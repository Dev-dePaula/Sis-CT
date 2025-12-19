/* CONTROLE DE ACESSO */
function fazerLogin() {
    const e = document.getElementById('login-email').value, s = document.getElementById('login-senha').value;
    const users = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    const u = users.find(x => x.email === e && x.senha === s);
    if (u) { document.getElementById('auth-screen').style.display = 'none'; document.getElementById('app').style.display = 'flex'; carregarDashboard(u); }
    else alert("Credenciais Inválidas!");
}

function carregarDashboard(u) {
    document.getElementById('user-name-display').innerText = u.nome;
    document.getElementById('user-role-badge').innerText = u.cargo;
    const m = document.getElementById('menu-dinamico');
    m.innerHTML = `<li onclick="mudarTela('home')">Início</li><li onclick="mudarTela('acolhidos')">Acolhidos</li>`;
    if (u.cargo === 'educador' || u.cargo === 'admin') {
        m.innerHTML += `<li onclick="mudarTela('diario')">Diário</li><li onclick="mudarTela('atividades')">Atividades/Escalas</li><li onclick="mudarTela('plantao')">Plantão</li>`;
    }
    carregarDadosBase();
}

function mudarTela(t) {
    document.querySelectorAll('.view-section').forEach(x => x.style.display = 'none');
    const id = (t === 'home') ? 'dashboard-home' : 'view-' + t;
    document.getElementById(id).style.display = 'block';
    if(t === 'atividades') mostrarSubAtividade('lista');
}

/* GERADOR DE ESCALAS */
function mostrarSubAtividade(aba) {
    document.getElementById('sub-atv-lista').style.display = (aba === 'lista') ? 'block' : 'none';
    document.getElementById('sub-atv-refeicao').style.display = (aba === 'refeicao') ? 'block' : 'none';
    document.getElementById('sub-atv-limpeza').style.display = (aba === 'limpeza') ? 'block' : 'none';
    if(aba === 'refeicao') carregarFormRefeicao();
    if(aba === 'limpeza') carregarFormLimpeza();
}

// ESCALA DE REFEIÇÕES
function carregarFormRefeicao() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const options = acolhidos.map(a => `<option>${a.nome}</option>`).join('');
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    let html = `<div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap:5px; font-size:11px;"><b>DIA</b><b>ALMOÇO</b><b>APOIO</b><b>JANTAR</b><b>APOIO</b>`;
    dias.forEach(d => {
        html += `<div>${d}</div>` + Array(4).fill(0).map((_,i) => `<select id="ref-${d}-${i}">${options}</select>`).join('');
    });
    document.getElementById('form-escala-refeicao').innerHTML = html + `</div>`;
}

function gerarTabelaRefeicao() {
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    let rows = dias.map(d => `<tr><td>${d}</td><td>${document.getElementById(`ref-${d}-0`).value}</td><td>${document.getElementById(`ref-${d}-1`).value}</td><td>${document.getElementById(`ref-${d}-2`).value}</td><td>${document.getElementById(`ref-${d}-3`).value}</td></tr>`).join('');
    
    document.getElementById('area-impressao-escala').innerHTML = `
        <table class="tabela-escala">
            <thead><tr class="azul-header"><th colspan="5">PREPARO DAS REFEIÇÕES DIÁRIAS</th></tr>
            <tr class="amarelo-header"><th>DIA</th><th>ALMOÇO</th><th>APOIO</th><th>JANTAR</th><th>APOIO</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="footer-print">
            <p>SE NO DIA DA SUA ESCALA VOCÊ NÃO ESTIVER OU NÃO PUDER, COMUNIQUE UM COLEGA E PEÇA A TROCA DO DIA, COMUNICAÇÃO PRA NÓS QUE ESTAMOS NA CASA É O PRINCÍPIO DO NOSSO ESTAR SÓBRIO.</p>
        </div>`;
}

// ESCALA DE LIMPEZA (BASEADA NA IMAGEM 8)
function carregarFormLimpeza() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const options = acolhidos.map(a => `<option>${a.nome}</option>`).join('');
    const setores = ["SALA/TV", "COPA", "COZINHA INTERNA", "COZINHA EXTERNA", "QUINTAL", "BANHEIRO 1", "BANHEIRO 2"];
    
    let html = `<div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;"><b>SETOR / LOCAL</b><b>RESPONSÁVEL</b>`;
    setores.forEach(s => {
        html += `<div>${s}</div><select id="limp-${s}">${options}</select>`;
    });
    document.getElementById('form-escala-limpeza').innerHTML = html + `</div>`;
}

function gerarTabelaLimpeza() {
    const dados = [
        {s: "SALA/TV", t: "ARRASTAR SOFÁ, LIMPAR CHÃO, APARADOR E TAPETE"},
        {s: "COPA", t: "LIMPAR CHÃO E TIRAR POEIRA DOS MÓVEIS"},
        {s: "COZINHA INTERNA", t: "LIMPAR CHÃO, PIA, ARMÁRIO E GELADEIRA"},
        {s: "COZINHA EXTERNA", t: "LIMPAR CHÃO, FOGÃO, PIA, ARMÁRIO DE PRODUTOS E MESA"},
        {s: "QUINTAL", t: "LIMPAR CHÃO, FRENTE E CORREDOR LATERAL"},
        {s: "BANHEIRO 1", t: "LIMPAR BANHEIRO DO PRÓPRIO QUARTO"},
        {s: "BANHEIRO 2", t: "LIMPAR BANHEIRO SOCIAL"}
    ];

    let rows = dados.map(d => `<tr><td>${d.s}</td><td>${document.getElementById(`limp-${d.s}`).value}</td><td>${d.t}</td></tr>`).join('');

    document.getElementById('area-impressao-escala').innerHTML = `
        <table class="tabela-escala">
            <thead><tr class="azul-header"><th colspan="3">LIMPEZA SEMANAL & FAXINÃO</th></tr>
            <tr class="amarelo-header"><th>SETOR / LOCAL</th><th>RESPONSÁVEL</th><th>TAREFA / OBSERVAÇÃO</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="footer-print">
            <h4>PARA OS QUE TRABALHAM</h4>
            <p>FICA A RESPONSABILIDADE DE CUMPRIR SUA TAREFA DEPOIS DO EXPEDIENTE DE TRABALHO, ENQUANTO OS QUE ESTÃO NA CASA DEVEM MANTER A LIMPEZA DURANTE A SEMANA.</p>
            <h4>LIMPEZA DOS QUARTOS</h4>
            <p>FICA POR RESPONSABILIDADE DE CADA INTEGRANTE A ORGANIZAÇÃO E ARRUMAÇÃO, VISANDO O COMPANHERISMO. ARRUMAR CAMAS COM LENÇOL, COBRE LEITO E TRAVESSEIRO.</p>
        </div>`;
}

/* FUNÇÕES BASE */
function carregarDadosBase() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('lista-acolhidos-tabela').innerHTML = acolhidos.map(x => `<tr><td>${x.nome}</td><td>${x.idade}</td><td>${x.droga}</td><td>---</td></tr>`).join('');
}
function salvarAcolhido() {
    const ac = { nome: document.getElementById('ac-nome').value, idade: document.getElementById('ac-idade').value, droga: document.getElementById('ac-droga').value };
    let l = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    l.push(ac); localStorage.setItem('acolhidos-ct', JSON.stringify(l)); location.reload();
}
function imprimirEscala() { window.print(); }
function logout() { location.reload(); }
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }
function alternarAuth(t) { document.getElementById('tela-login').style.display = (t === 'login') ? 'block' : 'none'; document.getElementById('tela-cadastro').style.display = (t === 'cadastro') ? 'block' : 'none'; }
