/* --- AUTENTICAÇÃO --- */
function fazerLogin() {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    const users = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    const user = users.find(u => u.email === email && u.senha === senha);
    if (user) {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
        carregarDashboard(user);
    } else {
        alert("Dados incorretos.");
    }
}

function carregarDashboard(u) {
    document.getElementById('user-name-display').innerText = u.nome;
    document.getElementById('user-role-badge').innerText = u.cargo;
    document.getElementById('welcome-text').innerText = `Paz do Senhor, ${u.nome}!`;

    const menu = document.getElementById('menu-dinamico');
    menu.innerHTML = `<li onclick="mudarTela('home')">Início</li><li onclick="mudarTela('acolhidos')">Acolhidos</li>`;
    
    if (u.cargo === 'educador' || u.cargo === 'admin') {
        menu.innerHTML += `<li onclick="mudarTela('diario')">Diário</li><li onclick="mudarTela('atividades')">Escalas</li><li onclick="mudarTela('plantao')">Plantão</li>`;
    }
    if (u.cargo === 'psicologa' || u.cargo === 'admin') menu.innerHTML += `<li onclick="mudarTela('psi-prontuario')">Prontuários</li>`;
    if (u.cargo === 'social' || u.cargo === 'admin') menu.innerHTML += `<li onclick="mudarTela('social-anamnese')">Anamnese Social</li><li onclick="mudarTela('social-docs')">Documentação</li>`;
    
    carregarDadosBase();
}

function mudarTela(t) {
    document.querySelectorAll('.view-section').forEach(x => x.style.display = 'none');
    const id = (t === 'home') ? 'dashboard-home' : 'view-' + t;
    document.getElementById(id).style.display = 'block';
    if(t === 'atividades') mostrarSubAtividade('refeicao');
    if(t === 'social-anamnese') carregarAcolhidosSocial();
}

/* --- ESCALAS (FIEL AOS MODELOS DAS FOTOS) --- */
function mostrarSubAtividade(aba) {
    document.getElementById('sub-atv-refeicao').style.display = (aba === 'refeicao') ? 'block' : 'none';
    document.getElementById('sub-atv-limpeza').style.display = (aba === 'limpeza') ? 'block' : 'none';
    if(aba === 'refeicao') carregarFormRefeicao();
    if(aba === 'limpeza') carregarFormLimpeza();
}

function carregarFormRefeicao() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const options = acolhidos.map(a => `<option>${a.nome}</option>`).join('');
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    let html = `<b>DIA</b><b>ALMOÇO</b><b>APOIO</b><b>JANTAR</b><b>APOIO</b>`;
    dias.forEach(d => {
        html += `<div>${d}</div>` + Array(4).fill(0).map((_,i) => `<select id="ref-${d}-${i}">${options}</select>`).join('');
    });
    document.getElementById('form-escala-refeicao').innerHTML = html;
}

function gerarTabelaRefeicao() {
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    let rows = dias.map(d => `<tr><td>${d}</td><td>${document.getElementById(`ref-${d}-0`).value}</td><td>${document.getElementById(`ref-${d}-1`).value}</td><td>${document.getElementById(`ref-${d}-2`).value}</td><td>${document.getElementById(`ref-${d}-3`).value}</td></tr>`).join('');
    document.getElementById('area-impressao-escala').innerHTML = `<table class="tabela-escala"><thead><tr class="azul-header"><th colspan="5">PREPARO DAS REFEIÇÕES DIÁRIAS</th></tr><tr class="amarelo-header"><th>DIA</th><th>ALMOÇO</th><th>APOIO</th><th>JANTAR</th><th>APOIO</th></tr></thead><tbody>${rows}</tbody></table><div class="footer-print"><h4>IMPORTANTE</h4><p>SE NO DIA DA SUA ESCALA VOCÊ NÃO ESTIVER OU NÃO PUDER, COMUNIQUE UM COLEGA E PEÇA A TROCA DO DIA. COMUNICAÇÃO É O PRINCÍPIO DO NOSSO ESTAR SÓBRIO.</p></div>`;
}

function carregarFormLimpeza() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const options = acolhidos.map(a => `<option>${a.nome}</option>`).join('');
    const setores = ["SALA/TV", "COPA", "COZINHA", "EXTERNA", "QUINTAL"];
    let html = `<b>SETOR</b><b>RESPONSÁVEL</b><b>-</b><b>-</b><b>-</b>`;
    setores.forEach(s => html += `<div>${s}</div><select id="limp-${s}">${options}</select><div></div><div></div><div></div>`);
    document.getElementById('form-escala-limpeza').innerHTML = html;
}

function gerarTabelaLimpeza() {
    const setores = ["SALA/TV", "COPA", "COZINHA", "EXTERNA", "QUINTAL"];
    let rows = setores.map(s => `<tr><td>${s}</td><td>${document.getElementById(`limp-${s}`).value}</td><td>Limpeza Geral</td></tr>`).join('');
    document.getElementById('area-impressao-escala').innerHTML = `<table class="tabela-escala"><thead><tr class="azul-header"><th colspan="3">LIMPEZA SEMANAL & FAXINÃO</th></tr><tr class="amarelo-header"><th>LOCAL</th><th>RESPONSÁVEL</th><th>TAREFA</th></tr></thead><tbody>${rows}</tbody></table><div class="footer-print"><h4>MANTER A LIMPEZA DURANTE A SEMANA É RESPONSABILIDADE DE TODOS.</h4></div>`;
}

/* --- ASSISTENTE SOCIAL --- */
function carregarAcolhidosSocial() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('ana-acolhido-select').innerHTML = acolhidos.map(x => `<option>${x.nome}</option>`).join('');
}

function salvarAnamnese() {
    const nome = document.getElementById('ana-acolhido-select').value;
    const parecer = document.getElementById('ana-parecer').value;
    const item = document.createElement('div');
    item.className = 'welcome-card';
    item.innerHTML = `<strong>${nome}:</strong> ${parecer}`;
    document.getElementById('historico-anamnese').appendChild(item);
    alert("Anamnese Social salva!");
}

/* --- GERAL --- */
function carregarDadosBase() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('lista-acolhidos-tabela').innerHTML = acolhidos.map(x => `<tr><td>${x.nome}</td><td>${x.idade}</td><td>${x.droga}</td><td>Ativo</td></tr>`).join('');
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
    localStorage.setItem('usuarios-ct', JSON.stringify(u)); alert("Cadastrado com sucesso!"); alternarAuth('login');
}

function imprimirEscala() { window.print(); }
function logout() { location.reload(); }
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }
function alternarAuth(t) { document.getElementById('tela-login').style.display = (t === 'login') ? 'block' : 'none'; document.getElementById('tela-cadastro').style.display = (t === 'cadastro') ? 'block' : 'none'; }
