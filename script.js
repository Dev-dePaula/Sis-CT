/* AUTH */
function alternarAuth(t) {
    document.getElementById('tela-login').style.display = (t === 'login') ? 'block' : 'none';
    document.getElementById('tela-cadastro').style.display = (t === 'cadastro') ? 'block' : 'none';
}

function cadastrarProfissional() {
    const n = document.getElementById('cad-nome').value, c = document.getElementById('cad-cargo').value, 
          e = document.getElementById('cad-email').value, s = document.getElementById('cad-senha').value;
    let users = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    users.push({ nome: n, cargo: c, email: e, senha: s });
    localStorage.setItem('usuarios-ct', JSON.stringify(users));
    alert("Cadastrado!"); alternarAuth('login');
}

function fazerLogin() {
    const e = document.getElementById('login-email').value, s = document.getElementById('login-senha').value;
    const users = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    const u = users.find(x => x.email === e && x.senha === s);
    if (u) { document.getElementById('auth-screen').style.display = 'none'; document.getElementById('app').style.display = 'flex'; carregarDashboard(u); }
    else { alert("Falha no login!"); }
}

/* DASHBOARD DINÂMICO */
function carregarDashboard(u) {
    document.getElementById('user-name-display').innerText = u.nome;
    document.getElementById('user-role-badge').innerText = u.cargo;
    document.getElementById('welcome-text').innerText = `Paz do Senhor, ${u.nome}!`;

    const m = document.getElementById('menu-dinamico'), s = document.getElementById('stats-area');
    const totalA = (JSON.parse(localStorage.getItem('acolhidos-ct')) || []).length;

    m.innerHTML = `<li onclick="mudarTela('home')">Início</li><li onclick="mudarTela('acolhidos')">Acolhidos</li>`;

    // RESTAURAÇÃO DOS MENUS POR CARGO
    if (u.cargo === 'educador') {
        m.innerHTML += `<li onclick="mudarTela('diario')">Diário de Bordo</li><li onclick="mudarTela('atividades')">Atividades</li>`;
        s.innerHTML = `<div class="stat-card" onclick="mudarTela('acolhidos')"><h4>Acolhidos</h4><p>${totalA}</p></div>
                       <div class="stat-card" onclick="mudarTela('diario')"><h4>Ocorrências</h4><p>Ver</p></div>`;
    } 
    else if (u.cargo === 'psicologa') {
        m.innerHTML += `<li onclick="mudarTela('psi-agendamentos')">Agendamentos</li><li onclick="mudarTela('psi-prontuario')">Prontuários</li>`;
        s.innerHTML = `<div class="stat-card" onclick="mudarTela('psi-agendamentos')"><h4>Agenda</h4><p>Ver</p></div>
                       <div class="stat-card" onclick="mudarTela('psi-prontuario')"><h4>Clínico</h4><p>${totalA}</p></div>`;
    }
    else if (u.cargo === 'social') {
        m.innerHTML += `<li onclick="mudarTela('social-familia')">Vínculos</li><li onclick="mudarTela('social-documentos')">Documentos</li>`;
        s.innerHTML = `<div class="stat-card" onclick="mudarTela('social-familia')"><h4>Contatos</h4><p>Ver</p></div>
                       <div class="stat-card" onclick="mudarTela('social-documentos')"><h4>Docs</h4><p>Pendentes</p></div>`;
    }
    else if (u.cargo === 'admin') {
        m.innerHTML += `<li onclick="mudarTela('admin-equipe')">Equipe</li>
                        <li onclick="mudarTela('diario')">Diário (Monitorar)</li>
                        <li onclick="mudarTela('psi-prontuario')">Prontuários</li>
                        <li onclick="mudarTela('social-familia')">Social</li>`;
        s.innerHTML = `<div class="stat-card" onclick="mudarTela('acolhidos')"><h4>Acolhidos</h4><p>${totalA}</p></div>
                       <div class="stat-card" onclick="mudarTela('admin-equipe')"><h4>Equipe</h4><p>${(JSON.parse(localStorage.getItem('usuarios-ct')) || []).length}</p></div>`;
    }

    carregarDadosBase(u.cargo);
}

function mudarTela(t) {
    document.querySelectorAll('.view-section').forEach(x => x.style.display = 'none');
    const mapa = { home:'dashboard-home', acolhidos:'view-acolhidos', 'admin-equipe':'view-admin-equipe', diario:'view-diario', atividades:'view-atividades', 'psi-agendamentos':'view-psi-agendamentos', 'psi-prontuario':'view-psi-prontuario', 'social-familia':'view-social-familia', 'social-documentos':'view-social-documentos' };
    document.getElementById(mapa[t]).style.display = 'block';
    document.getElementById('page-title').innerText = t.toUpperCase();
}

/* GESTÃO DE DADOS */
function carregarDadosBase(cargo) {
    const acolhidos = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    
    // Tabela Acolhidos
    document.getElementById('lista-acolhidos-tabela').innerHTML = acolhidos.map((x, i) => `<tr><td>${x.nome}</td><td>${x.idade}</td><td>${x.droga}</td><td>${cargo==='admin'?`<button class="btn-delete" onclick="excluirAc(${i})">Excluir</button>`:'--'}</td></tr>`).join('');
    
    // Diário
    document.getElementById('cards-diario-acolhidos').innerHTML = acolhidos.map(x => `<div class="card-paciente"><h4>${x.nome}</h4><textarea></textarea><button onclick="alert('Salvo!')">Gravar</button></div>`).join('');
    
    // Prontuário
    document.getElementById('lista-prontuarios').innerHTML = acolhidos.map(x => `<div class="card-paciente" style="border-top-color:#9b59b6"><h4>${x.nome}</h4><button onclick="abrirEvolucao('${x.nome}')">Evoluir</button></div>`).join('');
    
    // Psicologia/Social Selects
    const selects = ['agendar-acolhido', 'soc-familia-acolhido'];
    selects.forEach(s => { const el = document.getElementById(s); if(el) el.innerHTML = acolhidos.map(x => `<option>${x.nome}</option>`).join(''); });

    // Equipe Admin
    const equipe = JSON.parse(localStorage.getItem('usuarios-ct')) || [];
    const tEquipe = document.getElementById('lista-profissionais-tabela');
    if(tEquipe) tEquipe.innerHTML = equipe.map((x, i) => `<tr><td>${x.nome}</td><td>${x.cargo}</td><td>${x.email}</td><td><button class="btn-delete" onclick="excluirProf(${i})">Remover</button></td></tr>`).join('');
}

/* AÇÕES */
function salvarAcolhido() {
    const ac = { nome: document.getElementById('ac-nome').value, idade: document.getElementById('ac-idade').value, droga: document.getElementById('ac-droga').value };
    let lista = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    lista.push(ac); localStorage.setItem('acolhidos-ct', JSON.stringify(lista));
    location.reload();
}

let pAtual = "";
function abrirEvolucao(n) { pAtual = n; document.getElementById('evol-nome-acolhido').innerText = n; abrirModal('modal-evolucao'); }
function salvarEvolucaoClinica() { alert("Evolução salva!"); fecharModal('modal-evolucao'); }
function excluirAc(i) { let l = JSON.parse(localStorage.getItem('acolhidos-ct')); l.splice(i,1); localStorage.setItem('acolhidos-ct', JSON.stringify(l)); location.reload(); }
function excluirProf(i) { let l = JSON.parse(localStorage.getItem('usuarios-ct')); l.splice(i,1); localStorage.setItem('usuarios-ct', JSON.stringify(l)); location.reload(); }
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }
function logout() { location.reload(); }
function salvarAgendamento() { alert("Agendado!"); }
function adicionarAtividade() { alert("Atividade lançada!"); }
function salvarContatoSocial() { alert("Contato gravado!"); }
