// Função para carregar dados do CSV e definir o destaque do dia
async function carregarDadosCSV() {
    try {
        const response = await fetch('dados.csv');
        if (!response.ok) throw new Error("Não foi possível carregar o CSV.");

        const dados = await response.text();
        const linhas = dados.split('\n').slice(1); // Ignorar cabeçalho

        const tabelaCorpo = document.querySelector('#tabela-refeicoes tbody');
        tabelaCorpo.innerHTML = ''; // Limpa a tabela antes de carregar

        // Obter data atual no formato "dd/mm/yyyy"
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        let destaquePrato = "";

        linhas.forEach(linha => {
            const colunas = linha.split(',');
            if (colunas.length < 8 || colunas[0].trim() === "") return; // Ignora linhas vazias ou incompletas

            const novaLinha = document.createElement('tr');
            colunas.forEach(coluna => {
                const novaColuna = document.createElement('td');
                novaColuna.textContent = coluna.trim(); // Remove espaços em branco
                novaLinha.appendChild(novaColuna);
            });

            tabelaCorpo.appendChild(novaLinha);

            // Verifica se a linha é referente à data atual
            if (colunas[0].trim() === dataAtual) {
                destaquePrato = colunas[5].trim(); // Assume que a 5ª coluna é o PRATO PRINCIPAL
            }
        });

        // Atualiza o destaque do dia com o prato principal encontrado
        if (destaquePrato) {
            document.getElementById("destaque-principal").textContent = destaquePrato;
        } else {
            document.getElementById("destaque-principal").textContent = "Sem destaque disponível para hoje.";
        }

    } catch (error) {
        console.error("Erro ao carregar CSV: ", error.message);
    }
}

// Carregar os dados ao iniciar a página
window.onload = carregarDadosCSV;


// Configuração do Firebase (preencha com seus dados)
const firebaseConfig = {
    apiKey: "AIzaSyCVedhE-WoxA5AewudgrpYwXYS8i01FdpE",
    authDomain: "rusincero-9ac54.firebaseapp.com",
    projectId: "rusincero-9ac54",
    storageBucket: "rusincero-9ac54.appspot.com",
    messagingSenderId: "738902097792",
    appId: "1:738902097792:web:47afe0c885c6ceb37b8b65",
    measurementId: "G-TDJ2PP6FJH"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("comentarios");

// Função para enviar o comentário ao banco de dados Firebase
document.getElementById("comentario-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const nota = document.getElementById("nota").value;
    const comentario = document.getElementById("comentario").value;

    if (nota.trim() === "" || comentario.trim() === "") {
        alert("Por favor, preencha todos os campos antes de enviar.");
        return;
    }

    db.push({
        nota: nota,
        comentario: comentario,
        data: new Date().toLocaleString()
    });

    // Mostrar mensagem de sucesso
    alert("Comentário enviado com sucesso!");

    // Resetar o formulário após enviar
    document.getElementById("comentario-form").reset();
});

// Função para mostrar os comentários do Firebase
db.on("child_added", function (snapshot) {
    const comentarioData = snapshot.val();
    const listaComentarios = document.getElementById("comentarios-lista");

    // Adiciona o comentário no início da lista
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `<strong>Nota: ${comentarioData.nota} ⭐</strong> <br> ${comentarioData.comentario} <br> <small><i>Enviado em: ${comentarioData.data}</i></small>`;

    // Insere no topo da lista para mostrar os mais recentes primeiro
    listaComentarios.insertBefore(li, listaComentarios.firstChild);
});
