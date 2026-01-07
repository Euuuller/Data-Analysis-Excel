/**
 * Data Processor for Cohort Analysis
 * Handles file parsing, data validation, cohort calculations, and KPI generation
 */

const DataProcessor = {
    // Store processed data
    rawData: null,
    cohortMatrix: null,
    kpis: null,

    /**
     * Parse uploaded file (CSV or Excel)
     * @param {File} file - Uploaded file
     * @returns {Promise} Resolves with parsed data
     */
    async parseFile(file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();

        try {
            if (fileExtension === 'csv') {
                return await this.parseCSV(file);
            } else if (['xlsx', 'xls'].includes(fileExtension)) {
                return await this.parseExcel(file);
            } else {
                throw new Error('Formato de arquivo não suportado. Use CSV ou Excel.');
            }
        } catch (error) {
            Utils.showNotification(`Erro ao processar arquivo: ${error.message}`, 'error');
            throw error;
        }
    },

    /**
     * Parse CSV file using PapaParse
     * @param {File} file - CSV file
     * @returns {Promise} Parsed data
     */
    parseCSV(file) {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        reject(new Error('Erro ao processar CSV'));
                    } else {
                        resolve(results.data);
                    }
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    },

    /**
     * Parse Excel file using SheetJS
     * @param {File} file - Excel file
     * @returns {Promise} Parsed data
     */
    parseExcel(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    // Get first sheet
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: null });

                    resolve(jsonData);
                } catch (error) {
                    reject(new Error('Erro ao processar arquivo Excel'));
                }
            };

            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsArrayBuffer(file);
        });
    },

    /**
     * Process cohort data and generate matrix
     * @param {Array} data - Raw cohort data
     * @returns {object} Processed cohort matrix and metadata
     */
    processCohortData(data) {
        // Validate data
        const validation = Utils.validateCohortData(data);
        if (!validation.valid) {
            throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
        }

        this.rawData = data;

        // Extract cohort matrix
        const matrix = [];
        const cohortNames = [];
        const periods = [];

        data.forEach(row => {
            const cohortName = row.Month || row.month;
            const startYear = row['Start Year'] || row['Start 2014'] || row['Start 2023'] || '';
            const cohortLabel = startYear ? `${cohortName} ${startYear}` : cohortName;

            cohortNames.push(cohortLabel);

            // Extract period values (0-11)
            const periodValues = [];
            for (let i = 0; i <= 11; i++) {
                const value = row[i] !== undefined ? row[i] : null;
                periodValues.push(value);
            }

            matrix.push({
                cohort: cohortLabel,
                values: periodValues,
                initialSize: periodValues[0] || 0
            });
        });

        // Store periods
        for (let i = 0; i <= 11; i++) {
            periods.push(i);
        }

        this.cohortMatrix = {
            cohorts: matrix,
            cohortNames: cohortNames,
            periods: periods
        };

        // Calculate KPIs
        this.kpis = this.calculateKPIs();

        return {
            matrix: this.cohortMatrix,
            kpis: this.kpis
        };
    },

    /**
     * Calculate retention percentages
     * @param {object} cohort - Cohort data
     * @returns {Array} Retention percentages for each period
     */
    calculateRetentionPercentages(cohort) {
        const initialSize = cohort.initialSize;
        if (!initialSize || initialSize === 0) return cohort.values.map(() => 0);

        return cohort.values.map(value => {
            if (value === null || value === undefined) return null;
            return (value / initialSize) * 100;
        });
    },

    /**
     * Calculate KPIs from cohort data
     * @returns {object} KPI metrics
     */
    calculateKPIs() {
        if (!this.cohortMatrix) return null;

        const cohorts = this.cohortMatrix.cohorts;

        // Calculate average retention for specific periods
        const getAverageRetention = (periodIndex) => {
            const retentions = cohorts
                .map(cohort => {
                    const percentages = this.calculateRetentionPercentages(cohort);
                    return percentages[periodIndex];
                })
                .filter(val => val !== null && val !== undefined && !isNaN(val));

            return Utils.average(retentions);
        };

        const retention1 = getAverageRetention(1);
        const retention3 = getAverageRetention(3);
        const retention6 = getAverageRetention(6);

        // Find best and worst cohorts (based on month 3 retention)
        let bestCohort = null;
        let worstCohort = null;
        let bestRetention = -1;
        let worstRetention = 101;

        cohorts.forEach(cohort => {
            const percentages = this.calculateRetentionPercentages(cohort);
            const month3Retention = percentages[3];

            if (month3Retention !== null && month3Retention !== undefined && !isNaN(month3Retention)) {
                if (month3Retention > bestRetention) {
                    bestRetention = month3Retention;
                    bestCohort = cohort.cohort;
                }
                if (month3Retention < worstRetention) {
                    worstRetention = month3Retention;
                    worstCohort = cohort.cohort;
                }
            }
        });

        return {
            totalCohorts: cohorts.length,
            avgRetention1: retention1,
            avgRetention3: retention3,
            avgRetention6: retention6,
            bestCohort: {
                name: bestCohort,
                retention: bestRetention
            },
            worstCohort: {
                name: worstCohort,
                retention: worstRetention
            }
        };
    },

    /**
     * Generate retention matrix HTML table
     * @param {string} type - 'absolute' or 'percentage'
     * @returns {string} HTML table
     */
    generateMatrixHTML(type = 'absolute') {
        if (!this.cohortMatrix) return '<p>Nenhum dado disponível</p>';

        const { cohorts, periods } = this.cohortMatrix;

        let html = '<table><thead><tr>';
        html += '<th>Cohort</th>';
        periods.forEach(period => {
            html += `<th>Mês ${period}</th>`;
        });
        html += '</tr></thead><tbody>';

        cohorts.forEach(cohort => {
            html += '<tr>';
            html += `<td>${cohort.cohort}</td>`;

            const percentages = this.calculateRetentionPercentages(cohort);

            cohort.values.forEach((value, index) => {
                const percentage = percentages[index];
                const displayValue = type === 'percentage'
                    ? Utils.formatPercentage(percentage)
                    : Utils.formatNumber(value);

                const bgColor = percentage !== null ? Utils.getHeatmapColor(percentage) : 'rgb(241, 245, 249)';
                const textColor = Utils.getContrastColor(bgColor);

                html += `<td>
                    <div class="cell-value" style="background-color: ${bgColor}; color: ${textColor};" 
                         title="${cohort.cohort} - Mês ${index}: ${Utils.formatNumber(value)} (${Utils.formatPercentage(percentage)})">
                        ${displayValue}
                    </div>
                </td>`;
            });

            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    },

    /**
     * Get sample cohort data
     * @returns {Array} Sample data
     */
    getSampleData() {
        return [
            { Month: 'Jan', 'Start 2023': '', 0: 1000, 1: 450, 2: 320, 3: 280, 4: 250, 5: 230, 6: 210, 7: 195, 8: 180, 9: 170, 10: 160, 11: 155 },
            { Month: 'Fev', 'Start 2023': '', 0: 1200, 1: 540, 2: 400, 3: 350, 4: 310, 5: 285, 6: 260, 7: 240, 8: 225, 9: 210, 10: 200, 11: 190 },
            { Month: 'Mar', 'Start 2023': '', 0: 1100, 1: 550, 2: 420, 3: 370, 4: 330, 5: 300, 6: 275, 7: 255, 8: 240, 9: 225, 10: 215, 11: 205 },
            { Month: 'Abr', 'Start 2023': '', 0: 1300, 1: 650, 2: 520, 3: 455, 4: 410, 5: 375, 6: 345, 7: 320, 8: 300, 9: 285, 10: 270, 11: 260 },
            { Month: 'Mai', 'Start 2023': '', 0: 1250, 1: 625, 2: 500, 3: 438, 4: 400, 5: 363, 6: 338, 7: 313, 8: 294, 9: 275, 10: 263, 11: 250 },
            { Month: 'Jun', 'Start 2023': '', 0: 1400, 1: 700, 2: 560, 3: 490, 4: 448, 5: 406, 6: 378, 7: 350, 8: 329, 9: 308, 10: 294, 11: null },
            { Month: 'Jul', 'Start 2023': '', 0: 1350, 1: 675, 2: 540, 3: 473, 4: 432, 5: 392, 6: 365, 7: 338, 8: 318, 9: 297, 10: null, 11: null },
            { Month: 'Ago', 'Start 2023': '', 0: 1500, 1: 750, 2: 600, 3: 525, 4: 480, 5: 435, 6: 405, 7: 375, 8: 353, 9: null, 10: null, 11: null },
            { Month: 'Set', 'Start 2023': '', 0: 1450, 1: 725, 2: 580, 3: 508, 4: 464, 5: 421, 6: 392, 7: 363, 8: null, 9: null, 10: null, 11: null },
            { Month: 'Out', 'Start 2023': '', 0: 1600, 1: 800, 2: 640, 3: 560, 4: 512, 5: 464, 6: 432, 7: null, 8: null, 9: null, 10: null, 11: null },
            { Month: 'Nov', 'Start 2023': '', 0: 1550, 1: 775, 2: 620, 3: 543, 4: 496, 5: 450, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null },
            { Month: 'Dez', 'Start 2023': '', 0: 1700, 1: 850, 2: 680, 3: 595, 4: 544, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null }
        ];
    },

    /**
     * Export processed data to CSV
     * @returns {string} CSV content
     */
    exportToCSV() {
        if (!this.cohortMatrix) return '';

        const { cohorts, periods } = this.cohortMatrix;
        const headers = ['Cohort', ...periods.map(p => `Month ${p}`), ...periods.map(p => `Month ${p} %`)];
        const rows = [];

        cohorts.forEach(cohort => {
            const percentages = this.calculateRetentionPercentages(cohort);
            const row = [
                cohort.cohort,
                ...cohort.values.map(v => v !== null ? v : ''),
                ...percentages.map(p => p !== null ? p.toFixed(2) : '')
            ];
            rows.push(row);
        });

        return Utils.matrixToCSV(rows, headers);
    },

    /**
     * Generate insights from cohort data
     * @returns {object} Insights and recommendations
     */
    generateInsights() {
        if (!this.cohortMatrix || !this.kpis) return null;

        const insights = {
            patterns: [],
            recommendations: []
        };

        // Analyze retention trends
        const avgRetention1 = this.kpis.avgRetention1;
        const avgRetention3 = this.kpis.avgRetention3;
        const avgRetention6 = this.kpis.avgRetention6;

        // Pattern: Retention decay
        if (avgRetention1 > avgRetention3 && avgRetention3 > avgRetention6) {
            insights.patterns.push('Padrão de decaimento consistente na retenção ao longo do tempo');
        }

        // Pattern: Month 1 retention
        if (avgRetention1 < 40) {
            insights.patterns.push('Baixa retenção no primeiro mês indica problemas na experiência inicial');
            insights.recommendations.push('Melhorar onboarding e primeiras experiências do usuário');
        } else if (avgRetention1 > 60) {
            insights.patterns.push('Excelente retenção no primeiro mês');
        }

        // Pattern: Long-term retention
        if (avgRetention6 < 20) {
            insights.recommendations.push('Implementar estratégias de engajamento de longo prazo');
        }

        // Cohort comparison
        const retentionDiff = this.kpis.bestCohort.retention - this.kpis.worstCohort.retention;
        if (retentionDiff > 20) {
            insights.patterns.push('Grande variação entre cohorts sugere fatores sazonais ou mudanças no produto');
            insights.recommendations.push('Investigar diferenças entre cohorts para identificar fatores de sucesso');
        }

        return insights;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataProcessor;
}
