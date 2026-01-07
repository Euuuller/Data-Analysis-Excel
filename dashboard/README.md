# 📊 Cohort Analysis Dashboard

Dashboard interativo para análise de cohort desenvolvido com HTML, CSS e JavaScript puro.

## 🚀 Quick Start

### Opção 1: Abrir Localmente

1. Clone o repositório
2. Navegue até a pasta `dashboard`
3. Abra `index.html` no navegador

### Opção 2: GitHub Pages

Acesse: `https://euuuller.github.io/Data-Analysis-Excel/dashboard/`

## 📁 Estrutura

```
dashboard/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos
├── js/
│   ├── main.js            # Controlador principal
│   ├── data-processor.js  # Processamento de dados
│   ├── charts.js          # Visualizações Chart.js
│   └── utils.js           # Funções utilitárias
└── data/
    └── sample-cohort-data.csv  # Dados de exemplo
```

## 🎯 Funcionalidades

### Upload de Dados
- ✅ Suporte para CSV e Excel (.xlsx, .xls)
- ✅ Validação automática de formato
- ✅ Dados de exemplo pré-carregados

### Visualizações
- ✅ **Matriz de Retenção**: Heatmap com valores absolutos e percentuais
- ✅ **Curvas de Retenção**: Gráfico de linhas por cohort
- ✅ **Comparação de Cohorts**: Gráfico de barras
- ✅ **Análise de Churn**: Taxa de abandono ao longo do tempo

### KPIs
- ✅ Retenção média (Mês 1, 3, 6)
- ✅ Total de cohorts analisados
- ✅ Melhor e pior cohort
- ✅ Padrões e recomendações

### Recursos
- ✅ Design responsivo (mobile, tablet, desktop)
- ✅ Exportação de dados (CSV)
- ✅ Interface minimalista e profissional
- ✅ Navegação por tabs

## 📊 Formato de Dados

### Estrutura CSV Esperada

```csv
Month,Start Year,0,1,2,3,4,5,6,7,8,9,10,11
Jan,,1000,450,320,280,250,230,210,195,180,170,160,155
Fev,,1200,540,400,350,310,285,260,240,225,210,200,190
```

**Colunas:**
- `Month`: Nome do mês do cohort
- `Start Year`: Ano de início (opcional)
- `0-11`: Valores de retenção para cada período (mês)

### Exemplo de Dados

Use o botão **"Dados de Exemplo"** para carregar um dataset de demonstração com 12 cohorts.

## 🎨 Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Design moderno com variáveis CSS
- **JavaScript (ES6+)**: Lógica da aplicação
- **Chart.js**: Visualizações interativas
- **PapaParse**: Parser de CSV
- **SheetJS**: Suporte para Excel

## 🌐 Deploy no GitHub Pages

### Configuração

1. Vá em **Settings** > **Pages**
2. Em **Source**, selecione `main` branch
3. Em **Folder**, selecione `/dashboard` (ou `/root` se estiver na raiz)
4. Clique em **Save**

Seu dashboard estará disponível em:
```
https://[seu-usuario].github.io/Data-Analysis-Excel/dashboard/
```

### Estrutura Recomendada

Para GitHub Pages, mantenha o dashboard na pasta `/dashboard` do repositório:

```
Data-Analysis-Excel/
├── dashboard/          # ← Dashboard web
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── data/
├── data/              # Dados do projeto Excel
├── docs/              # Documentação
└── README.md          # README principal
```

## 📱 Responsividade

O dashboard é totalmente responsivo:

- **Desktop** (1920px+): Layout completo com gráficos lado a lado
- **Tablet** (768px - 1919px): Layout adaptado
- **Mobile** (< 768px): Layout vertical, scroll horizontal em tabelas

## 🔧 Customização

### Cores

Edite as variáveis CSS em `css/style.css`:

```css
:root {
    --primary: #2563eb;
    --accent: #10b981;
    /* ... */
}
```

### Gráficos

Modifique as configurações em `js/charts.js`:

```javascript
options: {
    responsive: true,
    // Suas configurações
}
```

## 📈 Métricas Calculadas

### Retenção
```
Retenção (%) = (Usuários Ativos no Período / Usuários Iniciais) × 100
```

### Churn
```
Churn (%) = 100 - Retenção (%)
```

### Média de Retenção
```
Média = Σ(Retenção de cada cohort) / Total de cohorts
```

## 🐛 Troubleshooting

### Arquivo não carrega
- Verifique o formato: CSV ou Excel (.xlsx, .xls)
- Certifique-se que tem as colunas corretas
- Use o arquivo de exemplo como referência

### Gráficos não aparecem
- Verifique a conexão com internet (CDNs)
- Abra o console do navegador (F12) para ver erros
- Certifique-se que os dados foram processados

### GitHub Pages não funciona
- Verifique se o repositório é público
- Confirme que o GitHub Pages está ativado
- Aguarde alguns minutos após o deploy

## 📝 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](../LICENSE) para mais detalhes.

## 👤 Autor

**Euller dos Santos**

- GitHub: [@Euuuller](https://github.com/Euuuller)
- Portfolio: [euuuller.github.io/Portfolio](https://euuuller.github.io/Portfolio/)

---

**Desenvolvido com 📊 e ☕**
