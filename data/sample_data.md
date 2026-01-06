# Estrutura de Dados - Sample Data

## 📊 Formato dos Dados Esperados

Este documento descreve a estrutura de dados necessária para a análise de cohort.

---

## 1️⃣ Dados Brutos (Raw Data)

### Estrutura da Tabela Principal

A tabela de dados brutos deve conter as seguintes colunas:

| Coluna | Tipo | Obrigatório | Descrição | Exemplo |
|--------|------|-------------|-----------|---------|
| `user_id` | Texto/Número | ✅ Sim | Identificador único do usuário | "USER001", "12345" |
| `first_interaction_date` | Data | ✅ Sim | Data da primeira interação do usuário | 15/01/2024 |
| `interaction_date` | Data | ✅ Sim | Data da interação atual | 20/02/2024 |
| `event_type` | Texto | ⚪ Opcional | Tipo de evento/interação | "signup", "purchase", "login" |
| `value` | Número | ⚪ Opcional | Valor monetário da transação | 150.00 |
| `channel` | Texto | ⚪ Opcional | Canal de aquisição | "organic", "paid", "referral" |
| `segment` | Texto | ⚪ Opcional | Segmento do usuário | "premium", "free", "trial" |

---

## 2️⃣ Exemplo de Dados

### Formato CSV

```csv
user_id,first_interaction_date,interaction_date,event_type,value,channel,segment
USER001,2024-01-15,2024-01-15,signup,0,organic,free
USER001,2024-01-15,2024-01-20,login,0,organic,free
USER001,2024-01-15,2024-02-10,purchase,100,organic,premium
USER002,2024-01-20,2024-01-20,signup,0,paid,trial
USER002,2024-01-20,2024-02-05,login,0,paid,trial
USER002,2024-01-20,2024-03-01,purchase,75,paid,premium
USER003,2024-02-01,2024-02-01,signup,0,referral,free
USER003,2024-02-01,2024-02-15,login,0,referral,free
USER004,2024-02-10,2024-02-10,signup,0,organic,free
USER004,2024-02-10,2024-03-20,purchase,200,organic,premium
USER005,2024-03-01,2024-03-01,signup,0,paid,trial
```

### Formato Excel

**Aba: "Dados Brutos"**

| user_id | first_interaction_date | interaction_date | event_type | value | channel | segment |
|---------|------------------------|------------------|------------|-------|---------|---------|
| USER001 | 15/01/2024 | 15/01/2024 | signup | 0 | organic | free |
| USER001 | 15/01/2024 | 20/01/2024 | login | 0 | organic | free |
| USER001 | 15/01/2024 | 10/02/2024 | purchase | 100 | organic | premium |
| USER002 | 20/01/2024 | 20/01/2024 | signup | 0 | paid | trial |
| USER002 | 20/01/2024 | 05/02/2024 | login | 0 | paid | trial |
| USER002 | 20/01/2024 | 01/03/2024 | purchase | 75 | paid | premium |

---

## 3️⃣ Dados Processados

### Tabela de Cohorts

Após processamento, os dados devem ser transformados em:

| user_id | cohort | first_interaction_date | interaction_date | period | event_type | value |
|---------|--------|------------------------|------------------|--------|------------|-------|
| USER001 | Jan/2024 | 15/01/2024 | 15/01/2024 | 0 | signup | 0 |
| USER001 | Jan/2024 | 15/01/2024 | 10/02/2024 | 1 | purchase | 100 |
| USER002 | Jan/2024 | 20/01/2024 | 20/01/2024 | 0 | signup | 0 |
| USER002 | Jan/2024 | 20/01/2024 | 01/03/2024 | 2 | purchase | 75 |

**Novas Colunas Calculadas:**
- `cohort`: Mês/Ano da primeira interação
- `period`: Número de meses desde a primeira interação

---

## 4️⃣ Matriz de Retenção

### Estrutura Final para Análise

|  | Período 0 | Período 1 | Período 2 | Período 3 | Período 4 | Período 5 |
|---|-----------|-----------|-----------|-----------|-----------|-----------|
| **Jan/2024** | 1000 (100%) | 450 (45%) | 320 (32%) | 280 (28%) | 250 (25%) | 230 (23%) |
| **Fev/2024** | 1200 (100%) | 540 (45%) | 400 (33%) | 350 (29%) | 310 (26%) | - |
| **Mar/2024** | 1100 (100%) | 550 (50%) | 420 (38%) | 370 (34%) | - | - |
| **Abr/2024** | 1300 (100%) | 650 (50%) | 520 (40%) | - | - | - |
| **Mai/2024** | 1250 (100%) | 625 (50%) | - | - | - | - |
| **Jun/2024** | 1400 (100%) | - | - | - | - | - |

**Formato:**
- Número absoluto de usuários
- Percentual de retenção entre parênteses

---

## 5️⃣ Regras de Validação

### Verificações Essenciais

1. **Datas Válidas**
   ```excel
   =SE(interaction_date < first_interaction_date; "ERRO"; "OK")
   ```

2. **User ID Não Vazio**
   ```excel
   =SE(ÉCÉL.VAZIA(user_id); "ERRO"; "OK")
   ```

3. **Primeira Interação Única por Usuário**
   ```excel
   =SE(CONT.SE(user_id_range; user_id) > 1; "DUPLICADO"; "OK")
   ```

4. **Valores Numéricos**
   ```excel
   =SE(NÃO(ÉNÚM(value)); "ERRO"; "OK")
   ```

---

## 6️⃣ Preparação dos Dados

### Passo a Passo

#### 1. Importação
- Copiar dados para aba "Dados Brutos"
- Converter para Tabela Excel (Ctrl+T)
- Nomear tabela como "DadosBrutos"

#### 2. Limpeza
- Remover linhas vazias
- Verificar formato de datas
- Padronizar text (maiúsculas/minúsculas)

#### 3. Cálculo de Campos
- Adicionar coluna "cohort"
- Adicionar coluna "period"
- Validar cálculos

#### 4. Criação de Tabela Dinâmica
- Linhas: Cohort
- Colunas: Period
- Valores: Contagem Distinta de user_id

---

## 7️⃣ Exemplo Completo de Dataset

### Cenário: E-commerce

```
user_id | first_interaction_date | interaction_date | event_type | value  | channel  | segment
--------|------------------------|------------------|------------|--------|----------|----------
U001    | 2024-01-05            | 2024-01-05       | signup     | 0      | organic  | free
U001    | 2024-01-05            | 2024-01-10       | view       | 0      | organic  | free
U001    | 2024-01-05            | 2024-01-15       | purchase   | 150.00 | organic  | premium
U001    | 2024-01-05            | 2024-02-20       | purchase   | 200.00 | organic  | premium
U002    | 2024-01-12            | 2024-01-12       | signup     | 0      | paid     | trial
U002    | 2024-01-12            | 2024-01-25       | purchase   | 99.00  | paid     | premium
U002    | 2024-01-12            | 2024-03-10       | purchase   | 120.00 | paid     | premium
U003    | 2024-01-18            | 2024-01-18       | signup     | 0      | referral | free
U003    | 2024-01-18            | 2024-01-20       | view       | 0      | referral | free
U004    | 2024-02-01            | 2024-02-01       | signup     | 0      | organic  | free
U004    | 2024-02-01            | 2024-02-05       | view       | 0      | organic  | free
U004    | 2024-02-01            | 2024-03-15       | purchase   | 180.00 | organic  | premium
U005    | 2024-02-10            | 2024-02-10       | signup     | 0      | paid     | trial
U005    | 2024-02-10            | 2024-02-15       | purchase   | 75.00  | paid     | premium
```

### Interpretação

- **U001**: Cohort Jan/2024, ativo nos períodos 0, 1
- **U002**: Cohort Jan/2024, ativo nos períodos 0, 2
- **U003**: Cohort Jan/2024, ativo apenas no período 0
- **U004**: Cohort Fev/2024, ativo nos períodos 0, 1
- **U005**: Cohort Fev/2024, ativo no período 0

---

## 8️⃣ Formatos de Exportação

### Para Excel
- Salvar como `.xlsx` (não versionado)
- Manter formatação de tabelas
- Incluir validações de dados

### Para Análise Externa
- Exportar como `.csv` UTF-8
- Separador: vírgula ou ponto-e-vírgula
- Formato de data: YYYY-MM-DD

### Para Backup
- Exportar como `.csv` + `.xlsx`
- Incluir timestamp no nome do arquivo
- Armazenar em local seguro (não no Git)

---

## 9️⃣ Tamanho Recomendado de Dataset

### Mínimo Viável
- **Usuários**: 100+ por cohort
- **Período**: 6 meses de dados
- **Cohorts**: 3+ cohorts para comparação

### Ideal
- **Usuários**: 1000+ por cohort
- **Período**: 12+ meses de dados
- **Cohorts**: 6+ cohorts para análise robusta

### Considerações
- Cohorts muito pequenos (<50 usuários) têm alta variabilidade
- Períodos curtos (<3 meses) limitam insights
- Mais dados = análises mais confiáveis

---

## 🔒 Segurança e Privacidade

### Dados Sensíveis

⚠️ **NUNCA versionar no Git:**
- Dados reais de clientes
- Informações pessoalmente identificáveis (PII)
- Valores financeiros reais
- Emails, telefones, endereços

### Anonimização

✅ **Para compartilhamento:**
- Substituir user_id por IDs genéricos (USER001, USER002)
- Remover colunas com PII
- Usar dados sintéticos ou agregados
- Aplicar técnicas de mascaramento

---

## 📝 Checklist de Preparação

Antes de iniciar a análise, verifique:

- [ ] Dados importados na aba "Dados Brutos"
- [ ] Tabela Excel criada e nomeada
- [ ] Formato de datas correto (DD/MM/YYYY ou YYYY-MM-DD)
- [ ] Sem valores vazios em colunas obrigatórias
- [ ] User IDs únicos e consistentes
- [ ] Primeira interação sempre <= interações subsequentes
- [ ] Valores numéricos em formato correto
- [ ] Dados sensíveis anonimizados
- [ ] Backup criado antes de processar

---

**Última atualização**: Janeiro 2026  
**Versão**: 1.0
