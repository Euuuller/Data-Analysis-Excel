(function () {
  const sampleCount = {
    rows: [
      { label: "Jan", values: [32, 3, 0, 2, 2, 0, 2, 4, 5, 3, 7, 5] },
      { label: "Fev", values: [24, 4, 2, 1, 0, 2, 2, 3, 3, 4, 4, 0] },
      { label: "Mar", values: [65, 4, 2, 8, 7, 0, 7, 5, 8, 6, 0, 0] },
      { label: "Abr", values: [56, 6, 2, 4, 3, 8, 6, 9, 8, 0, 0, 0] },
      { label: "Mai", values: [56, 5, 5, 4, 10, 2, 12, 10, 0, 0, 0, 0] },
      { label: "Jun", values: [48, 1, 2, 4, 2, 9, 8, 0, 0, 0, 0, 0] },
      { label: "Jul", values: [44, 6, 5, 0, 5, 8, 0, 0, 0, 0, 0, 0] },
      { label: "Ago", values: [49, 8, 3, 11, 5, 0, 0, 0, 0, 0, 0, 0] },
      { label: "Set", values: [68, 9, 9, 11, 0, 0, 0, 0, 0, 0, 0, 0] },
      { label: "Out", values: [42, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { label: "Nov", values: [62, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { label: "Dez", values: [49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ],
  };

  const samplePercent = {
    rows: sampleCount.rows.map((row) => {
      const base = row.values[0] || 1;
      return {
        label: row.label,
        values: row.values.map((v) => (v ? v / base : 0)),
      };
    }),
  };

  const sampleRevenue = {
    rows: [
      {
        label: "Jan",
        values: [14236.9, 223.23, 0, 1472.38, 47.75, 0, 116.3, 907.58, 1609.7, 1477.63, 3141.27, 11329.12],
      },
      {
        label: "Fev",
        values: [4294.66, 634.31, 596.25, 576.23, 0, 697.39, 1040.4, 11907.53, 3345.15, 6347.64, 227.26, 0],
      },
      {
        label: "Mar",
        values: [55056.7, 1519.55, 2543.34, 3298.72, 3101.22, 0, 2860.12, 1833.34, 5968.53, 2654.79, 0, 0],
      },
      {
        label: "Abr",
        values: [24707.17, 2410.62, 875.46, 2325.47, 454.15, 3195.57, 1245.68, 6778.99, 4387.11, 0, 0, 0],
      },
      {
        label: "Mai",
        values: [18070.24, 1685.13, 862.67, 653.26, 8717.34, 462.94, 10024.4, 7145.8, 0, 0, 0, 0],
      },
      {
        label: "Jun",
        values: [28735.82, 351.22, 31.0, 733.95, 104.15, 5489.49, 3241.38, 0, 0, 0, 0, 0],
      },
      {
        label: "Jul",
        values: [25492.14, 2188.38, 1044.58, 0, 1319.13, 4257.84, 0, 0, 0, 0, 0, 0],
      },
      {
        label: "Ago",
        values: [22634.69, 8059.58, 272.42, 3807.44, 1244.3, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        label: "Set",
        values: [43648.89, 1882.08, 3490.65, 7160.28, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        label: "Out",
        values: [20830.0, 583.72, 969.94, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        label: "Nov",
        values: [31697.26, 5332.21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        label: "Dez",
        values: [21599.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };

  const setStats = (rows, revenueRows) => {
    const elRows = document.getElementById("stat-rows");
    const elPeriods = document.getElementById("stat-periods");
    const elRevenue = document.getElementById("stat-revenue");
    const totalRows = rows.reduce(
      (acc, r) => acc + (Array.isArray(r.values) ? r.values.length : 0),
      0
    );
    const revenueTotal = revenueRows.reduce(
      (acc, r) =>
        acc + (Array.isArray(r.values) ? r.values.reduce((a, b) => a + b, 0) : 0),
      0
    );
    if (elRows) elRows.textContent = totalRows.toLocaleString("pt-BR");
    if (elPeriods) elPeriods.textContent = rows.length.toLocaleString("pt-BR");
    if (elRevenue)
      elRevenue.textContent = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(revenueTotal);
  };

  const handleFile = async (file) => {
    try {
      const raw = await window.DataLoader.loadCSVFromFile(file);
      const dataset = window.DataLoader.normalizeCohort(raw);
      window.CohortCharts.renderTable("table-count", dataset, "count");
      window.CohortCharts.renderTable("table-percent", dataset, "percent");
      window.CohortCharts.renderTable("table-revenue", dataset, "currency");
      window.CohortCharts.renderCharts(dataset);

      // Render analysis charts
      window.CohortCharts.renderRetentionComparison(dataset);
      window.CohortCharts.renderARPUChart(dataset, dataset);
      window.CohortCharts.renderLTVChart(dataset, dataset);
      window.CohortCharts.renderChurnVelocity(dataset);

      setStats(dataset.rows, dataset.rows);
    } catch (err) {
      alert("Erro ao carregar CSV: " + err.message);
    }
  };

  /**
   * Initialize tab navigation for cohort tables
   */
  const initTabs = () => {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        // Remove active class from all buttons
        tabButtons.forEach(b => b.classList.remove('tab-btn--active'));

        // Add active class to clicked button
        btn.classList.add('tab-btn--active');

        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('tab-content--active');
        });

        // Show target tab content
        const targetContent = document.querySelector(`[data-tab-content="${targetTab}"]`);
        if (targetContent) {
          targetContent.classList.add('tab-content--active');
        }
      });
    });
  };

  /**
   * Initialize business context tab navigation
   */
  const initBusinessTabs = () => {
    const businessTabButtons = document.querySelectorAll('.business-tab-btn');

    businessTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.businessTab;

        // Remove active class from all buttons
        businessTabButtons.forEach(b => b.classList.remove('business-tab-btn--active'));

        // Add active class to clicked button
        btn.classList.add('business-tab-btn--active');

        // Hide all tab contents
        document.querySelectorAll('.business-tab-content').forEach(content => {
          content.classList.remove('business-tab-content--active');
        });

        // Show target tab content
        const targetContent = document.querySelector(`[data-business-tab-content="${targetTab}"]`);
        if (targetContent) {
          targetContent.classList.add('business-tab-content--active');
        }
      });
    });
  };

  const bindUI = () => {
    const input = document.getElementById("file-input");
    if (input) {
      input.addEventListener("change", (ev) => {
        const [file] = ev.target.files || [];
        if (file) handleFile(file);
      });
    }

    const btnDoc = document.getElementById("btn-open-doc");
    if (btnDoc) {
      btnDoc.addEventListener("click", () => {
        window.open("./docs/analise-2014.pdf", "_blank");
      });
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    bindUI();
    initTabs(); // Initialize tab navigation
    initBusinessTabs(); // Initialize business context tabs

    // Render de exemplo para validar layout/UX
    window.CohortCharts.renderTable("table-count", sampleCount, "count");
    window.CohortCharts.renderTable("table-percent", samplePercent, "percent");
    window.CohortCharts.renderTable("table-revenue", sampleRevenue, "currency");
    window.CohortCharts.renderCharts(sampleCount);

    // Render new analysis charts
    window.CohortCharts.renderRetentionComparison(sampleCount);
    window.CohortCharts.renderARPUChart(sampleCount, sampleRevenue);
    window.CohortCharts.renderLTVChart(sampleCount, sampleRevenue);
    window.CohortCharts.renderChurnVelocity(sampleCount);

    setStats(sampleCount.rows, sampleRevenue.rows);
  });
})();

