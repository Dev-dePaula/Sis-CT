/* AUTH & NAVIGATION */
function fazerLogin() {
    const e = document.getElementById('login-email').value, s = document.getElementById('login-senha').value;
    const users = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    const u = users.find(x => x.email === e && x.senha === s);
    if (u) { document.getElementById('auth-screen').style.display = 'none'; document.getElementById('app').style.display = 'flex'; carregarDashboard(u); }
    else alert("Erro!");
}

function carregarDashboard(u) {
    document.getElementById('user-name-display').innerText = u.nome;
    document.getElementById('user-role-badge').innerText = u.cargo;
    const m = document.getElementById('menu-dinamico');
    m.innerHTML = `<li onclick="mudarTela('home')">Início</li><li onclick="mudarTela('acolhidos')">Acolhidos</li>`;

    if (u.cargo === 'educador') {
        m.innerHTML += `<li onclick="mudarTela('diario')">Diário</li><li onclick="mudarTela('plantao')">Plantão</li><li onclick="mudarTela('atividades')">Atividades/Escalas</li><li onclick="mudarTela('medicamentos')">Remédios</li>`;
    } else if (u.cargo === 'admin') {
        m.innerHTML += `<li onclick="mudarTela('admin-equipe')">Equipe</li><li onclick="mudarTela('atividades')">Escalas</li>`;
    }
    carregarDadosBase(u.cargo);
}

function mudarTela(t) {
    document.querySelectorAll('.view-section').forEach(x => x.style.display = 'none');
    document.getElementById('view-' + t.replace('home', 'dashboard-home')).style.display = 'block';
    if(t === 'atividades') ajustarCamposEscala();
}

/* GERADOR DE ESCALAS  */
function mostrarSubAtividade(aba) {
    document.getElementById('sub-atv-lista').style.display = (aba === 'lista') ? 'block' : 'none';
    document.getElementById('sub-atv-gerador').style.display = (aba === 'gerador') ? 'block' : 'none';
}

function ajustarCamposEscala() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const container = document.getElementById('form-preenchimento-escala');
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    const options = acolhidos.map(a => `<option>${a.nome}</option>`).join('');
    
    let html = `<div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap:5px; font-size:11px;">
                <b>DIA</b><b>ALMOÇO</b><b>APOIO</b><b>JANTAR</b><b>APOIO</b>`;
    dias.forEach(d => {
        html += `<div>${d}</div>` + Array(4).fill(0).map((_,i) => `<select id="sel-${d}-${i}">${options}</select>`).join('');
    });
    container.innerHTML = html + `</div>`;
}

function gerarTabelaEscala() {
    const tipo = document.getElementById('escala-tipo').value;
    const titulo = tipo === 'refeicao' ? 'PREPARO DAS REFEIÇÕES DIÁRIAS' : 'ESCALA DE LIMPEZA DIÁRIA';
    const col1 = tipo === 'refeicao' ? 'ALMOÇO' : 'COZINHA';
    const col2 = tipo === 'refeicao' ? 'JANTAR' : 'PÁTIO';
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    
    let html = `<table class="tabela-escala-print"><thead><tr><th colspan="5">${titulo}</th></tr>
                <tr class="sub-header"><th>DIA</th><th>${col1}</th><th>APOIO</th><th>${col2}</th><th>APOIO</th></tr></thead><tbody>`;
    dias.forEach(d => {
        html += `<tr><td>${d}</td>` + Array(4).fill(0).map((_,i) => `<td>${document.getElementById(`sel-${d}-${i}`).value}</td>`).join('') + `</tr>`;
    });
    document.getElementById('area-impressao-escala').innerHTML = html + `</tbody></table>
    <div class="aviso-escala">SE NO DIA DA SUA ESCALA VOCÊ NÃO ESTIVER OU NÃO PUDER, COMUNIQUE UM COLEGA E PEÇA A TROCA DO DIA. </div>`;
}

function imprimirEscala() { window.print(); }

/* BASE FUNCTIONS */
function carregarDadosBase(cargo) {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('lista-acolhidos-tabela').innerHTML = acolhidos.map((x, i) => `<tr><td>${x.nome}</td><td>${x.idade}</td><td>${x.droga}</td><td>${cargo==='admin'?`<button onclick="excluirAc(${i})">X</button>`:'--'}</td></tr>`).join('');
}

function salvarAcolhido() {
    const ac = { nome: document.getElementById('ac-nome').value, idade: document.getElementById('ac-idade').value, droga: document.getElementById('ac-droga').value };
    let l = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    l.push(ac); localStorage.setItem('acolhidos-ct', JSON.stringify(l)); location.reload();
}

function logout() { location.reload(); }
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }
