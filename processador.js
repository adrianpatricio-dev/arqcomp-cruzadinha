// =========================================================
// PROCESSADOR
// Jogo de arrastar as peças para montar o processador
// (Entrada e saída, CPU com ULA, UC e Registradores, e Memória)
// =========================================================


// ===== PARTE A: as peças =====
// id: igual ao data-vaga do espaço certo no HTML
// explicacao: aparece quando o jogador encaixa a peça no lugar certo
const pecas = [
    { id: "ula", nome: "ULA",
      explicacao: "faz as contas e as comparações. É a calculadora do processador." },
    { id: "uc", nome: "UC",
      explicacao: "comanda o processador: busca cada instrução, entende o que ela pede e avisa cada parte o que fazer." },
    { id: "registradores", nome: "Registradores",
      explicacao: "guardam os dados que a CPU está usando agora. São a memória mais rápida que existe." },
    { id: "memoria", nome: "Memória",
      explicacao: "guarda os programas e os dados. A CPU lê e grava nela pelos barramentos de endereço e de dados." },
    { id: "es", nome: "Entrada e saída",
      explicacao: "é por onde o computador conversa com o mundo: teclado e mouse (entrada), tela e impressora (saída)." }
];


// ===== PARTE B: elementos da página e estado do jogo =====

const bandeja = document.getElementById("bandeja");
const vagas = document.querySelectorAll(".vaga");
const contadorPecas = document.getElementById("contador-pecas");
const explicacaoPeca = document.getElementById("explicacao-peca");
const botaoRecomecar = document.getElementById("reiniciar-montar");

let pecaSelecionada = null;  // peça escolhida com clique/toque (para quem não arrasta)
let encaixadas = 0;          // quantas peças já estão no lugar certo

// Guarda a dica original de cada vaga, para poder recomeçar depois
for (let i = 0; i < vagas.length; i++) {
    vagas[i].dataset.dica = vagas[i].querySelector(".dica-vaga").textContent;
}


// ===== PARTE C: funções de apoio =====

// Procura a peça pelo id (ex.: "ula") e devolve o objeto dela
function buscarPeca(id) {
    for (let i = 0; i < pecas.length; i++) {
        if (pecas[i].id === id) {
            return pecas[i];
        }
    }
    return null;
}

// Devolve uma cópia da lista com os itens em ordem sorteada
// (vai do fim para o começo trocando cada item com um sorteado antes dele)
function embaralhar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
        const sorteado = Math.floor(Math.random() * (i + 1));
        const guardado = copia[i];
        copia[i] = copia[sorteado];
        copia[sorteado] = guardado;
    }
    return copia;
}

// Escreve uma mensagem na caixa de explicação.
// tipo: "" (normal), "certo" (azul) ou "erro" (vermelho)
function mostrarMensagem(texto, tipo) {
    explicacaoPeca.textContent = texto;
    explicacaoPeca.classList.remove("certo", "erro");
    if (tipo !== "") {
        explicacaoPeca.classList.add(tipo);
    }
}

function atualizarContadorPecas() {
    contadorPecas.textContent = encaixadas + " de " + pecas.length + " peças no lugar";
}


// ===== PARTE D: escolher uma peça (clique ou toque) =====

function selecionarPeca(elemento) {
    // Tira a marca da peça que estava escolhida antes
    if (pecaSelecionada !== null) {
        pecaSelecionada.classList.remove("selecionada");
    }

    // Clicou de novo na mesma peça: desmarca
    if (pecaSelecionada === elemento) {
        pecaSelecionada = null;
        mostrarMensagem("Escolha uma peça para começar.", "");
        return;
    }

    pecaSelecionada = elemento;
    elemento.classList.add("selecionada");
    mostrarMensagem("Agora clique no espaço onde a peça " + elemento.textContent + " se encaixa.", "");
}


// ===== PARTE E: tentar encaixar uma peça numa vaga =====

function tentarEncaixar(idPeca, vaga) {
    // Vaga já preenchida: não faz nada
    if (vaga.classList.contains("preenchida")) {
        return;
    }

    const peca = buscarPeca(idPeca);

    if (vaga.dataset.vaga === idPeca) {
        // ACERTOU: a vaga ganha o nome e a cor da peça
        // (e perde a marca vermelha, se alguém tinha errado nela antes)
        vaga.classList.remove("errou");
        vaga.classList.add("preenchida", "cor-" + idPeca);
        vaga.innerHTML = "<strong>" + peca.nome + "</strong>" +
                         "<span class=\"dica-vaga\">" + vaga.dataset.dica + "</span>";

        // Tira a peça da bandeja
        bandeja.querySelector("[data-peca=\"" + idPeca + "\"]").remove();
        pecaSelecionada = null;

        encaixadas++;
        atualizarContadorPecas();
        mostrarMensagem("✔ " + peca.nome + ": " + peca.explicacao, "certo");

        // Todas as peças no lugar: comemora (chuvaDeBits está no script.js)
        if (encaixadas === pecas.length) {
            mostrarMensagem("✔ Processador montado! Todas as peças estão no lugar. Clique em Recomeçar para jogar de novo.", "certo");
            chuvaDeBits();
        }
    } else {
        // ERROU: a vaga treme (tira e põe a classe para a animação repetir)
        vaga.classList.remove("errou");
        void vaga.offsetWidth;
        vaga.classList.add("errou");

        // Depois de 0,6 segundo a borda vermelha some
        setTimeout(function () {
            vaga.classList.remove("errou");
        }, 600);

        mostrarMensagem("✘ " + peca.nome + " não vai aí. Leia a dica embaixo de cada espaço e tente de novo.", "erro");
    }
}


// ===== PARTE F: criar as peças na bandeja =====

function montarBandeja() {
    bandeja.innerHTML = "";
    const ordem = embaralhar(pecas);

    for (let i = 0; i < ordem.length; i++) {
        const elemento = document.createElement("div");
        elemento.classList.add("peca", "cor-" + ordem[i].id);
        elemento.textContent = ordem[i].nome;
        elemento.dataset.peca = ordem[i].id;
        elemento.draggable = true;   // permite arrastar com o mouse

        // Começou a arrastar: guarda o id da peça no "pacote" do arraste
        elemento.addEventListener("dragstart", function (evento) {
            evento.dataTransfer.setData("text/plain", elemento.dataset.peca);
            elemento.classList.add("arrastando");
        });

        // Soltou (em qualquer lugar): tira o visual de "arrastando"
        elemento.addEventListener("dragend", function () {
            elemento.classList.remove("arrastando");
        });

        // Clique ou toque: escolhe a peça (alternativa ao arraste, para celular)
        elemento.addEventListener("click", function () {
            selecionarPeca(elemento);
        });

        bandeja.appendChild(elemento);
    }
}


// ===== PARTE G: eventos das vagas =====

for (let i = 0; i < vagas.length; i++) {
    const vaga = vagas[i];

    // Peça passando por cima: precisa do preventDefault para o navegador deixar soltar aqui
    vaga.addEventListener("dragover", function (evento) {
        evento.preventDefault();
        vaga.classList.add("por-cima");
    });

    // Peça saiu de cima sem soltar
    vaga.addEventListener("dragleave", function () {
        vaga.classList.remove("por-cima");
    });

    // Soltou a peça na vaga: pega o id guardado no dragstart e tenta encaixar
    vaga.addEventListener("drop", function (evento) {
        evento.preventDefault();
        vaga.classList.remove("por-cima");
        tentarEncaixar(evento.dataTransfer.getData("text/plain"), vaga);
    });

    // Clique ou toque na vaga, depois de ter escolhido uma peça
    vaga.addEventListener("click", function () {
        if (pecaSelecionada !== null) {
            tentarEncaixar(pecaSelecionada.dataset.peca, vaga);
        }
    });
}


// ===== PARTE H: recomeçar =====

function recomecarMontagem() {
    // Esvazia as vagas: volta só com a dica
    for (let i = 0; i < vagas.length; i++) {
        const vaga = vagas[i];
        vaga.className = "vaga";   // tira todas as classes e deixa só "vaga"
        if (vaga.dataset.vaga === "registradores") {
            vaga.classList.add("bloco-largo");
        }
        if (vaga.dataset.vaga === "es" || vaga.dataset.vaga === "memoria") {
            vaga.classList.add("bloco-fora");
        }
        vaga.innerHTML = "<span class=\"dica-vaga\">" + vaga.dataset.dica + "</span>";
    }

    encaixadas = 0;
    pecaSelecionada = null;
    atualizarContadorPecas();
    mostrarMensagem("Escolha uma peça para começar.", "");
    montarBandeja();
}

botaoRecomecar.addEventListener("click", recomecarMontagem);

// Prepara o jogo quando a página abre
recomecarMontagem();
