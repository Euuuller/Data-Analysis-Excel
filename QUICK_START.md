# 🚀 Guia Rápido - Como Organizar Seus Arquivos

## 📊 Arquivo Excel

### Onde colocar: **RAIZ DO PROJETO** ✅

```
Data-Analysis-Excel/
├── Data-Analysis-Excel.xlsx  ← Deixe aqui!
├── README.md
└── ...
```

**Por quê?**
- ✅ Fácil acesso
- ✅ Já está no `.gitignore` (não será versionado)
- ✅ Padrão para projetos de análise

**Você NÃO precisa mover o Excel!** Ele está perfeito onde está.

---

## 📁 Arquivos CSV do Kaggle

### Onde colocar: **`data/raw/`** ✅

```
Data-Analysis-Excel/
└── data/
    └── raw/
        ├── README.md          ← Preencha com info do Kaggle
        ├── seu_arquivo1.csv   ← Seus CSVs aqui
        ├── seu_arquivo2.csv
        └── seu_arquivo3.csv
```

### 🎯 Passo a Passo

1. **Mova seus CSVs para `data/raw/`**
   ```bash
   # No terminal, na pasta do projeto:
   mv caminho/do/seu/arquivo.csv data/raw/
   ```

2. **Preencha o `data/raw/README.md`**
   - Nome do dataset
   - Link do Kaggle
   - Descrição dos arquivos

3. **Versione no Git**
   ```bash
   git add data/raw/
   git commit -m "data: adiciona dataset do Kaggle"
   git push
   ```

---

## 📋 Estrutura Completa Recomendada

```
Data-Analysis-Excel/
│
├── 📊 Data-Analysis-Excel.xlsx       # Seu arquivo de trabalho (NÃO versionado)
│
├── 📄 README.md                       # Documentação principal
├── 📄 LICENSE
├── 📄 .gitignore                      # Atualizado para permitir CSVs
│
├── 📂 data/
│   ├── 📂 raw/                        # ✅ CSVs do Kaggle aqui
│   │   ├── README.md                  # Info do dataset
│   │   ├── transactions.csv           # Seus dados
│   │   └── customers.csv              # Seus dados
│   │
│   ├── 📂 processed/                  # Dados processados (opcional)
│   │   └── README.md
│   │
│   ├── 📂 sample/                     # Amostras (opcional)
│   │   └── README.md
│   │
│   ├── DATA_ORGANIZATION.md           # Guia de organização
│   ├── sample_data.md                 # Estrutura esperada
│   └── data_dictionary.md             # Dicionário
│
├── 📂 docs/                           # Documentação técnica
│   ├── metodologia.md
│   ├── formulas.md
│   └── insights.md
│
├── 📂 templates/
│   └── cohort_template.md
│
├── 📂 images/
│   └── charts/
│
└── 📂 output/                         # Resultados (NÃO versionados)
    └── .gitkeep
```

---

## ✅ Checklist - O Que Fazer Agora

### 1. Organizar CSVs

- [ ] Mover arquivos CSV para `data/raw/`
- [ ] Preencher `data/raw/README.md` com informações do Kaggle
- [ ] Verificar que os CSVs estão na pasta correta

### 2. Verificar .gitignore

- [ ] Confirmar que `.gitignore` permite CSVs (já atualizado! ✅)
- [ ] Confirmar que Excel continua ignorado

### 3. Versionar

```bash
# Adicionar os novos arquivos
git add data/

# Fazer commit
git commit -m "data: adiciona dataset do Kaggle e organiza estrutura de dados"

# Enviar para GitHub
git push
```

---

## 🎯 Comandos Prontos para Usar

### Se seus CSVs estão em outra pasta

```bash
# Exemplo: CSVs estão no Desktop
mv ~/Desktop/*.csv data/raw/

# Ou especificamente:
mv ~/Desktop/transactions.csv data/raw/
mv ~/Desktop/customers.csv data/raw/
```

### Verificar o que será versionado

```bash
git status
```

Você deve ver:
- ✅ `data/raw/` com seus CSVs
- ✅ `data/raw/README.md`
- ❌ **NÃO** deve ver `Data-Analysis-Excel.xlsx`

---

## ⚠️ Importante - Tamanho dos Arquivos

### Se seus CSVs forem GRANDES (>50MB)

Verifique o tamanho:
```bash
ls -lh data/raw/
```

**Se algum arquivo for >100MB**, você tem 3 opções:

#### Opção 1: Git LFS (Recomendado para arquivos grandes)
```bash
git lfs install
git lfs track "*.csv"
git add .gitattributes
```

#### Opção 2: Comprimir
```bash
zip data/raw/data.zip data/raw/*.csv
# Depois adicione *.csv ao .gitignore
```

#### Opção 3: Documentar onde baixar
No `data/raw/README.md`, adicione:
```markdown
## ⚠️ Arquivos Grandes

Os arquivos CSV são muito grandes para o GitHub.
Baixe diretamente do Kaggle: [LINK]
```

---

## 💡 Exemplo Prático

### Cenário: Você tem 3 CSVs do Kaggle

1. **Mover arquivos**
   ```bash
   mv ~/Downloads/online_retail.csv data/raw/
   mv ~/Downloads/customers.csv data/raw/
   mv ~/Downloads/products.csv data/raw/
   ```

2. **Preencher README**
   Edite `data/raw/README.md`:
   ```markdown
   **Nome**: Online Retail Dataset
   **Fonte**: https://www.kaggle.com/datasets/exemplo
   
   ## Arquivos
   - `online_retail.csv` - Transações de vendas
   - `customers.csv` - Dados de clientes
   - `products.csv` - Catálogo de produtos
   ```

3. **Versionar**
   ```bash
   git add data/raw/
   git commit -m "data: adiciona Online Retail Dataset do Kaggle"
   git push
   ```

---

## 🎉 Pronto!

Agora você tem:
- ✅ Excel na raiz (não versionado)
- ✅ CSVs em `data/raw/` (versionados)
- ✅ Estrutura profissional organizada
- ✅ Tudo documentado

---

**Dúvidas?** Consulte `data/DATA_ORGANIZATION.md` para mais detalhes!
