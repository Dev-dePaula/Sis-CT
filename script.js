/* SISTEMA DE LOGIN */
function fazerLogin() {
    const e = document.getElementById('login-email').value, s = document.getElementById('login-senha').value;
    const users = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    const u = users.find(x => x.email === e && x.senha === s);
    if (u) { document.getElementById('auth-screen').style.display = 'none'; document.getElementById('app').style.display = 'flex'; carregarDashboard(u); }
    else alert("Usuário não encontrado!");
}

/* CARREGAMENTO DE DASHBOARD POR CARGO */
function carregarDashboard(u) {
    document.getElementById('user-name-display').innerText = u.nome;
    document.getElementById('user-role-badge').innerText = u.cargo;
    document.getElementById('welcome-text').innerText = `Paz do Senhor, ${u.nome}!`;

    const m = document.getElementById('menu-dinamico'), s = document.getElementById('stats-area');
    const totalA = (JSON.parse(localStorage.getItem('acolhidos-ct')) || []).length;

    m.innerHTML = `<li onclick="mudarTela('home')">Início</li><li onclick="mudarTela('acolhidos')">Acolhidos</li>`;

    if (u.cargo === 'educador') {
        m.innerHTML += `<li onclick="mudarTela('diario')">Diário</li><li onclick="mudarTela('plantao')">Plantão</li><li onclick="mudarTela('atividades')">Atividades/Escalas</li><li onclick="mudarTela('medicamentos')">Remédios</li>`;
        s.innerHTML = `<div class="stat-card" onclick="mudarTela('acolhidos')"><h4>Acolhidos</h4><p>${totalA}</p></div><div class="stat-card" onclick="mudarTela('plantao')"><h4>Plantão</h4><p>Lançar</p></div>`;
    } 
    else if (u.cargo === 'psicologa') {
        m.innerHTML += `<li onclick="mudarTela('psi-agendamentos')">Agenda</li><li onclick="mudarTela('psi-prontuario')">Prontuários</li>`;
        s.innerHTML = `<div class="stat-card"><h4>Prontuários</h4><p>${totalA}</p></div>`;
    }
    else if (u.cargo === 'social') {
        m.innerHTML += `<li onclick="mudarTela('social-familia')">Família</li><li onclick="mudarTela('social-documentos')">Documentos</li>`;
        s.innerHTML = `<div class="stat-card"><h4>Docs</h4><p>Checklist</p></div>`;
    }
    else if (u.cargo === 'admin') {
        m.innerHTML += `<li onclick="mudarTela('admin-equipe')">Equipe</li><li onclick="mudarTela('atividades')">Escalas</li><li onclick="mudarTela('psi-prontuario')">Prontuários</li>`;
        s.innerHTML = `<div class="stat-card"><h4>Equipe</h4><p>${(JSON.parse(localStorage.getItem('usuarios-ct')) || []).length}</p></div>`;
    }
    carregarDadosBase(u.cargo);
}

function mudarTela(t) {
    document.querySelectorAll('.view-section').forEach(x => x.style.display = 'none');
    const id = (t === 'home') ? 'dashboard-home' : 'view-' + t;
    document.getElementById(id).style.display = 'block';
    if(t === 'atividades') carregarSeletoresEscala();
}

/* GESTÃO DE DADOS */
function carregarDadosBase(cargo) {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const equipe = JSON.parse(localStorage.getItem('usuarios-ct')) || [];

    // Tabelas e Cards
    document.getElementById('lista-acolhidos-tabela').innerHTML = acolhidos.map(x => `<tr><td>${x.nome}</td><td>${x.idade}</td><td>${x.droga}</td><td>---</td></tr>`).join('');
    if(document.getElementById('lista-profissionais-tabela')) {
        document.getElementById('lista-profissionais-tabela').innerHTML = equipe.map(x => `<tr><td>${x.nome}</td><td>${x.cargo}</td><td>${x.email}</td><td>---</td></tr>`).join('');
    }
    
    // Prontuários e Diários
    const containers = { 'cards-diario-acolhidos': 'Relato...', 'lista-prontuarios': 'Evoluir' };
    for (let id in containers) {
        const el = document.getElementById(id);
        if(el) el.innerHTML = acolhidos.map(x => `<div class="card-paciente"><h4>${x.nome}</h4><button>${containers[id]}</button></div>`).join('');
    }
}

/* GERADOR DE ESCALA DE REFEIÇÃO */
function mostrarSubAtividade(aba) {
    document.getElementById('sub-atv-lista').style.display = (aba === 'lista') ? 'block' : 'none';
    document.getElementById('sub-atv-gerador').style.display = (aba === 'gerador') ? 'block' : 'none';
}

function carregarSeletoresEscala() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const options = acolhidos.map(a => `<option>${a.nome}</option>`).join('');
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    let html = `<div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap:8px; font-size:11px;"><b>DIA</b><b>ALMOÇO</b><b>APOIO</b><b>JANTAR</b><b>APOIO</b>`;
    dias.forEach(d => {
        html += `<div>${d}</div>` + Array(4).fill(0).map((_,i) => `<select id="esc-${d}-${i}">${options}</select>`).join('');
    });
    document.getElementById('form-preenchimento-escala').innerHTML = html + `</div>`;
}

function gerarTabelaRefeicao() {
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    let rows = dias.map(d => `<tr><td>${d}</td><td>${document.getElementById(`esc-${d}-0`).value}</td><td>${document.getElementById(`esc-${d}-1`).value}</td><td>${document.getElementById(`esc-${d}-2`).value}</td><td>${document.getElementById(`esc-${d}-3`).value}</td></tr>`).join('');
    
    document.getElementById('area-impressao-escala').innerHTML = `
        <table class="tabela-refeicao">
            <thead><tr class="titulo-principal"><th colspan="5">PREPARO DAS REFEIÇÕES DIÁRIAS</th></tr>
            <tr class="cabecalho-colunas"><th></th><th>ALMOÇO</th><th>APOIO</th><th>JANTAR</th><th>APOIO</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="footer-escala">
            <p>SE NO DIA DA SUA ESCALA VOÇE NAO ESTIVER OU NAO PUDER,COMUNIQUE UM COLEGA E PEÇA A TROCA DO DIA,COMUNICAÇÃO PRA NOS QUE ESTAMOS NA CASA E O PRINCIPIO DO NOSSO ESTAR SOBRIO.</p>
            <div class="link-escala">https://dev-depaula.github.io/Escala-almoco/</div>
        </div>`;
}

/* FUNÇÕES GERAIS */
function salvarAcolhido() {
    const ac = { nome: document.getElementById('ac-nome').value, idade: document.getElementById('ac-idade').value, droga: document.getElementById('ac-droga').value };
    let l = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    l.push(ac); localStorage.setItem('acolhidos-ct', JSON.stringify(l)); location.reload();
}
function cadastrarProfissional() {
    const n = document.getElementById('cad-nome').value, c = document.getElementById('cad-cargo').value, e = document.getElementById('cad-email').value, s = document.getElementById('cad-senha').value;
    let u = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    u.push({ nome: n, cargo: c, email: e, senha: s });
    localStorage.setItem('usuarios-ct', JSON.stringify(u)); alert("Cadastrado!"); alternarAuth('login');
}
function imprimirEscala() { window.print(); }
function logout() { location.reload(); }
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }
function alternarAuth(t) { document.getElementById('tela-login').style.display = (t === 'login') ? 'block' : 'none'; document.getElementById('tela-cadastro').style.display = (t === 'cadastro') ? 'block' : 'none'; }
