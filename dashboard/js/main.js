/**
 * Main Application Controller
 * Coordinates all modules and handles user interactions
 */

const App = {
    /**
     * Initialize the application
     */
    init() {
        console.log('🚀 Initializing Cohort Analysis Dashboard...');

        // Set up event listeners
        this.setupEventListeners();

        // Check for auto-load sample data (for demo purposes)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('demo') === 'true') {
            this.loadSampleData();
        }
    },

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // File upload handlers
        const fileInput = document.getElementById('fileInput');
        const fileInputWelcome = document.getElementById('fileInputWelcome');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        if (fileInputWelcome) {
            fileInputWelcome.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // Sample data buttons
        const loadSampleBtn = document.getElementById('loadSampleBtn');
        const loadSampleBtnWelcome = document.getElementById('loadSampleBtnWelcome');

        if (loadSampleBtn) {
            loadSampleBtn.addEventListener('click', () => this.loadSampleData());
        }

        if (loadSampleBtnWelcome) {
            loadSampleBtnWelcome.addEventListener('click', () => this.loadSampleData());
        }

        // Tab navigation
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.closest('.tab-btn')));
        });

        // Matrix type toggle
        const matrixTypeRadios = document.querySelectorAll('input[name="matrixType"]');
        matrixTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateMatrix());
        });

        // Export button
        const exportBtn = document.getElementById('exportMatrixBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
    },

    /**
     * Handle file upload
     * @param {Event} event - File input change event
     */
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        console.log('📁 Processing file:', file.name);

        try {
            // Show loading state
            this.showLoading();

            // Parse file
            const data = await DataProcessor.parseFile(file);

            // Process cohort data
            this.processAndDisplay(data);

        } catch (error) {
            console.error('Error processing file:', error);
            Utils.showNotification('Erro ao processar arquivo. Verifique o formato.', 'error');
        } finally {
            this.hideLoading();
        }
    },

    /**
     * Load sample data
     */
    loadSampleData() {
        console.log('📊 Loading sample data...');

        try {
            const sampleData = DataProcessor.getSampleData();
            this.processAndDisplay(sampleData);
            Utils.showNotification('Dados de exemplo carregados com sucesso!', 'success');
        } catch (error) {
            console.error('Error loading sample data:', error);
            Utils.showNotification('Erro ao carregar dados de exemplo', 'error');
        }
    },

    /**
     * Process data and display dashboard
     * @param {Array} data - Raw cohort data
     */
    processAndDisplay(data) {
        try {
            // Process cohort data
            const result = DataProcessor.processCohortData(data);

            // Hide welcome screen, show dashboard
            this.showDashboard();

            // Update all visualizations
            this.updateKPIs(result.kpis);
            this.updateMatrix();
            Charts.initializeCharts(result.matrix);
            this.updateInsights();

            console.log('✅ Dashboard updated successfully');

        } catch (error) {
            console.error('Error processing data:', error);
            Utils.showNotification(error.message, 'error');
        }
    },

    /**
     * Update KPI cards
     * @param {object} kpis - KPI metrics
     */
    updateKPIs(kpis) {
        if (!kpis) return;

        // Retention Month 1
        const kpiRetention1 = document.getElementById('kpiRetention1');
        if (kpiRetention1) {
            kpiRetention1.textContent = Utils.formatPercentage(kpis.avgRetention1);
        }

        // Retention Month 3
        const kpiRetention3 = document.getElementById('kpiRetention3');
        if (kpiRetention3) {
            kpiRetention3.textContent = Utils.formatPercentage(kpis.avgRetention3);
        }

        // Retention Month 6
        const kpiRetention6 = document.getElementById('kpiRetention6');
        if (kpiRetention6) {
            kpiRetention6.textContent = Utils.formatPercentage(kpis.avgRetention6);
        }

        // Total Cohorts
        const kpiTotalCohorts = document.getElementById('kpiTotalCohorts');
        if (kpiTotalCohorts) {
            kpiTotalCohorts.textContent = kpis.totalCohorts;
        }

        // Add trends (optional)
        this.updateTrends(kpis);
    },

    /**
     * Update trend indicators
     * @param {object} kpis - KPI metrics
     */
    updateTrends(kpis) {
        // Simple trend calculation based on retention decay
        const trend1 = document.getElementById('kpiTrend1');
        const trend3 = document.getElementById('kpiTrend3');
        const trend6 = document.getElementById('kpiTrend6');

        if (kpis.avgRetention1 > 50) {
            if (trend1) trend1.textContent = '↗ Excelente';
            if (trend1) trend1.className = 'kpi-trend positive';
        } else if (kpis.avgRetention1 > 30) {
            if (trend1) trend1.textContent = '→ Bom';
            if (trend1) trend1.className = 'kpi-trend';
        } else {
            if (trend1) trend1.textContent = '↘ Baixo';
            if (trend1) trend1.className = 'kpi-trend negative';
        }

        // Similar for month 3 and 6
        if (kpis.avgRetention3 > 35) {
            if (trend3) trend3.textContent = '↗ Bom';
            if (trend3) trend3.className = 'kpi-trend positive';
        } else {
            if (trend3) trend3.textContent = '↘ Atenção';
            if (trend3) trend3.className = 'kpi-trend negative';
        }

        if (kpis.avgRetention6 > 25) {
            if (trend6) trend6.textContent = '↗ Estável';
            if (trend6) trend6.className = 'kpi-trend positive';
        } else {
            if (trend6) trend6.textContent = '↘ Crítico';
            if (trend6) trend6.className = 'kpi-trend negative';
        }
    },

    /**
     * Update retention matrix display
     */
    updateMatrix() {
        const matrixContainer = document.getElementById('retentionMatrix');
        if (!matrixContainer) return;

        const selectedType = document.querySelector('input[name="matrixType"]:checked');
        const type = selectedType ? selectedType.value : 'absolute';

        const matrixHTML = DataProcessor.generateMatrixHTML(type);
        matrixContainer.innerHTML = matrixHTML;
    },

    /**
     * Update insights tab
     */
    updateInsights() {
        const insights = DataProcessor.generateInsights();
        const kpis = DataProcessor.kpis;

        if (!insights || !kpis) return;

        // Best cohort
        const bestCohort = document.getElementById('bestCohort');
        if (bestCohort && kpis.bestCohort) {
            bestCohort.innerHTML = `
                <p><strong>${kpis.bestCohort.name}</strong></p>
                <p>Retenção no Mês 3: ${Utils.formatPercentage(kpis.bestCohort.retention)}</p>
            `;
        }

        // Worst cohort
        const worstCohort = document.getElementById('worstCohort');
        if (worstCohort && kpis.worstCohort) {
            worstCohort.innerHTML = `
                <p><strong>${kpis.worstCohort.name}</strong></p>
                <p>Retenção no Mês 3: ${Utils.formatPercentage(kpis.worstCohort.retention)}</p>
            `;
        }

        // Patterns
        const patterns = document.getElementById('patterns');
        if (patterns && insights.patterns) {
            patterns.innerHTML = '<ul>' +
                insights.patterns.map(p => `<li>${p}</li>`).join('') +
                '</ul>';
        }

        // Recommendations
        const recommendations = document.getElementById('recommendations');
        if (recommendations && insights.recommendations) {
            recommendations.innerHTML = '<ul>' +
                insights.recommendations.map(r => `<li>${r}</li>`).join('') +
                '</ul>';
        }
    },

    /**
     * Switch between tabs
     * @param {HTMLElement} tabBtn - Clicked tab button
     */
    switchTab(tabBtn) {
        if (!tabBtn) return;

        const targetTab = tabBtn.dataset.tab;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        tabBtn.classList.add('active');

        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        const targetPane = document.getElementById(targetTab);
        if (targetPane) {
            targetPane.classList.add('active');
        }
    },

    /**
     * Show dashboard, hide welcome screen
     */
    showDashboard() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        const dashboardContent = document.getElementById('dashboardContent');

        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (dashboardContent) dashboardContent.style.display = 'block';
    },

    /**
     * Export data to CSV
     */
    exportData() {
        try {
            const csvContent = DataProcessor.exportToCSV();
            const timestamp = new Date().toISOString().split('T')[0];
            Utils.downloadCSV(csvContent, `cohort-analysis-${timestamp}.csv`);
            Utils.showNotification('Dados exportados com sucesso!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            Utils.showNotification('Erro ao exportar dados', 'error');
        }
    },

    /**
     * Show loading state
     */
    showLoading() {
        // Simple loading implementation
        console.log('⏳ Loading...');
        // You can add a loading spinner here
    },

    /**
     * Hide loading state
     */
    hideLoading() {
        console.log('✓ Loading complete');
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
