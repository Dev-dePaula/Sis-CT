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
        alert("E-mail ou senha incorretos.");
    }
}

function carregarDashboard(u) {
    document.getElementById('user-name-display').innerText = u.nome;
    document.getElementById('user-role-badge').innerText = u.cargo;
    document.getElementById('welcome-text').innerText = `Paz do Senhor, ${u.nome}!`;

    const menu = document.getElementById('menu-dinamico');
    const totalA = (JSON.parse(localStorage.getItem('acolhidos-ct')) || []).length;
    
    menu.innerHTML = `<li onclick="mudarTela('home')">Início (Resumo)</li><li onclick="mudarTela('acolhidos')">Acolhidos na Casa</li>`;
    
    if (u.cargo === 'educador' || u.cargo === 'admin') {
        menu.innerHTML += `<li onclick="mudarTela('diario')">Diário de Bordo</li><li onclick="mudarTela('atividades')">Atividades e Escalas</li><li onclick="mudarTela('plantao')">Passagem de Plantão</li>`;
    }
    if (u.cargo === 'psicologa' || u.cargo === 'admin') {
        menu.innerHTML += `<li onclick="mudarTela('psi-prontuario')">Prontuários Clínicos</li>`;
    }
    if (u.cargo === 'social' || u.cargo === 'admin') {
        menu.innerHTML += `<li onclick="mudarTela('social-anamnese')">Anamnese Social</li><li onclick="mudarTela('social-docs')">Documentação</li>`;
    }
    
    carregarDadosBase();
}

function mudarTela(t) {
    document.querySelectorAll('.view-section').forEach(x => x.style.display = 'none');
    const id = (t === 'home') ? 'dashboard-home' : 'view-' + t;
    document.getElementById(id).style.display = 'block';
    if(t === 'atividades') mostrarSubAtividade('refeicao');
    if(t === 'social-anamnese') carregarAcolhidosSocial();
}

/* --- ESCALAS (FIEL AOS MODELOS 6, 7, 8) --- */
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
    let html = `<div class="grid-form-escala" style="font-weight:bold; font-size:12px;"><b>DIA</b><b>ALMOÇO</b><b>APOIO</b><b>JANTAR</b><b>APOIO</b></div>`;
    dias.forEach(d => {
        html += `<div class="grid-form-escala"><div>${d}</div>` + Array(4).fill(0).map((_,i) => `<select id="ref-${d}-${i}">${options}</select>`).join('') + `</div>`;
    });
    document.getElementById('form-escala-refeicao').innerHTML = html;
}

function gerarTabelaRefeicao() {
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    let rows = dias.map(d => `<tr><td>${d}</td><td>${document.getElementById(`ref-${d}-0`).value}</td><td>${document.getElementById(`ref-${d}-1`).value}</td><td>${document.getElementById(`ref-${d}-2`).value}</td><td>${document.getElementById(`ref-${d}-3`).value}</td></tr>`).join('');
    
    document.getElementById('area-impressao-escala').innerHTML = `
        <table class="tabela-escala">
            <thead>
                <tr class="azul-header"><th colspan="5">PREPARO DAS REFEIÇÕES DIÁRIAS</th></tr>
                <tr class="amarelo-header"><th>DIA</th><th>ALMOÇO</th><th>APOIO</th><th>JANTAR</th><th>APOIO</th></tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="footer-print">
            <p>SE NO DIA DA SUA ESCALA VOCÊ NÃO ESTIVER OU NÃO PUDER, COMUNIQUE UM COLEGA E PEÇA A TROCA DO DIA. COMUNICAÇÃO PRA NÓS QUE ESTAMOS NA CASA É O PRINCÍPIO DO NOSSO ESTAR SÓBRIO.</p>
        </div>`;
}

function carregarFormLimpeza() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const options = acolhidos.map(a => `<option>${a.nome}</option>`).join('');
    const setores = ["SALA/TV", "COPA", "COZINHA", "EXTERNA", "QUINTAL", "BANHEIROS"];
    let html = `<div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;"><b>LOCAL</b><b>RESPONSÁVEL</b>`;
    setores.forEach(s => html += `<div>${s}</div><select id="limp-${s}">${options}</select>`);
    document.getElementById('form-escala-limpeza').innerHTML = html + `</div>`;
}

function gerarTabelaLimpeza() {
    const dados = [
        {s: "SALA/TV", t: "ARRASTAR SOFÁ, LIMPAR CHÃO, APARADOR E TAPETE"},
        {s: "COPA", t: "LIMPAR CHÃO E TIRAR POEIRA DOS MÓVEIS"},
        {s: "COZINHA", t: "LIMPAR CHÃO, PIA, ARMÁRIO E GELADEIRA"},
        {s: "EXTERNA", t: "LIMPAR CHÃO, FOGÃO E MESA"},
        {s: "QUINTAL", t: "LIMPAR CHÃO E CORREDOR LATERAL"},
        {s: "BANHEIROS", t: "LIMPEZA COMPLETA E HIGIENIZAÇÃO"}
    ];
    let rows = dados.map(d => `<tr><td>${d.s}</td><td>${document.getElementById(`limp-${d.s}`).value}</td><td>${d.t}</td></tr>`).join('');
    document.getElementById('area-impressao-escala').innerHTML = `
        <table class="tabela-escala">
            <thead>
                <tr class="azul-header"><th colspan="3">LIMPEZA SEMANAL & FAXINÃO</th></tr>
                <tr class="amarelo-header"><th>SETOR / LOCAL</th><th>RESPONSÁVEL</th><th>TAREFA / OBSERVAÇÃO</th></tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="footer-print">
            <h4>PARA OS QUE TRABALHAM</h4>
            <p>FICA A RESPONSABILIDADE DE CUMPRIR SUA TAREFA DEPOIS DO EXPEDIENTE DE TRABALHO.</p>
        </div>`;
}

/* --- ASSISTENTE SOCIAL (ANAMNESE) --- */
function carregarAcolhidosSocial() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('ana-acolhido-select').innerHTML = acolhidos.map(x => `<option>${x.nome}</option>`).join('');
}

function salvarAnamnese() {
    const nome = document.getElementById('ana-acolhido-select').value;
    const parecer = document.getElementById('ana-parecer').value;
    const historico = JSON.parse(localStorage.getItem(`anamnese-${nome}`)) || [];
    historico.push({ data: new Date().toLocaleDateString(), parecer: parecer });
    localStorage.setItem(`anamnese-${nome}`, JSON.stringify(historico));
    alert("Anamnese Social salva!");
}

/* --- DADOS GERAIS --- */
function carregarDadosBase() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('lista-acolhidos-tabela').innerHTML = acolhidos.map(x => `<tr><td>${x.nome}</td><td>${x.idade}</td><td>${x.droga}</td><td>Acolhido</td></tr>`).join('');
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
    localStorage.setItem('usuarios-ct', JSON.stringify(u)); alert("Solicitado com sucesso!"); alternarAuth('login');
}

function imprimirEscala() { window.print(); }
function logout() { location.reload(); }
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }
function alternarAuth(t) { document.getElementById('tela-login').style.display = (t === 'login') ? 'block' : 'none'; document.getElementById('tela-cadastro').style.display = (t === 'cadastro') ? 'block' : 'none'; }

