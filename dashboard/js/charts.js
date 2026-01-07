/**
 * Charts Module for Cohort Analysis Dashboard
 * Handles all Chart.js visualizations
 */

const Charts = {
    // Store chart instances
    charts: {},

    /**
     * Initialize all charts with data
     * @param {object} cohortMatrix - Processed cohort matrix
     */
    initializeCharts(cohortMatrix) {
        this.destroyAllCharts();

        const { cohorts, periods } = cohortMatrix;

        // Create datasets for charts
        const datasets = this.createDatasets(cohorts, periods);

        // Initialize each chart
        this.createRetentionLineChart(datasets, periods);
        this.createCohortComparisonChart(cohorts);
        this.createDetailedRetentionChart(datasets, periods);
        this.createPeriodRetentionChart(cohorts, periods);
        this.createChurnChart(cohorts, periods);
    },

    /**
     * Create datasets from cohort data
     * @param {Array} cohorts - Cohort data
     * @param {Array} periods - Period array
     * @returns {Array} Chart.js datasets
     */
    createDatasets(cohorts, periods) {
        const colors = this.getColorPalette(cohorts.length);

        return cohorts.map((cohort, index) => {
            const percentages = DataProcessor.calculateRetentionPercentages(cohort);

            return {
                label: cohort.cohort,
                data: percentages,
                borderColor: colors[index],
                backgroundColor: colors[index] + '20',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6
            };
        });
    },

    /**
     * Get color palette for charts
     * @param {number} count - Number of colors needed
     * @returns {Array} Array of color strings
     */
    getColorPalette(count) {
        const baseColors = [
            '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
            '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
            '#14b8a6', '#f43f5e'
        ];

        // If we need more colors, generate them
        if (count <= baseColors.length) {
            return baseColors.slice(0, count);
        }

        const colors = [...baseColors];
        for (let i = baseColors.length; i < count; i++) {
            const hue = (i * 360 / count) % 360;
            colors.push(`hsl(${hue}, 70%, 50%)`);
        }

        return colors;
    },

    /**
     * Create retention line chart (Overview tab)
     * @param {Array} datasets - Chart datasets
     * @param {Array} periods - Period labels
     */
    createRetentionLineChart(datasets, periods) {
        const ctx = document.getElementById('retentionLineChart');
        if (!ctx) return;

        this.charts.retentionLine = new Chart(ctx, {
            type: 'line',
            data: {
                labels: periods.map(p => `Mês ${p}`),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${Utils.formatPercentage(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: (value) => value + '%'
                        },
                        title: {
                            display: true,
                            text: 'Taxa de Retenção (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Período (Meses)'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    },

    /**
     * Create cohort comparison bar chart
     * @param {Array} cohorts - Cohort data
     */
    createCohortComparisonChart(cohorts) {
        const ctx = document.getElementById('cohortComparisonChart');
        if (!ctx) return;

        // Compare retention at months 1, 3, 6
        const comparisonPeriods = [1, 3, 6];
        const colors = this.getColorPalette(comparisonPeriods.length);

        const datasets = comparisonPeriods.map((period, index) => {
            return {
                label: `Mês ${period}`,
                data: cohorts.map(cohort => {
                    const percentages = DataProcessor.calculateRetentionPercentages(cohort);
                    return percentages[period];
                }),
                backgroundColor: colors[index],
                borderRadius: 4
            };
        });

        this.charts.cohortComparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cohorts.map(c => c.cohort),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${Utils.formatPercentage(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: (value) => value + '%'
                        },
                        title: {
                            display: true,
                            text: 'Taxa de Retenção (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Cohort'
                        }
                    }
                }
            }
        });
    },

    /**
     * Create detailed retention chart (Charts tab)
     * @param {Array} datasets - Chart datasets
     * @param {Array} periods - Period labels
     */
    createDetailedRetentionChart(datasets, periods) {
        const ctx = document.getElementById('detailedRetentionChart');
        if (!ctx) return;

        this.charts.detailedRetention = new Chart(ctx, {
            type: 'line',
            data: {
                labels: periods.map(p => `Mês ${p}`),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 10,
                            font: { size: 10 }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${Utils.formatPercentage(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: (value) => value + '%'
                        },
                        title: {
                            display: true,
                            text: 'Taxa de Retenção (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Período (Meses)'
                        }
                    }
                }
            }
        });
    },

    /**
     * Create period retention chart (average across cohorts)
     * @param {Array} cohorts - Cohort data
     * @param {Array} periods - Period array
     */
    createPeriodRetentionChart(cohorts, periods) {
        const ctx = document.getElementById('periodRetentionChart');
        if (!ctx) return;

        // Calculate average retention for each period
        const averageRetention = periods.map(period => {
            const retentions = cohorts
                .map(cohort => {
                    const percentages = DataProcessor.calculateRetentionPercentages(cohort);
                    return percentages[period];
                })
                .filter(val => val !== null && val !== undefined && !isNaN(val));

            return Utils.average(retentions);
        });

        this.charts.periodRetention = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: periods.map(p => `Mês ${p}`),
                datasets: [{
                    label: 'Retenção Média',
                    data: averageRetention,
                    backgroundColor: '#2563eb',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `Retenção: ${Utils.formatPercentage(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: (value) => value + '%'
                        },
                        title: {
                            display: true,
                            text: 'Taxa de Retenção Média (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Período'
                        }
                    }
                }
            }
        });
    },

    /**
     * Create churn chart
     * @param {Array} cohorts - Cohort data
     * @param {Array} periods - Period array
     */
    createChurnChart(cohorts, periods) {
        const ctx = document.getElementById('churnChart');
        if (!ctx) return;

        // Calculate average churn for each period
        const averageChurn = periods.map(period => {
            const retentions = cohorts
                .map(cohort => {
                    const percentages = DataProcessor.calculateRetentionPercentages(cohort);
                    return percentages[period];
                })
                .filter(val => val !== null && val !== undefined && !isNaN(val));

            const avgRetention = Utils.average(retentions);
            return 100 - avgRetention;
        });

        this.charts.churn = new Chart(ctx, {
            type: 'line',
            data: {
                labels: periods.map(p => `Mês ${p}`),
                datasets: [{
                    label: 'Taxa de Churn',
                    data: averageChurn,
                    borderColor: '#ef4444',
                    backgroundColor: '#ef444420',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `Churn: ${Utils.formatPercentage(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: (value) => value + '%'
                        },
                        title: {
                            display: true,
                            text: 'Taxa de Churn (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Período (Meses)'
                        }
                    }
                }
            }
        });
    },

    /**
     * Destroy all chart instances
     */
    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Charts;
}
