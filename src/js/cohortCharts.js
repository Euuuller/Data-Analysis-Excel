(function () {
  const monthCols = Array.from({ length: 12 }, (_, i) => String(i));

  /**
   * Generates a heatmap color based on value ratio
   * Uses HSL color space for smooth gradient from blue (cold) to red (hot)
   * @param {number} value - The current value
   * @param {number} maxValue - The maximum value for normalization
   * @returns {string} HSL color string
   */
  const getHeatmapColor = (value, maxValue = 1) => {
    if (maxValue === 0 || value === 0) {
      return 'hsl(240, 50%, 15%)'; // Dark blue for zero
    }

    const ratio = Math.min(value / maxValue, 1);

    // Gradient: Blue (240°) -> Cyan (180°) -> Green (120°) -> Yellow (60°) -> Red (0°)
    const hue = 240 - (ratio * 240); // 240 = blue, 0 = red
    const saturation = 60 + (ratio * 30); // 60% to 90%
    const lightness = 25 + (ratio * 35); // 25% to 60%

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  /**
   * Determines text color for optimal contrast against background
   * @param {number} ratio - Value ratio (0-1)
   * @returns {string} Color string
   */
  const getTextColor = (ratio) => {
    // Use white text for darker backgrounds (low ratios)
    // Use dark text for brighter backgrounds (high ratios)
    return ratio > 0.6 ? '#0b1223' : '#ffffff';
  };

  const formatValue = (value, mode) => {
    if (mode === "percent") return `${(value * 100).toFixed(2)}%`;
    if (mode === "currency")
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(value);
    return value.toLocaleString("pt-BR");
  };

  const renderTable = (targetId, dataset, mode = "count") => {
    const target = document.getElementById(targetId);
    if (!target) return;

    if (!dataset || !dataset.rows || !dataset.rows.length) {
      target.innerHTML = `<p class="muted">Nenhum dado disponível para esta tabela.</p>`;
      return;
    }

    const maxValue =
      mode === "percent"
        ? 1
        : Math.max(...dataset.rows.flatMap((r) => r.values || [0]), 0);

    const table = document.createElement("table");
    table.className = "table-cohort";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Mês", ...monthCols].forEach((col) => {
      const th = document.createElement("th");
      th.textContent = col;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    const tbody = document.createElement("tbody");
    dataset.rows.forEach((row) => {
      const tr = document.createElement("tr");
      const tdLabel = document.createElement("td");
      tdLabel.textContent = row.label;
      tdLabel.style.textAlign = "left";
      tr.appendChild(tdLabel);

      monthCols.forEach((col, idx) => {
        const td = document.createElement("td");
        const value = row.values[idx] ?? 0;
        td.textContent = formatValue(value, mode);

        // Apply heatmap color as inline style
        const bgColor = getHeatmapColor(value, maxValue);
        const ratio = maxValue > 0 ? value / maxValue : 0;
        const textColor = getTextColor(ratio);

        td.style.backgroundColor = bgColor;
        td.style.color = textColor;
        td.style.fontWeight = ratio > 0.7 ? '700' : '400';

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    target.innerHTML = "";
    target.appendChild(table);
  };

  const renderCharts = (countDataset) => {
    if (typeof Chart === "undefined") return;
    const ctxRetention = document.getElementById("chart-retention");
    const ctxRevenue = document.getElementById("chart-revenue");
    if (!ctxRetention || !ctxRevenue) return;

    const months = monthCols;
    const avgRetention =
      countDataset && countDataset.rows && countDataset.rows.length
        ? months.map((_, idx) => {
          const values = countDataset.rows.map((r) => r.values[idx] || 0);
          const base = countDataset.rows.map((r) => r.values[0] || 1);
          const ratios = values.map((v, i) =>
            base[i] ? v / base[i] : 0
          );
          const sum = ratios.reduce((a, b) => a + b, 0);
          return ratios.length ? sum / ratios.length : 0;
        })
        : months.map(() => 0);

    new Chart(ctxRetention, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Retenção média",
            data: avgRetention,
            tension: 0.35,
            borderColor: "#22c55e",
            backgroundColor: "rgba(34,197,94,0.15)",
            fill: true,
          },
        ],
      },
      options: {
        scales: {
          y: { suggestedMin: 0, suggestedMax: 1 },
        },
        plugins: {
          legend: { labels: { color: "#e5e7ef" } },
        },
      },
    });

    const revenueSeries =
      countDataset && countDataset.rows && countDataset.rows.length
        ? months.map((_, idx) =>
          countDataset.rows.reduce((acc, r) => acc + (r.values[idx] || 0), 0)
        )
        : months.map(() => 0);

    new Chart(ctxRevenue, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Receita (soma por mês relativo)",
            data: revenueSeries,
            backgroundColor: "#f97316",
          },
        ],
      },
      options: {
        plugins: {
          legend: { labels: { color: "#e5e7ef" } },
        },
        scales: {
          x: { ticks: { color: "#e5e7ef" } },
          y: { ticks: { color: "#e5e7ef" } },
        },
      },
    });
  };

  // New chart: Retention M1 Comparison
  const renderRetentionComparison = (countDataset) => {
    if (typeof Chart === "undefined") return;
    const ctx = document.getElementById("chart-retention-comparison");
    if (!ctx) return;

    const labels = countDataset.rows.map(r => r.label);
    const retentionM1 = countDataset.rows.map(r => {
      const base = r.values[0] || 1;
      const m1 = r.values[1] || 0;
      return ((m1 / base) * 100).toFixed(2);
    });

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Retenção Mês 1 (%)",
          data: retentionM1,
          backgroundColor: retentionM1.map(v =>
            v > 20 ? "#22c55e" : v > 10 ? "#fbbf24" : "#ef4444"
          ),
          borderRadius: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y}% retidos no Mês 1`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 30,
            ticks: {
              color: "#e5e7ef",
              callback: (value) => value + "%"
            },
            grid: { color: "#1f2937" }
          },
          x: {
            ticks: { color: "#e5e7ef" },
            grid: { display: false }
          }
        },
      },
    });
  };

  // New chart: ARPU M0
  const renderARPUChart = (countDataset, revenueDataset) => {
    if (typeof Chart === "undefined") return;
    const ctx = document.getElementById("chart-arpu");
    if (!ctx) return;

    const labels = countDataset.rows.map(r => r.label);
    const arpu = countDataset.rows.map((r, idx) => {
      const count = r.values[0] || 1;
      const revenue = revenueDataset.rows[idx]?.values[0] || 0;
      return (revenue / count).toFixed(2);
    });

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "ARPU Mês 0 (R$)",
          data: arpu,
          backgroundColor: "#3b82f6",
          borderRadius: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `R$ ${parseFloat(context.parsed.y).toFixed(2)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#e5e7ef",
              callback: (value) => "R$ " + value
            },
            grid: { color: "#1f2937" }
          },
          x: {
            ticks: { color: "#e5e7ef" },
            grid: { display: false }
          }
        },
      },
    });
  };

  // New chart: LTV M3-M5
  const renderLTVChart = (countDataset, revenueDataset) => {
    if (typeof Chart === "undefined") return;
    const ctx = document.getElementById("chart-ltv");
    if (!ctx) return;

    const labels = countDataset.rows.map(r => r.label);
    const ltv = countDataset.rows.map((r, idx) => {
      const count = r.values[0] || 1;
      const revenueM3 = revenueDataset.rows[idx]?.values[3] || 0;
      const revenueM4 = revenueDataset.rows[idx]?.values[4] || 0;
      const revenueM5 = revenueDataset.rows[idx]?.values[5] || 0;
      const totalRevenue = revenueM3 + revenueM4 + revenueM5;
      return (totalRevenue / count).toFixed(2);
    });

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "LTV M3-M5 (R$/cliente)",
          data: ltv,
          backgroundColor: "#a855f7",
          borderRadius: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `R$ ${parseFloat(context.parsed.y).toFixed(2)} por cliente`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#e5e7ef",
              callback: (value) => "R$ " + value
            },
            grid: { color: "#1f2937" }
          },
          x: {
            ticks: { color: "#e5e7ef" },
            grid: { display: false }
          }
        },
      },
    });
  };

  // New chart: Churn Velocity
  const renderChurnVelocity = (countDataset) => {
    if (typeof Chart === "undefined") return;
    const ctx = document.getElementById("chart-churn-velocity");
    if (!ctx) return;

    const labels = countDataset.rows.map(r => r.label);
    const churnM1 = countDataset.rows.map(r => {
      const base = r.values[0] || 1;
      const m1 = r.values[1] || 0;
      return (((base - m1) / base) * 100).toFixed(2);
    });

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Churn Mês 1 (%)",
          data: churnM1,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: { color: "#e5e7ef" }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y}% de churn`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: "#e5e7ef",
              callback: (value) => value + "%"
            },
            grid: { color: "#1f2937" }
          },
          x: {
            ticks: { color: "#e5e7ef" },
            grid: { color: "#1f2937" }
          }
        },
      },
    });
  };

  window.CohortCharts = {
    renderTable,
    renderCharts,
    renderRetentionComparison,
    renderARPUChart,
    renderLTVChart,
    renderChurnVelocity,
  };
})();

