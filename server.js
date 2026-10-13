const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
const questions = require('./questions');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const isVercel = Boolean(process.env.VERCEL);
const DATA_DIR = isVercel ? '/tmp' : path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'session.json');

if (!isVercel && !fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn('Erro ao criar pasta data:', e.message);
  }
}

// Estado inicial da sala / atividade
let sessionState = {
  sessionId: 'SAEP-' + Date.now().toString(36).toUpperCase(),
  title: 'Simulado Avaliativo SAEP - Desenvolvimento Web & CSS',
  teacherPin: 'senai123',
  expectedStudents: 0, // 0 = flexível / dinâmico
  explanationsUnlocked: false,
  autoUnlockWhenAllFinish: true,
  students: []
};

// Carregar estado salvo caso exista
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    sessionState = { ...sessionState, ...JSON.parse(raw) };
    console.log(`[Servidor] Estado da sessão carregado com ${sessionState.students.length} estudantes.`);
  } catch (err) {
    console.error('[Servidor] Erro ao carregar sessão anterior:', err.message);
  }
}

function persistState() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(sessionState, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Servidor] Erro ao salvar sessão:', err.message);
  }
}

// Helper para obter IPs da rede local
function getLocalNetworkIPs() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push(net.address);
      }
    }
  }
  return addresses;
}

// Verifica se todos os alunos finalizaram
function checkAutoUnlockCondition() {
  if (!sessionState.autoUnlockWhenAllFinish) return;
  if (sessionState.students.length === 0) return;

  const total = sessionState.expectedStudents > 0 
    ? sessionState.expectedStudents 
    : sessionState.students.length;

  const finishedCount = sessionState.students.filter(s => s.completed).length;

  if (finishedCount >= total && total > 0) {
    sessionState.explanationsUnlocked = true;
    console.log(`[Servidor] CONDIÇÃO ATINGIDA! Todos os ${finishedCount} alunos finalizaram. Gabarito e explicações DESBLOQUEADOS automaticamente.`);
    persistState();
  }
}

// Rota principal para servir a aplicação HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para informações de rede e status da sessão
app.get('/api/info', (req, res) => {
  const ips = getLocalNetworkIPs();
  res.json({
    port: PORT,
    ips: ips,
    accessUrls: ips.map(ip => `http://${ip}:${PORT}`),
    localhostUrl: `http://localhost:${PORT}`,
    session: {
      title: sessionState.title,
      explanationsUnlocked: sessionState.explanationsUnlocked,
      autoUnlockWhenAllFinish: sessionState.autoUnlockWhenAllFinish,
      expectedStudents: sessionState.expectedStudents,
      totalRegistered: sessionState.students.length,
      totalCompleted: sessionState.students.filter(s => s.completed).length
    }
  });
});

// Endpoint com o banco completo de questões
app.get('/api/questions', (req, res) => {
  // Para alunos durante a prova, não enviamos gabarito nem justificativas caso queiram inspecionar
  const safeQuestions = questions.map(q => ({
    id: q.id,
    topic: q.topic,
    context: q.context,
    command: q.command,
    options: q.options
  }));
  res.json(safeQuestions);
});

// Endpoint para obter as questões completas (com explicações) caso desbloqueado
app.get('/api/questions/explanations', (req, res) => {
  const pin = req.query.pin;
  const isTeacher = pin === sessionState.teacherPin;

  if (sessionState.explanationsUnlocked || isTeacher) {
    return res.json({
      unlocked: true,
      questions: questions
    });
  }

  return res.status(403).json({
    unlocked: false,
    message: 'As explicações e o gabarito ainda estão bloqueados. Aguarde todos os alunos concluírem a avaliação.'
  });
});

// Registro de aluno
app.post('/api/students/register', (req, res) => {
  const { name, turma } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  const cleanName = name.trim();
  const cleanTurma = (turma || 'Geral').trim();

  // Verifica se o aluno já existe para reconexão
  let student = sessionState.students.find(s => s.name.toLowerCase() === cleanName.toLowerCase() && s.turma.toLowerCase() === cleanTurma.toLowerCase());

  if (!student) {
    student = {
      id: 'ALU-' + Math.random().toString(36).substring(2, 9),
      name: cleanName,
      turma: cleanTurma,
      registeredAt: new Date().toISOString(),
      completed: false,
      answers: {},
      score: 0,
      hits: 0,
      misses: 0,
      percentage: 0
    };
    sessionState.students.push(student);
    persistState();
  }

  res.json({
    success: true,
    student: {
      id: student.id,
      name: student.name,
      turma: student.turma,
      completed: student.completed,
      score: student.score,
      hits: student.hits,
      misses: student.misses
    },
    session: {
      explanationsUnlocked: sessionState.explanationsUnlocked,
      totalRegistered: sessionState.students.length,
      totalCompleted: sessionState.students.filter(s => s.completed).length,
      expectedStudents: sessionState.expectedStudents
    }
  });
});

// Submissão das respostas do aluno
app.post('/api/students/submit', (req, res) => {
  const { studentId, answers } = req.body;
  let student = sessionState.students.find(s => s.id === studentId);

  if (!student) {
    // Se a instância serverless reiniciou ou escalou, recupera o estudante com os dados da requisição
    student = {
      id: studentId || ('ALU-' + Math.random().toString(36).substring(2, 9)),
      name: req.body.studentName || 'Estudante',
      turma: req.body.studentTurma || 'Geral',
      registeredAt: new Date().toISOString(),
      completed: false,
      answers: {}
    };
    sessionState.students.push(student);
  }

  // Se já finalizou, apenas retorna
  if (student.completed) {
    return res.json({
      success: true,
      alreadySubmitted: true,
      student,
      explanationsUnlocked: sessionState.explanationsUnlocked
    });
  }

  // Avaliar as respostas
  student.answers = answers || {};
  let hits = 0;
  let misses = 0;
  const itemResults = {};

  questions.forEach(q => {
    const studentAnswer = student.answers[q.id];
    const isCorrect = studentAnswer === q.correct;
    if (isCorrect) {
      hits++;
    } else {
      misses++;
    }
    itemResults[q.id] = {
      selected: studentAnswer,
      correct: q.correct,
      isCorrect: isCorrect
    };
  });

  student.completed = true;
  student.submittedAt = new Date().toISOString();
  student.hits = hits;
  student.misses = misses;
  student.totalQuestions = questions.length;
  student.score = hits;
  student.percentage = Math.round((hits / questions.length) * 100);
  student.itemResults = itemResults;

  persistState();

  // Verificar se agora todos terminaram
  checkAutoUnlockCondition();

  res.json({
    success: true,
    student: {
      id: student.id,
      name: student.name,
      turma: student.turma,
      completed: true,
      hits: student.hits,
      misses: student.misses,
      score: student.score,
      percentage: student.percentage,
      itemResults: student.itemResults
    },
    session: {
      explanationsUnlocked: sessionState.explanationsUnlocked,
      totalRegistered: sessionState.students.length,
      totalCompleted: sessionState.students.filter(s => s.completed).length,
      expectedStudents: sessionState.expectedStudents
    }
  });
});

// Status em tempo real para polling do aluno
app.get('/api/students/poll-status', (req, res) => {
  const { studentId } = req.query;
  const student = sessionState.students.find(s => s.id === studentId);

  const totalRegistered = sessionState.students.length;
  const totalCompleted = sessionState.students.filter(s => s.completed).length;

  res.json({
    explanationsUnlocked: sessionState.explanationsUnlocked,
    totalRegistered,
    totalCompleted,
    expectedStudents: sessionState.expectedStudents,
    studentCompleted: student ? student.completed : false,
    studentScore: student ? { hits: student.hits, misses: student.misses, score: student.score, percentage: student.percentage } : null
  });
});

// Painel do Professor / Monitor (estatísticas completas)
app.get('/api/teacher/dashboard', (req, res) => {
  const pin = req.query.pin;
  if (pin !== sessionState.teacherPin) {
    return res.status(401).json({ error: 'PIN de acesso incorreto' });
  }

  // Calcular estatísticas da turma
  const totalRegistered = sessionState.students.length;
  const completedStudents = sessionState.students.filter(s => s.completed);
  const totalCompleted = completedStudents.length;

  let averageScore = 0;
  let averagePercentage = 0;

  if (totalCompleted > 0) {
    const sumScore = completedStudents.reduce((acc, s) => acc + s.score, 0);
    averageScore = Number((sumScore / totalCompleted).toFixed(1));
    averagePercentage = Math.round((averageScore / questions.length) * 100);
  }

  // Estatística por questão (taxa de acerto para cada um dos 20 itens)
  const questionStats = questions.map(q => {
    let qHits = 0;
    let qMisses = 0;
    const choiceDistribution = { a: 0, b: 0, c: 0, d: 0, e: 0, unan: 0 };

    completedStudents.forEach(s => {
      const ans = s.answers ? s.answers[q.id] : null;
      if (ans) {
        if (choiceDistribution[ans] !== undefined) {
          choiceDistribution[ans]++;
        }
        if (ans === q.correct) {
          qHits++;
        } else {
          qMisses++;
        }
      } else {
        choiceDistribution.unan++;
        qMisses++;
      }
    });

    const hitRate = totalCompleted > 0 ? Math.round((qHits / totalCompleted) * 100) : 0;

    return {
      id: q.id,
      topic: q.topic,
      correct: q.correct,
      command: q.command,
      hits: qHits,
      misses: qMisses,
      hitRate: hitRate,
      choiceDistribution
    };
  });

  // Distribuição de notas em faixas (0-4, 5-8, 9-12, 13-16, 17-20)
  const scoreDistribution = {
    '0 a 5': completedStudents.filter(s => s.score <= 5).length,
    '6 a 10': completedStudents.filter(s => s.score >= 6 && s.score <= 10).length,
    '11 a 15': completedStudents.filter(s => s.score >= 11 && s.score <= 15).length,
    '16 a 20': completedStudents.filter(s => s.score >= 16).length
  };

  res.json({
    session: {
      sessionId: sessionState.sessionId,
      title: sessionState.title,
      explanationsUnlocked: sessionState.explanationsUnlocked,
      autoUnlockWhenAllFinish: sessionState.autoUnlockWhenAllFinish,
      expectedStudents: sessionState.expectedStudents,
      totalRegistered,
      totalCompleted
    },
    metrics: {
      averageScore,
      averagePercentage,
      scoreDistribution,
      questionStats
    },
    students: sessionState.students.map(s => ({
      id: s.id,
      name: s.name,
      turma: s.turma,
      completed: s.completed,
      score: s.score,
      hits: s.hits,
      misses: s.misses,
      percentage: s.percentage,
      submittedAt: s.submittedAt,
      answers: s.answers
    }))
  });
});

// Professor altera status de liberação do gabarito
app.post('/api/teacher/unlock', (req, res) => {
  const { pin, unlock } = req.body;
  if (pin !== sessionState.teacherPin) {
    return res.status(401).json({ error: 'PIN incorreto' });
  }

  sessionState.explanationsUnlocked = unlock !== undefined ? Boolean(unlock) : true;
  persistState();

  console.log(`[Professor] Explicações alteradas para: ${sessionState.explanationsUnlocked ? 'LIBERADAS' : 'BLOQUEADAS'}`);

  res.json({
    success: true,
    explanationsUnlocked: sessionState.explanationsUnlocked
  });
});

// Configurações da turma pelo professor
app.post('/api/teacher/settings', (req, res) => {
  const { pin, expectedStudents, autoUnlockWhenAllFinish } = req.body;
  if (pin !== sessionState.teacherPin) {
    return res.status(401).json({ error: 'PIN incorreto' });
  }

  if (expectedStudents !== undefined) {
    sessionState.expectedStudents = Math.max(0, parseInt(expectedStudents) || 0);
  }
  if (autoUnlockWhenAllFinish !== undefined) {
    sessionState.autoUnlockWhenAllFinish = Boolean(autoUnlockWhenAllFinish);
  }

  persistState();
  checkAutoUnlockCondition();

  res.json({
    success: true,
    settings: {
      expectedStudents: sessionState.expectedStudents,
      autoUnlockWhenAllFinish: sessionState.autoUnlockWhenAllFinish,
      explanationsUnlocked: sessionState.explanationsUnlocked
    }
  });
});

// Professor reinicia a sala ou limpa resultados
app.post('/api/teacher/reset', (req, res) => {
  const { pin } = req.body;
  if (pin !== sessionState.teacherPin) {
    return res.status(401).json({ error: 'PIN incorreto' });
  }

  sessionState.sessionId = 'SAEP-' + Date.now().toString(36).toUpperCase();
  sessionState.explanationsUnlocked = false;
  sessionState.students = [];
  persistState();

  console.log('[Professor] Sessão reiniciada.');
  res.json({ success: true, message: 'Sessão reiniciada com sucesso' });
});

// Simulação de turma (útil para testes imediatos pelo professor com 1 clique)
app.post('/api/teacher/simulate-class', (req, res) => {
  const { pin, count = 12 } = req.body;
  if (pin !== sessionState.teacherPin) {
    return res.status(401).json({ error: 'PIN incorreto' });
  }

  const sampleNames = [
    'Ana Clara Silva', 'Bruno Carvalho', 'Camila Ferreira', 'Diego Santos',
    'Eduardo Rocha', 'Fernanda Lima', 'Gabriel Martins', 'Helena Costa',
    'Igor Mendes', 'Juliana Alves', 'Lucas Oliveira', 'Mariana Ribeiro'
  ];

  const letters = ['a', 'b', 'c', 'd', 'e'];
  const simCount = Math.min(count, sampleNames.length);

  for (let i = 0; i < simCount; i++) {
    const name = sampleNames[i];
    // Se o aluno já existe, pula
    if (sessionState.students.some(s => s.name === name)) continue;

    const answers = {};
    let hits = 0;
    let misses = 0;
    const itemResults = {};

    // Alunos com taxas variadas de acerto (simula desempenho real da turma)
    const proficiency = 0.5 + Math.random() * 0.45; // entre 50% e 95% de chance de acerto

    questions.forEach(q => {
      const shouldHit = Math.random() < proficiency;
      let chosen;
      if (shouldHit) {
        chosen = q.correct;
      } else {
        // escolhe uma incorreta
        const wrongs = letters.filter(l => l !== q.correct);
        chosen = wrongs[Math.floor(Math.random() * wrongs.length)];
      }

      answers[q.id] = chosen;
      const isCorrect = chosen === q.correct;
      if (isCorrect) hits++; else misses++;

      itemResults[q.id] = {
        selected: chosen,
        correct: q.correct,
        isCorrect
      };
    });

    sessionState.students.push({
      id: 'SIM-' + Math.random().toString(36).substring(2, 9),
      name,
      turma: 'Turma A - Téc. Informática',
      registeredAt: new Date(Date.now() - (simCount - i) * 60000).toISOString(),
      submittedAt: new Date(Date.now() - (simCount - i) * 30000).toISOString(),
      completed: true,
      answers,
      hits,
      misses,
      totalQuestions: questions.length,
      score: hits,
      percentage: Math.round((hits / questions.length) * 100),
      itemResults
    });
  }

  persistState();
  checkAutoUnlockCondition();

  res.json({
    success: true,
    message: `${simCount} alunos simulados adicionados à turma!`,
    totalRegistered: sessionState.students.length,
    totalCompleted: sessionState.students.filter(s => s.completed).length,
    explanationsUnlocked: sessionState.explanationsUnlocked
  });
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    const ips = getLocalNetworkIPs();
    console.log(`\n============================================================`);
    console.log(`🚀 SERVIDOR SAEP ROTA INICIADO COM SUCESSO NA PORTA ${PORT}`);
    console.log(`   Acesso local no computador do professor: http://localhost:${PORT}`);
    if (ips.length > 0) {
      console.log(`   Acesso dos alunos na mesma rede Wi-Fi / Cabo:`);
      ips.forEach(ip => console.log(`   👉 http://${ip}:${PORT}`));
    }
    console.log(`   PIN do Professor: senai123`);
    console.log(`============================================================\n`);
  });
}

module.exports = app;


