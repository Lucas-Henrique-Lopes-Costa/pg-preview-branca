// Gera a home (index.html) e as páginas de cada plano (planos/<slug>/index.html).
// Uso: node ferramentas/site/gerar.js
// Textos e valores dos planos ficam em PLANOS, logo abaixo. Edite aqui e rode de novo.
const fs = require('fs');
const path = require('path');
const RAIZ = path.resolve(__dirname, '../..');

const WA = 'https://wa.me/5511924771370?text=' + encodeURIComponent('Olá, tudo bem? Vim pelo site, queria mais informações.');
const waPlano = nome => 'https://wa.me/5511924771370?text=' + encodeURIComponent(`Olá! Vim pelo site e quero saber mais sobre o Plano ${nome}.`);

// ───────────── Ícones (traço, 24px) ─────────────
const I = {
  zap: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.05 4.91A9.82 9.82 0 0012.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.78 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02zM12.04 20.15h-.01a8.23 8.23 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 015.83 2.42 8.2 8.2 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14 0-.31-.01-.47-.01-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z"/></svg>',
};
const tr = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
Object.assign(I, {
  id: tr('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6.5 16c.6-1.4 1.5-2 2.5-2s1.9.6 2.5 2M14 10h4M14 13h3"/>'),
  doc: tr('<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>'),
  selo: tr('<circle cx="12" cy="9" r="5"/><path d="M9 13.5L8 21l4-2 4 2-1-7.5"/>'),
  equipe: tr('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.8-3.2 3.2-5 6-5s5.2 1.8 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5c2.4.2 4.2 1.9 5 4.5"/>'),
  carro: tr('<path d="M5 17h14v-4.5l-2-5H7l-2 5z"/><path d="M5 12.5h14"/><circle cx="8" cy="17" r="1.6"/><circle cx="16" cy="17" r="1.6"/>'),
  aviao: tr('<path d="M21 15.5l-8-4.5V5a1.5 1.5 0 00-3 0v6l-8 4.5V17l8-2.5V19l-2.5 1.5V22L12 21l4.5 1v-1.5L14 19v-4.5l7 2.5z"/>'),
  predio: tr('<rect x="4" y="3" width="10" height="18" rx="1"/><path d="M14 9h5a1 1 0 011 1v11M8 7h2M8 11h2M8 15h2M17 13h0M17 17h0"/>'),
  volante: tr('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 14.5V21M9.6 11.2L3.5 9.5M14.4 11.2l6.1-1.7"/>'),
  banco: tr('<path d="M3 10l9-6 9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 21h18"/>'),
  pessoas: tr('<circle cx="12" cy="8" r="3.5"/><path d="M5 21c1-4 3.8-6 7-6s6 2 7 6"/>'),
  livro: tr('<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19V5M9 7h6"/>'),
  revista: tr('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h3"/>'),
  fone: tr('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
  casa: tr('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10M10 20v-6h4v6"/>'),
  globo: tr('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>'),
  maleta: tr('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 5v2M3 13h18"/>'),
  saida: tr('<path d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4M9 8l-4 4 4 4M5 12h11"/>'),
  escudo: tr('<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>'),
  cadeado: tr('<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3M12 14.5v2.5"/>'),
  passaporte: tr('<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3.2"/><path d="M8.8 10h6.4M12 6.8c.9.9 1.3 2 1.3 3.2s-.4 2.3-1.3 3.2M9 17h6"/>'),
  vacina: tr('<path d="M18 3l3 3M16.5 4.5l3 3M19 6l-9.5 9.5M8 12l4 4M10.5 9.5l4 4M6.5 17.5L3 21M9.5 15.5l-3 3"/>'),
  calendario: tr('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
  mapa: tr('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>'),
  conversa: tr('<path d="M20 12a8 8 0 01-11.6 7.1L4 20l1-4.1A8 8 0 1120 12z"/>'),
  check: tr('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  seta: tr('<path d="M5 12h14M13 6l6 6-6 6"/>'),
});

const REDES = [
  ['Instagram', '@rafaolorenzatto', 'https://instagram.com/rafaolorenzatto'],
  ['Instagram', '@paraguaicapitalbr', 'https://www.instagram.com/paraguaicapitalbr/'],
  ['Instagram', '@paraguaiglobal', 'https://instagram.com/paraguaiglobal'],
  ['YouTube', 'Rafael Lorenzatto', 'https://www.youtube.com/@rafaolorenzatto'],
  ['Facebook', 'Rafael Lorenzatto', 'https://www.facebook.com/rafaolorenzatto'],
  ['TikTok', '@rafaellorenzatto', 'https://www.tiktok.com/@rafaellorenzatto'],
];
const redesHtml = (cls = 'redes') => `<div class="${cls}">${REDES.map(([r, h, u]) => `<a href="${u}" target="_blank" rel="noreferrer"><small>${r}</small>${h}</a>`).join('')}</div>`;
const NUMEROS = [
  ['25+', 'anos de experiência profissional'],
  ['~3 mi', 'de seguidores nas redes do Rafael'],
  ['+130 mil', 'clientes no mundo todo'],
  ['+1.500', 'documentações e cédulas entregues'],
  ['+12', 'profissionais na equipe'],
  ['100 m²', 'de escritório no Sky Park, Av. Aviadores del Chaco'],
];
const HISTORIA = [
  ['01 · Esporte', 15, ' anos', 'Selecionado para o basquete competitivo, passou por <b>três clubes</b>, dois mineiros e um carioca. Ali nasceram a disciplina e a liderança.'],
  ['02 · Nutrição', 25, '+ anos', 'Nutricionista com pós em <b>Nutrição Esportiva</b>, especialista em <b>formulações magistrais</b> e produtos manipulados.'],
  ['03 · Televisão', null, 'No Limite', 'Participou do reality de sobrevivência da <b>Rede Globo</b>, ganhando projeção nacional.'],
  ['04 · Digital', 3, ' milhões', 'De seguidores, construídos compartilhando conteúdo. Estruturou <b>oito operações digitais</b> com faturamentos de <b>múltiplos sete dígitos</b>.'],
  ['05 · Empresário', 130, ' mil+', 'Clientes atendidos. Proprietário do ecossistema <b>RL Performance Nutrition</b>, mentor de negócios e palestrante.'],
  ['06 · Internacional', 3, ' países', 'Fundador e CEO da <b>Paraguay Global Group</b>: Brasil, Paraguai e Estados Unidos, com sede no Sky Park, em Assunção.'],
];
const NUMEROS_ANIM = [
  ['', 25, '+', 'anos de experiência'],
  ['~', 3, ' mi', 'seguidores nas redes'],
  ['+', 130, ' mil', 'clientes atendidos'],
  ['+', 1500, '', 'documentações e cédulas entregues'],
  ['+', 12, '', 'profissionais na equipe'],
  ['', 100, ' m²', 'de escritório no Sky Park'],
];
const ICO_REDE = {
  Instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  YouTube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 00-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 001 7.2 31 31 0 00.6 12 31 31 0 001 16.8a3 3 0 002.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 002.1-2.1c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM9.8 15.1V8.9l5.8 3.1-5.8 3.1z"/></svg>',
  Facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8.5V6.8c0-.8.5-1 .9-1h2.4V2.1L14 2c-3.6 0-4.4 2.7-4.4 4.4v2.1H7.4v3.8h2.2V22H14v-9.7h3l.4-3.8H14z"/></svg>',
  TikTok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 2h-3.4v13.4a2.9 2.9 0 11-2.9-2.9c.3 0 .6 0 .9.1V9.1a6.3 6.3 0 105.4 6.3V8.6a8 8 0 004.6 1.5V6.7a4.6 4.6 0 01-4.6-4.7z"/></svg>',
};
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ───────────── Dados dos planos ─────────────
const DOCUMENTOS = [
  ['doc', 'Certidão de nascimento ou casamento', 'Documento oficial com apostilamento de Haia.'],
  ['escudo', 'Antecedentes criminais', 'Emitido no País de origem e apostilado.'],
  ['id', 'RG ou CNH com CPF', 'Documento oficial com foto e CPF válido.'],
  ['passaporte', 'Passaporte', 'Válido por no mínimo 6 meses.'],
  ['vacina', 'Vacina contra febre amarela', 'Certificado internacional de vacinação válido.'],
];

const ITENS = {
  residencia: ['id', 'Residência temporária e cédula paraguaia', 'Montamos e protocolamos o seu pedido de residência dentro da Lei de Migração vigente do Paraguai e conduzimos a emissão da cédula de identidade paraguaia, o documento que você usa no dia a dia no País.'],
  residenciaComp: ['id', 'Residência temporária, cédula paraguaia e comprovante de residência', 'Do protocolo da residência à cédula de identidade paraguaia na sua mão, com o comprovante de residência que bancos e órgãos pedem.'],
  carne: ['doc', 'Carnê Migratório', 'O documento migratório que acompanha a sua condição de residente, entregue junto com o processo.'],
  apostila: ['selo', 'Apostilamento dos documentos', 'Os documentos brasileiros precisam do apostilamento de Haia para valer no Paraguai. Isso já está incluso, sem você correr atrás de cartório por cartório.'],
  equipe: ['equipe', 'Acompanhamento da equipe do início ao fim', 'Uma equipe brasileira em Assunção cuida da agenda, responde suas dúvidas e acompanha cada etapa até a entrega.'],
  motorista: ['carro', 'Motorista particular e agente bilíngue', 'Nos seus compromissos em Assunção você não pega táxi nem enfrenta fila sozinho: tem motorista e um agente bilíngue ao seu lado.'],
  aeroporto: ['aviao', 'Recepção no aeroporto e traslado', 'Você é recebido no aeroporto e levado até o hotel ou a hospedagem. Do desembarque em diante, a gente cuida.'],
  ruc: ['predio', 'Abertura do RUC e certidão fiscal', 'O RUC é o cadastro fiscal paraguaio. Abrimos o seu e entregamos a certidão fiscal, o primeiro passo para atuar e faturar no País.'],
  cnh: ['volante', 'Carteira de motorista paraguaia', 'Você sai com a habilitação paraguaia, pronta para dirigir no País.'],
  conta: ['banco', 'Apoio com uma Conta Bancária Basic', 'Acompanhamos a abertura de uma conta bancária Basic no Paraguai, para você começar a movimentar a vida financeira no País.'],
  linha: ['fone', 'Linha telefônica paraguaia', 'Um número local ativo, para cadastros, bancos e o dia a dia no País.'],
  hospedagem: ['casa', 'Hospedagem em apartamento de alto padrão', 'Durante as suas vindas, você fica em um dos nossos apartamentos de luxo na área nobre de Assunção, em frente ao Paseo La Galería e ao Shopping del Sol.'],
  internacional: ['globo', 'Internacionalização de conta bancária', 'Estruturamos a internacionalização da sua conta bancária, para o seu patrimônio não depender de um único País.'],
  llc: ['maleta', 'Abertura de LLC nos Estados Unidos', 'Abertura de uma LLC americana com estrutura bancária nos EUA, para operar e receber em dólar.'],
  saida: ['saida', 'Saída fiscal do Brasil, como cortesia', 'Conduzimos a sua saída fiscal do Brasil sem custo adicional no Signature.'],
};

const PLANOS = [
  {
    slug: 'basico', nome: 'Básico', produto: 'Plano Básico', tag: 'Entrada',
    preco: 'US$ 1.597', parc: 'US$ 1.697', de: '', promo: true, prazo: '6 a 8 meses', vindas: '3 vindas',
    resumo: 'Residência e cédula paraguaia, com a nossa equipe conduzindo o processo.',
    titulo: 'A sua residência paraguaia, <span class="ouro">no melhor custo.</span>',
    sub: 'A porta de entrada para o Paraguai: <b>residência temporária, cédula paraguaia e Carnê Migratório</b>, com o apostilamento incluso e a nossa equipe acompanhando cada etapa.',
    foto: 'panteon.webp', fotoAlt: 'Panteón de los Héroes, no centro de Assunção',
    itens: ['residencia', 'carne', 'apostila', 'equipe'],
    vindasTxt: 'São necessárias 3 vindas ao Paraguai. Combinamos as datas com você e organizamos a agenda de cada uma.',
    paraQuem: [
      ['escudo', 'Quer um Plano B documentado', 'Ter a residência e a cédula paraguaia em mãos, prontas para quando precisar.'],
      ['calendario', 'Quer começar com investimento menor', 'O essencial do processo, com entrada de 20% e o restante em 6x sem juros no cartão.'],
      ['seta', 'Vai estruturar o resto depois', 'Começa pela residência agora e estrutura empresa e banco no seu tempo.'],
    ],
    faq: [
      ['Qual a diferença para o Básico Expresso?', 'O Básico Expresso inclui também motorista particular e agente bilíngue nos seus compromissos em Assunção.'],
      ['Como posso pagar?', 'US$ 1.597 à vista no Pix ou US$ 1.697 com 20% de entrada e o restante em 6x sem juros no cartão. O pagamento é feito em reais, pela cotação do dia, com spread e IOF do dia.'],
      ['Qual é o prazo?', 'O prazo estimado é de 6 a 8 meses. Ele pode variar conforme cada caso e o andamento nos órgãos paraguaios.'],
    ],
  },
  {
    slug: 'basico-expresso', nome: 'Básico Expresso', produto: 'Plano Básico Expresso', tag: 'Essencial',
    preco: 'US$ 2.497', parc: 'US$ 2.797', de: '', promo: true, prazo: '90 dias', vindas: '2 vindas',
    resumo: 'O essencial bem feito: residência, cédula e carnê migratório.',
    titulo: 'A sua residência paraguaia, <span class="ouro">pelo caminho mais direto.</span>',
    sub: 'Para quem quer o essencial bem feito: <b>residência temporária, cédula paraguaia e Carnê Migratório</b>, com a nossa equipe conduzindo cada etapa em Assunção.',
    foto: 'panteon.webp', fotoAlt: 'Panteón de los Héroes, no centro de Assunção',
    itens: ['residencia', 'carne', 'apostila', 'equipe', 'motorista'],
    vindasTxt: 'São necessárias 2 vindas ao Paraguai. Combinamos as datas com você e organizamos a agenda, o motorista e o agente bilíngue de cada uma.',
    paraQuem: [
      ['escudo', 'Quer um Plano B documentado', 'Ter a residência e a cédula paraguaia em mãos, prontas para quando precisar.'],
      ['calendario', 'Quer resolver sem enrolação', 'Prazo estimado de 90 dias, com a equipe cuidando da burocracia por você.'],
      ['seta', 'Prefere começar pelo essencial', 'Começa pela residência agora e estrutura empresa e banco no seu tempo.'],
    ],
    faq: [
      ['Quantas vezes preciso ir ao Paraguai?', 'No Básico Expresso são necessárias 2 vindas ao Paraguai. A nossa equipe combina as datas com você e organiza a agenda, o motorista e o agente bilíngue.'],
      ['Qual é o prazo?', 'O prazo estimado é de 90 dias. Ele pode variar conforme cada caso e o andamento nos órgãos paraguaios.'],
      ['Como posso pagar?', 'US$ 2.497 à vista no Pix ou US$ 2.797 com 20% de entrada e o restante em 6x sem juros no cartão. O pagamento é feito em reais, pela cotação do dia, com spread e IOF do dia.'],
      ['O Básico Expresso inclui RUC, CNH e conta bancária?', 'Não. Esses itens estão no Plano Executive, que também inclui recepção no aeroporto, linha telefônica e comprovante de residência.'],
    ],
  },
  {
    slug: 'executive', nome: 'Executive', produto: 'Plano Executive', tag: 'Recomendado', destaque: true,
    preco: 'US$ 3.997', parc: 'US$ 4.497', de: 'US$ 4.997', promo: true, prazo: '90 dias', vindas: '2 vindas',
    resumo: 'Residência, RUC, carteira de motorista e banco: a vida no Paraguai estruturada.',
    titulo: 'Residência, RUC, CNH e banco: <span class="ouro">a sua vida no Paraguai estruturada.</span>',
    sub: 'O destino mais próximo, rápido e barato para <b>zerar impostos sobre rendas estrangeiras</b> e aumentar a sua liberdade. Tudo em um pacote, com prazo estimado de 90 dias.',
    foto: 'assuncao-aerea.webp', fotoAlt: 'Vista aérea de Assunção e da costanera',
    itens: ['residenciaComp', 'aeroporto', 'ruc', 'cnh', 'conta', 'linha', 'carne', 'apostila'],
    vindasTxt: 'São 2 vindas ao Paraguai: 1 para a residência e 1 para o RUC e a carteira de motorista. Na chegada, você é recebido no aeroporto.',
    paraQuem: [
      ['maleta', 'Empresários e profissionais liberais', 'Quem quer o RUC e a estrutura fiscal paraguaia prontos para operar.'],
      ['globo', 'Quem tem renda no exterior', 'Quem busca um País próximo, com custo de vida baixo e tributação favorável.'],
      ['casa', 'Quem vai viver o Paraguai', 'Com CNH, linha telefônica e conta bancária, você resolve o dia a dia no País.'],
    ],
    faq: [
      ['Quantas vezes preciso ir ao Paraguai?', 'São 2 vindas: 1 para a residência e 1 para o RUC e a carteira de motorista.'],
      ['Qual é o prazo?', 'O prazo estimado é de 90 dias. Ele pode variar conforme cada caso e o andamento nos órgãos paraguaios.'],
      ['Qual a diferença para o Signature?', 'O Signature inclui tudo do Executive e acrescenta hospedagem em apartamento de alto padrão, internacionalização de conta bancária, abertura de LLC nos Estados Unidos e a saída fiscal do Brasil como cortesia.'],
    ],
  },
  {
    slug: 'signature', nome: 'Signature', produto: 'Plano Signature', tag: 'Experiência completa',
    preco: 'US$ 11.497', de: 'US$ 19.997', promo: true, prazo: 'Definido no atendimento', vindas: '2 vindas',
    resumo: 'Tudo do Executive, com hospedagem de luxo, LLC nos EUA e conta internacional.',
    titulo: 'Residência, patrimônio e dólar: <span class="ouro">a estrutura completa, sob medida.</span>',
    sub: 'Uma experiência desenvolvida de forma personalizada para clientes que exigem <b>o mais alto nível de exclusividade</b>. Tudo do Executive, com hospedagem de alto padrão, LLC nos Estados Unidos e internacionalização bancária.',
    foto: 'assuncao-centro.webp', fotoAlt: 'Prédios no centro financeiro de Assunção',
    itens: ['hospedagem', 'internacional', 'llc', 'saida'],
    base: ['residenciaComp', 'aeroporto', 'ruc', 'cnh', 'conta', 'linha', 'carne', 'apostila'],
    vindasTxt: 'São 2 vindas ao Paraguai: 1 para a residência e 1 para o RUC e a carteira de motorista, com hospedagem inclusa em apartamento de alto padrão.',
    paraQuem: [
      ['escudo', 'Quem pensa em gerações', 'Patrimônio construído no Brasil, diversificado em outros Países e em dólar.'],
      ['globo', 'Quem quer operar em dólar', 'Com LLC e estrutura bancária nos EUA, além da conta internacionalizada.'],
      ['cadeado', 'Quem exige exclusividade', 'Atendimento personalizado, hospedagem de luxo e total discrição.'],
    ],
    faq: [
      ['O que o Signature tem a mais que o Executive?', 'Hospedagem em apartamento de alto padrão em frente ao Paseo La Galería, internacionalização de conta bancária, abertura de LLC com estrutura bancária nos EUA e a saída fiscal do Brasil como cortesia.'],
      ['Qual é o prazo?', 'Como o Signature envolve estruturas no Paraguai e nos Estados Unidos, o prazo é definido no atendimento, conforme o seu caso.'],
      ['Quantas vezes preciso ir ao Paraguai?', 'São 2 vindas: 1 para a residência e 1 para o RUC e a carteira de motorista. Nas duas, a hospedagem está inclusa.'],
    ],
  },
];

// Linhas do comparativo: [rótulo, básico, básico expresso, executive, signature]
const COMPARA = [
  ['Residência temporária e cédula', 1, 1, 1, 1],
  ['Carnê Migratório', 1, 1, 1, 1],
  ['Apostilamento dos documentos', 1, 1, 1, 1],
  ['Acompanhamento da equipe em Assunção', 1, 1, 1, 1],
  ['Motorista particular e agente bilíngue', 0, 1, 0, 0],
  ['Comprovante de residência', 0, 0, 1, 1],
  ['Recepção no aeroporto e traslado', 0, 0, 1, 1],
  ['RUC e certidão fiscal', 0, 0, 1, 1],
  ['Carteira de motorista paraguaia', 0, 0, 1, 1],
  ['Apoio com Conta Bancária Basic', 0, 0, 1, 1],
  ['Linha telefônica paraguaia', 0, 0, 1, 1],
  ['Hospedagem em apartamento de alto padrão', 0, 0, 0, 1],
  ['Internacionalização de conta bancária', 0, 0, 0, 1],
  ['LLC com estrutura bancária nos EUA', 0, 0, 0, 1],
  ['Saída fiscal do Brasil (cortesia)', 0, 0, 0, 1],
];

const FAQ_GERAL = [
  ['Isso é legal?', 'Sim. Atuamos exclusivamente dentro da Lei de Migração vigente do Paraguai. Prazos e taxas oficiais são definidos pelos órgãos paraguaios.'],
  ['Os valores são por pessoa?', 'Sim. Para casais e famílias, montamos uma proposta única com todos, depois da conversa com a equipe.'],
  ['Como funciona o pagamento?', 'À vista no Pix com desconto, ou com 20% de entrada e o restante em 6x sem juros no cartão. Os valores são em dólar, pagos em reais pela cotação do dia, com spread e IOF do dia.'],
];

// ───────────── Partes comuns ─────────────
function head({ titulo, descricao, url, raiz = '/' }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-9GC6B1H6Y7"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-9GC6B1H6Y7');
</script>
  <meta charset="utf-8" />
  <meta name="facebook-domain-verification" content="cf2dfkic2owkbc9cs532528oaw7kjm" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#ffffff" />
  <title>${esc(titulo)}</title>
  <meta name="description" content="${esc(descricao)}" />
  <link rel="canonical" href="${url}" />
  <link rel="icon" type="image/png" href="/pg-preview-branca/assets/logo-sem-fundo.png" />
  <link rel="apple-touch-icon" href="/pg-preview-branca/assets/logo-sem-fundo.png" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:site_name" content="Paraguai Global Group" />
  <meta property="og:title" content="${esc(titulo)}" />
  <meta property="og:description" content="${esc(descricao)}" />
  <meta property="og:image" content="https://paraguaiglobalgroup.com/assets/og-preview.jpeg" />
  <meta property="og:url" content="${url}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/pg-preview-branca/assets/site/pg.css?v=1" />
  <!-- Meta Pixel Code -->
  <script>
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1348927197430045');
    fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=1348927197430045&ev=PageView&noscript=1" /></noscript>
  <!-- End Meta Pixel Code -->`;
}

function topo(ativo = '') {
  const l = (href, txt, k) => `<a href="${href}"${ativo === k ? ' class="on"' : ''}>${txt}</a>`;
  return `
<header class="topo">
  <div class="wrap topo-in">
    <a class="marca" href="/pg-preview-branca/" aria-label="Paraguai Global Group, página inicial">
      <img src="/pg-preview-branca/assets/logo-sem-fundo.png" alt="" />
      <div><b>PARAGUAI GLOBAL</b><span>Group · Assunção</span></div>
    </a>
    <nav class="nav" aria-label="Principal">
      ${l('/#planos', 'Planos', 'planos')}
      ${l('/pg-preview-branca/planos/basico-expresso/', 'Básico Expresso', 'basico-expresso')}
      ${l('/pg-preview-branca/planos/executive/', 'Executive', 'executive')}
      ${l('/pg-preview-branca/planos/signature/', 'Signature', 'signature')}
      ${l('/#como-funciona', 'Como funciona', 'como')}
      ${l('/pg-preview-branca/realestate/', 'Imóveis', 'imoveis')}
      ${l('/pg-preview-branca/sobre/', 'Quem somos', 'sobre')}
    </nav>
    <a class="btn btn-verde" href="${WA}" target="_blank" rel="noreferrer">${I.zap}Pré-inscrição</a>
    <button class="menu-btn" type="button" id="menu-btn" aria-expanded="false" aria-controls="gaveta" aria-label="Abrir menu">&#9776;</button>
  </div>
  <div class="gaveta" id="gaveta">
    <div class="wrap">
      <a href="/pg-preview-branca/#planos">Planos</a>
      <a href="/pg-preview-branca/planos/basico-expresso/">Plano Básico Expresso</a>
      <a href="/pg-preview-branca/planos/executive/">Plano Executive</a>
      <a href="/pg-preview-branca/planos/signature/">Plano Signature</a>
      <a href="/pg-preview-branca/#como-funciona">Como funciona</a>
      <a href="/pg-preview-branca/realestate/">Imóveis</a>
      <a href="/pg-preview-branca/guia/">E-books</a>
      <a href="/pg-preview-branca/sobre/">Quem somos</a>
      <a href="/pg-preview-branca/contato/">Contato</a>
      <a class="btn btn-verde btn-bloco" href="${WA}" target="_blank" rel="noreferrer">${I.zap}Faça sua pré-inscrição</a>
    </div>
  </div>
</header>`;
}

function cta({ rotulo = 'Próximo passo', titulo, texto, botao = 'Faça sua pré-inscrição', href = WA, produto = '' }) {
  return `
<section class="sec cta">
  <div class="wrap">
    <div class="escuro">
      <div>
        <p class="rotulo">${rotulo}</p>
        <h2>${titulo}</h2>
        <p>${texto}</p>
      </div>
      <div class="acoes">
        <a class="btn btn-verde" href="${href}" target="_blank" rel="noreferrer"${produto ? ` data-produto="${produto}"` : ''}>${I.zap}${botao}</a>
      </div>
    </div>
  </div>
</section>`;
}

function rodape() {
  return `
<footer class="rodape">
  <div class="wrap">
    <div class="rodape-top">
      <a class="marca" href="/pg-preview-branca/"><img src="/pg-preview-branca/assets/logo-sem-fundo.png" alt="" /><div><b>PARAGUAI GLOBAL</b><span>Group · Assunção</span></div></a>
      <div class="rodape-links">
        <a href="/pg-preview-branca/planos/basico/">Básico</a>
        <a href="/pg-preview-branca/planos/basico-expresso/">Básico Expresso</a>
        <a href="/pg-preview-branca/planos/executive/">Executive</a>
        <a href="/pg-preview-branca/planos/signature/">Signature</a>
        <a href="/pg-preview-branca/realestate/">Imóveis</a>
        <a href="/pg-preview-branca/guia/">E-books</a>
        <a href="/pg-preview-branca/sobre/">Quem somos</a>
        <a href="/pg-preview-branca/contato/">Contato</a>
        <a href="/pg-preview-branca/privacidade/">Privacidade</a>
      </div>
    </div>
    ${redesHtml('redes redes-rodape')}
    <p class="legal">
      <b>Paraguai Global Group</b> · Paraguai Global Group LLC, Delaware (EUA), registro nº 10766786 · Av. Aviadores del Chaco, nº 2581, 8º andar · Asunción, Paraguay.<br />
      Atuamos exclusivamente dentro da Lei de Migração vigente do Paraguai. Prazos e taxas oficiais são definidos pelos órgãos paraguaios e podem mudar sem aviso.
      Conteúdo informativo, não é recomendação de investimento: cada caso exige análise individual. © Paraguai Global Group · Rafael e Giancarla Lorenzatto.
    </p>
  </div>
<div class="legal-emp" style="max-width:1160px;margin:28px auto 0;padding:20px 24px 0;border-top:1px solid #e3e9e5;font-size:12px;line-height:1.7;color:#5a6760"><p style="margin:0 0 10px"><b>Telefone / WhatsApp:</b> <a href="https://wa.me/5511924771370" target="_blank" rel="noreferrer" style="color:inherit">+55 (11) 92477-1370</a></p><p style="margin:0 0 4px"><b>RL Performance Nutrition LTDA</b> · CNPJ 27.583.721/0001-28 · Av. Ipanema, 135 · Veleiros · São Paulo/SP · CEP 04773-010 · Brasil</p><p style="margin:0 0 4px"><b>Rafael Manoel Matos Lorenzato</b> · RUC 9481458-9 · Avenida Dr. Morra, 295 · Villa Morra · Asunción · Paraguay</p><p style="margin:0 0 4px"><b>Paraguai Global Group LLC</b> · EIN 38-4414093 · Delaware File No. 10766786 · 28210 Paseo Dr, Ste 190, Ofc 145 · Wesley Chapel, FL 33543 · USA</p></div></footer>
<a class="zap-fixo" href="${WA}" target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp">${I.zap}</a>`;
}

const SCRIPTS = `
<script>
  // Menu do celular
  (function () {
    var btn = document.getElementById('menu-btn'), g = document.getElementById('gaveta');
    if (!btn || !g) return;
    btn.addEventListener('click', function () {
      var on = g.classList.toggle('aberta');
      btn.setAttribute('aria-expanded', String(on));
      btn.setAttribute('aria-label', on ? 'Fechar menu' : 'Abrir menu');
    });
    g.addEventListener('click', function (e) { if (e.target.closest('a')) { g.classList.remove('aberta'); btn.setAttribute('aria-expanded', 'false'); } });
  })();
  // Conversão no Meta Pixel para qualquer caminho que leve ao WhatsApp
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (a && window.fbq) fbq('track', 'Contact');
  });
  // Entrada suave dos blocos ao rolar
  (function () {
    if (!('IntersectionObserver' in window)) return;
    var els = document.querySelectorAll('.sec .wrap > *, .grade > *, .planos > .plano, .item');
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add('sobe'); obs.observe(el);
    });
  })();
  // Rede de segurança: nada fica escondido se o observer falhar (ex.: salto por âncora)
  (function () {
    function revela() {
      document.querySelectorAll('.sobe:not(.visto), .pp-rev:not(.pp-on), .hx:not(.vis)').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) { el.classList.add('visto', 'vis', 'pp-on'); }
      });
    }
    addEventListener('scroll', revela, { passive: true }); addEventListener('hashchange', function () { setTimeout(revela, 400); }); setTimeout(revela, 800);
  })();
</script>
<script src="/pg-preview-branca/assets/lead-gate.js" defer></script>
<style>
.tem-seg{position:relative}
.tem-seg::after{content:attr(data-seg);position:absolute;left:50%;bottom:calc(100% + 10px);transform:translate(-50%,6px);white-space:nowrap;background:#0f1a14;color:#fff;font:600 12px/1.2 system-ui,-apple-system,sans-serif;letter-spacing:0;text-transform:none;padding:8px 11px;border-radius:9px;box-shadow:0 10px 24px -10px rgba(0,0,0,.5);border:1px solid rgba(232,176,92,.55);opacity:0;pointer-events:none;transition:opacity .18s,transform .18s;z-index:50}
.tem-seg::before{content:"";position:absolute;left:50%;bottom:calc(100% + 4px);transform:translate(-50%,6px);border:6px solid transparent;border-top-color:#0f1a14;border-bottom:0;opacity:0;transition:opacity .18s,transform .18s;z-index:50}
.tem-seg:hover::after,.tem-seg:focus-visible::after,.tem-seg:hover::before,.tem-seg:focus-visible::before{opacity:1!important;transform:translate(-50%,0)!important}
</style>
<script>
(function(){var R=[[/instagram\\.com\\/rafaolorenzatto/i,'@rafaolorenzatto · 1,5 mi seguidores'],[/instagram\\.com\\/paraguaicapitalbr/i,'@paraguaicapitalbr · 319 mil seguidores'],[/instagram\\.com\\/paraguaiglobal/i,'@paraguaiglobal · 155 mil seguidores'],[/youtube\\.com/i,'YouTube · 100 mil inscritos'],[/facebook\\.com/i,'Facebook · 408 mil seguidores'],[/tiktok\\.com/i,'TikTok · 274 mil seguidores · 1,3 mi curtidas']];
document.querySelectorAll('a[href]').forEach(function(a){for(var i=0;i<R.length;i++){if(R[i][0].test(a.href)){a.classList.add('tem-seg');a.setAttribute('data-seg',R[i][1]);if(!a.title)a.setAttribute('aria-label',R[i][1]);break}}});})();
</script>
<style>
.tem-seg.com-img::after,.tem-seg.com-img::before{display:none!important}
#seg-pop{position:fixed;z-index:9999;width:360px;max-width:calc(100vw - 24px);padding:8px;background:#111;border:1px solid rgba(232,176,92,.6);border-radius:14px;box-shadow:0 24px 50px -18px rgba(0,0,0,.6);opacity:0;transform:translateY(8px) scale(.97);transition:opacity .18s,transform .18s;pointer-events:none}
#seg-pop.on{opacity:1;transform:none}
#seg-pop img{display:block;width:100%;border-radius:8px}
#seg-pop b{display:block;color:#f0c878;font:600 12px/1.3 system-ui,sans-serif;padding:8px 4px 2px;text-align:center}
@media (hover:none){#seg-pop{display:none}}
</style>
<script>
(function(){var M=[[/instagram\\.com\\/rafaolorenzatto/i,'seg-ig-rafa'],[/instagram\\.com\\/paraguaicapitalbr/i,'seg-ig-capital'],[/instagram\\.com\\/paraguaiglobal/i,'seg-ig-global'],[/youtube\\.com/i,'seg-youtube'],[/facebook\\.com/i,'seg-facebook'],[/tiktok\\.com/i,'seg-tiktok']];
var pop=document.createElement('div');pop.id='seg-pop';pop.innerHTML='<img alt=""><b></b>';document.body.appendChild(pop);var im=pop.querySelector('img'),tx=pop.querySelector('b');
document.querySelectorAll('a.tem-seg').forEach(function(a){var f=null;for(var i=0;i<M.length;i++)if(M[i][0].test(a.href)){f=M[i][1];break}if(!f)return;a.classList.add('com-img');new Image().src='/pg-preview-branca/assets/redes/'+f+'.png';
a.addEventListener('mouseenter',function(){im.src='/pg-preview-branca/assets/redes/'+f+'.png';tx.textContent=a.getAttribute('data-seg')||'';var r=a.getBoundingClientRect(),w=Math.min(360,innerWidth-24);var x=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2));pop.style.left=x+'px';pop.style.top='0px';pop.classList.add('on');requestAnimationFrame(function(){var h=pop.offsetHeight;var y=r.top-h-12;if(y<8)y=r.bottom+12;pop.style.top=y+'px'})});
a.addEventListener('mouseleave',function(){pop.classList.remove('on')})});})();
</script>
</body>
</html>
`;

const lista = ks => ks.map(k => `<li>${ITENS[k][1]}</li>`).join('');
const btnPlano = (p, txt = 'Quero o ' + p.nome, cls = 'btn-verde') =>
  `<a class="btn ${cls} btn-bloco" href="${waPlano(p.nome)}" target="_blank" rel="noreferrer" data-produto="${p.produto}">${I.zap}${txt}</a>`;
const preco = (p, prefixo = 'à vista') => p.promo
  ? `<div class="promo-card"><span class="promo-selo">Promoção</span>${p.de ? `<p class="promo-de">De <s>${p.de}</s></p>` : ''}<div class="preco">${p.preco}</div><p class="promo-pix">à vista no Pix${p.de ? ` · <b>economize US$ ${(parseInt(p.de.replace(/\D/g,''))-parseInt(p.preco.replace(/\D/g,''))).toLocaleString('pt-BR')}</b>` : ''}</p>${p.parc ? `<div class="promo-parc"><span>ou</span><b>${p.parc}</b><small>20% de entrada + 6x sem juros</small></div>` : ''}<p class="promo-nota">*Câmbio, spread e IOF do dia</p></div>`
  : `<div class="preco"><small>${p.de ? `De <s>${p.de}</s> por` : prefixo}</small>${p.preco}</div>${p.parc ? `<p class="parc">ou <b>${p.parc}</b> com 20% de entrada + 6x sem juros no cartão</p>` : ''}<p class="promo-nota">*Câmbio, spread e IOF do dia</p>`;
const faqHtml = arr => arr.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n        ');

// Cartões dos 3 planos (home e páginas)
function gradePlanos() {
  return `<div class="planos">
${PLANOS.map(p => {
    const ks = p.base ? ['residenciaComp', 'ruc', 'cnh'] : p.destaque ? ['residenciaComp', 'carne', 'ruc', 'cnh', 'conta', 'linha', 'apostila', 'aeroporto'] : p.itens.slice(0, 5);
    const extra = p.base ? `<li class="mais">Tudo do Executive, e mais:</li>${lista(p.itens)}` : lista(ks);
    return `      <article class="plano${p.destaque ? ' destaque' : ''}">
        <span class="plano-tag">${p.tag}</span>
        <h3>${p.nome}</h3>
        <p class="para">${p.resumo}</p>
        ${preco(p)}
        <div class="meta"><div><b>${p.prazo}</b>prazo</div><div><b>${p.vindas}</b>ao Paraguai</div></div>
        <ul class="lista">${p.base ? extra : p.destaque ? ['Residência temporária','Cédula paraguaia','Comprovante de residência','Carnê Migratório','RUC e certidão fiscal','CNH paraguaia','Apoio com Conta Bancária Basic','Linha telefônica paraguaia','Apostilamento dos documentos','Recepção no aeroporto e traslado'].map(t => '<li>' + t + '</li>').join('') : lista(ks)}${!p.base && !p.destaque && p.itens.length > 5 ? `<li class="mais">+ ${p.itens.length - 5} itens inclusos</li>` : ''}</ul>
        <div class="acoes-plano">
          <a class="btn btn-linha btn-bloco" href="/pg-preview-branca/planos/${p.slug}/">Ver o plano completo</a>
          ${btnPlano(p)}
        </div>
      </article>`;
  }).join('\n')}
    </div>`;
}


// Uma seção por plano, imagem alternando de lado (home)
function secoesPlanos() {
  const DOC = ['residencia', 'residenciaComp', 'carne', 'apostila', 'ruc', 'cnh'];
  const ATD = ['equipe'];
  const grupo = (t, ks) => ks.length ? `<div class="pp-grupo"><h4>${t}</h4><ul class="lista">${lista(ks)}</ul></div>` : '';
  const selo = { 'basico': 'Melhor custo', 'basico-expresso': 'Com motorista', 'executive': 'Mais escolhido', 'signature': 'Exclusivo' };
  const nav = `<nav class="pp-nav" aria-label="Planos">${PLANOS.map(p => `<a href="#plano-${p.slug}">${p.nome}</a>`).join('')}</nav>`;
  return nav + PLANOS.map((p, i) => {
    const doc = p.itens.filter(k => DOC.includes(k)), atd = p.itens.filter(k => ATD.includes(k)), srv = p.itens.filter(k => !DOC.includes(k) && !ATD.includes(k));
    const grupos = p.base
      ? `<p class="pp-mais">Tudo do Executive, e mais:</p><div class="pp-grupos">${grupo('Exclusivo do Signature', p.itens)}</div>`
      : `<div class="pp-grupos">${grupo('Documentos', doc)}${grupo(atd.length && !srv.length ? 'Atendimento' : 'Serviços', srv.length ? srv : atd)}${srv.length && atd.length ? grupo('Atendimento', atd) : ''}</div>`;
    return `
    <article class="pp${i % 2 ? ' pp-inv' : ''}${p.destaque ? ' pp-dest' : ''}" id="plano-${p.slug}">
      <figure class="pp-img pp-rev"><img src="/pg-preview-branca/assets/site/planos-img/${p.slug}.jpg" alt="Plano ${p.nome}" loading="lazy" width="1400" height="933" /><span class="pp-selo">${selo[p.slug] || p.tag}</span></figure>
      <div class="pp-txt pp-rev">
        <span class="plano-tag">${p.tag}</span>
        <h3>${p.nome}</h3>
        <p class="pp-resumo">${p.resumo}</p>
        ${p.paraQuem ? `<p class="pp-para"><b>Para quem é:</b> ${p.paraQuem[0][1].toLowerCase().replace("plano b","Plano B")}. ${p.paraQuem[0][2]}</p>` : ''}
        <div class="pp-preco">${preco(p)}<div class="pp-chips"><span><b>${p.prazo}</b>prazo</span><span><b>${p.vindas}</b>ao Paraguai</span></div></div>
        ${grupos}
        <div class="pp-acoes"><a class="btn btn-linha" href="/pg-preview-branca/planos/${p.slug}/">Ver o plano completo</a>${btnPlano(p, 'Quero o ' + p.nome, 'btn-verde')}</div>
      </div>
    </article>`;
  }).join('') + `
<script>(function(){var els=document.querySelectorAll('.pp-rev');if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.documentElement.classList.add('pp-js');var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('pp-on');io.unobserve(e.target)}})},{threshold:0});els.forEach(function(el){io.observe(el)})})();</script>`;
}

// ───────────── Home ─────────────
function home() {
  return `${head({
    titulo: 'Paraguai Global Group · Residência e estrutura no Paraguai',
    descricao: 'Residência, cédula, RUC, conta bancária e proteção patrimonial no Paraguai. Equipe brasileira em Assunção, 100% dentro da lei. Planos Básico, Básico Expresso, Executive e Signature.',
    url: 'https://paraguaiglobalgroup.com/',
  })}
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"ProfessionalService","name":"Paraguai Global Group",
   "description":"Especialistas em residência, RUC, contas bancárias, empresas, internacionalização e proteção patrimonial no Paraguai.",
   "areaServed":["PY","BR"],"address":{"@type":"PostalAddress","streetAddress":"Av. Aviadores del Chaco, nº 2581, 8º andar","addressLocality":"Asunción","addressCountry":"PY"},
   "founder":{"@type":"Person","name":"Rafael Lorenzatto"},"knowsLanguage":["pt-BR","es"],"url":"https://paraguaiglobalgroup.com/",
   "image":"https://paraguaiglobalgroup.com/assets/logo-sem-fundo.png","sameAs":["https://www.instagram.com/paraguaiglobal"],"telephone":"+55 11 92477-1370"}
  </script>
</head>
<body class="home">
${topo()}

<section class="capa capa-banner">
  <svg class="capa-ceu" viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path id="rota" d="M-80 280 C 250 222, 520 268, 760 232 S 1060 120, 1300 20" fill="none" stroke="#b98a3c" stroke-opacity=".45" stroke-width="1.6" stroke-dasharray="3 9" stroke-linecap="round"/>
    <g class="aviao"><path transform="scale(1.35)" d="M14 0 L4 -2 L-3 -10 L-6 -10 L-2 -2 L-9 -1.5 L-12 -5 L-14 -5 L-12 0 L-14 5 L-12 5 L-9 1.5 L-2 2 L-6 10 L-3 10 L4 2 Z" fill="#140d07"/>
      <animateMotion dur="16s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear"><mpath href="#rota"/></animateMotion></g>
  </svg>
  <div class="wrap capa-in">
    <p class="capa-marca" aria-hidden="true">Paraguai</p>
    <div class="capa-txt">
      <p class="rotulo">Dr. Rafael Lorenzatto · Fundador e CEO</p>
      <h1>Seu próximo capítulo <em>começa no Paraguai.</em></h1>
      <p class="sub">Residência, cédula, RUC, conta bancária e estrutura patrimonial, conduzidos do começo ao fim por uma equipe brasileira em Assunção. <b>Com segurança, estratégia e exclusividade.</b></p>
      <div class="acoes">
        <a class="btn btn-verde" href="${WA}" target="_blank" rel="noreferrer">${I.zap}Faça sua pré-inscrição</a>
        <a class="capa-link" href="#planos">Ver os planos <span aria-hidden="true">→</span></a>
      </div>
      <img class="capa-mob" src="/pg-preview-branca/assets/site/capa-branca-mob.jpg?v=2" alt="Dr. Rafael Lorenzatto, fundador e CEO da Paraguai Global Group" />
      <div class="capa-prova">
        <span class="rostos"><img src="/pg-preview-branca/assets/site/rafael-oficial.jpg" alt="" /></span>
        <b>~3 mi</b><span>de seguidores acompanham<br/>o Rafael nas redes</span>
      </div>
    </div>
    <div class="capa-palco">
      <div class="capa-arco"></div>
      <div class="bandeira" aria-hidden="true"><span class="mastro"></span><div class="pano"><i style="--i:0"></i><i style="--i:1"></i><i style="--i:2"></i><i style="--i:3"></i><i style="--i:4"></i><i style="--i:5"></i><i style="--i:6"></i><i style="--i:7"></i><i style="--i:8"></i><i style="--i:9"></i><i style="--i:10"></i><i style="--i:11"></i><i style="--i:12"></i><i style="--i:13"></i><i style="--i:14"></i><i style="--i:15"></i><i style="--i:16"></i><i style="--i:17"></i><i style="--i:18"></i><i style="--i:19"></i></div></div>
      <img class="capa-rafa" src="/pg-preview-branca/assets/site/rafael-oficial.jpg" alt="Dr. Rafael Lorenzatto, fundador e CEO da Paraguai Global Group" fetchpriority="high" width="1040" height="1400" />
      <p class="capa-selo"><b>Dr. Rafael Lorenzatto</b>Fundador e CEO · Paraguai Global Group</p>
    </div>
  </div>
</section>

<section class="sec autoridade-sec historia" id="rafael">
  <div class="wrap">
    <div class="escuro hist">
      <div class="hist-cab">
        <p class="rotulo">Quem está à frente</p>
        <h2>Da alta performance no esporte <span class="ouro">à alta performance nos negócios.</span></h2>
        <p class="aut-esp">Nutricionista Especialista em Nutrição Esportiva · Formulações Magistrais e Produtos Manipulados · Empresário · CEO &amp; Founder · Mentor de Negócios · Palestrante · Internacionalização de Negócios</p>
      </div>
      <div class="hist-corpo">
        <figure class="hist-foto"><img src="/pg-preview-branca/assets/site/rafael-bandeiras.jpg" alt="Dr. Rafael Lorenzatto" loading="lazy" /><figcaption><b>Dr. Rafael Lorenzatto</b>Fundador e CEO · Brasil · Paraguai · Estados Unidos</figcaption></figure>
        <ol class="hist-linha">
          <i class="hist-trilho" aria-hidden="true"><i class="hist-fill"></i></i>
          ${HISTORIA.map(([tag, num, suf, txt]) => `<li class="hist-cap rev"><span class="hist-tag">${tag}</span><b class="hist-big">${num !== null ? `<span class="conta" data-alvo="${num}">${num}</span>` : ''}${suf}</b><p>${txt}</p></li>`).join('\n          ')}
        </ol>
      </div>
      <div class="hist-num rev">${NUMEROS_ANIM.map(([pre, n, suf, t]) => `<div><b>${pre}<span class="conta" data-alvo="${n}">${n}</span>${suf}</b><span>${t}</span></div>`).join('')}</div>
      <div class="hist-pe rev">
        <div class="hist-redes">${REDES.map(([r, h, u]) => `<a href="${u}" target="_blank" rel="noreferrer" aria-label="${r} ${h}" title="${r} ${h}">${ICO_REDE[r]}</a>`).join('')}<span>Siga o Rafael</span></div>
        <a class="aut-mais" href="/pg-preview-branca/sobre/">Conheça a história completa <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
</section>
<script>
(function(){
  var d=document.documentElement,red=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(red||!('IntersectionObserver' in window))return;
  d.classList.add('hist-js');
  function conta(el){var alvo=+el.dataset.alvo,t0=null,dur=1400;function f(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=Math.round(alvo*e).toLocaleString('pt-BR');if(k<1)requestAnimationFrame(f)}el.textContent='0';requestAnimationFrame(f)}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;e.target.classList.add('vis');e.target.querySelectorAll('.conta').forEach(conta);io.unobserve(e.target)})},{rootMargin:'0px 0px -18% 0px',threshold:.15});
  document.querySelectorAll('.historia .rev').forEach(function(el){io.observe(el)});
  var linha=document.querySelector('.hist-linha'),fill=document.querySelector('.hist-fill');
  function prog(){var r=linha.getBoundingClientRect(),vh=innerHeight,k=(vh*.6-r.top)/r.height;fill.style.transform='scaleY('+Math.max(0,Math.min(1,k))+')'}
  addEventListener('scroll',prog,{passive:true});addEventListener('resize',prog);prog();
})();
</script>

<section class="sec" id="planos">
  <div class="wrap">
    <div class="cabeca">
      <div>
        <p class="rotulo">Soluções estratégicas</p>
        <h2>Quatro níveis de assessoria. Um padrão de excelência.</h2>
      </div>
      <p>Soluções personalizadas para empresários, investidores e famílias que enxergam além das fronteiras. Da residência migratória à internacionalização empresarial e patrimonial, cada plano foi desenvolvido para atender diferentes objetivos, com discrição, segurança jurídica e acompanhamento especializado. Conheça nossas soluções e descubra a estrutura mais adequada ao seu momento e às suas ambições.</p>
    </div>
    ${secoesPlanos()}
    <div class="aviso">${I.equipe}<span><b>Valores em dólar, por pessoa.</b> Pagamento em reais pela cotação do dia, com spread e IOF do dia. Para casais e famílias, montamos uma proposta única. Prazos são estimados e variam conforme cada caso.</span></div>
  </div>
</section>

<section class="sec sec-ice">
  <div class="wrap">
    <div class="cabeca">
      <div>
        <p class="rotulo">Nosso diferencial</p>
        <h2>Quem administra grandes negócios não precisa administrar a própria burocracia.</h2>
      </div>
      <p>Seu tempo é valioso e a sua estrutura pede confidencialidade. Você foca no que importa e nós cuidamos da sua jornada internacional, com discrição e suporte real.</p>
    </div>
    <div class="grade g3">
      <div class="cartao"><div class="icone">${I.equipe}</div><h3>Equipe brasileira em Assunção</h3><p>Não somos intermediários à distância. A equipe mora no Paraguai e conduz cada etapa com você, em português.</p></div>
      <div class="cartao"><div class="icone">${I.carro}</div><h3>Motorista e concierge bilíngue</h3><p>Nas suas vindas, você é acompanhado por motorista e concierge bilíngue em todos os compromissos.</p></div>
      <div class="cartao"><div class="icone">${I.cadeado}</div><h3>Discrição e 100% dentro da lei</h3><p>Trabalhamos exclusivamente dentro da legislação paraguaia. Sem atalhos, cada etapa documentada.</p></div>
    </div>
    <div class="grade g2" style="margin-top:18px">
      <figure class="foto" style="aspect-ratio:16/10;margin:0"><img src="/pg-preview-branca/assets/site/assuncao-aerea.webp" alt="Vista aérea de Assunção" loading="lazy" /><figcaption>Assunção · Paraguai</figcaption></figure>
      <figure class="foto" style="aspect-ratio:16/10;margin:0"><img src="/pg-preview-branca/assets/site/motorista.webp" alt="Interior do carro usado nos deslocamentos" loading="lazy" /><figcaption>Você acompanhado em cada etapa</figcaption></figure>
    </div>
  </div>
</section>

<section class="sec" id="como-funciona">
  <div class="wrap">
    <div class="cabeca">
      <div>
        <p class="rotulo">Como funciona</p>
        <h2>Um processo claro, com acompanhamento real.</h2>
      </div>
      <p>Você fala com uma equipe só. Ela organiza os documentos, a agenda em Assunção e te mantém informado em cada etapa.</p>
    </div>
    <div class="grade g4">
      <div class="cartao etapa"><span class="num">01</span><h3>Pré-inscrição</h3><p>Você responde algumas perguntas rápidas. Assim entendemos o seu objetivo antes da conversa.</p></div>
      <div class="cartao etapa"><span class="num">02</span><h3>Conversa com a equipe</h3><p>Entendemos o seu caso, indicamos o plano certo e montamos a proposta, inclusive para a família.</p></div>
      <div class="cartao etapa"><span class="num">03</span><h3>Documentos no Brasil</h3><p>Você recebe a lista do que separar. O apostilamento dos documentos já está incluso nos planos.</p></div>
      <div class="cartao etapa"><span class="num">04</span><h3>Vindas a Assunção</h3><p>Agenda pronta, motorista e agente bilíngue. Você comparece, a gente cuida do resto até a entrega.</p></div>
    </div>
    <div class="reuniao sobe" id="reuniao">
      <figure class="reuniao-foto"><img src="/pg-preview-branca/assets/site/rafael-oficial.jpg" alt="Dr. Rafael Lorenzatto" loading="lazy" /><figcaption><b>Dr. Rafael Lorenzatto</b>Fundador e CEO</figcaption></figure>
      <div class="reuniao-txt">
        <p class="rotulo">Mentoria empresarial &amp; negócios</p>
        <h3>Dolarizar e proteger o patrimônio, <em>do jeito certo.</em></h3>
        <p>Uma hora de mentoria com o Rafael Lorenzatto, empresário que estruturou a própria operação no Paraguai. O foco não é só abrir uma empresa: é montar a <b>estrutura certa para dolarizar e proteger o seu patrimônio</b>, em camadas, dentro da lei.</p>
        <div class="reuniao-info">
          <div><b>1 hora</b><span>com o Rafael</span></div>
          <div><b>R$ 1.000</b><span>mentoria individual</span></div>
          <div><b>R$ 2.000</b><span>até 3 pessoas (sócios ou família)</span></div>
        </div>
        <a class="btn btn-verde" href="${WA}" target="_blank" rel="noreferrer" data-produto="Mentoria Empresarial">${I.zap}Agendar minha mentoria</a>
      </div>
      <div class="camadas-bloco">
        <p class="camadas-tit">As 4 camadas que analisamos com você</p>
        <ol class="camadas">
          <li><span>01</span><div><b>Camada migratória</b>Residência e cédula: a base legal para tudo o que vem depois.</div></li>
          <li><span>02</span><div><b>Camada fiscal</b>RUC e enquadramento corretos, para pagar o que é devido e nada além.</div></li>
          <li><span>03</span><div><b>Camada bancária</b>Contas em dólar e diversificação entre Países, sem depender de um só sistema.</div></li>
          <li><span>04</span><div><b>Camada empresarial e patrimonial</b>Sociedades e holdings que separam o risco do negócio do patrimônio da família.</div></li>
        </ol>
        <p class="camadas-fecho">Quem pula uma camada costuma pagar caro depois: estrutura fora de ordem, dinheiro parado no lugar errado, empresa que precisa ser refeita. Na mentoria você sai sabendo <b>qual camada vem primeiro no seu caso</b> e o que não precisa contratar agora.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec sec-ice">
  <div class="wrap">
    <div class="cabeca">
      <div>
        <p class="rotulo">Quem somos</p>
        <h2>Um casal que vive na prática o que oferece.</h2>
      </div>
      <p>Somos uma consultoria brasileira com base em Assunção. Escolhemos ser especialistas em um único País: profundidade real no processo, relacionamento com os órgãos locais e previsibilidade para você.</p>
    </div>
    <div class="grade g2">
      <div class="cartao pessoa">
        <img src="/pg-preview-branca/assets/site/rafael-oficial.jpg" alt="Dr. Rafael Lorenzatto" loading="lazy" />
        <div><h3>Dr. Rafael Lorenzatto</h3><p class="cargo">Fundador e CEO</p><p class="txt">Nutricionista esportivo, empresário e mentor de negócios, com mais de 25 anos de trajetória e cerca de 3 milhões de seguidores. Proprietário do ecossistema RL Performance Nutrition, une visão empresarial, conhecimento do mercado paraguaio e acompanhamento em cada etapa.</p></div>
      </div>
      <div class="cartao pessoa">
        <img src="/pg-preview-branca/assets/site/giancarla.webp" alt="Giancarla Lorenzatto" loading="lazy" />
        <div><h3>Giancarla Lorenzatto</h3><p class="cargo">Cofundadora</p><p class="txt">Empresária e especialista em comportamento humano, com mais de 20 anos de mercado e pós-graduação em Neurociência. Cuida da visão estratégica e do lado humano de cada história, porque mudar de País é, antes de tudo, uma decisão de vida.</p></div>
      </div>
    </div>
    <p style="margin-top:22px"><a href="/pg-preview-branca/sobre/" style="color:var(--gold);font-weight:700;text-decoration:none">Conheça a história completa do Rafael →</a></p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="cabeca">
      <div>
        <p class="rotulo">Bastidores</p>
        <h2>A vida de quem vive o processo, assim como você.</h2>
      </div>
      <p>Toque no vídeo para ativar o som.</p>
    </div>
    <div class="videos-car"><div class="videos" id="videos">
      <button class="video-cx" type="button" aria-label="Vídeo 1, toque para ativar o som"><span class="video-som" aria-hidden="true">&#128264;</span><video src="/pg-preview-branca/assets/videos/rafao-3.mp4" poster="/pg-preview-branca/assets/videos/rafao-3-capa.jpg" muted loop playsinline preload="none"></video></button>
      <button class="video-cx" type="button" aria-label="Vídeo 2, toque para ativar o som"><span class="video-som" aria-hidden="true">&#128264;</span><video src="/pg-preview-branca/assets/videos/rafao-6.mp4" poster="/pg-preview-branca/assets/videos/rafao-6-capa.jpg" muted loop playsinline preload="none"></video></button>
      <button class="video-cx" type="button" aria-label="Vídeo 3, toque para ativar o som"><span class="video-som" aria-hidden="true">&#128264;</span><video src="/pg-preview-branca/assets/videos/rafao-5.mp4" poster="/pg-preview-branca/assets/videos/rafao-5-capa.jpg" muted loop playsinline preload="none"></video></button>
      <button class="video-cx" type="button" aria-label="Vídeo 4, toque para ativar o som"><span class="video-som" aria-hidden="true">&#128264;</span><video src="/pg-preview-branca/assets/videos/rafao-7.mp4" poster="/pg-preview-branca/assets/videos/rafao-7-capa.jpg" muted loop playsinline preload="none"></video></button>
      <button class="video-cx" type="button" aria-label="Vídeo 5, toque para ativar o som"><span class="video-som" aria-hidden="true">&#128264;</span><video src="/pg-preview-branca/assets/videos/rafao-8.mp4" poster="/pg-preview-branca/assets/videos/rafao-8-capa.jpg" muted loop playsinline preload="none"></video></button>
    </div>
    <div class="videos-nav"><button type="button" id="vid-ant" aria-label="Vídeo anterior">&#8592;</button><button type="button" id="vid-prox" aria-label="Próximo vídeo">&#8594;</button></div></div>
    <script>(function(){var v=document.getElementById('videos'),a=document.getElementById('vid-ant'),p=document.getElementById('vid-prox');
      function passo(){return v.firstElementChild.offsetWidth+18}
      function upd(){a.disabled=v.scrollLeft<5;p.disabled=v.scrollLeft+v.clientWidth>=v.scrollWidth-5}
      a.onclick=function(){v.scrollBy({left:-passo(),behavior:'smooth'})};p.onclick=function(){v.scrollBy({left:passo(),behavior:'smooth'})};
      v.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();})();</script>
    </div>
  </div>
</section>

<section class="pgf-sec" id="formulario">
  <div class="pgf-wrap">
    <div class="pgf-intro">
      <p class="pgf-rot">Pré-inscrição</p>
      <h2 class="pgf-tit">Conte um pouco sobre você e sua família.</h2>
      <p class="pgf-txt">Leva menos de 1 minuto. Com essas respostas, nossa equipe chega à conversa no WhatsApp já sabendo qual caminho faz mais sentido para você.</p>
    </div>
    <form class="pgf" id="pgf" novalidate>
      <div class="pgf-prog"><small id="pgf-passo">Passo 1 de 4</small><div class="pgf-bar"><i id="pgf-fill"></i></div></div>

      <fieldset data-step="1">
        <legend>Qual é o seu principal objetivo no Paraguai?</legend>
        <p class="pgf-hint">Isso nos ajuda a preparar a conversa.</p>
        <div class="pgf-opts">
          <label class="pgf-opt"><input type="radio" name="objetivo" value="Preparar um Plano B, sem mudar agora"><span>Preparar um Plano B, sem mudar agora</span></label>
          <label class="pgf-opt"><input type="radio" name="objetivo" value="Mudar com a família"><span>Mudar com a minha família</span></label>
          <label class="pgf-opt"><input type="radio" name="objetivo" value="Abrir ou expandir negócios"><span>Abrir ou expandir meus negócios</span></label>
          <label class="pgf-opt"><input type="radio" name="objetivo" value="Proteger e estruturar patrimônio"><span>Proteger e estruturar meu patrimônio</span></label>
          <label class="pgf-opt"><input type="radio" name="objetivo" value="Ainda avaliando as possibilidades"><span>Ainda estou avaliando as possibilidades</span></label>
        </div>
        <span class="pgf-q">Quando pretende começar?</span>
        <div class="pgf-opts dois">
          <label class="pgf-opt"><input type="radio" name="prazo" value="Até 6 meses"><span>Até 6 meses</span></label>
          <label class="pgf-opt"><input type="radio" name="prazo" value="6 a 12 meses"><span>6 a 12 meses</span></label>
          <label class="pgf-opt"><input type="radio" name="prazo" value="12 a 24 meses"><span>12 a 24 meses</span></label>
          <label class="pgf-opt"><input type="radio" name="prazo" value="Sem prazo definido"><span>Sem prazo definido</span></label>
        </div>
      </fieldset>

      <fieldset data-step="2" hidden>
        <legend>Quem vai fazer o processo?</legend>
        <p class="pgf-hint">A residência é individual: cada pessoa da família tem o seu processo.</p>
        <div class="pgf-opts tres">
          <label class="pgf-opt"><input type="radio" name="quem" value="Só eu"><span>Só eu</span></label>
          <label class="pgf-opt"><input type="radio" name="quem" value="Eu e cônjuge"><span>Eu e cônjuge</span></label>
          <label class="pgf-opt"><input type="radio" name="quem" value="Família com filhos"><span>Família com filhos</span></label>
        </div>
        <div class="pgf-fam" id="pgf-fam" hidden>
          <div class="pgf-cont"><span>Adultos <small>(18 anos ou mais)</small></span><div class="pgf-num"><button type="button" data-n="adultos" data-d="-1" aria-label="Menos adultos">−</button><output id="pgf-adultos">2</output><button type="button" data-n="adultos" data-d="1" aria-label="Mais adultos">+</button></div></div>
          <div class="pgf-cont"><span>Crianças e adolescentes <small>(até 17 anos)</small></span><div class="pgf-num"><button type="button" data-n="criancas" data-d="-1" aria-label="Menos crianças">−</button><output id="pgf-criancas">0</output><button type="button" data-n="criancas" data-d="1" aria-label="Mais crianças">+</button></div></div>
        </div>
        <span class="pgf-q">Qual sua atividade principal?</span>
        <div class="pgf-opts dois">
          <label class="pgf-opt"><input type="radio" name="atividade" value="Empresário"><span>Empresário</span></label>
          <label class="pgf-opt"><input type="radio" name="atividade" value="Profissional liberal"><span>Profissional liberal</span></label>
          <label class="pgf-opt"><input type="radio" name="atividade" value="Executivo / CLT"><span>Executivo / CLT</span></label>
          <label class="pgf-opt"><input type="radio" name="atividade" value="Investidor / Aposentado"><span>Investidor / Aposentado</span></label>
        </div>
      </fieldset>

      <fieldset data-step="3" hidden>
        <legend>Por onde você quer começar?</legend>
        <p class="pgf-hint">Escolha uma opção. Você pode mudar depois na conversa.</p>
        <div class="pgf-opts">
          <label class="pgf-opt"><input type="radio" name="servico" value="Mentoria de estrutura com o Rafael (R$ 1.000)"><span>Mentoria de estrutura com o Rafael <em>R$ 1.000 · 1 hora</em></span></label>
          <label class="pgf-opt"><input type="radio" name="servico" value="Plano Básico (US$ 1.597)"><span>Básico: residência e cédula <em>a partir de US$ 1.597</em></span></label>
          <label class="pgf-opt"><input type="radio" name="servico" value="Plano Básico Expresso (US$ 2.497)"><span>Básico Expresso: com motorista e agente <em>a partir de US$ 2.497</em></span></label>
          <label class="pgf-opt"><input type="radio" name="servico" value="Plano Executive (US$ 3.997 promo)"><span>Executive: documentos, CNH, RUC e banco <em>de US$ 4.997 por US$ 3.997</em></span></label>
          <label class="pgf-opt"><input type="radio" name="servico" value="Plano Signature (US$ 11.497)"><span>Signature: estrutura patrimonial completa <em>US$ 11.497</em></span></label>
          <label class="pgf-opt"><input type="radio" name="servico" value="Quero ajuda para escolher"><span>Ainda não sei: quero ajuda para escolher</span></label>
        </div>
        <span class="pgf-q">Patrimônio aproximado <small>(opcional)</small></span>
        <div class="pgf-opts dois">
          <label class="pgf-opt"><input type="radio" name="patrimonio" value="Até R$ 1 milhão"><span>Até R$ 1 milhão</span></label>
          <label class="pgf-opt"><input type="radio" name="patrimonio" value="R$ 1 a 5 milhões"><span>R$ 1 a 5 milhões</span></label>
          <label class="pgf-opt"><input type="radio" name="patrimonio" value="R$ 5 a 20 milhões"><span>R$ 5 a 20 milhões</span></label>
          <label class="pgf-opt"><input type="radio" name="patrimonio" value="Acima de R$ 20 milhões"><span>Acima de R$ 20 milhões</span></label>
        </div>
      </fieldset>

      <fieldset data-step="4" hidden>
        <legend>Como falamos com você?</legend>
        <p class="pgf-hint">A conversa continua no WhatsApp.</p>
        <label class="pgf-campo">Nome completo<input name="nome" type="text" autocomplete="name" placeholder="Seu nome"></label>
        <label class="pgf-campo">Cidade e estado<input name="cidade" type="text" autocomplete="address-level2" placeholder="Ex.: Campinas, SP"></label>
        <label class="pgf-campo">Como conheceu o Rafael? <small>(opcional)</small>
          <select name="conheceu"><option value="">Selecione</option><option>Instagram</option><option>YouTube</option><option>TikTok</option><option>Facebook</option><option>Indicação de alguém</option><option>Google</option><option>Outro</option></select>
        </label>
      </fieldset>

      <p class="pgf-err" id="pgf-err" hidden></p>
      <div class="pgf-nav"><button type="button" class="pgf-voltar" id="pgf-voltar" hidden>Voltar</button><span></span><button type="submit" class="pgf-btn" id="pgf-prox">Continuar <span aria-hidden="true">→</span></button></div>
    </form>
  </div>
</section>
<style>
#formulario{--pgf-bg-sec:#f6f8f5;--pgf-card:#fff;--pgf-borda:#dde5df;--pgf-tx:#0f2219;--pgf-tx2:#5a6760;--pgf-acc:#006039;--pgf-sel:#eef6f1;--pgf-campo:#fff;--pgf-btn:#006039;--pgf-btn-tx:#fff}
#formulario .pgf-tit{font-family:"Fraunces",Georgia,serif;font-weight:400}
.pgf-sec{padding:96px 0;background:var(--pgf-bg-sec)}
.pgf-wrap{max-width:1160px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:.85fr 1.15fr;gap:56px;align-items:start}
.pgf-intro{position:sticky;top:120px}@media (max-width:900px){.pgf-intro{position:static}}
.pgf-rot{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--pgf-acc);margin:0 0 14px;font-weight:600}
.pgf-tit{font-size:clamp(30px,3.4vw,44px);line-height:1.1;margin:0 0 18px;color:var(--pgf-tx)}
.pgf-txt{font-size:17px;line-height:1.65;color:var(--pgf-tx2);margin:0}
.pgf{background:var(--pgf-card);border:1px solid var(--pgf-borda);border-radius:24px;padding:40px;box-shadow:0 30px 60px -35px rgba(0,0,0,.45)}
.pgf fieldset{border:0;margin:0;padding:0;min-width:0}
.pgf legend{font-size:26px;font-weight:600;line-height:1.2;color:var(--pgf-tx);padding:0;margin-bottom:8px}
.pgf-hint{color:var(--pgf-tx2);margin:0 0 24px;font-size:15px}
.pgf-prog{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:28px}
.pgf-prog small{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--pgf-tx2);font-weight:600}
.pgf-bar{flex:0 1 40%;height:4px;border-radius:4px;background:var(--pgf-borda);overflow:hidden}
.pgf-bar i{display:block;height:100%;width:25%;background:var(--pgf-acc);border-radius:4px;transition:width .3s}
.pgf-opts{display:grid;gap:12px}
.pgf-opts.dois{grid-template-columns:1fr 1fr}
.pgf-opts.tres{grid-template-columns:1fr 1fr 1fr}
.pgf-opt{position:relative;cursor:pointer}
.pgf-opt input{position:absolute;opacity:0;width:0;height:0;margin:0;pointer-events:none}
.pgf-opt span{display:flex;flex-direction:column;justify-content:center;min-height:58px;padding:14px 20px;border:1.5px solid var(--pgf-borda);border-radius:14px;color:var(--pgf-tx);font-size:16px;line-height:1.35;transition:border-color .15s,background .15s}
.pgf-opt span em{font-style:normal;font-size:13px;color:var(--pgf-tx2);margin-top:3px}
.pgf-opt:hover span{border-color:var(--pgf-acc)}
.pgf-opt input:checked+span{border-color:var(--pgf-acc);background:var(--pgf-sel)}
.pgf-opt input:focus-visible+span{outline:2px solid var(--pgf-acc);outline-offset:2px}
.pgf-q{display:block;font-weight:600;color:var(--pgf-tx);margin:28px 0 12px;font-size:16px}
.pgf-q small,.pgf-campo small{font-weight:400;color:var(--pgf-tx2)}
.pgf-fam{margin-top:16px;border:1.5px solid var(--pgf-borda);border-radius:14px;padding:6px 20px}
.pgf-cont{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 0;color:var(--pgf-tx)}
.pgf-cont+.pgf-cont{border-top:1px solid var(--pgf-borda)}
.pgf-cont small{display:block;color:var(--pgf-tx2);font-size:13px}
.pgf-num{display:flex;align-items:center;gap:14px}
.pgf-num button{width:38px;height:38px;border-radius:50%;border:1.5px solid var(--pgf-borda);background:transparent;color:var(--pgf-tx);font-size:20px;line-height:1;cursor:pointer}
.pgf-num button:hover{border-color:var(--pgf-acc);color:var(--pgf-acc)}
.pgf-num output{min-width:22px;text-align:center;font-size:18px;font-weight:600}
.pgf-campo{display:block;font-weight:600;color:var(--pgf-tx);margin-bottom:18px;font-size:15px}
.pgf-campo input,.pgf-campo select{display:block;width:100%;margin-top:8px;height:54px;padding:0 16px;border:1.5px solid var(--pgf-borda);border-radius:12px;background:var(--pgf-campo);color:var(--pgf-tx);font:inherit;font-weight:400;font-size:16px;box-sizing:border-box}
.pgf-campo input:focus,.pgf-campo select:focus{outline:none;border-color:var(--pgf-acc)}
.pgf-err{color:#e5484d;font-size:14px;margin:18px 0 0}
.pgf-nav{display:flex;align-items:center;justify-content:space-between;margin-top:32px}
.pgf-voltar{background:none;border:0;color:var(--pgf-tx2);font:inherit;font-weight:600;cursor:pointer;text-decoration:underline;text-underline-offset:4px}
.pgf-btn{height:54px;padding:0 30px;border:0;border-radius:14px;background:var(--pgf-btn);color:var(--pgf-btn-tx);font:inherit;font-size:17px;font-weight:600;cursor:pointer;transition:filter .15s}
.pgf-btn:hover{filter:brightness(1.08)}
@media (max-width:900px){.pgf-wrap{grid-template-columns:1fr;gap:32px}.pgf{padding:26px 20px}.pgf legend{font-size:22px}.pgf-sec{padding:64px 0}}
@media (max-width:520px){.pgf-opts.tres{grid-template-columns:1fr}.pgf-opts.dois{grid-template-columns:1fr 1fr}.pgf-opt span{padding:12px 14px;font-size:15px}}
</style>
<script>
(function(){
  var f=document.getElementById('pgf');if(!f)return;
  var passo=1,total=4,cont={adultos:2,criancas:0};
  var fam=document.getElementById('pgf-fam'),err=document.getElementById('pgf-err'),volt=document.getElementById('pgf-voltar'),prox=document.getElementById('pgf-prox');
  function val(n){var e=f.querySelector('[name="'+n+'"]:checked')||f.querySelector('input[type=text][name="'+n+'"],select[name="'+n+'"]');return e?e.value.trim():''}
  function mostra(){
    f.querySelectorAll('fieldset').forEach(function(s){s.hidden=+s.dataset.step!==passo});
    document.getElementById('pgf-passo').textContent='Passo '+passo+' de '+total;
    document.getElementById('pgf-fill').style.width=(passo/total*100)+'%';
    volt.hidden=passo===1;
    prox.innerHTML=passo===total?'Enviar e falar no WhatsApp <span aria-hidden="true">→</span>':'Continuar <span aria-hidden="true">→</span>';
    err.hidden=true;
  }
  f.addEventListener('change',function(e){
    if(e.target.name==='quem'){
      var v=e.target.value;fam.hidden=v==='Só eu';
      if(v==='Eu e cônjuge'){cont.adultos=2;cont.criancas=0}
      if(v==='Família com filhos'){cont.adultos=Math.max(cont.adultos,2);cont.criancas=Math.max(cont.criancas,1)}
      atualiza();
    }
  });
  function atualiza(){document.getElementById('pgf-adultos').textContent=cont.adultos;document.getElementById('pgf-criancas').textContent=cont.criancas}
  f.querySelectorAll('.pgf-num button').forEach(function(b){b.onclick=function(){var n=b.dataset.n;cont[n]=Math.max(n==='adultos'?1:0,Math.min(15,cont[n]+(+b.dataset.d)));atualiza()}});
  var exige={1:[['objetivo','seu objetivo'],['prazo','quando pretende começar']],2:[['quem','quem vai fazer o processo'],['atividade','sua atividade']],3:[['servico','por onde quer começar']],4:[['nome','seu nome'],['cidade','sua cidade']]};
  function ok(){var falta=exige[passo].filter(function(x){return !val(x[0])});if(falta.length){err.textContent='Falta informar: '+falta.map(function(x){return x[1]}).join(' e ')+'.';err.hidden=false;return false}return true}
  volt.onclick=function(){passo--;mostra()};
  f.addEventListener('submit',function(e){
    e.preventDefault();if(!ok())return;
    if(passo<total){passo++;mostra();f.scrollIntoView({behavior:'smooth',block:'start'});return}
    var quem=val('quem'),pessoas=quem==='Só eu'?'Só eu (1 adulto)':quem+': '+cont.adultos+' adulto(s) e '+cont.criancas+' criança(s)';
    var l=['Olá! Fiz a pré-inscrição pelo site.','','*Nome:* '+val('nome'),'*Cidade:* '+val('cidade'),'*Objetivo:* '+val('objetivo'),'*Quando:* '+val('prazo'),'*Pessoas:* '+pessoas,'*Atividade:* '+val('atividade'),'*Interesse:* '+val('servico')];
    if(val('patrimonio'))l.push('*Patrimônio:* '+val('patrimonio'));
    if(val('conheceu'))l.push('*Conheceu por:* '+val('conheceu'));
    try{if(window.fbq)fbq('track','Lead');if(window.gtag)gtag('event','generate_lead')}catch(x){}
    window.open('https://wa.me/5511924771370?text='+encodeURIComponent(l.join('\\n')),'_blank');
  });
  mostra();
})();
</script>

<section class="sec sec-ice" id="contato">
  <div class="wrap contato">
    <div>
      <p class="rotulo">Fale com a gente</p>
      <h2>Não sabe por onde começar? Conte o seu caso.</h2>
      <p style="color:var(--muted);font-size:17px;margin-top:18px">Escolha o seu objetivo, responda a pré-inscrição em dois minutos e continue a conversa no nosso WhatsApp, com as respostas já preenchidas.</p>
      <ul class="checks">
        <li>Atendimento pela equipe brasileira em Assunção</li>
        <li>Não pedimos documentos nesta etapa</li>
        <li>Proposta para você ou para toda a família</li>
      </ul>
    </div>
    <div class="cartao escolha">
      <h3>Qual é o seu principal objetivo?</h3>
      <p>Toque em uma opção para começar.</p>
      <div class="opcoes" id="opcoes">
        <button type="button" data-obj="Residência e cédula no Paraguai">Residência e cédula no Paraguai <span>→</span></button>
        <button type="button" data-obj="Abrir empresa / conta / RUC">Abrir empresa, conta ou RUC <span>→</span></button>
        <button type="button" data-obj="Dolarização e diversificação patrimonial">Dolarização e proteção patrimonial <span>→</span></button>
        <button type="button" data-obj="Mentoria Empresarial">Mentoria empresarial com o Rafael <span>→</span></button>
        <button type="button" data-obj="Imóveis no Paraguai">Imóveis no Paraguai <span>→</span></button>
        <button type="button" data-obj="Outro assunto">Ainda estou avaliando <span>→</span></button>
      </div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap faq-grid">
    <div><p class="rotulo">Perguntas frequentes</p><h2>Antes de começar.</h2></div>
    <div class="faq">
        ${faqHtml([
    ...FAQ_GERAL,
    ['Qual plano é o certo para mim?', 'O Básico Expresso resolve a residência e a cédula. O Executive acrescenta RUC, carteira de motorista, conta bancária e linha telefônica. O Signature soma hospedagem de alto padrão, LLC nos EUA e internacionalização bancária. Na conversa, indicamos o melhor para o seu caso.'],
    ['Preciso ir a Assunção?', 'Sim, a residência exige presença física no Paraguai. São 3 vindas no Básico e 2 vindas no Básico Expresso, no Executive e no Signature. Todo o resto, como a preparação e o apostilamento dos documentos, é feito à distância, no Brasil, com a nossa equipe.'],
    ['Por que a Mentoria de estrutura é paga?', 'Porque é uma consultoria individual de 1 hora com o Rafael, focada no seu caso: objetivo, família, patrimônio e negócios. Você sai com o caminho definido e sabendo o que fazer primeiro. Custa R$ 1.000 por pessoa ou R$ 2.000 para até 3 pessoas.'],
    ['Quanto tempo leva?', 'No Básico, de 6 a 8 meses. No Básico Expresso e no Executive, cerca de 90 dias. No Signature, o prazo é definido no atendimento. Os prazos são estimados e dependem da fila dos órgãos paraguaios.'],
    ['Qual regime de residência vocês usam?', 'A residência temporária, prevista na Lei de Migração do Paraguai. É o caminho legal para brasileiros, com cédula paraguaia, e depois pode ser convertida em residência permanente.'],
    ['A residência muda a minha situação fiscal no Brasil?', 'Não automaticamente. Residência migratória e residência fiscal são coisas diferentes. A saída fiscal do Brasil exige análise de um contador ou tributarista. No Signature, ela está incluída como cortesia.'],
    ['Vocês garantem a aprovação?', 'A decisão final é sempre dos órgãos paraguaios, então nenhuma empresa séria pode garantir aprovação. O que garantimos é a documentação correta, a análise do seu caso antes de começar e o acompanhamento da nossa equipe do início ao fim.'],
  ])}
    </div>
  </div>
</section>
${cta({ titulo: 'Planeje o próximo capítulo com quem <span class="ouro">já fez a mudança.</span>', texto: 'Responda a pré-inscrição e fale com a nossa equipe no WhatsApp.' })}
${rodape()}
<script>
  // Escolha rápida: abre a pré-inscrição já com o objetivo marcado
  document.getElementById('opcoes').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (window.leadGate) window.leadGate.abre(${JSON.stringify(WA)}, 'Home: ' + b.dataset.obj, '', { objetivo: b.dataset.obj });
    else window.open(${JSON.stringify(WA)}, '_blank', 'noopener');
  });
  // Vídeos: tocam sem som na tela, o toque liga o som (e desliga os outros)
  (function () {
    var cx = document.querySelectorAll('.video-cx');
    cx.forEach(function (c) {
      var v = c.querySelector('video');
      c.addEventListener('click', function () {
        var ligar = v.muted;
        cx.forEach(function (o) { o.querySelector('video').muted = true; o.classList.remove('com-som'); });
        if (ligar) { v.muted = false; c.classList.add('com-som'); }
        var t = v.play(); if (t && t.catch) t.catch(function () {});
      });
    });
    if (!('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target.querySelector('video');
        if (e.isIntersecting) { var t = v.play(); if (t && t.catch) t.catch(function () {}); } else v.pause();
      });
    }, { threshold: 0.4 });
    cx.forEach(function (c) { obs.observe(c); });
  })();
</script>${SCRIPTS}`;
}

// ───────────── Página de plano ─────────────

function heroPlano(p, total) {
  const metas = `<div class="ph-meta"><div><b>${p.prazo}</b><span>prazo estimado</span></div><div><b>${p.vindas}</b><span>ao Paraguai</span></div><div><b>${total} itens</b><span>inclusos</span></div></div>`;
  const ver = `<a class="capa-link" href="#inclusos">Ver o que está incluso <span aria-hidden="true">→</span></a>`;
  if (p.slug.startsWith('basico')) return `
<section class="ph ph-basico">
  <svg class="capa-ceu" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path id="rotaB" d="M-60 470 C 260 520, 380 300, 600 330 S 960 140, 1260 90" fill="none" stroke="#b98a3c" stroke-opacity=".4" stroke-width="1.6" stroke-dasharray="3 9" stroke-linecap="round"/>
    <g><path transform="scale(1.3)" d="M14 0 L4 -2 L-3 -10 L-6 -10 L-2 -2 L-9 -1.5 L-12 -5 L-14 -5 L-12 0 L-14 5 L-12 5 L-9 1.5 L-2 2 L-6 10 L-3 10 L4 2 Z" fill="#140d07"/><animateMotion dur="14s" repeatCount="indefinite" rotate="auto"><mpath href="#rotaB"/></animateMotion></g>
  </svg>
  <div class="wrap ph-centro">
    <p class="ph-marca" aria-hidden="true">${p.tag}</p>
    <p class="rotulo">Plano ${p.nome}</p>
    <h1>Sua residência no Paraguai, <em>sem rodeios.</em></h1>
    <p class="sub">${p.sub}</p>
    <div class="ph-faixa">
      <div class="ph-faixa-preco"><small>À vista, por pessoa</small><b>${p.preco}</b>${p.parc ? `<small>ou ${p.parc} em 20% + 6x</small>` : ''}</div>
      <div><b>${p.prazo}</b><span>prazo estimado</span></div>
      <div><b>${p.vindas}</b><span>ao Paraguai</span></div>
      ${btnPlano(p)}
    </div>
    ${ver}
  </div>
</section>`;
  if (p.slug === 'executive') {
    const chips = [['ruc', 'RUC'], ['cnh', 'Carteira de motorista'], ['conta', 'Conta bancária'], ['aeroporto', 'Recepção no aeroporto']];
    return `
<section class="ph ph-exec">
  <div class="wrap ph-duas">
    <div class="ph-txt">
      <p class="rotulo">Plano ${p.nome} · O mais escolhido</p>
      <h1>Sua vida no Paraguai, <em>estruturada de ponta a ponta.</em></h1>
      <p class="sub">${p.sub}</p>
      ${metas}
      <div class="acoes">${btnPlano(p)}${ver}</div>
    </div>
    <div class="ph-arco">
      <img src="/pg-preview-branca/assets/site/${p.foto}" alt="${p.fotoAlt}" fetchpriority="high" />
      ${chips.map(([k, t], i) => `<span class="ph-chip c${i}">${I[ITENS[k][0]]}${t}</span>`).join('')}
      <div class="ph-preco-flut"><small>À vista, por pessoa</small><b>${p.preco}</b></div>
    </div>
  </div>
</section>`;
  }
  return `
<section class="ph ph-sig">
  <div class="wrap ph-duas">
    <div class="ph-txt">
      <p class="rotulo">Plano ${p.nome} · Experiência completa</p>
      <h1>A estrutura completa, <em>feita sob medida.</em></h1>
      <p class="sub">${p.sub}</p>
      <div class="acoes">${ver}</div>
    </div>
    <div class="ph-convite">
      <img src="/pg-preview-branca/assets/site/${p.foto}" alt="${p.fotoAlt}" fetchpriority="high" />
      <div class="convite">
        <p class="convite-marca">Signature</p>
        <p class="convite-de">De <s>${p.de}</s> por</p>
        <p class="convite-preco">${p.preco}</p>
        <p class="convite-nota">à vista, por pessoa</p>
        <ul>${p.itens.map(k => `<li>${ITENS[k][1]}</li>`).join('')}<li>Tudo do Executive</li></ul>
        ${btnPlano(p)}
      </div>
    </div>
  </div>
</section>`;
}

function paginaPlano(p) {
  const idx = PLANOS.indexOf(p);
  const outros = PLANOS.filter(o => o !== p);
  const itemHtml = (k, extra) => {
    const [ic, t, d] = ITENS[k];
    return `<div class="item"><div class="icone">${I[ic]}</div><div><h3>${t}${extra ? '<span class="selo-extra">Exclusivo Signature</span>' : ''}</h3><p>${d}</p></div></div>`;
  };
  const inclusos = p.base
    ? p.itens.map(k => itemHtml(k, true)).join('\n') + '\n' + p.base.map(k => itemHtml(k)).join('\n')
    : p.itens.map(k => itemHtml(k)).join('\n');
  const total = p.itens.length + (p.base ? p.base.length : 0);
  const col = i => PLANOS[i].nome;
  const cel = (v, i) => `<td class="${i === idx ? 'atual' : ''}">${v ? '<span class="sim">✓</span>' : '<span class="nao">—</span>'}</td>`;

  return `${head({
    titulo: `Plano ${p.nome} · Paraguai Global Group`,
    descricao: `Plano ${p.nome}: ${p.resumo} ${p.preco} por pessoa, prazo ${p.prazo.toLowerCase()}. Equipe brasileira em Assunção, 100% dentro da lei.`,
    url: `https://paraguaiglobalgroup.com/planos/${p.slug}/`,
  })}
  <script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Service', name: `Plano ${p.nome}`, description: p.resumo,
    provider: { '@type': 'ProfessionalService', name: 'Paraguai Global Group', url: 'https://paraguaiglobalgroup.com/' },
    areaServed: 'PY', offers: { '@type': 'Offer', priceCurrency: 'USD', price: p.preco.replace(/[^\d]/g, '') },
  })}
  </script>
</head>
<body class="home">
${topo(p.slug)}

<div class="wrap migalha"><a href="/pg-preview-branca/">Início</a> / <a href="/pg-preview-branca/#planos">Planos</a> / ${p.nome}</div>

${heroPlano(p, total)}

<section class="sec" style="padding-bottom:40px">
  <div class="wrap">
    <div class="cabeca"><div><p class="rotulo">Para quem é</p><h2>Feito para quem…</h2></div><p>${p.resumo}</p></div>
    <div class="grade g3">
      ${p.paraQuem.map(([ic, t, d]) => `<div class="cartao"><div class="icone">${I[ic]}</div><h3>${t}</h3><p>${d}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="sec" id="inclusos" style="padding-top:40px">
  <div class="wrap duas">
    <div class="fixo">
      <p class="rotulo">O que está incluso</p>
      <h2>${p.base ? 'Tudo do Executive, e muito mais.' : 'Cada item, explicado.'}</h2>
      <p>${p.base ? 'Os itens exclusivos do Signature vêm primeiro. Abaixo deles, tudo o que já faz parte do Executive.' : 'Sem letras miúdas: veja o que cada item resolve para você no Paraguai.'}</p>
      <figure class="foto"><img src="/pg-preview-branca/assets/site/${p.foto}" alt="${p.fotoAlt}" loading="lazy" /><figcaption>Assunção · Paraguai</figcaption></figure>
    </div>
    <div class="cartao">
${inclusos}
    </div>
  </div>
</section>

<section class="sec sec-ice">
  <div class="wrap">
    <div class="cabeca"><div><p class="rotulo">Como funciona</p><h2>Do primeiro contato à entrega.</h2></div><p>${p.vindasTxt}</p></div>
    <div class="grade g4">
      <div class="cartao etapa"><span class="num">01</span><h3>Pré-inscrição</h3><p>Você responde algumas perguntas rápidas e fala com a equipe no WhatsApp.</p></div>
      <div class="cartao etapa"><span class="num">02</span><h3>Proposta</h3><p>Confirmamos o plano, montamos a proposta (inclusive para a família) e as condições de pagamento.</p></div>
      <div class="cartao etapa"><span class="num">03</span><h3>Documentos</h3><p>Você separa os documentos da lista abaixo. O apostilamento fica com a gente.</p></div>
      <div class="cartao etapa"><span class="num">04</span><h3>${p.vindas} a Assunção</h3><p>${p.base ? 'Hospedagem de alto padrão, motorista e agente bilíngue.' : p.slug === 'executive' ? 'Recepção no aeroporto, agenda pronta e acompanhamento da equipe.' : 'Agenda pronta, motorista particular e agente bilíngue.'} Prazo: ${p.prazo.toLowerCase()}.</p></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="cabeca"><div><p class="rotulo">Documentos necessários</p><h2>O que você vai separar no Brasil.</h2></div><p>Organização, agilidade e segurança em cada etapa. Depois da proposta, a equipe te passa a lista completa para o seu caso.</p></div>
    <div class="grade g3 docs">
      ${DOCUMENTOS.map(([ic, t, d]) => `<div class="cartao"><div class="icone">${I[ic]}</div><div><h3>${t}</h3><p>${d}</p></div></div>`).join('\n      ')}
      <div class="cartao" style="background:var(--ice)"><div class="icone">${I.selo}</div><div><h3>Apostilamento incluso</h3><p>Certidões e antecedentes precisam do apostilamento de Haia. Isso já faz parte do plano.</p></div></div>
    </div>
  </div>
</section>

<section class="sec sec-ice">
  <div class="wrap">
    <div class="cabeca"><div><p class="rotulo">Comparativo</p><h2>${p.nome} lado a lado com os outros planos.</h2></div><p>Para você ter certeza de que está escolhendo o plano certo.</p></div>
    <div class="rolagem">
      <table class="tabela">
        <thead><tr><th></th>${PLANOS.map((_, i) => `<th class="${i === idx ? 'atual' : ''}">${col(i)}</th>`).join('')}</tr></thead>
        <tbody>
          ${COMPARA.map(([r, ...v]) => `<tr><td>${r}</td>${v.map(cel).join('')}</tr>`).join('\n          ')}
          <tr><td>Prazo estimado</td>${PLANOS.map((o, i) => `<td class="${i === idx ? 'atual' : ''}">${o.prazo}</td>`).join('')}</tr>
          <tr><td>Investimento por pessoa</td>${PLANOS.map((o, i) => `<td class="${i === idx ? 'atual' : ''}"><b>${o.preco}</b></td>`).join('')}</tr>
        </tbody>
      </table>
    </div>
    <div class="outros" style="margin-top:22px">
      ${outros.map(o => `<a class="cartao" href="/pg-preview-branca/planos/${o.slug}/"><div><p class="rotulo" style="margin-bottom:8px">Plano ${o.tag.toLowerCase()}</p><h3>${o.nome}</h3><p style="color:var(--muted);font-size:14.5px;margin-top:6px">${o.resumo}</p></div><div style="text-align:right"><div class="preco">${o.preco}</div><span class="seta">Ver plano →</span></div></a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap faq-grid">
    <div><p class="rotulo">Perguntas frequentes</p><h2>Dúvidas sobre o ${p.nome}.</h2></div>
    <div class="faq">
        ${faqHtml([...p.faq, ...FAQ_GERAL])}
    </div>
  </div>
</section>
${cta({ rotulo: `Plano ${p.nome}`, titulo: `Pronto para começar <span class="ouro">o seu ${p.nome}?</span>`, texto: `${p.de ? `De ${p.de} por ` : ''}${p.preco} à vista, por pessoa. Responda a pré-inscrição e fale com a equipe no WhatsApp.`, href: waPlano(p.nome), produto: p.produto })}
${rodape()}${SCRIPTS}`;
}


function sobre() {
  const cap = (n, rot, tit, corpo, extra = '') => `<article class="bx-cap sobe">
      <div class="bx-cap-n"><span>${n}</span><p>${rot}</p></div>
      <div class="bx-cap-c"><h2>${tit}</h2>${corpo}${extra}</div>
    </article>`;
  const ps = arr => arr.map(t => `<p>${t}</p>`).join('');
  return `${head({ titulo: 'Dr. Rafael Lorenzatto | Paraguai Global Group', descricao: 'Dr. Rafael Lorenzatto: nutricionista especialista em nutrição esportiva, empresário, CEO & Founder da Paraguay Global Group, mentor de negócios e palestrante. Brasil, Paraguai e Estados Unidos.', url: 'https://paraguaiglobalgroup.com/sobre/' })}
</head>
<body class="home">
${topo('sobre')}

<section class="capa capa-banner bx-capa">
  <div class="wrap capa-in">
    <div class="capa-txt">
      <p class="rotulo">Brasil • Paraguai • Estados Unidos</p>
      <h1>Dr. Rafael Lorenzatto <em>Da alta performance no esporte à liderança empresarial internacional.</em></h1>
      <p class="bx-esp">Nutricionista Especialista em Nutrição Esportiva | Especialista em Formulações Magistrais e Produtos Manipulados | Empresário | CEO &amp; Founder | Mentor de Negócios | Palestrante | Especialista em Internacionalização de Negócios</p>
      <div class="acoes">
        <a class="btn btn-verde" href="/pg-preview-branca/#formulario">${I.zap}Faça sua pré-inscrição</a>
        <a class="capa-link" href="#trajetoria">Conheça a trajetória <span aria-hidden="true">→</span></a>
      </div>
      <img class="capa-mob" src="/pg-preview-branca/assets/site/capa-branca-mob.jpg?v=2" alt="Dr. Rafael Lorenzatto" />
    </div>
  </div>
</section>

<section class="bx-faixa">
  <div class="wrap bx-faixa-in">
    <div><b>25+</b><span>anos de experiência</span></div>
    <div><b>~3 mi</b><span>de seguidores</span></div>
    <div><b>8</b><span>operações digitais</span></div>
    <div><b>3</b><span>países: Brasil, Paraguai e EUA</span></div>
  </div>
</section>

<section class="sec bx-sec" id="trajetoria">
  <div class="wrap bx-wrap">
    <p class="rotulo bx-abre">A trajetória</p>

    ${cap('01', 'O esporte', 'Uma trajetória de mais de 25 anos construída com disciplina, conhecimento e visão empreendedora', ps([
      'A história do Dr. Rafael Lorenzatto começou muito antes da transformação digital e da ascensão das redes sociais.',
      'Desde a infância, o esporte fez parte de sua formação. Aos 15 anos, foi selecionado para atuar no basquete competitivo, construindo uma trajetória esportiva que passou por dois clubes mineiros e um clube carioca.',
      'A vivência nas quadras desenvolveu características que se tornariam fundamentais ao longo de sua vida: disciplina, liderança, resiliência, competitividade e busca constante pela excelência.',
      'Foi justamente a paixão pelo esporte e pelo desempenho humano que o levou a escolher a nutrição esportiva como profissão.',
      'Com mais de 25 anos de experiência na área, Rafael construiu uma carreira dedicada à saúde, à transformação corporal, ao desempenho físico e à qualidade de vida.',
      'Sua trajetória representa a evolução de um profissional que transformou conhecimento técnico em marcas, empresas e oportunidades de negócios internacionais.']))}

    ${cap('02', 'A nutrição', 'Formação profissional e autoridade em nutrição esportiva', ps([
      'Nutricionista com pós-graduação em Nutrição Esportiva, Rafael Lorenzatto desenvolveu sua atuação profissional com foco em performance física, composição corporal, estratégias nutricionais e saúde.',
      'Ao longo de sua carreira, aprofundou sua experiência no segmento de formulações magistrais, produtos manipulados e suplementação personalizada, conectando a ciência da nutrição às necessidades individuais de seus pacientes e consumidores.',
      'Sua atuação nesse mercado também se expandiu para o desenvolvimento e a comercialização de produtos próprios, em parceria com estruturas especializadas do setor farmacêutico.',
      'Esse conhecimento se tornou um dos pilares de sua trajetória empresarial, permitindo unir experiência profissional, desenvolvimento de produtos, posicionamento de marcas e comercialização.']),
      '<blockquote class="bx-cita">Mais do que construir uma carreira na nutrição, Rafael passou a transformar sua experiência em soluções, produtos e negócios.</blockquote>')}

    ${cap('03', 'A televisão', 'Da televisão à projeção nacional', ps([
      'A participação no reality show de sobrevivência <b>No Limite</b>, da Rede Globo de Televisão, representou um marco importante em sua trajetória pública.',
      'A experiência ampliou sua visibilidade nacional e fortaleceu sua imagem como uma personalidade associada à determinação, à resistência física e à superação de desafios.',
      'Sua vivência no esporte, na televisão e no empreendedorismo também contribuiu para sua atuação como palestrante motivacional, compartilhando experiências relacionadas à disciplina, à liderança e à transformação pessoal.']))}

    ${cap('04', 'O digital', 'A pandemia e a construção de uma audiência milionária', ps([
      'Durante a pandemia, Rafael intensificou sua atuação nas redes sociais, compartilhando gratuitamente conteúdos sobre nutrição, alimentação saudável, transformação física e qualidade de vida.',
      'Em um momento em que milhões de pessoas buscavam orientação para melhorar seus hábitos, encontrou no ambiente digital uma maneira de ampliar o alcance de seu conhecimento.',
      'Sua comunicação direta, associada à experiência profissional, contribuiu para a construção de uma comunidade que ultrapassou as fronteiras de sua atuação presencial.',
      'Atualmente, Rafael Lorenzatto acumula aproximadamente <b>3 milhões de seguidores</b>, distribuídos entre Instagram, Facebook, YouTube, TikTok e Kwai.',
      'Sua presença digital consolidou sua imagem no segmento de nutrição, saúde, fitness e estilo de vida.']))}

    ${cap('05', 'O empreendedorismo', 'Do conhecimento ao empreendedorismo digital', ps([
      'O crescimento de sua audiência abriu caminho para uma nova fase profissional.',
      'Rafael estruturou <b>oito operações no mercado digital</b>, desenvolvendo produtos, programas, lançamentos e estratégias comerciais.',
      'Ao longo dessa trajetória, suas operações alcançaram resultados de faturamento de <b>múltiplos sete dígitos</b>, consolidando sua experiência em posicionamento de marcas, comunicação, desenvolvimento comercial e gestão empresarial.',
      'Paralelamente, fortaleceu sua atuação no mercado físico por meio de marcas e produtos ligados à suplementação e às farmácias de manipulação.',
      'Com mais de cinco anos de atuação comercial nesse segmento, desenvolveu um portfólio próprio, conectando conhecimento técnico, produtos manipulados, experiência do consumidor e gestão de negócios.',
      'Sua trajetória empresarial passou a reunir operações físicas e digitais, construção de marcas, desenvolvimento de produtos e expansão comercial.']))}

    ${cap('06', 'A liderança', 'CEO, empresário, mentor de negócios e palestrante', ps([
      'Com experiência acumulada em diferentes segmentos, Rafael ampliou sua atuação para a liderança empresarial, a mentoria de negócios e as palestras.',
      'Sua trajetória reúne conhecimento técnico, experiência comercial, comunicação em grande escala e desenvolvimento de operações empresariais.',
      'Como mentor, compartilha conhecimentos relacionados ao empreendedorismo, posicionamento, construção de marcas, desenvolvimento comercial e expansão de negócios.',
      'Como palestrante, conecta sua história no esporte, na televisão e no mundo empresarial para abordar temas como disciplina, liderança, mentalidade, superação e transformação.',
      'Sua experiência demonstra a importância de unir conhecimento, execução e capacidade de adaptação para construir negócios ao longo do tempo.']))}
  </div>
</section>

<section class="sec bx-paises">
  <div class="wrap">
    <div class="cabeca"><div><p class="rotulo">07 · A internacionalização</p><h2 class="bx-h">Expansão internacional: <em>Brasil, Paraguai e Estados Unidos</em></h2></div>
    <div>${ps([
      'Após consolidar sua trajetória profissional e empresarial no Brasil, Rafael iniciou uma nova etapa voltada à internacionalização de negócios.',
      'Estabeleceu residência no Paraguai e ampliou sua presença empresarial para os Estados Unidos, com estrutura societária por meio de uma LLC constituída em Delaware.',
      'Essa expansão representa a continuidade de sua visão empreendedora, conectando três mercados e diferentes oportunidades de desenvolvimento empresarial.'])}</div></div>
    <div class="bx-tres">
      <div class="bx-pais"><span class="bx-band" aria-hidden="true">🇧🇷</span><h3>Brasil</h3><p>Origem de sua carreira profissional, construção de marcas, operações digitais, produtos físicos e consolidação de sua audiência.</p></div>
      <div class="bx-pais"><span class="bx-band" aria-hidden="true">🇵🇾</span><h3>Paraguai</h3><p>Residência, presença empresarial, estrutura física, documentação, serviços bancários e desenvolvimento de soluções para brasileiros e empresas.</p></div>
      <div class="bx-pais"><span class="bx-band" aria-hidden="true">🇺🇸</span><h3>Estados Unidos</h3><p>Presença societária por meio de LLC em Delaware, ampliando sua estrutura empresarial internacional.</p></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="escuro bx-pgg">
      <div class="bx-pgg-top">
        <p class="rotulo">08 · Fundador e CEO</p>
        <h2>Paraguay Global Group: <span class="ouro">fundador e CEO</span></h2>
        <p>Como empresário, fundador e CEO da Paraguay Global Group, Rafael Lorenzatto lidera uma operação voltada à internacionalização de negócios, estruturação empresarial e soluções para brasileiros que desejam estabelecer presença no Paraguai.</p>
        <p>A atuação da empresa contempla <b>mais de 30 soluções e serviços</b>, incluindo:</p>
      </div>
      <ul class="bx-serv">
        <li><b>Residência no Paraguai</b>Orientação e suporte em processos de residência legal, migração e regularização documental.</li>
        <li><b>Documentação paraguaia</b>Processos relacionados à cédula de identidade, RUC, registros e documentação necessária para pessoas físicas e empresas.</li>
        <li><b>Estruturação bancária</b>Suporte para abertura de contas pessoais e empresariais, relacionamento bancário e organização de estruturas financeiras internacionais.</li>
        <li><b>Estruturação imobiliária</b>Apoio em processos de aquisição, locação e organização de imóveis residenciais e comerciais, com profissionais e parceiros habilitados.</li>
        <li><b>Abertura e estruturação de empresas</b>Suporte documental, societário e operacional para empresários que desejam estabelecer atividades no Paraguai.</li>
        <li><b>Internacionalização de negócios</b>Soluções para expansão empresarial conectando Brasil, Paraguai e Estados Unidos.</li>
        <li><b>Organização patrimonial</b>Apoio à estruturação e ao planejamento patrimonial internacional, em conjunto com profissionais especializados nas áreas jurídica, contábil e tributária.</li>
        <li><b>Atendimento executivo e concierge</b>Acompanhamento personalizado para empresários e famílias durante os processos de instalação e adaptação no Paraguai.</li>
      </ul>
      <div class="bx-pgg-pe">
        <p>Com sede operacional em Assunção, no complexo empresarial <b>Sky Park</b>, na Avenida Aviadores del Chaco, a operação dispõe de escritório com <b>mais de 100 metros quadrados</b> e equipe multidisciplinar composta por <b>mais de 12 profissionais</b>.</p>
        <p>A estrutura empresarial também se conecta à atuação internacional nos Estados Unidos, por meio de uma LLC em Delaware.</p>
        <p>A proposta da Paraguay Global Group é oferecer suporte organizado e especializado a pessoas e empresas que buscam desenvolver sua presença internacional com planejamento e segurança jurídica.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec bx-sec">
  <div class="wrap bx-wrap">
    ${cap('09', 'Paraguay Capital', 'Paraguay Capital e a expansão dos serviços', ps([
      'A atuação empresarial de Rafael no Paraguai também contempla a Paraguay Capital, direcionada a soluções de documentação, residência, atendimento executivo e suporte aos processos de estabelecimento no país.',
      'A integração entre as diferentes frentes de negócio permite atender necessidades que vão desde os primeiros procedimentos documentais até demandas mais amplas de estruturação empresarial e internacionalização.',
      'Essa atuação reúne experiência empreendedora, presença física no Paraguai e uma rede multidisciplinar de profissionais e parceiros.']))}

    ${cap('10', 'Família e legado', 'A família Lorenzatto e a construção de um legado', ps([
      'A trajetória de Rafael também é marcada pela importância da família e pela busca de crescimento com planejamento de longo prazo.',
      'Ao lado de sua esposa e família, desenvolve uma nova etapa de vida e negócios no Paraguai, com atuação internacional e foco na continuidade de suas atividades empresariais.',
      'Sua visão envolve diversificação patrimonial, organização empresarial, estruturas internacionais, desenvolvimento de ativos e planejamento para as próximas gerações.']),
      '<blockquote class="bx-cita">Mais do que alcançar resultados financeiros, seu objetivo é construir negócios consistentes, ampliar oportunidades e estabelecer um legado familiar.</blockquote>')}
  </div>
</section>

<section class="sec sec-ice">
  <div class="wrap">
    <div class="cabeca"><div><p class="rotulo">Rafael Lorenzatto em números</p><h2 class="bx-h">Uma carreira <em>que se mede em resultados.</em></h2></div></div>
    <div class="bx-nums">
      <div><b>25+</b><span>Mais de 25 anos de experiência profissional.</span></div>
      <div><b>15</b><span>Trajetória esportiva iniciada aos 15 anos.</span></div>
      <div><b>3</b><span>Passagem por três clubes de basquete, sendo dois mineiros e um carioca.</span></div>
      <div><b>Globo</b><span>Participação em reality show da Rede Globo.</span></div>
      <div><b>~3 mi</b><span>Aproximadamente 3 milhões de seguidores nas redes sociais.</span></div>
      <div><b>8</b><span>Oito operações digitais.</span></div>
      <div><b>7 dígitos</b><span>Lançamentos com faturamentos de múltiplos sete dígitos.</span></div>
      <div><b>5+</b><span>Mais de cinco anos de atuação comercial no segmento de produtos manipulados.</span></div>
      <div><b>3 países</b><span>Presença empresarial no Brasil, Paraguai e Estados Unidos.</span></div>
      <div><b>30+</b><span>Mais de 30 soluções e serviços de internacionalização.</span></div>
      <div><b>12+</b><span>Equipe multidisciplinar com mais de 12 profissionais.</span></div>
      <div><b>100 m²</b><span>Escritório de mais de 100 m² em Assunção, Paraguai.</span></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap bx-redes-wrap">
    <div>
      <p class="rotulo">Presença digital</p>
      <h2 class="bx-h">Acompanhe <em>o Rafael.</em></h2>
      <p class="bx-redes-txt">Instagram pessoal: @rafaolorenzatto · Paraguay Capital: @paraguaicapitalbr · Paraguay Global Group: @paraguaiglobal · Demais plataformas: Facebook, YouTube, TikTok e Kwai. Audiência total informada: aproximadamente 3 milhões de seguidores.</p>
    </div>
    <div class="bx-redes">
      <a href="https://instagram.com/rafaolorenzatto" target="_blank" rel="noreferrer"><small>Instagram pessoal</small>@rafaolorenzatto</a>
      <a href="https://www.instagram.com/paraguaicapitalbr/" target="_blank" rel="noreferrer"><small>Paraguay Capital</small>@paraguaicapitalbr</a>
      <a href="https://instagram.com/paraguaiglobal" target="_blank" rel="noreferrer"><small>Paraguay Global Group</small>@paraguaiglobal</a>
      <a href="https://www.youtube.com/@rafaolorenzatto" target="_blank" rel="noreferrer"><small>YouTube</small>@rafaolorenzatto</a>
      <a href="https://www.facebook.com/rafaolorenzatto" target="_blank" rel="noreferrer"><small>Facebook</small>rafaolorenzatto</a>
      <a href="https://www.tiktok.com/@rafaellorenzatto" target="_blank" rel="noreferrer"><small>TikTok</small>@rafaellorenzatto</a>
    </div>
  </div>
</section>

<section class="bx-final">
  <div class="wrap">
    <p class="rotulo">Uma história que continua sendo construída</p>
    <div class="bx-seq">
      <p>O esporte ensinou <em>a disciplina.</em></p>
      <p>A nutrição trouxe <em>o conhecimento.</em></p>
      <p>A televisão ampliou <em>a visibilidade.</em></p>
      <p>O digital multiplicou <em>as oportunidades.</em></p>
      <p>O empreendedorismo consolidou <em>os negócios.</em></p>
      <p>A internacionalização abriu <em>novos mercados.</em></p>
    </div>
    <p class="bx-assina">Dr. Rafael Lorenzatto. Da alta performance no esporte à alta performance nos negócios.</p>
    <p class="bx-tags">CEO &amp; Founder | Nutrição Esportiva | Produtos Manipulados | Empreendedorismo | Mentoria | Palestras | Internacionalização de Negócios</p>
    <p class="bx-paises-l">BRASIL • PARAGUAI • ESTADOS UNIDOS</p>
    <div class="acoes bx-final-acoes">
      <a class="btn btn-verde" href="/pg-preview-branca/#formulario">${I.zap}Faça sua pré-inscrição</a>
      <a class="bx-final-link" href="${WA}" target="_blank" rel="noreferrer">Falar com a equipe no WhatsApp →</a>
    </div>
  </div>
</section>

${rodape()}${SCRIPTS}`;
}

// ───────────── Escrita ─────────────
fs.writeFileSync(path.join(RAIZ, 'index.html'), home());
for (const p of PLANOS) {
  const dir = path.join(RAIZ, 'planos', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), paginaPlano(p));
}
fs.writeFileSync(path.join(RAIZ, 'sobre', 'index.html'), sobre());
console.log('ok: sobre + index.html +', PLANOS.map(p => 'planos/' + p.slug).join(', '));
