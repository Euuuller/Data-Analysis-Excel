# Template - Análise de Cohort

## 📋 Template Reutilizável

Este template pode ser adaptado para criar novas análises de cohort em diferentes contextos.

---

## 🎯 Informações do Projeto

### Detalhes Básicos

| Campo | Valor |
|-------|-------|
| **Nome do Projeto** | [Nome da análise] |
| **Objetivo** | [Objetivo principal] |
| **Período de Análise** | [Data início] a [Data fim] |
| **Granularidade** | Mensal / Semanal / Trimestral |
| **Responsável** | [Nome] |
| **Data de Criação** | [Data] |
| **Última Atualização** | [Data] |

---

## 📊 Configuração da Análise

### 1. Definição de Cohort

**Critério de Agrupamento**:
- [ ] Data de cadastro/signup
- [ ] Data da primeira compra
- [ ] Data da primeira interação
- [ ] Outro: [especificar]

**Período de Agrupamento**:
- [ ] Semanal
- [ ] Mensal
- [ ] Trimestral
- [ ] Outro: [especificar]

---

### 2. Definição de "Ativo"

Um usuário é considerado **ativo** quando:
- [ ] Realiza login
- [ ] Faz uma compra
- [ ] Interage com o produto
- [ ] Outro: [especificar]

**Período de Medição**: [Diário / Semanal / Mensal]

---

### 3. Período de Acompanhamento

- **Número de períodos**: [Ex: 12 meses]
- **Período 0**: [Definição do período de aquisição]
- **Períodos subsequentes**: [Como são calculados]

---

## 📁 Estrutura de Dados

### Campos Necessários

Copie esta estrutura para sua planilha:

| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| `user_id` | Texto/Número | ✅ | "USER001" |
| `first_interaction_date` | Data | ✅ | 15/01/2024 |
| `interaction_date` | Data | ✅ | 20/02/2024 |
| `event_type` | Texto | ⚪ | "purchase" |
| `value` | Número | ⚪ | 150.00 |
| `[campo_custom_1]` | [Tipo] | ⚪ | [Exemplo] |
| `[campo_custom_2]` | [Tipo] | ⚪ | [Exemplo] |

---

## 🔧 Configuração no Excel

### Passo 1: Preparação dos Dados

1. **Criar nova planilha** chamada "Dados Brutos"
2. **Importar dados** seguindo a estrutura acima
3. **Converter para Tabela** (Ctrl+T)
4. **Nomear a tabela** como "DadosBrutos"

---

### Passo 2: Cálculo de Campos

#### Adicionar Coluna "Cohort"

```excel
=TEXTO([@[first_interaction_date]];"MMM/YYYY")
```

#### Adicionar Coluna "Period"

```excel
=DATEDIF([@[first_interaction_date]];[@[interaction_date]];"M")
```

---

### Passo 3: Criar Tabela Dinâmica

**Configuração**:
1. Inserir → Tabela Dinâmica
2. **Linhas**: Cohort
3. **Colunas**: Period
4. **Valores**: Contagem Distinta de user_id
5. **Mostrar valores como**: % do Total da Linha

---

### Passo 4: Criar Matriz de Retenção

Criar nova aba "Matriz Retenção" com estrutura:

```
         | Período 0 | Período 1 | Período 2 | ...
---------|-----------|-----------|-----------|-----
Cohort 1 |           |           |           |
Cohort 2 |           |           |           |
Cohort 3 |           |           |           |
```

**Fórmula para cada célula**:
```excel
=CONT.SE.S(DadosBrutos[Cohort];$A2;DadosBrutos[Period];B$1)
```

---

### Passo 5: Calcular Percentuais

Criar nova aba "Retenção %" com mesma estrutura.

**Fórmula**:
```excel
=(MatrizRetencao!B2/MatrizRetencao!$B2)*100
```

---

### Passo 6: Formatação Condicional

Aplicar heatmap na aba "Retenção %":

1. Selecionar dados (excluir cabeçalhos)
2. Formatação Condicional → Escala de Cores
3. Configurar:
   - **Mínimo**: Vermelho (0%)
   - **Ponto Médio**: Amarelo (30%)
   - **Máximo**: Verde (100%)

---

## 📈 Visualizações Recomendadas

### Gráfico 1: Curva de Retenção

**Tipo**: Gráfico de Linhas

**Configuração**:
- **Eixo X**: Período (0, 1, 2, 3...)
- **Eixo Y**: Taxa de Retenção (%)
- **Séries**: Uma linha por cohort

**Como criar**:
1. Selecionar dados da aba "Retenção %"
2. Inserir → Gráfico de Linhas
3. Formatar cores e legendas

---

### Gráfico 2: Heatmap Visual

**Tipo**: Formatação Condicional

**Já configurado no Passo 6**

---

### Gráfico 3: Comparação de Cohorts

**Tipo**: Gráfico de Barras

**Configuração**:
- **Eixo X**: Cohort
- **Eixo Y**: Retenção Média
- **Dados**: Média de retenção de cada cohort

---

## 📊 Dashboard Sugerido

### Layout do Dashboard

```
┌─────────────────────────────────────────────────────┐
│  ANÁLISE DE COHORT - [NOME DO PROJETO]             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  KPIs Principais:                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │Retenção  │  │  Churn   │  │   LTV    │         │
│  │  Mês 1   │  │  Médio   │  │ Estimado │         │
│  │   XX%    │  │   XX%    │  │  R$ XXX  │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│                                                     │
│  Heatmap de Retenção:                              │
│  ┌───────────────────────────────────────┐         │
│  │  [Matriz de cores]                    │         │
│  └───────────────────────────────────────┘         │
│                                                     │
│  Curva de Retenção:                                │
│  ┌───────────────────────────────────────┐         │
│  │  [Gráfico de linhas]                  │         │
│  └───────────────────────────────────────┘         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Checklist de Implementação

### Preparação
- [ ] Dados coletados e organizados
- [ ] Estrutura de dados validada
- [ ] Campos obrigatórios preenchidos
- [ ] Datas no formato correto

### Configuração
- [ ] Tabela "DadosBrutos" criada
- [ ] Coluna "Cohort" calculada
- [ ] Coluna "Period" calculada
- [ ] Validações aplicadas

### Análise
- [ ] Tabela Dinâmica criada
- [ ] Matriz de Retenção montada
- [ ] Percentuais calculados
- [ ] Formatação condicional aplicada

### Visualização
- [ ] Gráfico de curva de retenção
- [ ] Heatmap configurado
- [ ] Dashboard montado
- [ ] KPIs calculados

### Documentação
- [ ] Insights documentados
- [ ] Recomendações listadas
- [ ] Limitações anotadas
- [ ] Próximos passos definidos

---

## 💡 Dicas e Boas Práticas

### Performance

✅ **Faça**:
- Use Tabelas Estruturadas
- Mantenha dados brutos separados de análises
- Documente fórmulas complexas
- Crie backup antes de grandes mudanças

❌ **Evite**:
- Fórmulas voláteis (AGORA, HOJE) em grandes datasets
- Múltiplas Tabelas Dinâmicas na mesma aba
- Formatação excessiva que pode travar o Excel
- Misturar dados e análises na mesma aba

---

### Manutenção

**Atualização Mensal**:
1. Importar novos dados
2. Atualizar Tabela Dinâmica (Ctrl+Alt+F5)
3. Verificar novos cohorts
4. Atualizar dashboard
5. Documentar insights

**Revisão Trimestral**:
1. Validar metodologia
2. Revisar definições
3. Ajustar período de análise
4. Comparar com benchmarks
5. Atualizar recomendações

---

## 🔄 Adaptações Comuns

### Para E-commerce

**Campos Adicionais**:
- `order_id`: ID do pedido
- `product_category`: Categoria do produto
- `discount_used`: Desconto aplicado

**Definição de Ativo**: Realizou compra no período

---

### Para SaaS

**Campos Adicionais**:
- `plan_type`: Tipo de plano
- `mrr`: Receita recorrente mensal
- `feature_usage`: Features utilizadas

**Definição de Ativo**: Login + uso de feature principal

---

### Para Conteúdo/Mídia

**Campos Adicionais**:
- `content_type`: Tipo de conteúdo consumido
- `time_spent`: Tempo gasto
- `engagement_score`: Score de engajamento

**Definição de Ativo**: Consumiu conteúdo no período

---

## 📚 Recursos Adicionais

### Documentação de Referência

- [Metodologia Detalhada](../docs/metodologia.md)
- [Guia de Fórmulas](../docs/formulas.md)
- [Dicionário de Dados](../data/data_dictionary.md)
- [Exemplos de Insights](../docs/insights.md)

---

### Templates Prontos

- **Template Excel**: [Link para download]
- **Template Dashboard**: [Link para download]
- **Template Apresentação**: [Link para download]

---

## 🆘 Troubleshooting

### Problema: Fórmulas retornando erro

**Solução**:
- Verificar se nomes de colunas estão corretos
- Confirmar que tabela está nomeada
- Usar SE.ERRO para tratar erros

---

### Problema: Tabela Dinâmica não atualiza

**Solução**:
- Clicar com botão direito → Atualizar
- Verificar se fonte de dados está correta
- Usar Ctrl+Alt+F5 para atualizar tudo

---

### Problema: Percentuais incorretos

**Solução**:
- Verificar se Período 0 está sendo usado como base
- Confirmar cálculo de DATEDIF
- Validar que não há duplicatas

---

## 📝 Notas Finais

Este template é um ponto de partida. Adapte conforme necessário para seu contexto específico.

**Sugestões de melhoria**: Abra uma issue no GitHub ou contribua com um Pull Request!

---

**Versão**: 1.0  
**Última atualização**: Janeiro 2026  
**Licença**: MIT
