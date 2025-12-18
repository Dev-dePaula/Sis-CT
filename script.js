/* === SISTEMA DE AUTENTICAÇÃO === */
function alternarAuth(tela) {
    document.getElementById('tela-login').style.display = (tela === 'login') ? 'block' : 'none';
    document.getElementById('tela-cadastro').style.display = (tela === 'cadastro') ? 'block' : 'none';
}

function cadastrarProfissional() {
    const nome = document.getElementById('cad-nome').value;
    const cargo = document.getElementById('cad-cargo').value;
    const email = document.getElementById('cad-email').value;
    const senha = document.getElementById('cad-senha').value;
    if(!nome || !email || !senha) return alert("Preencha todos os campos!");

    const usuarios = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    usuarios.push({ nome, cargo, email, senha });
    localStorage.setItem('usuarios-ct', JSON.stringify(usuarios));
    alert("Profissional cadastrado!");
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
    } else { alert("Dados de acesso incorretos!"); }
}

/* === GESTÃO DO DASHBOARD === */
function carregarDashboard(user) {
    document.getElementById('user-name-display').innerText = user.nome;
    document.getElementById('user-role-badge').innerText = user.cargo;
    document.getElementById('welcome-text').innerText = `Paz do Senhor, ${user.nome}!`;

    const menu = document.getElementById('menu-dinamico');
    const stats = document.getElementById('stats-area');
    const totalAcolhidos = (JSON.parse(localStorage.getItem('acolhidos-ct')) || []).length;

    menu.innerHTML = `<li onclick="mudarTela('home')">Início</li><li onclick="mudarTela('acolhidos')">Acolhidos</li>`;

    if (user.cargo === 'educador') {
        menu.innerHTML += `<li onclick="mudarTela('diario')">Diário de Bordo</li><li onclick="mudarTela('atividades')">Atividades</li>`;
        stats.innerHTML = `<div class="stat-card" onclick="mudarTela('acolhidos')"><h4>Acolhidos</h4><p>${totalAcolhidos}</p></div>
                           <div class="stat-card" onclick="mudarTela('diario')"><h4>Ocorrências</h4><p>Registrar</p></div>`;
    } 
    else if (user.cargo === 'psicologa') {
        menu.innerHTML += `<li onclick="mudarTela('psi-agendamentos')">Agendamentos</li><li onclick="mudarTela('psi-prontuario')">Prontuários</li>`;
        stats.innerHTML = `<div class="stat-card" onclick="mudarTela('psi-agendamentos')"><h4>Sessões</h4><p>Ver Agenda</p></div>
                           <div class="stat-card" onclick="mudarTela('psi-prontuario')"><h4>Clínico</h4><p>${totalAcolhidos}</p></div>`;
    }
    else if (user.cargo === 'social') {
        menu.innerHTML += `<li onclick="mudarTela('social-familia')">Vínculos</li><li onclick="mudarTela('social-documentos')">Documentos</li>`;
        stats.innerHTML = `<div class="stat-card" onclick="mudarTela('social-familia')"><h4>Família</h4><p>Contatos</p></div>
                           <div class="stat-card" onclick="mudarTela('social-documentos')"><h4>Documentação</h4><p>Checklist</p></div>`;
    }
    carregarAcolhidos();
    if(user.cargo === 'psicologa') atualizarViewPsicologia();
    if(user.cargo === 'social') atualizarViewSocial();
}

function mudarTela(tipo) {
    document.querySelectorAll('.view-section').forEach(s => s.style.display = 'none');
    const mapa = { 
        home:'dashboard-home', acolhidos:'view-acolhidos', diario:'view-diario', 
        atividades:'view-atividades', 'psi-agendamentos':'view-psi-agendamentos', 
        'psi-prontuario':'view-psi-prontuario', 'social-familia':'view-social-familia',
        'social-documentos':'view-social-documentos'
    };
    document.getElementById(mapa[tipo]).style.display = 'block';
    document.getElementById('page-title').innerText = tipo.toUpperCase();
}

/* === FUNÇÕES DE DADOS === */
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }

function salvarAcolhido() {
    const ac = { 
        nome: document.getElementById('ac-nome').value, 
        idade: document.getElementById('ac-idade').value, 
        cidade: document.getElementById('ac-cidade').value, 
        droga: document.getElementById('ac-droga').value 
    };
    let lista = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    lista.push(ac);
    localStorage.setItem('acolhidos-ct', JSON.stringify(lista));
    fecharModal('modal-acolhido');
    location.reload(); // Recarrega para atualizar listas
}

function carregarAcolhidos() {
    const lista = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const tabela = document.getElementById('lista-acolhidos-tabela');
    const diario = document.getElementById('cards-diario-acolhidos');
    if(tabela) {
        tabela.innerHTML = lista.map(ac => `<tr><td>${ac.nome}</td><td>${ac.idade}</td><td>${ac.cidade}</td><td>${ac.droga}</td><td><button>Ver</button></td></tr>`).join('');
    }
    if(diario) {
        diario.innerHTML = lista.map(ac => `<div class="card-paciente"><h4>${ac.nome}</h4><textarea placeholder="Ocorrência de hoje..."></textarea><button onclick="alert('Salvo!')">Registrar</button></div>`).join('');
    }
}

/* === LOGICA ESPECIFICA (PSI E SOCIAL) === */
function atualizarViewPsicologia() {
    const lista = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('agendar-acolhido').innerHTML = lista.map(ac => `<option>${ac.nome}</option>`).join('');
    document.getElementById('lista-prontuarios').innerHTML = lista.map(ac => `
        <div class="card-paciente" style="border-top-color:#9b59b6">
            <h4>${ac.nome}</h4><button onclick="abrirEvolucao('${ac.nome}')">Abrir Evolução</button>
        </div>`).join('');
}

let pAtual = "";
function abrirEvolucao(nome) {
    pAtual = nome;
    document.getElementById('evol-nome-acolhido').innerText = `Evolução: ${nome}`;
    const hist = JSON.parse(localStorage.getItem(`clini-${nome}`)) || [];
    document.getElementById('historico-evolucoes').innerHTML = hist.map(h => `<div><small>${h.data}</small><p>${h.txt}</p><hr></div>`).join('');
    abrirModal('modal-evolucao');
}

function salvarEvolucaoClinica() {
    const txt = document.getElementById('evol-texto').value;
    if(!txt) return;
    let hist = JSON.parse(localStorage.getItem(`clini-${pAtual}`)) || [];
    hist.unshift({ data: new Date().toLocaleString(), txt: txt });
    localStorage.setItem(`clini-${pAtual}`, JSON.stringify(hist));
    document.getElementById('evol-texto').value = "";
    fecharModal('modal-evolucao');
    alert("Prontuário atualizado!");
}

function atualizarViewSocial() {
    const lista = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('soc-familia-acolhido').innerHTML = lista.map(ac => `<option>${ac.nome}</option>`).join('');
    document.getElementById('lista-docs-acolhidos').innerHTML = lista.map(ac => `
        <div class="card-paciente" style="border-top-color:#e67e22">
            <h4>${ac.nome}</h4>
            <label><input type="checkbox"> RG/CPF</label><br>
            <label><input type="checkbox"> Cartão SUS</label><br>
            <button onclick="alert('Docs atualizados!')" style="width:100%; margin-top:10px;">Salvar</button>
        </div>`).join('');
}

function salvarContatoSocial() {
    const acolhido = document.getElementById('soc-familia-acolhido').value;
    const txt = document.getElementById('soc-obs-familia').value;
    const lista = document.getElementById('lista-contatos-familia');
    lista.innerHTML += `<div class="welcome-card" style="border-left-color:#e67e22"><strong>${acolhido}:</strong> ${txt}</div>`;
    document.getElementById('soc-obs-familia').value = "";
}

function logout() { location.reload(); }
function adicionarAtividade() { alert("Atividade registrada!"); }
function salvarAgendamento() { alert("Sessão agendada!"); }
