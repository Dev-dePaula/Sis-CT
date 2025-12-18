/* CONTROLE DE ACESSO */
function alternarAuth(tela) {
    document.getElementById('tela-login').style.display = (tela === 'login') ? 'block' : 'none';
    document.getElementById('tela-cadastro').style.display = (tela === 'cadastro') ? 'block' : 'none';
}

function cadastrarProfissional() {
    const nome = document.getElementById('cad-nome').value;
    const cargo = document.getElementById('cad-cargo').value;
    const email = document.getElementById('cad-email').value;
    const senha = document.getElementById('cad-senha').value;
    if(!nome || !email || !senha) return alert("Preencha tudo!");

    const usuarios = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    usuarios.push({ nome, cargo, email, senha });
    localStorage.setItem('usuarios-ct', JSON.stringify(usuarios));
    alert("Cadastro ok!");
    alternarAuth('login');
}

function fazerLogin() {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    const usuarios = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    const user = usuarios.find(u => u.email === email && u.senha === senha);

    if (user) {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
        carregarDashboard(user);
    } else { alert("Erro no login!"); }
}

/* DASHBOARD DINÂMICO */
function carregarDashboard(user) {
    document.getElementById('user-name-display').innerText = user.nome;
    document.getElementById('user-role-badge').innerText = user.cargo;
    document.getElementById('welcome-text').innerText = `Paz do Senhor, ${user.nome}!`;

    const menu = document.getElementById('menu-dinamico');
    const stats = document.getElementById('stats-area');
    const total = (JSON.parse(localStorage.getItem('acolhidos-ct')) || []).length;

    menu.innerHTML = `<li onclick="mudarTela('home')">Dashboard</li><li onclick="mudarTela('acolhidos')">Acolhidos</li>`;

    if (user.cargo === 'educador') {
        menu.innerHTML += `<li onclick="mudarTela('diario')">Diário de Bordo</li><li onclick="mudarTela('atividades')">Atividades</li>`;
        stats.innerHTML = `<div class="stat-card" onclick="mudarTela('acolhidos')"><h4>Acolhidos</h4><p>${total}</p></div>
                           <div class="stat-card" onclick="mudarTela('diario')"><h4>Ocorrências</h4><p>Ver</p></div>`;
    } else if (user.cargo === 'psicologa') {
        menu.innerHTML += `<li onclick="mudarTela('psi-agendamentos')">Agendamentos</li><li onclick="mudarTela('psi-prontuario')">Prontuários</li>`;
        stats.innerHTML = `<div class="stat-card" onclick="mudarTela('psi-agendamentos')"><h4>Sessões</h4><p>Consultar</p></div>
                           <div class="stat-card" onclick="mudarTela('psi-prontuario')"><h4>Clínico</h4><p>${total}</p></div>`;
    }
    carregarAcolhidos();
    if(user.cargo === 'psicologa') atualizarViewPsicologia();
}

function mudarTela(tipo) {
    document.querySelectorAll('.view-section').forEach(s => s.style.display = 'none');
    const mapa = { home:'dashboard-home', acolhidos:'view-acolhidos', diario:'view-diario', atividades:'view-atividades', 'psi-agendamentos':'view-psi-agendamentos', 'psi-prontuario':'view-psi-prontuario' };
    document.getElementById(mapa[tipo]).style.display = 'block';
    document.getElementById('page-title').innerText = tipo.toUpperCase();
}

/* GESTÃO DE ACOLHIDOS */
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }

function salvarAcolhido() {
    const ac = { nome:document.getElementById('ac-nome').value, idade:document.getElementById('ac-idade').value, cidade:document.getElementById('ac-cidade').value, droga:document.getElementById('ac-droga').value, ocorrencia:document.getElementById('ac-ocorrencia').value };
    let lista = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    lista.push(ac);
    localStorage.setItem('acolhidos-ct', JSON.stringify(lista));
    fecharModal('modal-acolhido');
    carregarAcolhidos();
}

function carregarAcolhidos() {
    const lista = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const tabela = document.getElementById('lista-acolhidos-tabela');
    const diario = document.getElementById('cards-diario-acolhidos');
    if(tabela) {
        tabela.innerHTML = lista.map(ac => `<tr><td>${ac.nome}</td><td>${ac.idade}</td><td>${ac.cidade}</td><td>${ac.droga}</td><td><button>Ficha</button></td></tr>`).join('');
    }
    if(diario) {
        diario.innerHTML = lista.map(ac => `<div class="card-paciente"><h4>${ac.nome}</h4><textarea placeholder="Ocorrência..."></textarea><button onclick="alert('Salvo!')">Salvar</button></div>`).join('');
    }
}

/* PSICOLOGIA */
let pSelecionado = "";
function atualizarViewPsicologia() {
    const lista = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('agendar-acolhido').innerHTML = lista.map(ac => `<option>${ac.nome}</option>`).join('');
    document.getElementById('lista-prontuarios').innerHTML = lista.map(ac => `
        <div class="card-paciente" style="border-top-color:#9b59b6">
            <h4>${ac.nome}</h4><button onclick="abrirEvolucao('${ac.nome}')">Evoluir</button>
        </div>`).join('');
}

function abrirEvolucao(nome) {
    pSelecionado = nome;
    document.getElementById('evol-nome-acolhido').innerText = nome;
    const hist = JSON.parse(localStorage.getItem(`pront-${nome}`)) || [];
    document.getElementById('historico-evolucoes').innerHTML = hist.map(h => `<div><b>${h.data}:</b> ${h.texto}</div>`).join('');
    abrirModal('modal-evolucao');
}

function salvarEvolucaoClinica() {
    const txt = document.getElementById('evol-texto').value;
    if(!txt) return;
    let hist = JSON.parse(localStorage.getItem(`pront-${pSelecionado}`)) || [];
    hist.unshift({ data: new Date().toLocaleDateString(), texto: txt });
    localStorage.setItem(`pront-${pSelecionado}`, JSON.stringify(hist));
    document.getElementById('evol-texto').value = "";
    fecharModal('modal-evolucao');
}

function salvarAgendamento() { alert("Sessão agendada com sucesso!"); }
function adicionarAtividade() { alert("Atividade adicionada!"); }
function logout() { location.reload(); }