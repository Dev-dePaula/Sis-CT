/* AUTH */
function fazerLogin() {
    const e = document.getElementById('login-email').value, s = document.getElementById('login-senha').value;
    const users = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    const u = users.find(x => x.email === e && x.senha === s);
    if (u) { document.getElementById('auth-screen').style.display = 'none'; document.getElementById('app').style.display = 'flex'; carregarDashboard(u); }
    else alert("Dados inválidos.");
}

function carregarDashboard(u) {
    document.getElementById('user-name-display').innerText = u.nome;
    document.getElementById('user-role-badge').innerText = u.cargo;
    document.getElementById('welcome-text').innerText = `Paz do Senhor, ${u.nome}!`;
    const m = document.getElementById('menu-dinamico');
    m.innerHTML = `<li onclick="mudarTela('home')">Início</li><li onclick="mudarTela('acolhidos')">Acolhidos</li>`;
    
    if (u.cargo === 'educador' || u.cargo === 'admin') {
        m.innerHTML += `<li onclick="mudarTela('diario')">Diário</li><li onclick="mudarTela('atividades')">Escalas</li><li onclick="mudarTela('plantao')">Plantão</li>`;
    }
    if (u.cargo === 'psicologa' || u.cargo === 'admin') {
        m.innerHTML += `<li onclick="mudarTela('psi-clinico')">Evolução Clínica</li>`;
    }
    if (u.cargo === 'social' || u.cargo === 'admin') {
        m.innerHTML += `<li onclick="mudarTela('social-anamnese')">Anamnese Social</li><li onclick="mudarTela('social-docs')">Documentos</li>`;
    }
    carregarDadosBase();
}

function mudarTela(t) {
    document.querySelectorAll('.view-section').forEach(x => x.style.display = 'none');
    const id = (t === 'home') ? 'dashboard-home' : 'view-' + t;
    document.getElementById(id).style.display = 'block';
    if(t === 'atividades') mostrarSubAtividade('refeicao');
    if(t === 'psi-clinico' || t === 'social-anamnese') carregarAcolhidosPsiSoc();
}

/* ESCALAS */
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
    dias.forEach(d => { h += `<div>${d}</div>` + Array(4).fill(0).map((_,i) => `<select id="ref-${d}-${i}">${opt}</select>`).join(''); });
    document.getElementById('form-escala-refeicao').innerHTML = h + `</div>`;
}

function gerarTabelaRefeicao() {
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    let r = dias.map(d => `<tr><td>${d}</td><td>${document.getElementById(`ref-${d}-0`).value}</td><td>${document.getElementById(`ref-${d}-1`).value}</td><td>${document.getElementById(`ref-${d}-2`).value}</td><td>${document.getElementById(`ref-${d}-3`).value}</td></tr>`).join('');
    document.getElementById('area-impressao-escala').innerHTML = `<table class="tabela-escala"><thead><tr class="azul-header"><th colspan="5">PREPARO DAS REFEIÇÕES DIÁRIAS</th></tr><tr class="amarelo-header"><th>DIA</th><th>ALMOÇO</th><th>APOIO</th><th>JANTAR</th><th>APOIO</th></tr></thead><tbody>${r}</tbody></table>`;
}

function carregarFormLimpeza() {
    const acs = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const opt = acs.map(a => `<option>${a.nome}</option>`).join('');
    const s = ["SALA", "COPA", "COZINHA", "QUINTAL"];
    let h = `<div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;"><b>SETOR</b><b>RESPONSÁVEL</b>`;
    s.forEach(x => h += `<div>${x}</div><select id="limp-${x}">${opt}</select>`);
    document.getElementById('form-escala-limpeza').innerHTML = h + `</div>`;
}

function gerarTabelaLimpeza() {
    const s = ["SALA", "COPA", "COZINHA", "QUINTAL"];
    let r = s.map(x => `<tr><td>${x}</td><td>${document.getElementById(`limp-${x}`).value}</td><td>Limpeza Geral</td></tr>`).join('');
    document.getElementById('area-impressao-escala').innerHTML = `<table class="tabela-escala"><thead><tr class="azul-header"><th colspan="3">LIMPEZA SEMANAL & FAXINÃO</th></tr><tr class="amarelo-header"><th>LOCAL</th><th>RESPONSÁVEL</th><th>TAREFA</th></tr></thead><tbody>${r}</tbody></table>`;
}

/* PSICOLOGIA & SOCIAL */
function carregarAcolhidosPsiSoc() {
    const acs = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const opt = acs.map(x => `<option>${x.nome}</option>`).join('');
    if(document.getElementById('psi-acolhido-select')) document.getElementById('psi-acolhido-select').innerHTML = opt;
    if(document.getElementById('ana-acolhido-select')) document.getElementById('ana-acolhido-select').innerHTML = opt;
}

function salvarEvolucaoPsi() {
    const nome = document.getElementById('psi-acolhido-select').value;
    const relato = document.getElementById('psi-relato').value;
    const item = document.createElement('div');
    item.className = 'welcome-card';
    item.innerHTML = `<strong>${nome} (Clínico):</strong> ${relato}`;
    document.getElementById('historico-psi').prepend(item);
    document.getElementById('psi-relato').value = "";
    alert("Evolução Clínica salva com sigilo!");
}

function salvarAnamnese() {
    const nome = document.getElementById('ana-acolhido-select').value;
    const parecer = document.getElementById('ana-parecer').value;
    const item = document.createElement('div');
    item.className = 'welcome-card';
    item.innerHTML = `<strong>${nome} (Social):</strong> ${parecer}`;
    document.getElementById('historico-anamnese').prepend(item);
    alert("Anamnese Social salva!");
}

/* GERAL */
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
    localStorage.setItem('usuarios-ct', JSON.stringify(u)); alert("Solicitado!"); alternarAuth('login');
}
function imprimirEscala() { window.print(); }
function logout() { location.reload(); }
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }
function alternarAuth(t) { document.getElementById('tela-login').style.display = (t === 'login') ? 'block' : 'none'; document.getElementById('tela-cadastro').style.display = (t === 'cadastro') ? 'block' : 'none'; }
