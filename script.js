/* TRADUÇÃO TÉCNICA: obterElementoPorID -> getElementById */

function fazerLogin() {
    const email = document.getElementById('login-email').value;
    if(email) {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
        carregarDashboard();
    }
}

function carregarDashboard() {
    const menu = document.getElementById('menu-dinamico');
    menu.innerHTML = `
        <li onclick="mudarTela('acolhidos')">ACOLHIDOS</li>
        <li onclick="mudarTela('psi-clinico')">PSICOLOGIA</li>
        <li onclick="mudarTela('atividades')">ESCALAS</li>`;
    carregarAcolhidos();
}

function mudarTela(t) {
    document.querySelectorAll('.view-section').forEach(x => x.style.display = 'none');
    document.getElementById('view-' + t).style.display = 'block';
    if(t === 'psi-clinico') carregarSelects();
}

function gerarEvolucaoOficial() {
    const acolhido = document.getElementById('psi-acolhido-select').value;
    const relato = document.getElementById('psi-relato').value;
    const data = new Date().toLocaleDateString();

    document.getElementById('print-nome-acolhido').innerText = acolhido.toUpperCase();
    const tabela = document.getElementById('tabela-linhas-evolucao');
    
    let html = `<tr><td>${data}</td><td>${relato}</td></tr>`;
    for(let i=0; i<22; i++) { html += `<tr><td></td><td></td></tr>`; } // Linhas para completar a folha
    
    tabela.innerHTML = html;
    window.print();
}

function carregarAcolhidos() {
    const l = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('lista-acolhidos-tabela').innerHTML = l.map(x => `<tr><td>${x.nome}</td><td>--</td></tr>`).join('');
}

function carregarSelects() {
    const l = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    document.getElementById('psi-acolhido-select').innerHTML = l.map(x => `<option>${x.nome}</option>`).join('');
}

function salvarAcolhido() {
    const nome = document.getElementById('ac-nome').value;
    let l = JSON.parse(localStorage.getItem('acolhidos-ct')) || [];
    l.push({nome});
    localStorage.setItem('acolhidos-ct', JSON.stringify(l));
    location.reload();
}

function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }
function logout() { location.reload(); }
