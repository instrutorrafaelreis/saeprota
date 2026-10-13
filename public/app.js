/**
 * SIMULADO SAEP ROTA - APLICAÇÃO CLIENTE (JAVASCRIPT)
 * Integração em Tempo Real, Gráficos Interativos (Chart.js),
 * Avaliação e Área de Explicação Desbloqueada após Conclusão Coletiva.
 */

class SaepApp {
  constructor() {
    this.questions = typeof QUESTIONS_DATA !== 'undefined' ? QUESTIONS_DATA : [];
    this.currentQuestionIndex = 0;
    this.answers = {}; // { [qId]: 'a' | 'b' | 'c' | 'd' | 'e' }
    this.flagged = {}; // { [qId]: boolean }
    
    this.student = null; // { id, name, turma, completed, hits, misses, score, percentage, itemResults }
    this.session = {
      unlocked: false,
      totalRegistered: 0,
      totalCompleted: 0,
      expectedStudents: 0
    };
    
    this.isServerOnline = false;
    this.pollingTimer = null;
    this.quizTimerInterval = null;
    this.quizSecondsElapsed = 0;
    this.teacherPollingTimer = null;
    
    // Instâncias de Gráficos (Chart.js)
    this.chartHitsMisses = null;
    this.chartTopics = null;
    this.chartTeacherItemRates = null;
    this.chartTeacherDistribution = null;

    this.currentExplanationFilter = 'all'; // 'all' | 'wrongs' | 'hits'
  }

  // Inicialização do Aplicativo
  async init() {
    await this.checkServerConnection();
    this.loadSavedState();
    this.renderQuestionsNavGrid();
    this.updateStatusBadge();
  }

  // Verifica se o servidor Node.js local está rodando
  async checkServerConnection() {
    try {
      const res = await fetch('/api/info', { method: 'GET', headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        this.isServerOnline = true;
        this.session.unlocked = data.session.explanationsUnlocked;
        this.session.totalRegistered = data.session.totalRegistered;
        this.session.totalCompleted = data.session.totalCompleted;
        this.session.expectedStudents = data.session.expectedStudents;
        
        console.log('[App] Conectado ao servidor da sala:', data.localhostUrl);
        return true;
      }
    } catch (e) {
      this.isServerOnline = false;
      console.log('[App] Servidor remoto não detectado. Operando em modo Standalone / Local.');
    }
    return false;
  }

  // Atualiza crachá de status no cabeçalho
  updateStatusBadge() {
    const badge = document.getElementById('netStatusBadge');
    const dot = document.getElementById('netStatusDot');
    const text = document.getElementById('netStatusText');

    if (this.isServerOnline) {
      dot.className = 'status-indicator';
      dot.style.backgroundColor = '#22c55e';
      text.innerText = `Servidor Online (${this.session.totalCompleted}/${this.session.totalRegistered || '1'} entregas)`;
    } else {
      dot.className = 'status-indicator';
      dot.style.backgroundColor = '#00a0e9';
      text.innerText = 'Modo Local / Simulado';
    }
  }

  // Recupera estado salvo no LocalStorage para evitar perda em refresh
  loadSavedState() {
    try {
      const savedStudent = localStorage.getItem('saep_student');
      const savedAnswers = localStorage.getItem('saep_answers');
      const savedFlagged = localStorage.getItem('saep_flagged');

      if (savedStudent) {
        this.student = JSON.parse(savedStudent);
      }
      if (savedAnswers) {
        this.answers = JSON.parse(savedAnswers);
      }
      if (savedFlagged) {
        this.flagged = JSON.parse(savedFlagged);
      }

      // Se o aluno já existia e já finalizou, direcionar para a tela apropriada
      if (this.student && this.student.completed) {
        if (this.session.unlocked) {
          this.showResultsView();
        } else {
          this.showWaitingView();
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar estado salvo:', e);
    }
  }

  // Alternador de Views (Telas)
  switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // -------------------------------------------------------------------
  // 1. FLUXO DO ALUNO: LOGIN & INÍCIO
  // -------------------------------------------------------------------
  async handleStudentLogin(event) {
    event.preventDefault();
    const nameInput = document.getElementById('studentNameInput').value.trim();
    const turmaInput = document.getElementById('studentTurmaInput').value.trim() || 'Turma A';

    if (!nameInput) return;

    const studentData = {
      id: 'ALU-' + Math.random().toString(36).substring(2, 9),
      name: nameInput,
      turma: turmaInput,
      completed: false,
      answers: {},
      score: 0,
      hits: 0,
      misses: 0
    };

    if (this.isServerOnline) {
      try {
        const res = await fetch('/api/students/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: nameInput, turma: turmaInput })
        });
        if (res.ok) {
          const data = await res.json();
          this.student = data.student;
          this.session.unlocked = data.session.explanationsUnlocked;
        }
      } catch (e) {
        console.error('Falha ao registrar no servidor, usando modo local:', e);
        this.student = studentData;
      }
    } else {
      this.student = studentData;
    }

    localStorage.setItem('saep_student', JSON.stringify(this.student));
    this.startQuiz();
  }

  startQuiz() {
    document.getElementById('quizStudentName').innerText = this.student.name;
    document.getElementById('quizStudentTurma').innerText = this.student.turma;

    this.currentQuestionIndex = 0;
    this.startTimer();
    this.renderQuestion(0);
    this.updateProgressBar();
    this.switchView('view-quiz');
  }

  startTimer() {
    this.quizSecondsElapsed = 0;
    clearInterval(this.quizTimerInterval);
    const timerElem = document.getElementById('quizTimer');

    this.quizTimerInterval = setInterval(() => {
      this.quizSecondsElapsed++;
      const mins = Math.floor(this.quizSecondsElapsed / 60).toString().padStart(2, '0');
      const secs = (this.quizSecondsElapsed % 60).toString().padStart(2, '0');
      timerElem.innerText = `⏱️ Tempo: ${mins}:${secs}`;
    }, 1000);
  }

  // -------------------------------------------------------------------
  // 2. FLUXO DO EXAME: NAVEGAÇÃO E RESPOSTAS
  // -------------------------------------------------------------------
  renderQuestionsNavGrid() {
    const grid = document.getElementById('questionsNavGrid');
    grid.innerHTML = '';

    this.questions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-q-btn';
      btn.innerText = q.id;
      btn.id = `navBtn-${q.id}`;
      btn.onclick = () => this.goToQuestion(idx);
      grid.appendChild(btn);
    });
  }

  renderQuestion(index) {
    if (index < 0 || index >= this.questions.length) return;
    this.currentQuestionIndex = index;
    const q = this.questions[index];

    // Badge e tópico
    document.getElementById('qBadge').innerText = `ITEM ${q.id} DE ${this.questions.length}`;
    document.getElementById('qTopic').innerText = `Tópico: ${q.topic || 'CSS'}`;

    // Contexto com formatação de código
    const formattedContext = this.formatCodeInText(q.context);
    document.getElementById('qContext').innerHTML = `<strong>Contexto:</strong> ${formattedContext}`;

    // Comando
    const formattedCommand = this.formatCodeInText(q.command);
    document.getElementById('qCommand').innerHTML = `<strong>Comando:</strong> ${formattedCommand}`;

    // Lista de Alternativas (A, B, C, D, E)
    const optionsContainer = document.getElementById('qOptionsList');
    optionsContainer.innerHTML = '';

    const currentAnswer = this.answers[q.id];

    q.options.forEach(opt => {
      const isSelected = currentAnswer === opt.id;
      const optItem = document.createElement('div');
      optItem.className = `option-item ${isSelected ? 'selected' : ''}`;
      optItem.onclick = () => this.selectAnswer(q.id, opt.id);

      const formattedText = this.formatCodeInText(opt.text);

      optItem.innerHTML = `
        <div class="option-letter">${opt.id.toUpperCase()}</div>
        <div class="option-text">${formattedText}</div>
      `;

      optionsContainer.appendChild(optItem);
    });

    // Botões de navegação
    document.getElementById('btnPrevQ').disabled = index === 0;
    const btnNext = document.getElementById('btnNextQ');
    if (index === this.questions.length - 1) {
      btnNext.style.display = 'none';
    } else {
      btnNext.style.display = 'inline-flex';
    }

    // Botão de marcar para revisão
    const isFlagged = Boolean(this.flagged[q.id]);
    document.getElementById('lblFlagBtn').innerText = isFlagged ? 'Desmarcar Revisão' : 'Marcar para Revisar';

    this.updateNavButtonsHighlight();
    this.updateProgressBar();
  }

  selectAnswer(questionId, optionId) {
    this.answers[questionId] = optionId;
    localStorage.setItem('saep_answers', JSON.stringify(this.answers));
    this.renderQuestion(this.currentQuestionIndex);
  }

  toggleFlagCurrent() {
    const q = this.questions[this.currentQuestionIndex];
    this.flagged[q.id] = !this.flagged[q.id];
    localStorage.setItem('saep_flagged', JSON.stringify(this.flagged));
    this.renderQuestion(this.currentQuestionIndex);
  }

  goToQuestion(idx) {
    this.renderQuestion(idx);
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.renderQuestion(this.currentQuestionIndex - 1);
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.renderQuestion(this.currentQuestionIndex + 1);
    }
  }

  updateNavButtonsHighlight() {
    this.questions.forEach((q, idx) => {
      const btn = document.getElementById(`navBtn-${q.id}`);
      if (!btn) return;

      btn.className = 'nav-q-btn';
      if (this.answers[q.id]) {
        btn.classList.add('answered');
      }
      if (idx === this.currentQuestionIndex) {
        btn.classList.add('current');
      }
      if (this.flagged[q.id]) {
        btn.style.borderColor = 'var(--warning)';
      } else {
        btn.style.borderColor = '';
      }
    });
  }

  updateProgressBar() {
    const total = this.questions.length;
    const answeredCount = Object.keys(this.answers).length;
    const percent = Math.round((answeredCount / total) * 100);

    const bar = document.getElementById('quizProgressBar');
    if (bar) bar.style.width = `${percent}%`;

    const progressTxt = document.getElementById('quizProgressText');
    if (progressTxt) progressTxt.innerText = `Respondidas: ${answeredCount} de ${total} (${percent}%)`;

    const pendingTxt = document.getElementById('quizPendingText');
    if (pendingTxt) pendingTxt.innerText = `${total - answeredCount} pendentes`;
  }

  // Formatador de snippets e código no texto
  formatCodeInText(text) {
    if (!text) return '';
    // Substitui fragmentos entre crases `...` ou seletores e regras CSS por <code class="code-snippet">
    return text.replace(/`([^`]+)`/g, '<code class="code-snippet">$1</code>');
  }

  // -------------------------------------------------------------------
  // 3. FINALIZAÇÃO DA PROVA & MODAL
  // -------------------------------------------------------------------
  openSubmitConfirmModal() {
    const total = this.questions.length;
    const answeredCount = Object.keys(this.answers).length;
    const missing = total - answeredCount;

    const warnBox = document.getElementById('unansweredWarningBox');
    const msg = document.getElementById('confirmSubmitMsg');

    if (missing > 0) {
      warnBox.style.display = 'block';
      warnBox.innerHTML = `⚠️ <strong>Atenção:</strong> Você ainda não respondeu <strong>${missing}</strong> de 20 questões. As questões não respondidas serão computadas como incorretas.`;
      msg.innerText = `Deseja realmente entregar a avaliação com questões pendentes?`;
    } else {
      warnBox.style.display = 'none';
      msg.innerText = `Você respondeu todas as 20 questões da avaliação! Deseja confirmar a entrega definitiva das suas respostas?`;
    }

    document.getElementById('confirmSubmitModal').classList.add('open');
  }

  closeSubmitConfirmModal() {
    document.getElementById('confirmSubmitModal').classList.remove('open');
  }

  async confirmAndSubmitQuiz() {
    this.closeSubmitConfirmModal();
    clearInterval(this.quizTimerInterval);

    // Calcular acertos e erros
    let hits = 0;
    let misses = 0;
    const itemResults = {};

    this.questions.forEach(q => {
      const chosen = this.answers[q.id];
      const isRight = chosen === q.correct;
      if (isRight) hits++; else misses++;

      itemResults[q.id] = {
        selected: chosen || null,
        correct: q.correct,
        isCorrect: isRight
      };
    });

    this.student.completed = true;
    this.student.hits = hits;
    this.student.misses = misses;
    this.student.score = hits;
    this.student.percentage = Math.round((hits / this.questions.length) * 100);
    this.student.itemResults = itemResults;
    this.student.timeElapsedSeconds = this.quizSecondsElapsed;

    localStorage.setItem('saep_student', JSON.stringify(this.student));

    // Se estiver conectado ao servidor, envia as respostas
    if (this.isServerOnline) {
      try {
        const res = await fetch('/api/students/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: this.student.id,
            answers: this.answers
          })
        });
        if (res.ok) {
          const data = await res.json();
          this.session.unlocked = data.session.explanationsUnlocked;
          this.session.totalCompleted = data.session.totalCompleted;
          this.session.totalRegistered = data.session.totalRegistered;
        }
      } catch (e) {
        console.error('Erro ao enviar respostas para o servidor:', e);
      }
    }

    // Se as explicações JÁ estiverem desbloqueadas (por exemplo, prova feita depois da turma)
    if (this.session.unlocked) {
      this.showResultsView();
    } else {
      this.showWaitingView();
    }
  }

  // -------------------------------------------------------------------
  // 4. SALA DE ESPERA (AGUARDANDO TODOS OS ALUNOS)
  // -------------------------------------------------------------------
  showWaitingView() {
    document.getElementById('waitStudentName').innerText = this.student.name;
    this.switchView('view-waiting');
    this.updateWaitingCounters();
    this.startWaitingPolling();
  }

  updateWaitingCounters() {
    const total = this.session.expectedStudents > 0 
      ? this.session.expectedStudents 
      : Math.max(this.session.totalRegistered, 1);
    const completed = this.session.totalCompleted;
    const percent = Math.min(100, Math.round((completed / total) * 100));

    const countDone = document.getElementById('waitCountDone');
    const countTotal = document.getElementById('waitCountTotal');
    const countPercent = document.getElementById('waitCountPercent');
    const classProgress = document.getElementById('waitClassProgressBar');

    if (countDone) countDone.innerText = completed;
    if (countTotal) countTotal.innerText = total;
    if (countPercent) countPercent.innerText = `${percent}%`;
    if (classProgress) classProgress.style.width = `${percent}%`;
  }

  startWaitingPolling() {
    clearInterval(this.pollingTimer);

    // Consulta status do servidor a cada 2.5 segundos
    this.pollingTimer = setInterval(async () => {
      if (!this.isServerOnline) return;

      try {
        const res = await fetch(`/api/students/poll-status?studentId=${this.student.id}`);
        if (res.ok) {
          const data = await res.json();
          this.session.unlocked = data.explanationsUnlocked;
          this.session.totalCompleted = data.totalCompleted;
          this.session.totalRegistered = data.totalRegistered;
          this.session.expectedStudents = data.expectedStudents;
          
          this.updateWaitingCounters();
          this.updateStatusBadge();

          // CONDIÇÃO ATINGIDA: Explicações liberadas!
          if (data.explanationsUnlocked) {
            clearInterval(this.pollingTimer);
            this.handleUnlockCelebration();
          }
        }
      } catch (e) {
        console.warn('Polling do status falhou temporariamente:', e);
      }
    }, 2500);
  }

  // Botão de simulação/teste: permite ao professor ou usuário testar na hora
  async simulateEveryoneFinished() {
    if (this.isServerOnline) {
      try {
        await fetch('/api/teacher/unlock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: 'senai123', unlock: true })
        });
      } catch (e) {
        console.warn('Erro ao chamar desbloqueio via servidor:', e);
      }
    }
    this.session.unlocked = true;
    clearInterval(this.pollingTimer);
    this.handleUnlockCelebration();
  }

  // Valida a chave de liberação informada pelo professor em sala
  submitStudentUnlockCode() {
    const input = document.getElementById('inputStudentUnlockCode');
    if (!input) return;

    const code = input.value.trim().toUpperCase();
    const validCodes = ['SAEP2026', 'SENAI123', 'SAEP', 'ROTA2026', 'SENAI'];

    if (validCodes.includes(code)) {
      this.session.unlocked = true;
      clearInterval(this.pollingTimer);
      this.handleUnlockCelebration();
    } else {
      alert('Chave incorreta. Aguarde o professor anunciar a chave de liberação quando todos concluírem a avaliação.');
    }
  }

  // Animação de celebração com confetes e desbloqueio
  handleUnlockCelebration() {
    try {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {}

    // Transiciona para a tela de resultados
    setTimeout(() => {
      this.showResultsView();
    }, 600);
  }

  // -------------------------------------------------------------------
  // 5. TELA DE RESULTADOS, GRÁFICOS & EXPLICAÇÃO DESBLOQUEADA
  // -------------------------------------------------------------------
  showResultsView() {
    clearInterval(this.pollingTimer);

    const s = this.student;
    if (!s) return;

    // Preenche cards de pontuação
    document.getElementById('resStudentTitle').innerText = `${s.name} (${s.turma})`;
    document.getElementById('resScoreNum').innerText = `${s.score}/20`;
    document.getElementById('resTotalHits').innerText = s.hits;
    document.getElementById('resTotalMisses').innerText = s.misses;
    document.getElementById('resPercentage').innerText = `${s.percentage}%`;

    // Conceito MSEP
    const msepBadge = document.getElementById('resMSEPLevel');
    if (s.percentage >= 85) {
      msepBadge.innerText = 'Avançado (Excelente)';
      msepBadge.style.color = 'var(--success)';
    } else if (s.percentage >= 70) {
      msepBadge.innerText = 'Adequado (Bom Domínio)';
      msepBadge.style.color = 'var(--secondary)';
    } else if (s.percentage >= 50) {
      msepBadge.innerText = 'Básico (Necessita Reforço)';
      msepBadge.style.color = 'var(--warning)';
    } else {
      msepBadge.innerText = 'Abaixo do Básico';
      msepBadge.style.color = 'var(--danger)';
    }

    this.switchView('view-results');

    // Renderiza Gráficos (Chart.js)
    this.renderStudentCharts();

    // Renderiza Lista com as Justificativas Pedagógicas dos 20 Itens
    this.renderExplanationsList();
  }

  renderStudentCharts() {
    const s = this.student;
    if (!s || typeof Chart === 'undefined') return;

    // 1. Gráfico de Rosca: Acertos vs Erros
    const ctxHits = document.getElementById('chartHitsMisses');
    if (ctxHits) {
      if (this.chartHitsMisses) this.chartHitsMisses.destroy();

      this.chartHitsMisses = new Chart(ctxHits, {
        type: 'doughnut',
        data: {
          labels: ['Acertos (Questões Corretas)', 'Erros (Questões Incorretas)'],
          datasets: [{
            data: [s.hits, s.misses],
            backgroundColor: ['#10b981', '#ef4444'],
            borderColor: ['#ffffff', '#ffffff'],
            borderWidth: 2,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { font: { family: 'Inter', size: 12 } }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const val = ctx.raw;
                  const pct = Math.round((val / this.questions.length) * 100);
                  return ` ${ctx.label}: ${val} itens (${pct}%)`;
                }
              }
            }
          },
          cutout: '65%'
        }
      });
    }

    // 2. Gráfico por Tópico de CSS
    const topicStats = {};
    this.questions.forEach(q => {
      const topic = q.topic || 'Outros';
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, hits: 0 };
      }
      topicStats[topic].total++;
      if (s.itemResults && s.itemResults[q.id] && s.itemResults[q.id].isCorrect) {
        topicStats[topic].hits++;
      }
    });

    const topicLabels = Object.keys(topicStats);
    const topicRates = topicLabels.map(t => {
      const st = topicStats[t];
      return Math.round((st.hits / st.total) * 100);
    });

    const ctxTopics = document.getElementById('chartTopics');
    if (ctxTopics) {
      if (this.chartTopics) this.chartTopics.destroy();

      this.chartTopics = new Chart(ctxTopics, {
        type: 'bar',
        data: {
          labels: topicLabels,
          datasets: [{
            label: 'Taxa de Acerto por Eixo (%)',
            data: topicRates,
            backgroundColor: topicRates.map(r => r >= 70 ? 'rgba(16, 185, 129, 0.8)' : (r >= 50 ? 'rgba(245, 158, 11, 0.8)' : 'rgba(239, 68, 68, 0.8)')),
            borderColor: topicRates.map(r => r >= 70 ? '#10b981' : (r >= 50 ? '#f59e0b' : '#ef4444')),
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y', // Barra horizontal para legibilidade
          scales: {
            x: {
              min: 0,
              max: 100,
              ticks: { callback: v => `${v}%` }
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  }

  // Filtro da Área de Explicações
  filterExplanations(filterType) {
    this.currentExplanationFilter = filterType;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));

    if (filterType === 'all') document.getElementById('filterAll').classList.add('active');
    if (filterType === 'wrongs') document.getElementById('filterWrongs').classList.add('active');
    if (filterType === 'hits') document.getElementById('filterHits').classList.add('active');

    this.renderExplanationsList();
  }

  // Renderiza os 20 Itens com todas as Justificativas MSEP
  renderExplanationsList() {
    const container = document.getElementById('explanationsContainer');
    if (!container) return;
    container.innerHTML = '';

    const s = this.student;
    if (!s) return;

    let itemsToShow = this.questions;

    if (this.currentExplanationFilter === 'wrongs') {
      itemsToShow = this.questions.filter(q => s.itemResults && s.itemResults[q.id] && !s.itemResults[q.id].isCorrect);
    } else if (this.currentExplanationFilter === 'hits') {
      itemsToShow = this.questions.filter(q => s.itemResults && s.itemResults[q.id] && s.itemResults[q.id].isCorrect);
    }

    if (itemsToShow.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
          Nenhuma questão para exibir neste filtro.
        </div>
      `;
      return;
    }

    itemsToShow.forEach(q => {
      const itemRes = s.itemResults ? s.itemResults[q.id] : null;
      const isCorrect = itemRes ? itemRes.isCorrect : false;
      const selectedOpt = itemRes ? itemRes.selected : null;
      const selectedLetter = selectedOpt ? selectedOpt.toUpperCase() : 'Não respondida';
      const correctLetter = q.correct.toUpperCase();

      // Pega a justificativa específica da escolha do aluno
      const chosenJustification = (selectedOpt && q.justifications[selectedOpt]) 
        ? q.justifications[selectedOpt] 
        : null;

      // Pega a justificativa da alternativa correta
      const correctJustification = q.justifications[q.correct];

      const card = document.createElement('div');
      card.className = `explained-item-card ${isCorrect ? 'is-correct' : 'is-wrong'}`;

      let studentFeedbackHtml = '';
      if (!isCorrect) {
        studentFeedbackHtml = `
          <div class="justification-callout student-feedback">
            <div class="callout-title">
              <span>🔍</span> Diagnóstico Pedagógico do seu Erro (Opção ${selectedLetter}):
            </div>
            <p>${chosenJustification ? chosenJustification.explanation : 'Esta questão não foi assinalada durante a prova.'}</p>
          </div>
        `;
      }

      // Todas as 5 alternativas detalhadas para o accordion
      let allOptsRows = '';
      ['a', 'b', 'c', 'd', 'e'].forEach(optKey => {
        const just = q.justifications[optKey];
        const isRightOpt = optKey === q.correct;
        const optObj = q.options.find(o => o.id === optKey);
        const optText = optObj ? this.formatCodeInText(optObj.text) : '';

        allOptsRows += `
          <div class="option-analysis-row ${isRightOpt ? 'is-right-opt' : ''}">
            <strong>${optKey.toUpperCase()}) ${optText}</strong> — 
            <span style="font-weight: 700; color: ${isRightOpt ? 'var(--success)' : 'var(--danger)'};">
              [${just ? just.status : ''}]
            </span>
            <div style="margin-top: 0.25rem; font-size: 0.88rem; color: #334155;">
              ${just ? just.explanation : ''}
            </div>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="item-status-bar">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <strong style="font-size: 1.1rem; color: var(--primary);">ITEM ${q.id}</strong>
            <span class="question-topic">${q.topic}</span>
          </div>

          <span class="item-tag ${isCorrect ? 'correct' : 'wrong'}">
            ${isCorrect ? '✓ VOCÊ ACERTOU' : '✕ VOCÊ ERROU'}
          </span>
        </div>

        <div style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 0.75rem; color: #334155;">
          ${this.formatCodeInText(q.context)}
        </div>

        <div style="font-size: 0.95rem; font-weight: 700; color: var(--primary); margin-bottom: 1rem;">
          ${this.formatCodeInText(q.command)}
        </div>

        <div class="answer-comparison-box">
          <div class="ans-comp-item">
            <strong>SUA RESPOSTA:</strong>
            <span style="font-weight: 700; color: ${isCorrect ? 'var(--success)' : 'var(--danger)'};">
              ${selectedLetter} ${isCorrect ? '(Correta)' : '(Incorreta)'}
            </span>
          </div>
          <div class="ans-comp-item">
            <strong>GABARITO OFICIAL:</strong>
            <span style="font-weight: 700; color: var(--success);">
              ${correctLetter}) ${this.formatCodeInText(q.options.find(o => o.id === q.correct).text)}
            </span>
          </div>
        </div>

        ${studentFeedbackHtml}

        <div class="justification-callout correct-rationale">
          <div class="callout-title">
            <span>✅</span> Fundamentação Técnica da Resposta Correta:
          </div>
          <p>${correctJustification ? correctJustification.explanation : ''}</p>
        </div>

        <button type="button" class="all-options-toggle" onclick="app.toggleAllOptionsAccordion(${q.id})">
          <span id="accordionArrow-${q.id}">▶</span>
          <span>Ver justificativa detalhada de todas as 5 alternativas</span>
        </button>

        <div class="all-options-panel" id="accordionPanel-${q.id}">
          <h4 style="font-size: 0.9rem; color: var(--primary); margin-bottom: 0.6rem;">
            Matriz de Análise das Alternativas (MSEP):
          </h4>
          ${allOptsRows}
        </div>
      `;

      container.appendChild(card);
    });
  }

  toggleAllOptionsAccordion(qId) {
    const panel = document.getElementById(`accordionPanel-${qId}`);
    const arrow = document.getElementById(`accordionArrow-${qId}`);
    if (!panel) return;

    if (panel.classList.contains('open')) {
      panel.classList.remove('open');
      if (arrow) arrow.innerText = '▶';
    } else {
      panel.classList.add('open');
      if (arrow) arrow.innerText = '▼';
    }
  }

  restartStudentQuiz() {
    if (confirm('Deseja reiniciar a avaliação para uma nova tentativa?')) {
      this.answers = {};
      this.flagged = {};
      this.student.completed = false;
      this.student.answers = {};
      this.student.score = 0;
      this.student.hits = 0;
      this.student.misses = 0;
      localStorage.removeItem('saep_answers');
      localStorage.removeItem('saep_flagged');
      localStorage.setItem('saep_student', JSON.stringify(this.student));
      this.startQuiz();
    }
  }

  // -------------------------------------------------------------------
  // 6. PAINEL DO INSTRUTOR / PROFESSOR
  // -------------------------------------------------------------------
  toggleRoleModal() {
    document.getElementById('teacherPinModal').classList.add('open');
  }

  closeTeacherPinModal() {
    document.getElementById('teacherPinModal').classList.remove('open');
  }

  verifyTeacherPin() {
    const pin = document.getElementById('teacherPinInput').value;
    if (pin === 'senai123') {
      this.closeTeacherPinModal();
      this.openTeacherDashboard();
    } else {
      alert('PIN incorreto. Digite o PIN de instrutor (Padrão: senai123)');
    }
  }

  openTeacherDashboard() {
    this.switchView('view-teacher');
    this.fetchTeacherDashboard();

    clearInterval(this.teacherPollingTimer);
    this.teacherPollingTimer = setInterval(() => {
      this.fetchTeacherDashboard();
    }, 3000);
  }

  async fetchTeacherDashboard() {
    if (!this.isServerOnline) {
      // Modo local/simulado
      this.renderTeacherLocalData();
      return;
    }

    try {
      const res = await fetch('/api/teacher/dashboard?pin=senai123');
      if (res.ok) {
        const data = await res.json();
        this.renderTeacherDashboardData(data);
      }
    } catch (e) {
      console.warn('Erro ao atualizar painel do professor:', e);
    }
  }

  renderTeacherDashboardData(data) {
    const sess = data.session;
    const metrics = data.metrics;
    const students = data.students || [];

    // Status da Liberação
    const unlockBtn = document.getElementById('btnTeacherMasterUnlock');
    const statusLbl = document.getElementById('teacherUnlockStatusLabel');

    if (sess.explanationsUnlocked) {
      unlockBtn.className = 'btn-unlock-master is-unlocked';
      unlockBtn.innerHTML = '🔒 Bloquear Explicações Novamente';
      statusLbl.innerHTML = 'Status atual: <strong style="color: var(--success);">LIBERADO PARA TODOS OS ALUNOS</strong>';
    } else {
      unlockBtn.className = 'btn-unlock-master';
      unlockBtn.innerHTML = '🔓 Liberar Gabarito e Explicações Agora';
      statusLbl.innerHTML = 'Status atual: <strong style="color: var(--warning);">Bloqueado</strong> (Aguardando término coletivo)';
    }

    // Indicadores numéricos
    document.getElementById('tStatRegistered').innerText = sess.totalRegistered;
    document.getElementById('tStatCompleted').innerText = sess.totalCompleted;
    document.getElementById('tStatAverage').innerText = metrics.averageScore;
    document.getElementById('tStatRate').innerText = `${metrics.averagePercentage}%`;

    // Gráfico de Taxa de Acerto por Item (1 a 20)
    this.renderTeacherItemRatesChart(metrics.questionStats);

    // Gráfico de Distribuição de Notas
    this.renderTeacherDistributionChart(metrics.scoreDistribution);

    // Tabela de Alunos
    this.renderTeacherStudentsTable(students);
  }

  renderTeacherItemRatesChart(questionStats) {
    if (!questionStats || typeof Chart === 'undefined') return;

    const ctx = document.getElementById('chartTeacherItemRates');
    if (!ctx) return;

    const labels = questionStats.map(q => `Item ${q.id}`);
    const rates = questionStats.map(q => q.hitRate);
    const colors = rates.map(r => r >= 75 ? '#10b981' : (r >= 50 ? '#f59e0b' : '#ef4444'));

    if (this.chartTeacherItemRates) this.chartTeacherItemRates.destroy();

    this.chartTeacherItemRates = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '% de Acertos na Turma',
          data: rates,
          backgroundColor: colors,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: { callback: v => `${v}%` }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterLabel: (ctx) => {
                const qStat = questionStats[ctx.dataIndex];
                return `Tópico: ${qStat.topic}\nAcertos: ${qStat.hits} | Erros: ${qStat.misses}`;
              }
            }
          }
        }
      }
    });
  }

  renderTeacherDistributionChart(distribution) {
    if (!distribution || typeof Chart === 'undefined') return;

    const ctx = document.getElementById('chartTeacherDistribution');
    if (!ctx) return;

    const labels = Object.keys(distribution).map(k => `${k} acertos`);
    const counts = Object.values(distribution);

    if (this.chartTeacherDistribution) this.chartTeacherDistribution.destroy();

    this.chartTeacherDistribution = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Qtd de Estudantes',
          data: counts,
          backgroundColor: '#005da4',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  renderTeacherStudentsTable(students) {
    this.teacherStudentsData = students || [];
    const tbody = document.getElementById('teacherStudentsTableBody');
    if (!tbody) return;

    if (!students || students.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            Nenhum aluno registrado no momento.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = '';
    students.forEach((st, idx) => {
      const tr = document.createElement('tr');
      const statusBadge = st.completed 
        ? '<span style="color: var(--success); font-weight: 700;">✓ Concluído</span>' 
        : '<span style="color: var(--warning); font-weight: 600;">⏳ Em Andamento</span>';

      tr.innerHTML = `
        <td><strong>${st.name}</strong></td>
        <td>${st.turma || 'Geral'}</td>
        <td>${statusBadge}</td>
        <td style="color: var(--success); font-weight: 600;">${st.completed ? st.hits : '-'}</td>
        <td style="color: var(--danger); font-weight: 600;">${st.completed ? st.misses : '-'}</td>
        <td><strong>${st.completed ? st.score : '-'} / 20</strong></td>
        <td>${st.completed ? st.percentage + '%' : '-'}</td>
        <td>
          <button class="btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="app.openStudentDetailModal(${idx})">
            🔍 Ver Gabarito
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  openStudentDetailModal(studentIndex) {
    const st = this.teacherStudentsData ? this.teacherStudentsData[studentIndex] : null;
    if (!st) return;

    document.getElementById('modalStudentName').innerText = st.name;
    document.getElementById('modalStudentTurma').innerText = `${st.turma || 'Geral'} • Entregue em: ${st.submittedAt ? new Date(st.submittedAt).toLocaleTimeString() : 'Pendente'}`;
    document.getElementById('modalStudentScore').innerText = `${st.score || 0}/20`;
    document.getElementById('modalStudentPct').innerText = `${st.percentage || 0}%`;

    const grid = document.getElementById('modalStudentAnswersGrid');
    grid.innerHTML = '';

    this.questions.forEach(q => {
      const ans = st.answers ? st.answers[q.id] : null;
      const isRight = ans === q.correct;

      const itemBox = document.createElement('div');
      itemBox.style.padding = '0.5rem';
      itemBox.style.borderRadius = '6px';
      itemBox.style.border = '1px solid ' + (isRight ? 'var(--success-border)' : 'var(--danger-border)');
      itemBox.style.background = isRight ? 'var(--success-bg)' : 'var(--danger-bg)';
      itemBox.style.fontSize = '0.82rem';

      itemBox.innerHTML = `
        <div style="font-weight: 700; color: ${isRight ? '#065f46' : '#991b1b'};">Item ${q.id} ${isRight ? '✓' : '✕'}</div>
        <div style="color: var(--text-muted); font-size: 0.75rem;">Marcou: <strong>${ans ? ans.toUpperCase() : '-'}</strong> (Certa: ${q.correct.toUpperCase()})</div>
      `;
      grid.appendChild(itemBox);
    });

    document.getElementById('studentDetailModal').classList.add('open');
  }

  closeStudentDetailModal() {
    document.getElementById('studentDetailModal').classList.remove('open');
  }

  renderTeacherLocalData() {
    // Caso esteja sem servidor Node, exibe dados locais
    const stList = this.student ? [this.student] : [];
    this.renderTeacherDashboardData({
      session: {
        totalRegistered: stList.length,
        totalCompleted: stList.filter(s => s.completed).length,
        explanationsUnlocked: this.session.unlocked
      },
      metrics: {
        averageScore: this.student ? this.student.score : 0,
        averagePercentage: this.student ? this.student.percentage : 0,
        questionStats: this.questions.map(q => ({
          id: q.id,
          topic: q.topic,
          hitRate: this.student && this.student.itemResults && this.student.itemResults[q.id] && this.student.itemResults[q.id].isCorrect ? 100 : 0,
          hits: this.student && this.student.itemResults && this.student.itemResults[q.id] && this.student.itemResults[q.id].isCorrect ? 1 : 0,
          misses: this.student && this.student.itemResults && (!this.student.itemResults[q.id] || !this.student.itemResults[q.id].isCorrect) ? 1 : 0
        })),
        scoreDistribution: {
          '0 a 5': this.student && this.student.score <= 5 ? 1 : 0,
          '6 a 10': this.student && this.student.score >= 6 && this.student.score <= 10 ? 1 : 0,
          '11 a 15': this.student && this.student.score >= 11 && this.student.score <= 15 ? 1 : 0,
          '16 a 20': this.student && this.student.score >= 16 ? 1 : 0
        }
      },
      students: stList
    });
  }

  async teacherToggleUnlock() {
    const newStatus = !this.session.unlocked;

    if (this.isServerOnline) {
      try {
        const res = await fetch('/api/teacher/unlock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: 'senai123', unlock: newStatus })
        });
        if (res.ok) {
          const data = await res.json();
          this.session.unlocked = data.explanationsUnlocked;
        }
      } catch (e) {
        console.error('Erro ao alterar status de liberação:', e);
      }
    } else {
      this.session.unlocked = newStatus;
    }

    this.fetchTeacherDashboard();
  }

  async teacherSimulateClass() {
    if (!this.isServerOnline) {
      alert('Inicie o servidor com "npm start" para executar a simulação coletiva de turma.');
      return;
    }

    try {
      const res = await fetch('/api/teacher/simulate-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: 'senai123', count: 12 })
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        this.fetchTeacherDashboard();
      }
    } catch (e) {
      alert('Erro ao simular alunos: ' + e.message);
    }
  }

  async teacherResetSession() {
    if (confirm('Atenção: Deseja realmente reiniciar a sessão e apagar todas as tentativas dos alunos?')) {
      if (this.isServerOnline) {
        try {
          await fetch('/api/teacher/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: 'senai123' })
          });
        } catch (e) {}
      }
      this.student = null;
      this.answers = {};
      this.flagged = {};
      localStorage.clear();
      this.session.unlocked = false;
      alert('Sessão reiniciada com sucesso!');
      this.fetchTeacherDashboard();
    }
  }

  exportStudentsCSV() {
    if (!this.student) {
      alert('Sem dados para exportar.');
      return;
    }

    let csv = 'Nome,Turma,Acertos,Erros,Nota,Aproveitamento,Status\n';
    csv += `"${this.student.name}","${this.student.turma}",${this.student.hits},${this.student.misses},${this.student.score},"${this.student.percentage}%","Concluído"\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_saep_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.app = new SaepApp();
  window.app.init();
});
