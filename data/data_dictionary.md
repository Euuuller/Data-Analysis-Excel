# Dicionário de Dados - Data Analysis Excel

## 📖 Visão Geral

Este documento define todos os campos utilizados na análise de cohort, incluindo tipos de dados, formatos, validações e exemplos.

---

## 🗂️ Tabela: Dados Brutos

### Campos Principais

#### 1. user_id

| Propriedade | Valor |
|-------------|-------|
| **Nome do Campo** | `user_id` |
| **Tipo de Dado** | Texto ou Número |
| **Obrigatório** | ✅ Sim |
| **Único** | ✅ Sim (por linha de interação) |
| **Formato** | Alfanumérico, sem espaços |
| **Comprimento** | Até 50 caracteres |
| **Validação** | Não pode ser vazio |
| **Exemplo** | "USER001", "12345", "ABC-XYZ-789" |

**Descrição**: Identificador único do usuário. Deve ser consistente em todas as interações do mesmo usuário.

**Regras de Negócio**:
- Mesmo usuário deve ter sempre o mesmo `user_id`
- Não deve conter informações pessoalmente identificáveis (PII)
- Recomenda-se usar hash ou ID anonimizado

---

#### 2. first_interaction_date

| Propriedade | Valor |
|-------------|-------|
| **Nome do Campo** | `first_interaction_date` |
| **Tipo de Dado** | Data |
| **Obrigatório** | ✅ Sim |
| **Formato** | DD/MM/YYYY ou YYYY-MM-DD |
| **Validação** | Deve ser <= interaction_date |
| **Exemplo** | 15/01/2024, 2024-01-15 |

**Descrição**: Data da primeira interação do usuário com o produto/serviço. Define a qual cohort o usuário pertence.

**Regras de Negócio**:
- Deve ser a mesma para todas as linhas do mesmo `user_id`
- Não pode ser data futura
- Geralmente corresponde à data de signup/cadastro

**Fórmula de Validação**:
```excel
=SE([@[first_interaction_date]]>HOJE();"ERRO: Data futura";"OK")
```

---

#### 3. interaction_date

| Propriedade | Valor |
|-------------|-------|
| **Nome do Campo** | `interaction_date` |
| **Tipo de Dado** | Data |
| **Obrigatório** | ✅ Sim |
| **Formato** | DD/MM/YYYY ou YYYY-MM-DD |
| **Validação** | Deve ser >= first_interaction_date |
| **Exemplo** | 20/02/2024, 2024-02-20 |

**Descrição**: Data da interação específica registrada nesta linha.

**Regras de Negócio**:
- Pode haver múltiplas linhas com mesma `interaction_date` para o mesmo usuário
- Deve ser >= `first_interaction_date`
- Não pode ser data futura

**Fórmula de Validação**:
```excel
=SE([@[interaction_date]]<[@[first_interaction_date]];"ERRO: Data anterior à primeira interação";"OK")
```

---

#### 4. event_type

| Propriedade | Valor |
|-------------|-------|
| **Nome do Campo** | `event_type` |
| **Tipo de Dado** | Texto |
| **Obrigatório** | ⚪ Opcional |
| **Formato** | Texto, lowercase |
| **Valores Permitidos** | "signup", "login", "purchase", "view", "click", "custom" |
| **Exemplo** | "purchase", "login" |

**Descrição**: Tipo de evento ou interação realizada pelo usuário.

**Regras de Negócio**:
- Usar nomenclatura padronizada
- Manter consistência (sempre lowercase ou uppercase)
- Documentar eventos customizados

**Valores Comuns**:
- `signup`: Cadastro inicial
- `login`: Acesso ao sistema
- `purchase`: Compra realizada
- `view`: Visualização de conteúdo
- `click`: Clique em elemento
- `download`: Download de arquivo

---

#### 5. value

| Propriedade | Valor |
|-------------|-------|
| **Nome do Campo** | `value` |
| **Tipo de Dado** | Número (Decimal) |
| **Obrigatório** | ⚪ Opcional |
| **Formato** | Número com até 2 casas decimais |
| **Validação** | Deve ser >= 0 |
| **Exemplo** | 150.00, 99.99, 0 |

**Descrição**: Valor monetário associado à interação (quando aplicável).

**Regras de Negócio**:
- Usar 0 para eventos sem valor monetário
- Sempre em moeda base (ex: BRL, USD)
- Não incluir símbolo de moeda

**Fórmula de Validação**:
```excel
=SE([@value]<0;"ERRO: Valor negativo";"OK")
```

---

#### 6. channel

| Propriedade | Valor |
|-------------|-------|
| **Nome do Campo** | `channel` |
| **Tipo de Dado** | Texto |
| **Obrigatório** | ⚪ Opcional |
| **Formato** | Texto, lowercase |
| **Valores Permitidos** | "organic", "paid", "referral", "direct", "social", "email" |
| **Exemplo** | "organic", "paid" |

**Descrição**: Canal de aquisição ou origem do usuário.

**Valores Comuns**:
- `organic`: Busca orgânica (SEO)
- `paid`: Mídia paga (Google Ads, Facebook Ads)
- `referral`: Indicação de outro usuário
- `direct`: Acesso direto (URL digitada)
- `social`: Redes sociais
- `email`: Email marketing

---

#### 7. segment

| Propriedade | Valor |
|-------------|-------|
| **Nome do Campo** | `segment` |
| **Tipo de Dado** | Texto |
| **Obrigatório** | ⚪ Opcional |
| **Formato** | Texto, lowercase |
| **Valores Permitidos** | "free", "trial", "premium", "enterprise" |
| **Exemplo** | "premium", "free" |

**Descrição**: Segmento ou plano do usuário.

**Valores Comuns**:
- `free`: Plano gratuito
- `trial`: Período de teste
- `premium`: Plano pago individual
- `enterprise`: Plano corporativo

---

## 🗂️ Tabela: Dados Processados

### Campos Calculados

#### 8. cohort

| Propriedade | Valor |
|-------------|-------|
| **Nome do Campo** | `cohort` |
| **Tipo de Dado** | Texto |
| **Obrigatório** | ✅ Sim (calculado) |
| **Formato** | "MMM/YYYY" (ex: "Jan/2024") |
| **Cálculo** | `=TEXTO([@[first_interaction_date]];"MMM/YYYY")` |
| **Exemplo** | "Jan/2024", "Fev/2024" |

**Descrição**: Identificador do cohort ao qual o usuário pertence, baseado no mês/ano da primeira interação.

---

#### 9. period

| Propriedade | Valor |
|-------------|-------|
| **Nome do Campo** | `period` |
| **Tipo de Dado** | Número (Inteiro) |
| **Obrigatório** | ✅ Sim (calculado) |
| **Formato** | Número inteiro >= 0 |
| **Cálculo** | `=DATEDIF([@[first_interaction_date]];[@[interaction_date]];"M")` |
| **Exemplo** | 0, 1, 2, 3... |

**Descrição**: Número de meses completos desde a primeira interação.

**Interpretação**:
- `0`: Mês de aquisição
- `1`: Primeiro mês após aquisição
- `2`: Segundo mês após aquisição
- etc.

---

## 🗂️ Tabela: Matriz de Retenção

### Campos da Matriz

#### 10. cohort_name

| Propriedade | Valor |
|-------------|-------|
| **Nome do Campo** | `cohort_name` |
| **Tipo de Dado** | Texto |
| **Formato** | "MMM/YYYY" |
| **Exemplo** | "Jan/2024" |

**Descrição**: Nome do cohort (linha da matriz).

---

#### 11. period_N

| Propriedade | Valor |
|-------------|-------|
| **Nome do Campo** | `period_0`, `period_1`, `period_2`, etc. |
| **Tipo de Dado** | Número (Inteiro) ou Percentual |
| **Formato** | Número absoluto ou % |
| **Exemplo** | 1000, 450 (45%) |

**Descrição**: Número de usuários ativos no período N, ou percentual de retenção.

---

## 📊 Métricas Derivadas

### 12. retention_rate

| Propriedade | Valor |
|-------------|-------|
| **Nome da Métrica** | `retention_rate` |
| **Tipo de Dado** | Percentual |
| **Formato** | 0-100% |
| **Cálculo** | `(Usuários Ativos / Total Cohort) × 100` |
| **Exemplo** | 45.5%, 32.1% |

**Descrição**: Percentual de usuários do cohort que permaneceram ativos no período.

---

### 13. churn_rate

| Propriedade | Valor |
|-------------|-------|
| **Nome da Métrica** | `churn_rate` |
| **Tipo de Dado** | Percentual |
| **Formato** | 0-100% |
| **Cálculo** | `100 - retention_rate` |
| **Exemplo** | 54.5%, 67.9% |

**Descrição**: Percentual de usuários que abandonaram (não retornaram).

---

### 14. cumulative_retention

| Propriedade | Valor |
|-------------|-------|
| **Nome da Métrica** | `cumulative_retention` |
| **Tipo de Dado** | Percentual |
| **Formato** | 0-100% |
| **Cálculo** | `MÉDIA(retention_rates até período N)` |
| **Exemplo** | 40.2% |

**Descrição**: Média de retenção acumulada até determinado período.

---

### 15. ltv_estimate

| Propriedade | Valor |
|-------------|-------|
| **Nome da Métrica** | `ltv_estimate` |
| **Tipo de Dado** | Número (Decimal) |
| **Formato** | Valor monetário |
| **Cálculo** | `Ticket Médio × SOMA(retention_rates)` |
| **Exemplo** | 450.00 |

**Descrição**: Estimativa do Lifetime Value (valor total esperado do cliente).

---

## 🔍 Regras de Validação

### Validações Automáticas

| Validação | Fórmula | Mensagem de Erro |
|-----------|---------|------------------|
| Data válida | `=ÉNÚM([@[interaction_date]])` | "Data inválida" |
| Data futura | `=[@[interaction_date]]>HOJE()` | "Data não pode ser futura" |
| Ordem de datas | `=[@[interaction_date]]<[@[first_interaction_date]]` | "Interação antes da primeira data" |
| User ID vazio | `=ÉCÉL.VAZIA([@user_id])` | "User ID obrigatório" |
| Valor negativo | `=[@value]<0` | "Valor não pode ser negativo" |

---

## 📝 Notas de Implementação

### Nomenclatura

- **Campos**: snake_case (ex: `first_interaction_date`)
- **Tabelas**: PascalCase (ex: `DadosBrutos`)
- **Ranges**: PascalCase (ex: `MatrizRetencao`)

### Formatação no Excel

- **Datas**: Formato personalizado `DD/MM/YYYY`
- **Percentuais**: Formato `0.0%`
- **Valores monetários**: Formato `R$ #,##0.00`
- **Números inteiros**: Formato `#,##0`

### Performance

- Usar **Tabelas Estruturadas** para melhor performance
- Evitar fórmulas voláteis em grandes datasets
- Indexar campos frequentemente filtrados

---

## 🔄 Versionamento do Dicionário

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Jan/2026 | Versão inicial do dicionário de dados |

---

**Última atualização**: Janeiro 2026  
**Versão**: 1.0
