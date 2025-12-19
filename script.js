/* LÓGICA DE LOGIN COM SEPARAÇÃO DE CARGO */
function fazerLogin() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-senha').value;
    
    // Busca usuário no banco de dados local
    const users = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    const user = users.find(u => u.email === email && u.senha === pass);

    if (user) {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
        carregarDashboard(user); // Carrega o dashboard real do usuário
    } else {
        alert("E-mail ou senha incorretos.");
    }
}

function carregarDashboard(u) {
    document.getElementById('user-name-display').innerText = u.nome;
    document.getElementById('user-role-badge').innerText = u.cargo;
    const m = document.getElementById('menu-dinamico');
    
    // Menu Comum
    m.innerHTML = `<li onclick="mudarTela('home')">INÍCIO</li><li onclick="mudarTela('acolhidos')">ACOLHIDOS</li>`;
    
    // Menu Específico por Cargo
    if (u.cargo === 'educador') {
        m.innerHTML += `<li onclick="mudarTela('diario')">DIÁRIO</li><li onclick="mudarTela('atividades')">ESCALAS</li><li onclick="mudarTela('plantao')">PLANTÃO</li>`;
    } 
    else if (u.cargo === 'psicologa') {
        m.innerHTML += `<li onclick="mudarTela('psi-clinico')">EVOLUÇÃO (RDC 29)</li>`;
    } 
    else if (u.cargo === 'social') {
        m.innerHTML += `<li onclick="mudarTela('social-anamnese')">ANAMNESE SOCIAL</li><li onclick="mudarTela('social-docs')">DOCUMENTAÇÃO</li>`;
    } 
    else if (u.cargo === 'admin') {
        m.innerHTML += `<li onclick="mudarTela('atividades')">ESCALAS</li><li onclick="mudarTela('psi-clinico')">PSICOLOGIA</li><li onclick="mudarTela('admin-equipe')">EQUIPE</li>`;
    }
    
    carregarDadosBase();
}

function mudarTela(t) {
    document.querySelectorAll('.view-section').forEach(x => x.style.display = 'none');
    const target = document.getElementById('view-' + t);
    if(target) target.style.display = 'block';
    if(t === 'atividades') mostrarSubAtividade('refeicao');
    if(t === 'psi-clinico') carregarSelectAcolhidos('psi-acolhido-select');
    if(t === 'social-anamnese') carregarSelectAcolhidos('ana-acolhido-select');
}

/* GERAÇÃO DA FOLHA RDC 29 */
function gerarEvolucaoOficial() {
    const nome = document.getElementById('psi-acolhido-select').value;
    const relato = document.getElementById('psi-relato').value;
    if(!relato) return alert("Digite o relato antes de gerar!");

    document.getElementById('print-nome-acolhido').innerText = nome.toUpperCase();
    const tabela = document.getElementById('tabela-linhas-evolucao');
    let html = `<tr><td>${new Date().toLocaleDateString()}</td><td>${relato}</td></tr>`;
    for(let i=0; i<20; i++) html += `<tr><td></td><td></td></tr>`;
    tabela.innerHTML = html;
    window.print();
}

/* ESCALAS (MODELO FOTOS 1, 7, 8) */
function mostrarSubAtividade(aba) {
    document.getElementById('sub-atv-refeicao').style.display = (aba === 'refeicao') ? 'block' : 'none';
    document.getElementById('sub-atv-limpeza').style.display = (aba === 'limpeza') ? 'block' : 'none';
    if(aba === 'refeicao') carregarFormRefeicao();
    if(aba === 'limpeza') carregarFormLimpeza();
}

function carregarFormRefeicao() {
    const acs = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const opt = acs.map(a => `<option>${a.nome}</option>`).join('');
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    let h = `<div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:5px; font-size:11px;"><b>DIA</b><b>ALMOÇO</b><b>APOIO</b><b>JANTAR</b><b>APOIO</b>`;
    dias.forEach(d => h += `<div>${d}</div>` + Array(4).fill(0).map((_,i) => `<select id="ref-${d}-${i}">${opt}</select>`).join(''));
    document.getElementById('form-escala-refeicao').innerHTML = h + `</div>`;
}

function gerarTabelaRefeicao() {
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    let r = dias.map(d => `<tr><td>${d}</td><td>${document.getElementById(`ref-${d}-0`).value}</td><td>${document.getElementById(`ref-${d}-1`).value}</td><td>${document.getElementById(`ref-${d}-2`).value}</td><td>${document.getElementById(`ref-${d}-3`).value}</td></tr>`).join('');
    document.getElementById('area-impressao-escala').innerHTML = `<table class="tabela-escala"><thead><tr class="azul-header"><th colspan="5">PREPARO DAS REFEIÇÕES DIÁRIAS</th></tr><tr class="amarelo-header"><th>DIA</th><th>ALMOÇO</th><th>APOIO</th><th>JANTAR</th><th>APOIO</th></tr></thead><tbody>${r}</tbody></table><div class="footer-print"><p>SE NO DIA DA SUA ESCALA VOCÊ NÃO ESTIVER OU NÃO PUDER, COMUNIQUE UM COLEGA E PEÇA A TROCA DO DIA.</p></div>`;
}

/* OUTRAS FUNÇÕES */
function carregarSelectAcolhidos(id) {
    const acs = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const el = document.getElementById(id);
    if(el) el.innerHTML = acs.map(x => `<option>${x.nome}</option>`).join('');
}

function carregarDadosBase() {
    const acs = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('lista-acolhidos-tabela').innerHTML = acs.map(x => `<tr><td>${x.nome}</td><td>${x.idade}</td><td>${x.droga}</td><td>Ativo</td></tr>`).join('');
}

function salvarAcolhido() {
    const ac = { nome: document.getElementById('ac-nome').value, idade: document.getElementById('ac-idade').value, droga: document.getElementById('ac-droga').value };
    let l = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    l.push(ac); localStorage.setItem('acolhidos-ct', JSON.stringify(l)); location.reload();
}

function cadastrarProfissional() {
    const n = document.getElementById('cad-nome').value, c = document.getElementById('cad-cargo').value, e = document.getElementById('cad-email').value, s = document.getElementById('cad-senha').value;
    let u = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    u.push({ nome: n, cargo: c, email: e, senha: s });
    localStorage.setItem('usuarios-ct', JSON.stringify(u)); alert("Profissional cadastrado!"); alternarAuth('login');
}

function imprimirEscala() { window.print(); }
function logout() { location.reload(); }
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }
function alternarAuth(t) { document.getElementById('tela-login').style.display = (t === 'login') ? 'block' : 'none'; document.getElementById('tela-cadastro').style.display = (t === 'cadastro') ? 'block' : 'none'; }
