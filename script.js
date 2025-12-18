/* ============================================================
   SISTEMA DE AUTENTICAÇÃO E EQUIPE
   ============================================================ */
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

    let profissionais = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    profissionais.push({ nome, cargo, email, senha });
    localStorage.setItem('usuarios-ct', JSON.stringify(profissionais));
    
    alert("Profissional cadastrado com sucesso!");
    alternarAuth('login');
}

function fazerLogin() {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    const profissionais = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    const user = profissionais.find(u => u.email === email && u.senha === senha);

    if (user) {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
        carregarDashboard(user);
    } else {
        alert("E-mail ou senha incorretos!");
    }
}

/* ============================================================
   LÓGICA DO DASHBOARD (DINÂMICO POR CARGO)
   ============================================================ */
function carregarDashboard(user) {
    document.getElementById('user-name-display').innerText = user.nome;
    document.getElementById('user-role-badge').innerText = user.cargo;
    document.getElementById('welcome-text').innerText = `Paz do Senhor, ${user.nome}!`;

    const menu = document.getElementById('menu-dinamico');
    const stats = document.getElementById('stats-area');
    const totalAcolhidos = (JSON.parse(localStorage.getItem('acolhidos-ct')) || []).length;
    const totalEquipe = (JSON.parse(localStorage.getItem('usuarios-ct')) || []).length;

    // Menu Comum
    menu.innerHTML = `<li onclick="mudarTela('home')">Dashboard</li>`;
    menu.innerHTML += `<li onclick="mudarTela('acolhidos')">Gestão de Acolhidos</li>`;

    // Se for ADMIN (Vê tudo e gerencia equipe)
    if (user.cargo === 'admin') {
        menu.innerHTML += `<li onclick="mudarTela('admin-equipe')">Gestão de Equipe</li>`;
        menu.innerHTML += `<li onclick="mudarTela('diario')">Monitorar Diário</li>`;
        menu.innerHTML += `<li onclick="mudarTela('psi-prontuario')">Ver Prontuários</li>`;
        
        stats.innerHTML = `
            <div class="stat-card" onclick="mudarTela('acolhidos')"><h4>Total Acolhidos</h4><p>${totalAcolhidos}</p></div>
            <div class="stat-card" onclick="mudarTela('admin-equipe')"><h4>Total Equipe</h4><p>${totalEquipe}</p></div>
            <div class="stat-card"><h4>Status CT</h4><p>Ativa</p></div>`;
    } 
    // Outros cargos (Educador, Psicóloga, Social)...
    else if (user.cargo === 'educador') {
        menu.innerHTML += `<li onclick="mudarTela('diario')">Diário de Bordo</li>`;
        stats.innerHTML = `<div class="stat-card"><h4>Acolhidos</h4><p>${totalAcolhidos}</p></div>`;
    }
    else if (user.cargo === 'psicologa') {
        menu.innerHTML += `<li onclick="mudarTela('psi-prontuario')">Prontuários</li>`;
        stats.innerHTML = `<div class="stat-card"><h4>Atendimentos</h4><p>${totalAcolhidos}</p></div>`;
    }

    carregarAcolhidos(user.cargo);
    carregarEquipe();
}

function mudarTela(tipo) {
    document.querySelectorAll('.view-section').forEach(s => s.style.display = 'none');
    const mapa = { 
        home:'dashboard-home', acolhidos:'view-acolhidos', 'admin-equipe':'view-admin-equipe',
        diario:'view-diario', 'psi-prontuario':'view-psi-prontuario'
    };
    document.getElementById(mapa[tipo]).style.display = 'block';
    document.getElementById('page-title').innerText = tipo.toUpperCase().replace('-', ' ');
}

/* ============================================================
   FUNÇÕES DE GESTÃO DE DADOS
   ============================================================ */
function carregarAcolhidos(cargo) {
    const lista = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    const tabela = document.getElementById('lista-acolhidos-tabela');
    
    tabela.innerHTML = lista.map((ac, index) => `
        <tr>
            <td>${ac.nome}</td>
            <td>${ac.idade}</td>
            <td>${ac.droga}</td>
            <td>
                ${cargo === 'admin' ? `<button class="btn-delete" onclick="excluirAcolhido(${index})">Excluir</button>` : '---'}
            </td>
        </tr>`).join('');

    // Preenche também os cards de prontuário e diário
    document.getElementById('cards-diario-acolhidos').innerHTML = lista.map(ac => `
        <div class="card-paciente"><h4>${ac.nome}</h4><textarea placeholder="Relato..."></textarea></div>`).join('');
    
    document.getElementById('lista-prontuarios').innerHTML = lista.map(ac => `
        <div class="card-paciente"><h4>${ac.nome}</h4><button onclick="alert('Abrindo prontuário...')">Ver Evolução</button></div>`).join('');
}

function carregarEquipe() {
    const equipe = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    const tabela = document.getElementById('lista-profissionais-tabela');
    
    tabela.innerHTML = equipe.map((prof, index) => `
        <tr>
            <td>${prof.nome}</td>
            <td>${prof.cargo}</td>
            <td>${prof.email}</td>
            <td><button class="btn-delete" onclick="excluirProfissional(${index})">Remover</button></td>
        </tr>`).join('');
}

function salvarAcolhido() {
    const ac = { nome: document.getElementById('ac-nome').value, idade: document.getElementById('ac-idade').value, droga: document.getElementById('ac-droga').value };
    let lista = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    lista.push(ac);
    localStorage.setItem('acolhidos-ct', JSON.stringify(lista));
    location.reload();
}

function excluirProfissional(index) {
    if(confirm("Tem certeza que deseja remover este profissional?")) {
        let equipe = JSON.parse(localStorage.getItem('usuarios-ct'));
        equipe.splice(index, 1);
        localStorage.setItem('usuarios-ct', JSON.stringify(equipe));
        location.reload();
    }
}

function excluirAcolhido(index) {
    if(confirm("Deseja excluir permanentemente este acolhido?")) {
        let lista = JSON.parse(localStorage.getItem('acolhidos-ct'));
        lista.splice(index, 1);
        localStorage.setItem('acolhidos-ct', JSON.stringify(lista));
        location.reload();
    }
}

function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }
function logout() { location.reload(); }
