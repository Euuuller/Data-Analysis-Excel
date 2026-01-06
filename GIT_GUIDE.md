# 🚀 Guia Rápido - Git Commands

## 📋 Comandos para Versionar o Projeto

### 1️⃣ Adicionar Todos os Arquivos

```bash
git add .
```

Este comando adiciona todos os novos arquivos e modificações ao staging area.

**Arquivos que serão adicionados:**
- ✅ `.gitignore`
- ✅ `README.md`
- ✅ `LICENSE`
- ✅ `STRUCTURE.md`
- ✅ Toda a pasta `docs/`
- ✅ Toda a pasta `data/`
- ✅ Toda a pasta `templates/`
- ✅ `output/.gitkeep`

**Arquivos que NÃO serão adicionados (conforme .gitignore):**
- ❌ `Data-Analysis-Excel.xlsx`
- ❌ Outros arquivos Excel
- ❌ Arquivos CSV
- ❌ Arquivos temporários

---

### 2️⃣ Fazer o Commit

```bash
git commit -m "feat: estrutura profissional do projeto de Cohort Analysis

- Adiciona .gitignore completo para arquivos Excel e temporários
- Cria README.md profissional com badges e documentação completa
- Adiciona documentação técnica (metodologia, fórmulas, insights)
- Inclui especificações de dados (sample_data, data_dictionary)
- Adiciona template reutilizável para novas análises
- Inclui licença MIT
- Organiza estrutura de pastas profissional
- Adiciona guia de estrutura do projeto"
```

---

### 3️⃣ Enviar para o GitHub

```bash
git push origin main
```

Ou, se sua branch principal for `master`:

```bash
git push origin master
```

---

## 🔄 Comandos Completos (Copiar e Colar)

### Opção 1: Executar Tudo de Uma Vez

```bash
git add . && git commit -m "feat: estrutura profissional do projeto de Cohort Analysis

- Adiciona .gitignore completo para arquivos Excel e temporários
- Cria README.md profissional com badges e documentação completa
- Adiciona documentação técnica (metodologia, fórmulas, insights)
- Inclui especificações de dados (sample_data, data_dictionary)
- Adiciona template reutilizável para novas análises
- Inclui licença MIT
- Organiza estrutura de pastas profissional
- Adiciona guia de estrutura do projeto" && git push origin main
```

---

### Opção 2: Passo a Passo

```bash
# Passo 1: Adicionar arquivos
git add .

# Passo 2: Verificar o que será commitado
git status

# Passo 3: Fazer o commit
git commit -m "feat: estrutura profissional do projeto de Cohort Analysis"

# Passo 4: Enviar para o GitHub
git push origin main
```

---

## 📊 Verificar Status

### Antes do Commit

```bash
git status
```

Mostra quais arquivos foram modificados/adicionados.

---

### Ver Histórico de Commits

```bash
git log --oneline
```

Mostra o histórico de commits de forma resumida.

---

## 🔍 Comandos Úteis

### Ver Diferenças

```bash
git diff
```

Mostra as mudanças que ainda não foram adicionadas ao staging.

---

### Ver Arquivos Ignorados

```bash
git status --ignored
```

Mostra os arquivos que estão sendo ignorados pelo `.gitignore`.

---

### Verificar Branch Atual

```bash
git branch
```

Mostra em qual branch você está.

---

## ⚠️ Importante

### Antes de Fazer Push

1. ✅ Verifique se o arquivo Excel **NÃO** está sendo versionado:
   ```bash
   git status
   ```
   
   Você **NÃO** deve ver `Data-Analysis-Excel.xlsx` na lista.

2. ✅ Confirme que o `.gitignore` está funcionando:
   ```bash
   git check-ignore Data-Analysis-Excel.xlsx
   ```
   
   Deve retornar o caminho do arquivo, confirmando que está ignorado.

---

## 🎯 Próximos Commits

### Quando Atualizar a Documentação

```bash
git add docs/
git commit -m "docs: atualiza insights e metodologia"
git push origin main
```

---

### Quando Adicionar Novas Visualizações

```bash
git add images/
git commit -m "docs: adiciona gráficos de retenção"
git push origin main
```

---

### Quando Atualizar o README

```bash
git add README.md
git commit -m "docs: atualiza README com novos insights"
git push origin main
```

---

## 🆘 Troubleshooting

### Problema: "fatal: not a git repository"

**Solução**: Você não está na pasta correta. Navegue até a pasta do projeto:

```bash
cd "c:\Users\Euller dos Santos\Documents\GitHub\Projetos\Data-Analysis-Excel"
```

---

### Problema: "Your branch is behind 'origin/main'"

**Solução**: Puxe as mudanças do GitHub antes de fazer push:

```bash
git pull origin main
```

---

### Problema: Arquivo Excel foi adicionado por engano

**Solução**: Remova do staging:

```bash
git reset HEAD Data-Analysis-Excel.xlsx
```

Ou, se já foi commitado:

```bash
git rm --cached Data-Analysis-Excel.xlsx
git commit -m "fix: remove arquivo Excel do versionamento"
```

---

## 📚 Convenções de Commit

Use prefixos semânticos para commits:

| Prefixo | Uso | Exemplo |
|---------|-----|---------|
| `feat:` | Nova funcionalidade | `feat: adiciona nova análise de segmentação` |
| `docs:` | Documentação | `docs: atualiza guia de fórmulas` |
| `fix:` | Correção de bug | `fix: corrige cálculo de retenção` |
| `style:` | Formatação | `style: melhora formatação do README` |
| `refactor:` | Refatoração | `refactor: reorganiza estrutura de pastas` |
| `chore:` | Manutenção | `chore: atualiza .gitignore` |

---

## ✅ Checklist Antes do Push

- [ ] Executei `git status` e verifiquei os arquivos
- [ ] Arquivo Excel **NÃO** está na lista
- [ ] Mensagem de commit é descritiva
- [ ] Testei que a estrutura está correta
- [ ] Li o README.md para confirmar que está completo

---

**Dica**: Salve este arquivo para referência futura!

**Última atualização**: Janeiro 2026
