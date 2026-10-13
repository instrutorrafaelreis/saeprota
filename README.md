# 🎓 Simulado Avaliativo SAEP ROTA — Desenvolvimento Web & Folhas de Estilo (CSS)
> **Sistema de Avaliação da Educação Profissional (SAEP) | Metodologia SENAI (MSEP)**

Aplicação web completa, responsiva e interativa para aplicação do simulado formativo com **20 Itens**, contendo:
1. **Ambiente de Prova Online** para os estudantes (Item 1 ao 20 com navegação rápida, marcadores de revisão e cronômetro).
2. **Gráfico de Acertos e Erros** interativo (Chart.js), com aproveitamento percentual e desempenho por tópico de CSS.
3. **Sala de Espera com Liberação Coletiva**: a área de explicações e o gabarito comentado permanecem **bloqueados até que todos os alunos finalizem a avaliação** (ou liberação pelo professor).
4. **Área de Explicações Detalhadas (MSEP)**: apresenta o feedback diagnóstico para a alternativa marcada pelo aluno (hipóteses de erro) e a fundamentação técnica da resposta correta com matriz comparativa das 5 alternativas.
5. **Painel do Instrutor / Professor (PIN: `senai123`)**: monitoramento ao vivo das entregas, taxa de acerto por questão (diagnóstico pedagógico para intervenção docente), média da sala e exportação para CSV.

---

## 🚀 Como Executar

### Opção 1: Inicialização Rápida no Windows (Recomendada)
Dê um **duplo clique** no arquivo:
```text
iniciar_simulado.bat
```
O script iniciará o servidor Node.js e abrirá automaticamente o navegador no endereço `http://localhost:3000`.

---

### Opção 2: Pelo Terminal / Linha de Comando
Na pasta do projeto, execute:
```bash
npm start
```
O console exibirá os endereços de acesso:
- **Computador do Professor:** `http://localhost:3000`
- **Computadores dos Alunos (mesma rede/Wi-Fi):** `http://IP_DA_REDE:3000` (ex: `http://192.168.20.152:3000`)

---

### Opção 3: Modo Autônomo / Standalone (Sem Servidor)
Caso queira testar ou usar sem rede, basta abrir o arquivo:
```text
index.html
```
diretamente em qualquer navegador moderno. Todas as bibliotecas (Chart.js e Confetti) foram baixadas localmente e funcionam **100% offline**.

---

## 📋 Regra de Negócio: Liberação das Explicações ("Quando Todos Terminarem")

* Quando o estudante clica em **Finalizar e Entregar**, suas respostas são registradas e ele é direcionado para a **Sala de Espera**.
* Na Sala de Espera, o aluno visualiza o progresso coletivo da turma:
  * Quantos alunos já concluíram;
  * Barra de progresso da turma em tempo real.
* **O Desbloqueio Ocorre Quando:**
  1. **Automático:** Todos os alunos da sala finalizarem suas provas.
  2. **Manual pelo Professor:** O instrutor pode clicar a qualquer momento no botão `🔓 Liberar Gabarito e Explicações Agora` no **Painel do Instrutor** (PIN: `senai123`).
  3. **Modo Demonstração:** Na própria tela de espera existe o botão *"Liberar Explicações e Gráficos Agora (Modo Teste)"* para simulações ágeis.

---

## 📊 Gráficos e Relatórios Gerados

### Para o Aluno (Após Liberação):
1. **Gráfico de Rosca (Doughnut Chart):** Total de acertos (verde) vs total de erros (vermelho) com percentual de aproveitamento.
2. **Gráfico de Barras Horizontais por Eixo:** Desempenho distribuído por tópicos:
   - *Flexbox* (Itens 1 e 20)
   - *Seletores & Cascata* (Itens 2 e 8)
   - *Responsividade & Media Queries* (Item 3)
   - *Posicionamento & Z-Index* (Itens 4 e 14)
   - *Box Model & Overflow* (Itens 5 e 19)
   - *CSS Grid* (Item 6)
   - *Fontes, Variáveis & Unidades* (Itens 7, 9 e 16)
   - *Acessibilidade, Pseudo-classes & Validação* (Itens 10, 11 e 18)
   - *Transições & Tipografia* (Itens 12, 13, 15 e 17)
3. **Área de Explicação & Gabarito Comentado:**
   - Filtros: `[Todas as 20]`, `[❌ Apenas Erros]`, `[✅ Apenas Acertos]`
   - Exibição de:
     - Diagnóstico pedagógico do erro assinalado pelo aluno (ex: *"Hipótese: O estudante confunde o modelo Flexbox com o CSS Grid..."*);
     - Fundamentação técnica da alternativa correta alinhada à competência técnica da MSEP;
     - Acordeão expansível com a justificativa técnica detalhada de **todas as 5 alternativas (A, B, C, D, E)** de cada item.

### Para o Professor (Painel com PIN `senai123`):
1. **Taxa de Acerto por Questão (Item 1 a 20):** Identifica visualmente as questões com maior índice de erro (colunas em vermelho se < 50%, âmbar se 50-74%, verde se >= 75%) para orientar a intervenção pedagógica do docente.
2. **Distribuição de Notas da Turma:** Histograma de notas (faixas de 0-5, 6-10, 11-15, 16-20 acertos).
3. **Tabela de Alunos em Tempo Real:** Permite ao professor abrir o espelho de prova individual de cada aluno (`🔍 Ver Gabarito`).
4. **Simulação de Turma (1 clique):** Botão para gerar 12 alunos simulados e testar a visualização dos gráficos da turma instantaneamente.
5. **Exportação de Relatório:** Download em formato `.csv` compatível com Excel.

---

## 📁 Estrutura de Arquivos

```text
ATIVIDADE SAEP ROTA/
├── questions.js            # Banco completo dos 20 itens com justificativas MSEP
├── index.html              # Interface do usuário (Aluno, Espera, Resultados e Painel)
├── style.css               # Estilos modernos padrão SENAI com tema responsivo
├── app.js                  # Lógica do simulador, Chart.js, polling e desbloqueio
├── server.js               # Servidor Node.js/Express com API REST e persistência
├── chart.umd.min.js        # Biblioteca Chart.js (offline)
├── confetti.browser.min.js # Biblioteca Canvas Confetti (offline)
├── iniciar_simulado.bat    # Executável de inicialização rápida no Windows
├── package.json            # Metadados do projeto e dependências Node.js
└── data/                   # Pasta para persistência dos dados da turma
```
