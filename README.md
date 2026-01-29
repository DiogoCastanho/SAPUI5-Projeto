# Catálogo de Recursos de Estudo - SAPUI5

## Identificação do Projeto

- **Instituição**: Deloitte + IPS (Instituto Politécnico de Setúbal)
- **Unidade Curricular**: IPW
- **Projeto**: Aplicação SAPUI5 - Catálogo de Recursos de Estudo
- **Docente**: Vitor Ferreira
- **Autor**: Diogo Castanho
- **Local**: Setúbal, Portugal
- **Data**: Janeiro 2026

---

## Descrição do Projeto

Aplicação SAPUI5 desenvolvida para permitir aos estudantes consultar materiais de estudo organizados por disciplina. A aplicação oferece funcionalidades de pesquisa, visualização de detalhes e navegação intuitiva entre ecrãs, seguindo as boas práticas do framework SAPUI5.

### Objetivos Alcançados

- ✅ Estrutura modular e bem organizada (MVC)
- ✅ Models e Data Binding completos
- ✅ XML Views e Fragments
- ✅ Internacionalização (i18n) PT e EN
- ✅ Formatters para lógica visual
- ✅ Routing completo entre páginas
- ✅ Pesquisa e filtros funcionais
- ✅ Validação defensiva de dados
- ✅ UX polida e responsiva

---

## Instruções de Execução

### Pré-requisitos

- Node.js (v14 ou superior)
- npm (v6 ou superior)

### Instalação

1. **Clonar/Descompactar o projeto**

   ```bash
   unzip BrightStart_IPS_2026_UI5_DiogoCastanho.zip
   cd BrightStart_IPS_2026_UI5_DiogoCastanho
   ```

2. **Instalar dependências**

   ```bash
   npm install
   ```

3. **Executar a aplicação**

   ```bash
   npm start
   ```

4. **Aceder à aplicação**
   - Abrir o browser em: `http://localhost:8080`

### Comandos Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run build      # Cria build de produção
npm test           # Executa testes (se configurados)
```

---

## Funcionalidades Implementadas

### ✅ Funcionalidades Obrigatórias

1. **Página Principal**
   - Lista de disciplinas organizada
   - Pesquisa por nome de disciplina (case-insensitive)
   - Ordenação ascendente/descendente
   - **Nível A Extra**: Contagem de recursos por disciplina

2. **Página de Detalhe**
   - Tabela completa de recursos
   - Botão "Voltar" funcional
   - **Nível B Extra**: Pesquisa estendida (título, tipo, descrição)
   - Botão para adicionar recursos (sem persistência)
   - Botão para limpar pesquisa

3. **Diálogo "Sobre"**
   - Implementado como Fragment
   - Informações do autor e projeto
   - Ícone "information" no header

4. **Internacionalização (i18n)**
   - ✅ Português (PT) - i18n.properties
   - ✅ Inglês (EN) - i18n_en.properties
   - Todos os textos externalizados

5. **Formatters**
   - `formatResourceCount`: Conta recursos (singular/plural)
   - `formatDescription`: Validação defensiva com fallback
   - `iconByType`: Ícones dinâmicos por tipo
   - `stateByObrigatorio`: Estados visuais
   - `hasValidUrl`: Validação de URLs

6. **Routing**
   - Navegação Main ↔ Detail
   - Parâmetros de rota funcionais
   - History management

---

## Funcionalidades Extras Implementadas (Secção 14)

### Nível A - Informação Adicional (+1 valor)

**✅ Implementado: Mostrar número total de recursos por disciplina**

- Cada disciplina na lista principal mostra a contagem de recursos
- Formatação inteligente: "1 recurso" vs "2 recursos"
- Binding dinâmico com formatter personalizado
- Implementação: `formatResourceCount` em `formatter.js`

```xml
number="{
    parts: ['recursos', 'i18n>resourceCount', 'i18n>resourceCountSingular'],
    formatter: '.formatter.formatResourceCount'
}"
```

### Nível B - Funcionalidade Moderada (+1 valor)

**✅ Implementado: Pesquisa estendida à descrição**

- SearchField na página de detalhe
- Pesquisa simultânea em 3 campos: título, tipo e descrição
- Filtros OR (qualquer campo que contenha o termo)
- Botão "Limpar Pesquisa" adicional
- Implementação: `onSearchResources` em `Detail.controller.js`

```javascript
new Filter({
  filters: [
    new Filter("titulo", FilterOperator.Contains, sQuery),
    new Filter("tipo", FilterOperator.Contains, sQuery),
    new Filter("descricao", FilterOperator.Contains, sQuery),
  ],
  and: false,
});
```

### Nível C - Organização e Robustez (+1 valor)

**✅ Implementado: Validação defensiva dos dados do JSON**

1. **Validação de URL vazia**
   - Link "Abrir recurso" escondido quando URL ausente
   - Binding condicional: `visible="{= ${url} !== '' }"`

2. **Validação de descrição ausente**
   - Formatter mostra "Sem descrição disponível" como fallback
   - Função: `formatDescription` em `formatter.js`

3. **Validação no formulário de adicionar recurso**
   - Estados de erro visuais (Error/Warning)
   - Mensagens de validação específicas
   - Tratamento de campos vazios com valores padrão

```javascript
// Exemplo de validação defensiva
descricao: oDescArea.getValue().trim() || "Sem descrição disponível",
url: sUrl || ""
```

---

## Estrutura do Projeto

```
webapp/
├── controller/
│   ├── BaseController.js          # Controlador base
│   ├── Main.controller.js         # Controlador da página principal
│   └── Detail.controller.js       # Controlador da página de detalhe
├── view/
│   ├── App.view.xml               # View raiz
│   ├── Main.view.xml              # View principal
│   ├── Detail.view.xml            # View de detalhe
│   └── fragment/
│       ├── AboutDialog.fragment.xml
│       └── AddResourceDialog.fragment.xml
├── model/
│   ├── Resources.json             # Dados das disciplinas
│   └── formatter.js               # Formatters personalizados
├── i18n/
│   ├── i18n.properties            # Textos em Português
│   └── i18n_en.properties         # Textos em Inglês
├── css/
│   └── style.css                  # Estilos personalizados
├── manifest.json                   # Configuração da aplicação
├── Component.js                    # Componente principal
└── index.html                      # Ponto de entrada
```

---

## Tecnologias Utilizadas

- **SAPUI5** v1.96.0+
- **JavaScript ES6+**
- **XML Views**
- **JSON Model**
- **sap.m Controls**
- **sap.ui.core.routing**

---

## 🎥 Demonstração em Vídeo

[Adicionar link para vídeo de demonstração de 2-3 minutos - Opcional]

---

## ⚠️ Limitações Conhecidas

1. **Persistência de Dados**
   - Recursos adicionados só existem em memória
   - Dados resetam ao recarregar a página
   - Solução futura: Backend com OData/REST API

2. **Validação de URL**
   - Não valida formato da URL (http/https)
   - Aceita qualquer string no campo URL

3. **Pesquisa**
   - Case-insensitive mas não trata acentos
   - Não suporta operadores booleanos (AND/OR explícitos)

---

## Checklist de Autoavaliação

- ✅ Aplicação corre sem erros na consola?
- ✅ manifest.json contém configuração do JSONModel?
- ✅ Todos os textos visíveis estão em i18n (PT e EN)?
- ✅ Pesquisa filtra corretamente os itens?
- ✅ UX: títulos claros, itens informativos, botão Voltar visível?
- ✅ Navegação para detalhe funciona e permite retroceder?
- ✅ Formatters funcionam corretamente?
- ✅ Validação defensiva implementada?
- ✅ Contagem de recursos por disciplina visível?
- ✅ Código limpo e bem documentado?

---

## Contacto

**Diogo Castanho**

- GitHub: [github.com/DiogoCastanho](https://github.com/DiogoCastanho)
- Email: diogodev06@gmail.com

---

## Licença

Este projeto foi desenvolvido para fins académicos no âmbito da Unidade Curricular de IPW (IPS 2026).

---

**Desenvolvido por Diogo Castanho | Janeiro 2026**
