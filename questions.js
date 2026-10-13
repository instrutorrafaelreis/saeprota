/**
 * BANCO DE QUESTÕES - SAEP / MSEP (Metodologia SENAI de Educação Profissional)
 * Tópico: Desenvolvimento Web & Folhas de Estilo (CSS)
 * Total: 20 Itens estruturados com Contexto, Comando, Alternativas e Justificativas pedagógicas.
 */

const QUESTIONS_DATA = [
  {
    id: 1,
    topic: "Flexbox",
    context: "Um desenvolvedor front-end está a construir o cabeçalho de um sistema web corporativo. Ele precisa de alinhar horizontalmente a logomarca do lado esquerdo e o menu de navegação do lado direito, garantindo que todo o espaço extra disponível fique distribuído entre os dois elementos.",
    command: "O fragmento de código CSS que aplica a técnica correta para esse alinhamento é",
    options: [
      { id: "a", text: "display: flex; justify-content: center;" },
      { id: "b", text: "display: flex; justify-content: space-around;" },
      { id: "c", text: "display: flex; justify-content: space-between;" },
      { id: "d", text: "display: grid; align-items: space-between;" },
      { id: "e", text: "float: left; margin: auto;" }
    ],
    correct: "c",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde o alinhamento centralizado com a distribuição de espaço entre elementos opostos."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante compreende o uso do flexbox, mas seleciona a propriedade que distribui espaço também ao redor (antes e depois) dos elementos, e não apenas entre eles."
      },
      c: {
        status: "Correta",
        explanation: "O estudante reconhece que space-between é a propriedade do flexbox que empurra o primeiro elemento para o início e o último para o final do contentor. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde o modelo Flexbox com o CSS Grid e aplica uma propriedade de alinhamento vertical (align-items) de forma incorreta."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante recorre a técnicas obsoletas de flutuação e margens automáticas, que não resolvem a distribuição de espaço num contentor de forma responsiva."
      }
    }
  },
  {
    id: 2,
    topic: "Seletores CSS",
    context: "Durante a codificação da interface de um sistema de vendas, um programador precisa de estilizar apenas os botões com a classe \"btn-primario\" que estão estritamente dentro de um contentor com o ID \"painel-acoes\", garantindo que outros botões idênticos no resto da página não sejam afetados.",
    command: "O seletor CSS que segue a recomendação técnica para essa estilização específica é",
    options: [
      { id: "a", text: "#painel-acoes .btn-primario" },
      { id: "b", text: "#painel-acoes, .btn-primario" },
      { id: "c", text: ".btn-primario #painel-acoes" },
      { id: "d", text: "div > .btn-primario" },
      { id: "e", text: "painel-acoes .btn-primario" }
    ],
    correct: "a",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Correta",
        explanation: "O estudante identifica corretamente a sintaxe do seletor descendente, onde o ID restringe o escopo da classe. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante adiciona uma vírgula, o que transforma a instrução em múltiplos seletores, aplicando o estilo ao painel e a TODOS os botões primários da página."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante inverte a ordem hierárquica do seletor, procurando um ID dentro de uma classe, o que não reflete a estrutura do HTML descrita."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante utiliza o seletor de filho direto genérico, que não garante a restrição exclusiva ao ID \"painel-acoes\"."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante esquece o símbolo cardinal (#) obrigatório para identificar um ID no CSS, transformando a instrução numa procura por uma tag HTML inexistente chamada painel-acoes."
      }
    }
  },
  {
    id: 3,
    topic: "Responsividade & Media Queries",
    context: "Uma equipa está a adaptar um sistema web para dispositivos móveis (Mobile First). A recomendação técnica exige que o layout em grelha de produtos mude de quatro colunas para apenas uma coluna quando a largura do ecrã for igual ou inferior a 768 pixels.",
    command: "A estrutura CSS (Media Query) que implementa corretamente esta regra de responsividade é",
    options: [
      { id: "a", text: "@media (max-width: 768px) { .grade { grid-template-columns: 1fr; } }" },
      { id: "b", text: "@media (min-width: 768px) { .grade { grid-template-columns: 1fr; } }" },
      { id: "c", text: "@media screen and (max-height: 768px) { .grade { grid-template-columns: 1fr; } }" },
      { id: "d", text: "@media { .grade { grid-template-columns: 768px; } }" },
      { id: "e", text: "@viewport { width: 768px; .grade { columns: 1; } }" }
    ],
    correct: "a",
    competency: "Utilizar técnicas de estilização, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Correta",
        explanation: "O estudante aplica corretamente o limite máximo de largura (max-width) para aplicar a regra de uma única coluna (1fr) em ecrãs até 768px. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde max-width com min-width, o que aplicaria a regra de uma coluna apenas em ecrãs maiores que 768px, quebrando o layout em telemóveis."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante utiliza a altura (max-height) do ecrã em vez da largura para tentar resolver um problema de grelha horizontal."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante não compreende a sintaxe das media queries e tenta atribuir o valor do breakpoint diretamente à propriedade de colunas da grelha."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde a regra obsoleta @viewport com media queries e usa uma propriedade de colunas de texto em vez do sistema de grelha."
      }
    }
  },
  {
    id: 4,
    topic: "Posicionamento CSS",
    context: "Num sistema web, um programador precisa de posicionar um ícone de alerta vermelho exatamente no canto superior direito de um cartão de notificação. Para que o ícone fique flutuante em relação aos limites do cartão, e não em relação à página inteira, o cartão pai precisa de ter um comportamento específico de posicionamento.",
    command: "A propriedade CSS que deve ser aplicada ao cartão de notificação para servir de referência ao ícone posicionado de forma absoluta (position: absolute;) é",
    options: [
      { id: "a", text: "position: absolute;" },
      { id: "b", text: "position: fixed;" },
      { id: "c", text: "position: relative;" },
      { id: "d", text: "position: static;" },
      { id: "e", text: "position: sticky;" }
    ],
    correct: "c",
    competency: "Utilizar técnicas de estilização, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante aplica a mesma propriedade do filho ao contentor pai, o que retiraria o próprio cartão do fluxo normal da página desnecessariamente."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde com elementos fixos ao scroll do ecrã (como menus de navegação), o que prenderia o cartão à janela do navegador."
      },
      c: {
        status: "Correta",
        explanation: "O estudante compreende que position: relative no contentor pai cria um novo contexto de posicionamento, permitindo que os filhos absolutos se guiem pelos limites desse cartão. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante seleciona o posicionamento estático (padrão), desconhecendo que este comportamento anula qualquer contexto de referência para elementos absolutos internos."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde o comportamento pegajoso (sticky) de rolagem com o contexto de empilhamento necessário para elementos absolutos."
      }
    }
  },
  {
    id: 5,
    topic: "Box Model",
    context: "Ao aplicar estilos num formulário web, um desenvolvedor nota que a largura dos campos de texto (input) ultrapassa o tamanho do contentor pai sempre que bordas e espaçamentos internos (paddings) são adicionados, criando uma barra de rolagem horizontal indesejada e quebrando o layout.",
    command: "A propriedade CSS recomendada para ajustar o modelo de caixa, garantindo que as bordas e os espaçamentos internos sejam incluídos no cálculo da largura total do elemento, é",
    options: [
      { id: "a", text: "box-sizing: border-box;" },
      { id: "b", text: "box-sizing: content-box;" },
      { id: "c", text: "display: block;" },
      { id: "d", text: "margin: 0 auto;" },
      { id: "e", text: "overflow: hidden;" }
    ],
    correct: "a",
    competency: "Utilizar técnicas de estilização, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Correta",
        explanation: "O estudante reconhece a propriedade essencial do CSS Box Model que altera o cálculo de largura para incluir bordas e padding dentro dos 100% definidos. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante seleciona o comportamento padrão do CSS (content-box), que é justamente o causador do problema descrito no contexto."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante tenta resolver um problema de largura e modelo de caixa apenas mudando o comportamento de exibição do elemento para bloco."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante tenta usar a técnica de centralização automática, que não impede a quebra do limite do contentor pai."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante opta por esconder visualmente o excesso que quebra o contentor (gambiarra), em vez de corrigir o cálculo estrutural da caixa do elemento."
      }
    }
  },
  {
    id: 6,
    topic: "CSS Grid",
    context: "Um desenvolvedor front-end está a estruturar a página principal de um painel administrativo (dashboard). O layout bidimensional exige um cabeçalho, um menu lateral, uma área de conteúdo central e um rodapé. A equipa de design recomendou o uso de CSS Grid para mapear visualmente estas seções no próprio código, atribuindo nomes específicos a cada área do layout.",
    command: "A propriedade CSS que permite definir a estrutura desse layout em grelha utilizando áreas nomeadas é",
    options: [
      { id: "a", text: "grid-auto-flow" },
      { id: "b", text: "grid-template-areas" },
      { id: "c", text: "grid-template-columns" },
      { id: "d", text: "display: flex" },
      { id: "e", text: "grid-area-map" }
    ],
    correct: "b",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante sabe que a propriedade pertence ao módulo Grid, mas confunde o mapeamento visual com o algoritmo que controla o fluxo automático de inserção de itens."
      },
      b: {
        status: "Correta",
        explanation: "O estudante reconhece a propriedade do CSS Grid que permite \"desenhar\" o layout diretamente no código através de strings de texto que representam as áreas. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante compreende a criação de grelhas, mas seleciona a propriedade que define apenas o dimensionamento das colunas, e não o mapeamento por áreas nomeadas."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante tenta aplicar o modelo Flexbox, que é otimizado para layouts unidimensionais (uma linha ou uma coluna por vez) e não suporta nativamente áreas nomeadas num grid 2D."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante desconhece a sintaxe oficial e deduz uma propriedade inexistente (grid-area-map) com base no contexto do enunciado."
      }
    }
  },
  {
    id: 7,
    topic: "Fontes & Importação CSS",
    context: "O manual de identidade visual de uma empresa determina o uso da fonte \"Roboto\" em todas as aplicações web. O programador precisa de importar a folha de estilos externa dessa fonte (hospedada no Google Fonts) diretamente dentro do seu ficheiro principal de CSS, antes de aplicar a fonte à tag body.",
    command: "A regra técnica recomendada e nativa do CSS para importar folhas de estilos externas no topo de um ficheiro CSS é",
    options: [
      { id: "a", text: "<link href=\"url_da_fonte\" rel=\"stylesheet\" />" },
      { id: "b", text: "@include font('url_da_fonte');" },
      { id: "c", text: "@import url('url_da_fonte');" },
      { id: "d", text: "font-family: url('url_da_fonte');" },
      { id: "e", text: "import { font } from 'url_da_fonte';" }
    ],
    correct: "c",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde a sintaxe de CSS com a sintaxe de HTML, utilizando a tag <link> que só funciona no <head> do documento HTML."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde CSS nativo com pré-processadores como SASS ou SCSS, que utilizam diretivas como @include."
      },
      c: {
        status: "Correta",
        explanation: "O estudante identifica perfeitamente a diretiva @import, que é o padrão nativo do CSS para incorporar folhas de estilos externas no início de um documento CSS. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante mistura o conceito de declaração de família de fontes (font-family) com a função url(), criando uma sintaxe inválida."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde o comportamento do CSS com as importações de módulos do JavaScript (ES6 Modules)."
      }
    }
  },
  {
    id: 8,
    topic: "Especificidade & Cascata",
    context: "Num sistema corporativo, um parágrafo que exibe uma mensagem de erro possui a classe .mensagem-erro, que define a cor do texto como vermelho. No entanto, o mesmo parágrafo também possui o atributo ID #alerta-sistema, que define a cor do texto como azul no ficheiro CSS. Não existem marcações de !important no código.",
    command: "Considerando as recomendações de especificidade do CSS (Cascata), a cor final apresentada no ecrã e a sua justificação técnica são",
    options: [
      { id: "a", text: "azul, porque o seletor de ID possui maior peso de especificidade do que o seletor de classe." },
      { id: "b", text: "vermelho, porque o seletor de classe possui maior peso de especificidade do que o seletor de ID." },
      { id: "c", text: "azul, porque os seletores de ID são sempre carregados e renderizados primeiro pelo navegador." },
      { id: "d", text: "vermelho, porque os estilos das mensagens de erro possuem prioridade semântica nativa no CSS." },
      { id: "e", text: "roxo, porque o navegador tenta mesclar automaticamente cores em caso de conflito de estilos." }
    ],
    correct: "a",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Correta",
        explanation: "O estudante domina a regra do cálculo de especificidade do CSS, em que um ID (peso 100) sempre se sobrepõe a uma classe (peso 10), independentemente da ordem no ficheiro. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante inverte a hierarquia de pesos, acreditando equivocadamente que classes são mais específicas do que identificadores únicos."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante acerta a cor final, mas erra a justificativa técnica, atribuindo o resultado a uma ordem cronológica de renderização em vez do peso matemático da especificidade."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante acredita que a semântica de uma classe de \"erro\" influencia o mecanismo de renderização do motor de CSS, o que é falso."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante desconhece completamente o algoritmo de cascata e supõe que o navegador executa uma mistura visual de propriedades conflituosas."
      }
    }
  },
  {
    id: 9,
    topic: "Variáveis CSS (Custom Properties)",
    context: "Uma aplicação web necessita de suportar um \"Modo Escuro\" (Dark Mode) e um \"Modo Claro\" (Light Mode). Para facilitar a manutenção e evitar a repetição de códigos de cores hexadecimais em centenas de linhas, o desenvolvedor decidiu armazenar a cor principal do sistema numa propriedade personalizada reutilizável, também conhecida como variável CSS.",
    command: "A sintaxe nativa correta para declarar uma variável CSS na raiz do documento e, de seguida, utilizá-la na cor de fundo de uma div é",
    options: [
      { id: "a", text: ":root { --cor-primaria: #333; } div { background-color: var(--cor-primaria); }" },
      { id: "b", text: "$cor-primaria: #333; div { background-color: $cor-primaria; }" },
      { id: "c", text: ":root { cor-primaria: #333; } div { background-color: get(cor-primaria); }" },
      { id: "d", text: "var cor-primaria = #333; div { background-color: cor-primaria; }" },
      { id: "e", text: "root { @cor-primaria: #333; } div { background-color: var(@cor-primaria); }" }
    ],
    correct: "a",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Correta",
        explanation: "O estudante reconhece a declaração de variáveis com -- no seletor :root e a sua aplicação correta através da função var(). Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde as variáveis nativas do CSS com a sintaxe de cifrão ($) do pré-processador SASS."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante esquece os traços duplos da declaração e inventa uma função get() que não existe no CSS padrão."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante tenta aplicar a sintaxe de declaração de variáveis do JavaScript diretamente dentro da folha de estilos."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante mistura o seletor root (sem os dois-pontos da pseudo-classe) com a sintaxe de arroba (@), típica do pré-processador LESS."
      }
    }
  },
  {
    id: 10,
    topic: "Acessibilidade & Pseudo-classes",
    context: "As diretrizes de acessibilidade de um portal exigem que os links de um menu de navegação alterem o seu estilo visual instantaneamente para dar feedback aos utilizadores que navegam no sistema através do teclado (usando a tecla \"Tab\"), sem dependerem do rato.",
    command: "A pseudo-classe CSS apropriada para aplicar estilos apenas quando o elemento recebe a navegação ou seleção por teclado é",
    options: [
      { id: "a", text: ":active" },
      { id: "b", text: ":focus" },
      { id: "c", text: ":hover" },
      { id: "d", text: ":target" },
      { id: "e", text: ":visited" }
    ],
    correct: "b",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde o estado de navegação com o estado ativo, que ocorre apenas no momento exato em que o link está a ser clicado ou pressionado."
      },
      b: {
        status: "Correta",
        explanation: "O estudante compreende que o :focus é o estado acionado quando um elemento interativo recebe o foco de navegação, seja pelo teclado (Tab) ou programaticamente. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante escolhe a pseudo-classe mais comum, ignorando que o :hover depende do cursor do rato e não atende aos utilizadores de teclado."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde o foco de navegação com o :target, que é usado para destacar o elemento que corresponde ao fragmento (hash) na URL da página."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde acessibilidade com histórico de navegação, escolhendo o estado aplicado a links que já foram acedidos anteriormente."
      }
    }
  },
  {
    id: 11,
    topic: "Pseudo-elementos",
    context: "Para evitar a alteração da estrutura de um documento HTML (DOM), a equipa de design recomendou que um ícone decorativo em formato de aspas fosse inserido visualmente antes de cada parágrafo com a classe .citacao, utilizando exclusivamente CSS.",
    command: "O pseudo-elemento e a propriedade obrigatória para injetar esse conteúdo visual através da folha de estilos são",
    options: [
      { id: "a", text: "::after e background-image" },
      { id: "b", text: "::before e content" },
      { id: "c", text: ":first-child e display" },
      { id: "d", text: "::first-letter e text-decoration" },
      { id: "e", text: ":prepend e insert" }
    ],
    correct: "b",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante escolhe o pseudo-elemento que insere conteúdo no final (::after) em vez do início, e ignora a propriedade essencial para o seu funcionamento."
      },
      b: {
        status: "Correta",
        explanation: "O estudante reconhece que ::before é o pseudo-elemento correto para inserir elementos antes do conteúdo principal e que a propriedade content é obrigatória para que ele seja renderizado no ecrã. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde um pseudo-elemento visual com a pseudo-classe estrutural :first-child, que seleciona o primeiro filho de um contentor HTML."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde a injeção de novos elementos visuais com a estilização tipográfica da primeira letra de um texto."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante tenta aplicar funções de manipulação de DOM do JavaScript (ou jQuery) diretamente na sintaxe do CSS."
      }
    }
  },
  {
    id: 12,
    topic: "Transições & Animações",
    context: "Para melhorar a experiência do utilizador (UX) num formulário, um desenvolvedor front-end deseja que a cor de fundo do botão \"Enviar\" mude de azul para verde quando o utilizador passar o cursor do rato por cima. No entanto, a recomendação técnica exige que essa mudança não seja abrupta, mas sim uma transição suave que dure 0,3 segundos.",
    command: "A propriedade CSS que deve ser aplicada ao estado inicial do botão para garantir essa suavidade é",
    options: [
      { id: "a", text: "animation-duration: 0.3s;" },
      { id: "b", text: "delay: 0.3s;" },
      { id: "c", text: "transform: background-color 0.3s;" },
      { id: "d", text: "transition: background-color 0.3s;" },
      { id: "e", text: "visibility: smooth 0.3s;" }
    ],
    correct: "d",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde transições simples de estado com a sintaxe de keyframes para animações complexas."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante seleciona uma propriedade que atrasaria o início do efeito, mas que não cria a suavidade na mudança da cor."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde a propriedade de transição (mudança de estado no tempo) com a de transformação (alteração espacial, como rotação ou escala)."
      },
      d: {
        status: "Correta",
        explanation: "O estudante identifica a propriedade transition como a ferramenta nativa do CSS para interpolar valores de propriedades (neste caso, a cor de fundo) num intervalo de tempo. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante inventa um valor para a propriedade visibility, que apenas controla se um elemento está visível ou oculto, não suportando interpolação de cores."
      }
    }
  },
  {
    id: 13,
    topic: "Tipografia & Formatação",
    context: "Num sistema de relatórios financeiros, a recomendação técnica para a exibição de cabeçalhos de tabelas (<th>) determina que todas as palavras devem ser exibidas em letras maiúsculas, garantindo a padronização visual, independentemente de como o texto foi introduzido na base de dados ou no HTML.",
    command: "A propriedade CSS responsável por forçar esta formatação tipográfica no navegador é",
    options: [
      { id: "a", text: "font-variant: uppercase;" },
      { id: "b", text: "font-weight: bold;" },
      { id: "c", text: "text-align: uppercase;" },
      { id: "d", text: "text-decoration: capitalize;" },
      { id: "e", text: "text-transform: uppercase;" }
    ],
    correct: "e",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde a transformação de texto com variantes de fonte (utilizada frequentemente para small-caps)."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde a capitalização das letras com o peso (negrito) da fonte."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante aplica o valor desejado a uma propriedade incorreta, que serve apenas para o alinhamento horizontal (esquerda, direita, centro)."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde a decoração de texto (como sublinhados) com a transformação tipográfica, e utiliza o valor que capitaliza apenas a primeira letra de cada palavra."
      },
      e: {
        status: "Correta",
        explanation: "O estudante reconhece que text-transform com o valor uppercase é a instrução correta no CSS para converter todo o texto do elemento em maiúsculas na renderização. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      }
    }
  },
  {
    id: 14,
    topic: "Camadas & Z-Index",
    context: "Um desenvolvedor criou uma janela modal de confirmação para um sistema web. Esta janela possui um position: fixed para ficar fixa no centro do ecrã. Contudo, ao rolar a página, alguns elementos do cabeçalho do site estão a sobrepor-se visualmente à janela modal.",
    command: "A propriedade CSS recomendada para ajustar a ordem de empilhamento e garantir que a modal fique sempre por cima dos restantes elementos é",
    options: [
      { id: "a", text: "display: block;" },
      { id: "b", text: "float: top;" },
      { id: "c", text: "opacity: 1;" },
      { id: "d", text: "top: 100%;" },
      { id: "e", text: "z-index: 9999;" }
    ],
    correct: "e",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante tenta resolver um problema de eixo Z (profundidade) com uma propriedade do modelo de caixas e fluxo de documento normal."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante inventa um valor (top) para a propriedade float, tentando forçar o elemento para o topo da pilha visual."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde a transparência do elemento com a sua posição no contexto de empilhamento do navegador."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante tenta utilizar coordenadas do eixo Y (top) para tentar alterar a profundidade (eixo Z)."
      },
      e: {
        status: "Correta",
        explanation: "O estudante compreende que o z-index (juntamente com um elemento posicionado) controla o contexto de empilhamento, determinando quais elementos ficam à frente ou atrás no eixo Z. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      }
    }
  },
  {
    id: 15,
    topic: "Estilização de Links & Texto",
    context: "Na codificação de um menu de navegação, a diretriz de interface do utilizador (UI) determina que os links (<a>) não devem apresentar a linha sublinhada padrão fornecida pelos navegadores, a fim de manter uma estética limpa, semelhante a botões.",
    command: "A propriedade CSS capaz de remover essa formatação nativa dos links é",
    options: [
      { id: "a", text: "border-bottom: none;" },
      { id: "b", text: "font-style: normal;" },
      { id: "c", text: "list-style-type: none;" },
      { id: "d", text: "text-decoration: none;" },
      { id: "e", text: "text-transform: none;" }
    ],
    correct: "d",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde o sublinhado tipográfico nativo dos links com uma borda inferior aplicada ao redor da caixa do elemento."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante tenta alterar o estilo da fonte (usado para itálico) para tentar remover decorações de linha."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde a remoção do estilo de links com a remoção dos marcadores (bolinhas) de itens de listas (<li>)."
      },
      d: {
        status: "Correta",
        explanation: "O estudante sabe que o sublinhado nativo dos links é controlado pela propriedade text-decoration e que o valor none anula esse comportamento. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas na aplicação de folhas de estilos, por meio do conhecimento em CSS."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde propriedades de texto, selecionando aquela que afeta maiúsculas/minúsculas em vez da linha sublinhada."
      }
    }
  },
  {
    id: 16,
    topic: "Unidades Relativas & Root EM",
    context: "Um desenvolvedor quer definir o tamanho da fonte de um subtítulo num sistema web de forma relativa. No entanto, para evitar problemas de herança em cascata, a recomendação técnica exige que esse tamanho seja calculado com base no tamanho da fonte do elemento raiz (<html>), e não do elemento pai direto.",
    command: "A unidade de medida CSS que deve ser utilizada para garantir esse comportamento é",
    options: [
      { id: "a", text: "%" },
      { id: "b", text: "em" },
      { id: "c", text: "px" },
      { id: "d", text: "rem" },
      { id: "e", text: "vh" }
    ],
    correct: "d",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde unidades relativas de layout de blocos (%) com unidades tipográficas relativas à raiz."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante sabe que é uma unidade relativa à fonte, mas escolhe aquela que se baseia no tamanho da fonte do elemento pai (em), o que causa o efeito cascata indesejado."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante seleciona a unidade de medida absoluta em pixels, ignorando o requisito de ser uma medida relativa."
      },
      d: {
        status: "Correta",
        explanation: "O estudante reconhece que a unidade rem (Root EM) é relativa exclusivamente ao tamanho da fonte do elemento raiz, evitando problemas de sobreposição de herança. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas, por meio do conhecimento em CSS."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde com unidades relativas à altura da janela de visualização do navegador (Viewport Height)."
      }
    }
  },
  {
    id: 17,
    topic: "Background & Dimensionamento",
    context: "A área de destaque (hero section) de um site corporativo possui uma imagem de fundo. A recomendação técnica exige que esta imagem seja redimensionada de modo a cobrir completamente toda a área do contentor, sem distorcer a sua proporção (aspect ratio), mesmo que isso signifique cortar partes da imagem.",
    command: "A propriedade e o valor CSS corretos para aplicar essa recomendação são",
    options: [
      { id: "a", text: "background-attachment: fixed;" },
      { id: "b", text: "background-repeat: no-repeat;" },
      { id: "c", text: "background-size: contain;" },
      { id: "d", text: "background-size: cover;" },
      { id: "e", text: "object-fit: cover;" }
    ],
    correct: "d",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante seleciona a propriedade que fixa o fundo durante o scroll (efeito parallax), o que não resolve o redimensionamento."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante opta pela propriedade que apenas impede a repetição da imagem, sem forçar o preenchimento do contentor."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde com o valor que garante que a imagem inteira caiba no contentor (contain), mas que pode deixar espaços vazios nas laterais."
      },
      d: {
        status: "Correta",
        explanation: "O estudante identifica que background-size: cover é a propriedade responsável por expandir a imagem de fundo até que ela cubra todo o elemento, mantendo a proporção. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, por meio do conhecimento em CSS."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante seleciona uma propriedade que faz o mesmo efeito, mas que é aplicada à tag HTML <img> nativa, e não a imagens de fundo (background)."
      }
    }
  },
  {
    id: 18,
    topic: "Validação de Formulários CSS",
    context: "Durante a codificação de um formulário de registo, a equipa de desenvolvimento quer dar feedback visual imediato. A recomendação técnica é que a borda do campo de entrada de dados (input) fique vermelha assim que o navegador detetar que a informação digitada não respeita o padrão exigido (como um e-mail mal formatado).",
    command: "A pseudo-classe CSS recomendada para aplicar esse estilo a campos com dados incorretos é",
    options: [
      { id: "a", text: ":error" },
      { id: "b", text: ":focus" },
      { id: "c", text: ":invalid" },
      { id: "d", text: ":required" },
      { id: "e", text: ":wrong" }
    ],
    correct: "c",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante inventa uma pseudo-classe com base na semântica da palavra \"erro\", que não existe no padrão CSS."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante seleciona o estado em que o utilizador está a clicar no campo, independentemente de os dados estarem corretos ou incorretos."
      },
      c: {
        status: "Correta",
        explanation: "O estudante conhece as pseudo-classes de validação de formulários do CSS e sabe que :invalid aplica estilos a campos cujo valor não passa na validação do HTML5. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, por meio do conhecimento em CSS."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde a validação do conteúdo com a obrigatoriedade de preenchimento do campo."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante, tal como na opção A, inventa uma palavra em inglês (errado) como pseudo-classe."
      }
    }
  },
  {
    id: 19,
    topic: "Overflow & Rolagem",
    context: "Uma janela modal contém um texto longo de Termos de Serviço. Para evitar que a modal ocupe toda a altura do ecrã e quebre o layout, o contentor do texto tem uma altura fixa de 300px. No entanto, como o texto é extenso, ele transborda visualmente para fora da caixa.",
    command: "A propriedade CSS que deve ser aplicada ao contentor para adicionar uma barra de rolagem (scroll) apenas quando o conteúdo exceder a altura definida é",
    options: [
      { id: "a", text: "display: scroll;" },
      { id: "b", text: "overflow: auto;" },
      { id: "c", text: "overflow: hidden;" },
      { id: "d", text: "scroll-behavior: smooth;" },
      { id: "e", text: "visibility: visible;" }
    ],
    correct: "b",
    competency: "Utilizar técnicas de estilização, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante tenta aplicar o valor \"scroll\" à propriedade errada de modelo de exibição."
      },
      b: {
        status: "Correta",
        explanation: "O estudante reconhece que overflow: auto instrui o navegador a colocar barras de rolagem de forma automática apenas se o conteúdo ultrapassar os limites do contentor. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização, por meio do conhecimento em CSS."
      },
      c: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante seleciona a propriedade que corta o conteúdo excedente, mas que não adiciona a barra de rolagem, impedindo o utilizador de ler o resto do texto."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde a criação de uma barra de rolagem com o comportamento suave de transição entre âncoras na página."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante tenta forçar a visibilidade do elemento, o que não resolve o problema do transbordo do texto."
      }
    }
  },
  {
    id: 20,
    topic: "Flexbox Wrapping",
    context: "Uma galeria de imagens utiliza display: flex no seu contentor para alinhar miniaturas numa linha horizontal. No entanto, à medida que mais miniaturas são carregadas, elas tentam espremer-se na mesma linha, ficando muito estreitas e desconfiguradas, pois o flexbox tenta forçar tudo numa só dimensão.",
    command: "A propriedade CSS que deve ser adicionada ao contentor flex para permitir que os itens quebrem para a linha seguinte quando não houver espaço suficiente é",
    options: [
      { id: "a", text: "align-content: space-between;" },
      { id: "b", text: "flex-direction: column;" },
      { id: "c", text: "flex-wrap: wrap;" },
      { id: "d", text: "justify-content: flex-start;" },
      { id: "e", text: "word-wrap: break-word;" }
    ],
    correct: "c",
    competency: "Utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas, por meio do conhecimento em CSS.",
    justifications: {
      a: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante seleciona uma propriedade que alinha as várias linhas existentes, mas que não é responsável por ordenar a quebra dessas mesmas linhas."
      },
      b: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante muda o eixo principal do flexbox para vertical, criando uma coluna empilhada, em vez de manter uma grelha horizontal com quebra de linha."
      },
      c: {
        status: "Correta",
        explanation: "O estudante identifica perfeitamente que flex-wrap: wrap é a instrução que permite que os itens flexíveis passem para a linha de baixo quando o contentor pai não tem mais largura disponível. Os estudantes que acertaram este item, provavelmente, são capazes de utilizar técnicas de estilização na codificação de sistemas web, para seguir recomendações técnicas, por meio do conhecimento em CSS."
      },
      d: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde com o alinhamento principal no eixo horizontal, o que apenas junta os itens no início da única linha existente."
      },
      e: {
        status: "Incorreta",
        explanation: "Hipótese: O estudante confunde a quebra de linhas do flexbox (layout) com a quebra de texto (palavras compridas) dentro de um parágrafo."
      }
    }
  }
];

// Suporte para Node.js (CommonJS) e Navegador
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QUESTIONS_DATA;
}
