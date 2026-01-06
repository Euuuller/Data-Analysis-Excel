# Guia de Fórmulas - Análise de Cohort no Excel

## 📐 Fórmulas Principais

Este documento detalha todas as fórmulas utilizadas na análise de cohort, com explicações e exemplos práticos.

---

## 1️⃣ Preparação de Dados

### 1.1 Identificação do Cohort

**Objetivo**: Atribuir cada usuário ao seu cohort baseado na data da primeira interação.

```excel
=TEXTO([@[first_interaction_date]];"MMM/YYYY")
```

**Explicação**:
- `TEXTO()`: Converte data em texto formatado
- `[@[first_interaction_date]]`: Referência estruturada à coluna da tabela
- `"MMM/YYYY"`: Formato de saída (ex: "Jan/2024")

**Exemplo**:
```
Data: 15/01/2024 → Resultado: "Jan/2024"
Data: 28/02/2024 → Resultado: "Fev/2024"
```

---

### 1.2 Cálculo do Período Relativo

**Objetivo**: Calcular quantos meses se passaram desde a primeira interação.

```excel
=DATEDIF([@[first_interaction_date]];[@[interaction_date]];"M")
```

**Explicação**:
- `DATEDIF()`: Calcula diferença entre datas
- Primeiro argumento: Data inicial
- Segundo argumento: Data final
- `"M"`: Retorna diferença em meses completos

**Exemplo**:
```
Primeira interação: 15/01/2024
Interação atual: 20/03/2024
Resultado: 2 (meses)
```

**Alternativa com DATADIF**:
```excel
=ANO([@[interaction_date]])*12+MÊS([@[interaction_date]]) - 
 (ANO([@[first_interaction_date]])*12+MÊS([@[first_interaction_date]]))
```

---

### 1.3 Remoção de Duplicatas

**Objetivo**: Garantir que cada usuário seja contado apenas uma vez por período.

```excel
=SE(CONT.SE.S($A$2:A2;A2;$B$2:B2;B2)>1;"Duplicado";"Único")
```

**Explicação**:
- Verifica se a combinação usuário+período já apareceu antes
- Marca duplicatas para exclusão ou tratamento

---

## 2️⃣ Contagem de Usuários

### 2.1 Total de Usuários no Cohort

**Objetivo**: Contar quantos usuários iniciaram em cada cohort.

```excel
=CONT.SE($D$2:$D$10000;H2)
```

**Explicação**:
- `CONT.SE()`: Conta células que atendem critério
- `$D$2:$D$10000`: Range de cohorts (referência absoluta)
- `H2`: Cohort específico a contar

**Com Tabela Estruturada**:
```excel
=CONT.SE(Dados[Cohort];[@Cohort])
```

---

### 2.2 Usuários Ativos por Período

**Objetivo**: Contar quantos usuários únicos estavam ativos em cada período.

```excel
=CONT.SE.S(
    Dados[Cohort];[@Cohort];
    Dados[Periodo];[@Periodo]
)
```

**Explicação**:
- `CONT.SE.S()`: Conta com múltiplos critérios
- Primeiro par: Range e critério do cohort
- Segundo par: Range e critério do período

**Versão com SOMA e SE**:
```excel
=SOMA(SE((Dados[Cohort]=[@Cohort])*(Dados[Periodo]=[@Periodo]);1;0))
```
*Nota: Fórmula de matriz, confirmar com Ctrl+Shift+Enter em versões antigas do Excel*

---

### 2.3 Contagem de Usuários Únicos

**Objetivo**: Contar usuários únicos quando há múltiplas interações por período.

```excel
=SOMARPRODUTO((Dados[Cohort]=[@Cohort])*(Dados[Periodo]=[@Periodo])/
    CONT.SE.S(Dados[UserID];Dados[UserID];Dados[Cohort];[@Cohort];Dados[Periodo];[@Periodo]))
```

**Explicação**:
- `SOMARPRODUTO()`: Realiza operações em arrays
- Divide por contagem para evitar duplicatas
- Retorna número de usuários únicos

**Alternativa Simplificada (Excel 365)**:
```excel
=CONT.VALORES(ÚNICO(SE((Dados[Cohort]=[@Cohort])*(Dados[Periodo]=[@Periodo]);Dados[UserID])))
```

---

## 3️⃣ Cálculo de Métricas

### 3.1 Taxa de Retenção (%)

**Objetivo**: Calcular percentual de usuários que permaneceram ativos.

```excel
=(C3/$B3)*100
```

**Explicação**:
- `C3`: Usuários ativos no período N
- `$B3`: Total de usuários no cohort (referência absoluta na coluna)
- `*100`: Converte para percentual

**Com Tratamento de Erro**:
```excel
=SE.ERRO((C3/$B3)*100;0)
```

**Formatação Condicional**:
```excel
=ARRED((C3/$B3)*100;1)&"%"
```

---

### 3.2 Taxa de Churn (%)

**Objetivo**: Calcular percentual de usuários que abandonaram.

```excel
=100-(C3/$B3)*100
```

**Ou simplesmente**:
```excel
=100-[@Retencao]
```

---

### 3.3 Retenção Acumulada

**Objetivo**: Média de retenção até determinado período.

```excel
=MÉDIA($C3:C3)
```

**Explicação**:
- `$C3`: Início fixo (primeira retenção)
- `C3`: Fim variável (expande conforme arrasta)

---

### 3.4 Variação de Retenção (MoM)

**Objetivo**: Calcular mudança percentual mês a mês.

```excel
=SE(C2=0;0;(C3-C2)/C2*100)
```

**Explicação**:
- Verifica se período anterior é zero (evita divisão por zero)
- Calcula variação percentual

---

## 4️⃣ Fórmulas Avançadas

### 4.1 Índice e Corresp para Lookup

**Objetivo**: Buscar valor de retenção específico na matriz de cohort.

```excel
=ÍNDICE(MatrizRetencao;
    CORRESP(CohortProcurado;ListaCohorts;0);
    CORRESP(PeriodoProcurado;ListaPeriodos;0))
```

**Explicação**:
- `ÍNDICE()`: Retorna valor de posição específica
- `CORRESP()`: Encontra posição do valor procurado
- Primeiro CORRESP: Linha (cohort)
- Segundo CORRESP: Coluna (período)

---

### 4.2 Média Ponderada de Retenção

**Objetivo**: Calcular média de retenção ponderada pelo tamanho do cohort.

```excel
=SOMARPRODUTO(TaxasRetencao;TamanhoCohorts)/SOMA(TamanhoCohorts)
```

**Explicação**:
- Multiplica cada taxa pelo tamanho do cohort
- Divide pela soma total de usuários

---

### 4.3 Projeção de Retenção

**Objetivo**: Estimar retenção futura baseada em tendência.

```excel
=PREVISÃO.LINEAR(PeriodoFuturo;TaxasHistoricas;PeriodosHistoricos)
```

**Explicação**:
- `PREVISÃO.LINEAR()`: Regressão linear simples
- Extrapola tendência para períodos futuros

**Alternativa (Excel 2016+)**:
```excel
=TENDÊNCIA(TaxasHistoricas;PeriodosHistoricos;PeriodoFuturo)
```

---

### 4.4 Lifetime Value (LTV) Estimado

**Objetivo**: Estimar valor total do cliente baseado em retenção.

```excel
=TicketMedio * SOMA(TaxasRetencao/100)
```

**Explicação**:
- Soma todas as taxas de retenção (convertidas para decimal)
- Multiplica pelo ticket médio
- Resultado: Valor esperado ao longo do tempo

---

## 5️⃣ Formatação Condicional

### 5.1 Heatmap de Retenção

**Regra 1 - Verde Escuro** (Retenção > 50%):
```excel
=E(C3<>"";C3>50)
```

**Regra 2 - Verde Claro** (Retenção 30-50%):
```excel
=E(C3<>"";C3>=30;C3<=50)
```

**Regra 3 - Amarelo** (Retenção 15-30%):
```excel
=E(C3<>"";C3>=15;C3<30)
```

**Regra 4 - Vermelho** (Retenção < 15%):
```excel
=E(C3<>"";C3<15)
```

---

### 5.2 Destaque de Melhor/Pior Cohort

**Melhor Cohort**:
```excel
=C3=MÁXIMO($C$3:$C$20)
```

**Pior Cohort**:
```excel
=C3=MÍNIMO($C$3:$C$20)
```

---

## 6️⃣ Validação de Dados

### 6.1 Verificação de Datas

**Objetivo**: Garantir que interaction_date >= first_interaction_date.

```excel
=SE([@[interaction_date]]<[@[first_interaction_date]];"ERRO: Data inválida";"OK")
```

---

### 6.2 Detecção de Valores Ausentes

```excel
=SE(OU(ÉCÉL.VAZIA([@UserID]);ÉCÉL.VAZIA([@[first_interaction_date]]));"DADOS FALTANDO";"OK")
```

---

## 7️⃣ Fórmulas de Dashboard

### 7.1 KPI - Taxa de Retenção Média

```excel
=MÉDIA(RangeRetencaoMes1)
```

---

### 7.2 KPI - Melhor Cohort

```excel
=ÍNDICE(ListaCohorts;CORRESP(MÁXIMO(RetencaoMedia);RetencaoMedia;0))
```

---

### 7.3 KPI - Tendência de Retenção

```excel
=SE(MÉDIA(Ultimos3Cohorts)>MÉDIA(Primeiros3Cohorts);"↑ Melhorando";"↓ Piorando")
```

---

## 8️⃣ Tabelas Dinâmicas

### Configuração Recomendada

**Linhas**: Cohort  
**Colunas**: Período  
**Valores**: Contagem Distinta de UserID  
**Cálculo Personalizado**: % do Total da Linha

**Fórmula de Campo Calculado**:
```
=UserID / PRIMEIRO(UserID)
```

---

## 📝 Notas Importantes

### Performance

- ✅ Use referências estruturadas (tabelas) quando possível
- ✅ Evite fórmulas voláteis (AGORA, HOJE, ALEATÓRIO) em grandes datasets
- ✅ Prefira CONT.SE.S a múltiplos CONT.SE aninhados
- ✅ Use Tabelas Dinâmicas para agregações complexas

### Compatibilidade

- **Excel 365/2021**: Suporta ÚNICO, FILTRO, CLASSIFICAR
- **Excel 2016/2019**: Use SOMARPRODUTO para arrays
- **Excel 2013 ou anterior**: Fórmulas de matriz com Ctrl+Shift+Enter

### Debugging

Para testar fórmulas complexas:
```excel
=FORMULATEXTO(A1)  // Mostra a fórmula como texto
=AVALIAR.FÓRMULA()  // Ferramenta de avaliação passo a passo
```

---

## 🔗 Referências Rápidas

| Função | Uso Principal | Exemplo |
|--------|---------------|---------|
| `CONT.SE` | Contagem com 1 critério | `=CONT.SE(range;critério)` |
| `CONT.SE.S` | Contagem com múltiplos critérios | `=CONT.SE.S(range1;crit1;range2;crit2)` |
| `SOMARPRODUTO` | Arrays e contagens únicas | `=SOMARPRODUTO((cond1)*(cond2))` |
| `ÍNDICE/CORRESP` | Lookup bidirecional | `=ÍNDICE(matriz;CORRESP();CORRESP())` |
| `DATEDIF` | Diferença entre datas | `=DATEDIF(data1;data2;"M")` |
| `SE.ERRO` | Tratamento de erros | `=SE.ERRO(fórmula;valor_se_erro)` |

---

**Última atualização**: Janeiro 2026  
**Versão**: 1.0
