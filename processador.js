// =========================================================
// PROCESSADOR
// Parte 1: animação passo a passo de como o computador faz 2 + 3
// Parte 2: jogo de arrastar as peças para montar o processador
// =========================================================


// =================== PARTE 1: VER FUNCIONANDO ===================

// ===== 1A: os passos da animação =====
// Cada passo tem:
//   titulo e texto  -> o que aparece embaixo do diagrama
//   destaque        -> ids das caixas e setas que acendem nesse passo
//   visores         -> o que escrever dentro de cada caixa (o "visorzinho" preto)
const passos = [
    {
        titulo: "Visão geral",
        texto: "A CPU fica no meio: recebe dados pela entrada, busca e guarda informações na memória e entrega o resultado na saída. Dentro dela, ULA, UC e registradores trabalham juntos. Clique em Próximo para acompanhar a conta 2 + 3.",
        destaque: [],
        visores: []
    },
    {
        titulo: "1. Entrada",
        texto: "O usuário digita 2 + 3 no teclado. Esse dado entra no computador por um dispositivo de entrada.",
        destaque: ["v-es", "v-seta-es"],
        visores: [ { id: "v-es", texto: "teclado: 2 + 3" } ]
    },
    {
        titulo: "2. Busca da instrução",
        texto: "O programa fica guardado na memória. A UC busca a próxima instrução: o barramento de endereço diz onde ler e o barramento de dados traz a instrução.",
        destaque: ["v-memoria", "v-seta-mem", "v-uc"],
        visores: [ { id: "v-memoria", texto: "SOMAR R1, R2" }, { id: "v-uc", texto: "buscando..." } ]
    },
    {
        titulo: "3. Decodificação",
        texto: "A UC decodifica a instrução: entende que é uma soma e manda sinais avisando cada parte do que fazer.",
        destaque: ["v-uc"],
        visores: [ { id: "v-uc", texto: "é uma SOMA!" } ]
    },
    {
        titulo: "4. Dados nos registradores",
        texto: "Os números 2 e 3 são colocados nos registradores, a memória mais rápida, bem ao lado da ULA.",
        destaque: ["v-registradores"],
        visores: [ { id: "v-registradores", texto: "R1 = 2 · R2 = 3" } ]
    },
    {
        titulo: "5. Execução",
        texto: "A ULA pega os valores dos registradores e faz a conta: 2 + 3 = 5.",
        destaque: ["v-ula", "v-registradores"],
        visores: [ { id: "v-registradores", texto: "R1 = 2 · R2 = 3" }, { id: "v-ula", texto: "2 + 3 = 5" } ]
    },
    {
        titulo: "6. Resultado guardado",
        texto: "O resultado vai para um registrador e depois é gravado na memória, de novo passando pelos barramentos.",
        destaque: ["v-registradores", "v-seta-mem", "v-memoria"],
        visores: [ { id: "v-registradores", texto: "R3 = 5" }, { id: "v-memoria", texto: "resultado = 5" } ]
    },
    {
        titulo: "7. Saída",
        texto: "Por fim, o resultado aparece na tela, um dispositivo de saída. E o ciclo recomeça com a próxima instrução!",
        destaque: ["v-es", "v-seta-es"],
        visores: [ { id: "v-es", texto: "tela: 5" } ]
    }
];


// ===== 1B: elementos da página =====

const diagramaVer = document.getElementById("diagrama-ver");
const contadorPasso = document.getElementById("contador-passo");
const tituloPasso = document.getElementById("titulo-passo");
const textoPasso = document.getElementById("texto-passo");
const botaoAnterior = document.getElementById("passo-anterior");
const botaoProximo = document.getElementById("passo-proximo");
const botaoPlay = document.getElementById("passo-play");

let passoAtual = 0;        // número do passo que está na tela
let temporizador = null;   // guarda o "relógio" do modo Reproduzir (null = parado)


// ===== 1C: mostrar um passo =====

function mostrarPasso(numero) {
    passoAtual = numero;
    const passo = passos[numero];

    // 1. Apaga os destaques e os visores do passo anterior
    const partes = diagramaVer.querySelectorAll(".bloco, .seta");
    for (let i = 0; i < partes.length; i++) {
        partes[i].classList.remove("ativo");
    }
    const visores = diagramaVer.querySelectorAll(".visor");
    for (let i = 0; i < visores.length; i++) {
        visores[i].textContent = "";
    }

    // 2. Acende as partes deste passo
    for (let i = 0; i < passo.destaque.length; i++) {
        document.getElementById(passo.destaque[i]).classList.add("ativo");
    }

    // 3. Escreve nos visores deste passo
    for (let i = 0; i < passo.visores.length; i++) {
        const caixa = document.getElementById(passo.visores[i].id);
        caixa.querySelector(".visor").textContent = passo.visores[i].texto;
    }

    // 4. Se alguma parte está acesa, as outras ficam apagadinhas (classe no CSS)
    if (passo.destaque.length > 0) {
        diagramaVer.classList.add("tem-destaque");
    } else {
        diagramaVer.classList.remove("tem-destaque");
    }

    // 5. Textos embaixo do diagrama
    contadorPasso.textContent = "Passo " + numero + " de " + (passos.length - 1);
    tituloPasso.textContent = passo.titulo;
    textoPasso.textContent = passo.texto;

    // 6. Desativa "Anterior" no primeiro passo e "Próximo" no último
    botaoAnterior.disabled = (numero === 0);
    botaoProximo.disabled = (numero === passos.length - 1);
}


// ===== 1D: botões Anterior, Próximo e Reproduzir =====

// Para o modo Reproduzir e volta o botão ao normal
function pararReproducao() {
    clearInterval(temporizador);
    temporizador = null;
    botaoPlay.textContent = "▶ Reproduzir";
}

// Usada pelo modo Reproduzir: avança um passo, ou para quando chega no fim
function avancarSozinho() {
    if (passoAtual < passos.length - 1) {
        mostrarPasso(passoAtual + 1);
    } else {
        pararReproducao();
    }
}

botaoAnterior.addEventListener("click", function () {
    pararReproducao();
    mostrarPasso(passoAtual - 1);
});

botaoProximo.addEventListener("click", function () {
    pararReproducao();
    mostrarPasso(passoAtual + 1);
});

botaoPlay.addEventListener("click", function () {
    if (temporizador === null) {
        // Estava parado: começa (se já estava no fim, recomeça do início)
        if (passoAtual === passos.length - 1) {
            mostrarPasso(0);
        }
        // setInterval chama a função a cada 3000 milissegundos (3 segundos)
        temporizador = setInterval(avancarSozinho, 3000);
        botaoPlay.textContent = "❚❚ Pausar";
        avancarSozinho();
    } else {
        // Estava reproduzindo: pausa
        pararReproducao();
    }
});

// Mostra o primeiro passo quando a página abre
mostrarPasso(0);


// =================== PARTE 2: MONTAR O PROCESSADOR ===================

// ===== 2A: as peças =====
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


// ===== 2B: elementos da página e estado do jogo =====

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


// ===== 2C: funções de apoio =====

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


// ===== 2D: escolher uma peça (clique ou toque) =====

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


// ===== 2E: tentar encaixar uma peça numa vaga =====

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


// ===== 2F: criar as peças na bandeja =====

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


// ===== 2G: eventos das vagas =====

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


// ===== 2H: recomeçar =====

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
