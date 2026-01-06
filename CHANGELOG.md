# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.0.0] - 2026-01-06

### 🎉 Lançamento Inicial

Primeira versão da estrutura profissional do projeto de Análise de Cohort em Excel.

### ✨ Adicionado

#### Documentação Principal
- `README.md` - Documentação completa do projeto com badges, estrutura e guias
- `STRUCTURE.md` - Guia visual da estrutura do projeto
- `GIT_GUIDE.md` - Guia rápido de comandos Git
- `CHANGELOG.md` - Este arquivo de histórico de versões
- `LICENSE` - Licença MIT

#### Configuração
- `.gitignore` - Configuração completa para ignorar arquivos Excel, CSV e temporários

#### Documentação Técnica (`docs/`)
- `metodologia.md` - Metodologia completa de Cohort Analysis
  - Fundamentos teóricos
  - Metodologia aplicada passo a passo
  - Cálculo de métricas
  - Análise e interpretação
  - Aplicações práticas
  - Referências

- `formulas.md` - Guia completo de fórmulas Excel
  - Fórmulas de preparação de dados
  - Fórmulas de contagem e agregação
  - Cálculo de métricas de retenção
  - Fórmulas avançadas
  - Formatação condicional
  - Troubleshooting

- `insights.md` - Template para documentação de insights
  - Estrutura para análise de retenção
  - Comparação entre cohorts
  - Segmentação
  - Padrões sazonais
  - Cálculo de LTV
  - Recomendações acionáveis

#### Especificações de Dados (`data/`)
- `sample_data.md` - Estrutura de dados esperada
  - Formato de dados brutos
  - Exemplos de datasets
  - Regras de validação
  - Preparação de dados
  - Checklist de preparação

- `data_dictionary.md` - Dicionário de dados completo
  - Definição de todos os campos
  - Tipos de dados e validações
  - Regras de negócio
  - Métricas derivadas
  - Nomenclatura e formatação

#### Templates (`templates/`)
- `cohort_template.md` - Template reutilizável para novas análises
  - Configuração passo a passo
  - Estrutura de dados
  - Fórmulas Excel
  - Visualizações recomendadas
  - Dashboard sugerido
  - Checklist de implementação
  - Adaptações comuns
  - Troubleshooting

#### Estrutura de Pastas
- `images/` - Pasta para armazenar visualizações
- `images/charts/` - Subpasta para gráficos exportados
- `output/` - Pasta para resultados exportados (com `.gitkeep`)

### 🔒 Segurança

- Configuração do `.gitignore` para **não versionar**:
  - Arquivos Excel (*.xlsx, *.xlsm, *.xls, *.xlsb)
  - Arquivos CSV
  - Arquivos temporários do Excel
  - Backups e versões antigas
  - Arquivos de sistema operacional
  - Configurações de IDEs
  - Logs e debugging
  - Configurações locais
  - Outputs temporários

### 📊 Estatísticas

- **Total de Arquivos Criados**: 12 arquivos
- **Linhas de Documentação**: ~2500 linhas
- **Pastas Organizadas**: 5 pastas
- **Templates Incluídos**: 1 template completo
- **Guias Técnicos**: 3 guias detalhados

---

## [Unreleased]

### 🚀 Planejado para Próximas Versões

#### v1.1.0 - Visualizações
- [ ] Adicionar exemplos de gráficos em `images/charts/`
- [ ] Screenshots do dashboard
- [ ] Exemplos de heatmaps
- [ ] GIFs demonstrativos

#### v1.2.0 - Exemplos Práticos
- [ ] Dataset de exemplo anonimizado
- [ ] Análise completa de exemplo
- [ ] Insights documentados de caso real
- [ ] Comparação com benchmarks de indústria

#### v1.3.0 - Automação
- [ ] Scripts Python para processamento de dados
- [ ] Integração com Power BI
- [ ] Dashboard interativo
- [ ] Exportação automatizada

#### v2.0.0 - Expansão
- [ ] Análise de cohort por segmento
- [ ] Previsão de churn com ML
- [ ] Análise de RFM
- [ ] Integração com Google Analytics

---

## Tipos de Mudanças

- `✨ Adicionado` - Para novas funcionalidades
- `🔄 Modificado` - Para mudanças em funcionalidades existentes
- `🗑️ Removido` - Para funcionalidades removidas
- `🐛 Corrigido` - Para correções de bugs
- `🔒 Segurança` - Para correções de vulnerabilidades
- `📚 Documentação` - Para mudanças apenas em documentação
- `⚡ Performance` - Para melhorias de performance

---

## Links

- [Repositório GitHub](https://github.com/Euuuller/Data-Analysis-Excel)
- [Issues](https://github.com/Euuuller/Data-Analysis-Excel/issues)
- [Pull Requests](https://github.com/Euuuller/Data-Analysis-Excel/pulls)

---

**Mantido por**: [@Euuuller](https://github.com/Euuuller)  
**Última atualização**: 2026-01-06
