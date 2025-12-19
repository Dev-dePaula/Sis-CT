/* CONTROLE DE ACESSO */
function fazerLogin() {
    const e = document.getElementById('login-email').value, s = document.getElementById('login-senha').value;
    const users = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    const u = users.find(x => x.email === e && x.senha === s);
    if (u) { document.getElementById('auth-screen').style.display = 'none'; document.getElementById('app').style.display = 'flex'; carregarDashboard(u); }
    else alert("Login inválido.");
}

function carregarDashboard(u) {
    document.getElementById('user-name-display').innerText = u.nome;
    document.getElementById('user-role-badge').innerText = u.cargo;
    const m = document.getElementById('menu-dinamico');
    m.innerHTML = `<li onclick="mudarTela('home')">Início</li><li onclick="mudarTela('acolhidos')">Acolhidos</li>`;
    
    if (u.cargo === 'educador' || u.cargo === 'admin') {
        m.innerHTML += `<li onclick="mudarTela('diario')">Diário</li><li onclick="mudarTela('plantao')">Plantão</li><li onclick="mudarTela('atividades')">Atividades/Escalas</li><li onclick="mudarTela('medicamentos')">Medicamentos</li>`;
    }
    if (u.cargo === 'psicologa' || u.cargo === 'admin') m.innerHTML += `<li onclick="mudarTela('psi-prontuario')">Prontuários</li>`;
    if (u.cargo === 'social' || u.cargo === 'admin') {
        m.innerHTML += `<li onclick="mudarTela('social-vinculos')">Vínculos Familiares</li><li onclick="mudarTela('social-docs')">Documentação</li>`;
    }
    if (u.cargo === 'admin') m.innerHTML += `<li onclick="mudarTela('admin-equipe')">Gerenciar Equipe</li>`;
    carregarDadosBase();
}

function mudarTela(t) {
    document.querySelectorAll('.view-section').forEach(x => x.style.display = 'none');
    document.getElementById('view-' + t.replace('home', 'dashboard-home')).style.display = 'block';
    if(t === 'atividades') mostrarSubAtividade('refeicao');
    if(t === 'social-vinculos') carregarSocialAcolhidos();
}

/* ESCALAS (MODELO FOTOS) */
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
    let html = `<div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap:5px; font-size:11px;"><b>DIA</b><b>ALMOÇO</b><b>APOIO</b><b>JANTAR</b><b>APOIO</b>`;
    dias.forEach(d => { html += `<div>${d}</div>` + Array(4).fill(0).map((_,i) => `<select id="ref-${d}-${i}">${options}</select>`).join(''); });
    document.getElementById('form-escala-refeicao').innerHTML = html + `</div>`;
}

function gerarTabelaRefeicao() {
    const dias = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];
    let rows = dias.map(d => `<tr><td>${d}</td><td>${document.getElementById(`ref-${d}-0`).value}</td><td>${document.getElementById(`ref-${d}-1`).value}</td><td>${document.getElementById(`ref-${d}-2`).value}</td><td>${document.getElementById(`ref-${d}-3`).value}</td></tr>`).join('');
    document.getElementById('area-impressao-escala').innerHTML = `<table class="tabela-escala"><thead><tr class="azul-header"><th colspan="5">PREPARO DAS REFEIÇÕES DIÁRIAS</th></tr><tr class="amarelo-header"><th>DIA</th><th>ALMOÇO</th><th>APOIO</th><th>JANTAR</th><th>APOIO</th></tr></thead><tbody>${rows}</tbody></table><div class="footer-print"><p>SE NO DIA DA SUA ESCALA VOCÊ NÃO ESTIVER OU NÃO PUDER, COMUNIQUE UM COLEGA E PEÇA A TROCA DO DIA, COMUNICAÇÃO PRA NÓS QUE ESTAMOS NA CASA É O PRINCÍPIO DO NOSSO ESTAR SÓBRIO.</p></div>`;
}

function carregarFormLimpeza() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const options = acolhidos.map(a => `<option>${a.nome}</option>`).join('');
    const setores = ["SALA/TV", "COPA", "COZINHA INTERNA", "COZINHA EXTERNA", "QUINTAL", "BANHEIRO 1", "BANHEIRO 2"];
    let html = `<div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;"><b>SETOR</b><b>RESPONSÁVEL</b>`;
    setores.forEach(s => html += `<div>${s}</div><select id="limp-${s}">${options}</select>`);
    document.getElementById('form-escala-limpeza').innerHTML = html + `</div>`;
}

function gerarTabelaLimpeza() {
    const dados = [{s: "SALA/TV", t: "ARRASTAR SOFÁ, LIMPAR CHÃO, APARADOR E TAPETE"}, {s: "COPA", t: "LIMPAR CHÃO E TIRAR POEIRA DOS MÓVEIS"}, {s: "COZINHA INTERNA", t: "LIMPAR CHÃO, PIA, ARMÁRIO E GELADEIRA"}, {s: "COZINHA EXTERNA", t: "LIMPAR CHÃO, FOGÃO, PIA, ARMÁRIO E MESA"}, {s: "QUINTAL", t: "LIMPAR CHÃO, FRENTE E CORREDOR LATERAL"}, {s: "BANHEIRO 1", t: "LIMPAR BANHEIRO DO PRÓPRIO QUARTO"}, {s: "BANHEIRO 2", t: "LIMPAR BANHEIRO SOCIAL"}];
    let rows = dados.map(d => `<tr><td>${d.s}</td><td>${document.getElementById(`limp-${d.s}`).value}</td><td>${d.t}</td></tr>`).join('');
    document.getElementById('area-impressao-escala').innerHTML = `<table class="tabela-escala"><thead><tr class="azul-header"><th colspan="3">LIMPEZA SEMANAL & FAXINÃO</th></tr><tr class="amarelo-header"><th>LOCAL</th><th>RESPONSÁVEL</th><th>TAREFA</th></tr></thead><tbody>${rows}</tbody></table><div class="footer-print"><h4>PARA OS QUE TRABALHAM</h4><p>FICA A RESPONSABILIDADE DE CUMPRIR SUA TAREFA DEPOIS DO EXPEDIENTE DE TRABALHO.</p><h4>LIMPEZA DOS QUARTOS</h4><p>ARRUMAR AS CAMAS COM LENÇOL, COBRE LEITO E TRAVESSEIRO.</p></div>`;
}

/* FUNÇÕES SOCIAIS */
function carregarSocialAcolhidos() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('social-acolhido-select').innerHTML = acolhidos.map(x => `<option>${x.nome}</option>`).join('');
    document.getElementById('lista-docs-social').innerHTML = acolhidos.map(x => `
        <div class="card-paciente" style="border-top-color:#e67e22">
            <h4>${x.nome}</h4>
            <label><input type="checkbox"> RG</label><br>
            <label><input type="checkbox"> CPF</label><br>
            <label><input type="checkbox"> Título</label><br>
            <label><input type="checkbox"> SUS</label>
            <button onclick="alert('Docs de ${x.nome} atualizados!')" style="width:100%; margin-top:10px;">Salvar</button>
        </div>`).join('');
}

function salvarContatoSocial() {
    const acolhido = document.getElementById('social-acolhido-select').value;
    const txt = document.getElementById('social-contato-texto').value;
    const lista = document.getElementById('historico-social-contatos');
    lista.innerHTML += `<div class="welcome-card" style="border-left-color:#9b59b6"><strong>${acolhido}:</strong> ${txt}</div>`;
    document.getElementById('social-contato-texto').value = "";
    alert("Contato registrado!");
}

/* GERAL */
function carregarDadosBase() {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('lista-acolhidos-tabela').innerHTML = acolhidos.map(x => `<tr><td>${x.nome}</td><td>${x.idade}</td><td>${x.droga}</td><td>---</td></tr>`).join('');
    if(document.getElementById('cards-diario-acolhidos')) document.getElementById('cards-diario-acolhidos').innerHTML = acolhidos.map(x => `<div class="card-paciente"><h4>${x.nome}</h4><textarea></textarea><button>Gravar</button></div>`).join('');
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
