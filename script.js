/* AUTH */
function fazerLogin() {
    const e = document.getElementById('login-email').value, s = document.getElementById('login-senha').value;
    const users = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    const u = users.find(x => x.email === e && x.senha === s);
    if (u) { document.getElementById('auth-screen').style.display = 'none'; document.getElementById('app').style.display = 'flex'; carregarDashboard(u); }
    else alert("Dados de acesso incorretos!");
}

function carregarDashboard(u) {
    document.getElementById('user-name-display').innerText = u.nome;
    document.getElementById('user-role-badge').innerText = u.cargo;
    const m = document.getElementById('menu-dinamico');
    m.innerHTML = `<li onclick="mudarTela('home')">Início</li>
                   <li onclick="mudarTela('acolhidos')">Acolhidos</li>
                   <li onclick="mudarTela('escala-refeicao')">Escala Refeição</li>`;
    carregarDadosBase();
}

function mudarTela(t) {
    document.querySelectorAll('.view-section').forEach(x => x.style.display = 'none');
    document.getElementById('view-' + t.replace('home', 'dashboard-home')).style.display = 'block';
    if(t === 'escala-refeicao') carregarSeletoresEscala();
}

/* GESTÃO DE ACOLHIDOS */
function salvarAcolhido() {
    const nome = document.getElementById('ac-nome').value;
    if(!nome) return alert("Digite o nome!");
    let l = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    l.push({ nome });
    localStorage.setItem('acolhidos-ct', JSON.stringify(l));
    fecharModal('modal-acolhido');
    carregarDadosBase();
}

function carregarDadosBase() {
    const l = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('lista-acolhidos-tabela').innerHTML = l.map(x => `<tr><td>${x.nome}</td><td>---</td></tr>`).join('');
}

/* LÓGICA DA ESCALA [cite: 1, 2, 3] */
function carregarSeletoresEscala() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const container = document.getElementById('form-preenchimento-escala');
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    const options = acolhidos.map(a => `<option value="${a.nome}">${a.nome}</option>`).join('');
    
    let html = `<div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap:10px; font-size:12px; font-weight:bold; margin-bottom:10px;">
                <div>DIA</div><div>ALMOÇO</div><div>APOIO</div><div>JANTAR</div><div>APOIO</div></div>`;

    dias.forEach(d => {
        html += `<div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap:10px; margin-bottom:5px;">
                    <div>${d}</div>
                    <select id="re-alm-${d}">${options}</select>
                    <select id="re-ap1-${d}">${options}</select>
                    <select id="re-jan-${d}">${options}</select>
                    <select id="re-ap2-${d}">${options}</select>
                 </div>`;
    });
    container.innerHTML = html;
}

function gerarTabelaRefeicao() {
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    let rows = "";

    dias.forEach(d => {
        rows += `<tr>
            <td>${d}</td>
            <td>${document.getElementById(`re-alm-${d}`).value}</td>
            <td>${document.getElementById(`re-ap1-${d}`).value}</td>
            <td>${document.getElementById(`re-jan-${d}`).value}</td>
            <td>${document.getElementById(`re-ap2-${d}`).value}</td>
        </tr>`;
    });

    const tabelaHtml = `
        <table class="tabela-refeicao">
            <thead>
                <tr class="titulo-principal"><th colspan="5">PREPARO DAS REFEIÇÕES DIÁRIAS</th></tr>
                <tr class="cabecalho-colunas">
                    <th></th><th>ALMOÇO</th><th>APOIO</th><th>JANTAR</th><th>APOIO</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="footer-escala">
            <p>SE NO DIA DA SUA ESCALA VOCÊ NÃO ESTIVER OU NÃO PUDER, COMUNIQUE UM COLEGA E PEÇA A TROCA DO DIA, COMUNICAÇÃO PRA NÓS QUE ESTAMOS NA CASA É O PRINCÍPIO DO NOSSO ESTAR SÓBRIO. [cite: 2]</p>
            <div class="link-escala">https://dev-depaula.github.io/Escala-almoco/ [cite: 3]</div>
        </div>`;

    document.getElementById('area-impressao-escala').innerHTML = tabelaHtml;
}

function imprimirEscala() { window.print(); }
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }
function logout() { location.reload(); }
function alternarAuth(t) {
    document.getElementById('tela-login').style.display = (t === 'login') ? 'block' : 'none';
    document.getElementById('tela-cadastro').style.display = (t === 'cadastro') ? 'block' : 'none';
}
