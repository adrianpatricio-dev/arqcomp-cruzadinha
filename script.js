// ===== PARTE A: os dados do tabuleiro =====

// Tamanho da grade (igual ao desenho que fizemos)
const LINHAS = 16;
const COLUNAS = 15;

// Texto provisório das pistas que ainda vão ser escritas
const PISTA_PENDENTE = "(pista a escrever)";

// Cada objeto é uma palavra: onde começa (linha e coluna, contando a partir de 0),
// para onde vai ("H" = horizontal, "V" = vertical) e a pista que aparece na tela
const palavras = [
    { numero: 1,  palavra: "MEMORIADEMASSA",   linha: 0,  coluna: 2,  direcao: "V", pista: PISTA_PENDENTE },
    { numero: 2,  palavra: "MICROCONTROLADOR", linha: 0,  coluna: 11, direcao: "V", pista: PISTA_PENDENTE },
    { numero: 3,  palavra: "DMA",              linha: 2,  coluna: 1,  direcao: "H", pista: PISTA_PENDENTE },
    { numero: 4,  palavra: "CPU",              linha: 2,  coluna: 11, direcao: "H", pista: PISTA_PENDENTE },
    { numero: 5,  palavra: "CACHE",            linha: 3,  coluna: 9,  direcao: "V", pista: "Memória rápida entre o processador e a memória principal, com os dados mais usados." },
    { numero: 6,  palavra: "REGISTRADORES",    linha: 4,  coluna: 2,  direcao: "H", pista: PISTA_PENDENTE },
    { numero: 7,  palavra: "EEPROM",           linha: 4,  coluna: 13, direcao: "V", pista: PISTA_PENDENTE },
    { numero: 8,  palavra: "ADDRESSBUS",       linha: 5,  coluna: 0,  direcao: "V", pista: PISTA_PENDENTE },
    { numero: 9,  palavra: "DATABUS",          linha: 6,  coluna: 4,  direcao: "V", pista: PISTA_PENDENTE },
    { numero: 10, palavra: "UC",               linha: 6,  coluna: 6,  direcao: "V", pista: PISTA_PENDENTE },
    { numero: 11, palavra: "DUALCORE",         linha: 7,  coluna: 2,  direcao: "H", pista: PISTA_PENDENTE },
    { numero: 12, palavra: "RAM",              linha: 7,  coluna: 8,  direcao: "V", pista: PISTA_PENDENTE },
    { numero: 13, palavra: "ROM",              linha: 9,  coluna: 11, direcao: "H", pista: PISTA_PENDENTE },
    { numero: 14, palavra: "FLASH",            linha: 12, coluna: 9,  direcao: "H", pista: PISTA_PENDENTE },
    { numero: 15, palavra: "ULA",              linha: 13, coluna: 0,  direcao: "H", pista: PISTA_PENDENTE },
    { numero: 16, palavra: "QUADCORE",         linha: 15, coluna: 5,  direcao: "H", pista: PISTA_PENDENTE }
];


// ===== PARTE B: montar o mapa (matriz) com as letras =====

// Cria uma grade de LINHAS x COLUNAS com tudo vazio (null)
const mapa = [];
for (let l = 0; l < LINHAS; l++) {
    mapa.push([]);
    for (let c = 0; c < COLUNAS; c++) {
        mapa[l].push(null);
    }
}

// Para cada palavra, grava cada letra na casa certa do mapa
for (let i = 0; i < palavras.length; i++) {
    const p = palavras[i];

    for (let j = 0; j < p.palavra.length; j++) {
        let linha = p.linha;
        let coluna = p.coluna;

        if (p.direcao === "H") {
            coluna = coluna + j; // horizontal: anda para a direita
        } else {
            linha = linha + j;   // vertical: anda para baixo
        }

        mapa[linha][coluna] = p.palavra[j];
    }
}


// ===== PARTE C: desenhar o tabuleiro na tela =====

const tabuleiro = document.getElementById("tabuleiro");

// Guarda os campos de digitar por posição, para usar depois no botão Conferir
const campos = [];

for (let l = 0; l < LINHAS; l++) {
    campos.push([]);

    for (let c = 0; c < COLUNAS; c++) {
        const casa = document.createElement("div");
        casa.classList.add("casa");

        if (mapa[l][c] === null) {
            // Casa sem letra: fica vazia (vai ser escura no CSS)
            casa.classList.add("vazia");
            campos[l].push(null);
        } else {
            // Casa com letra: vira um campo de digitar
            // (quem garante que fica só 1 letra é a PARTE G, no evento "input")
            const campo = document.createElement("input");
            campo.autocomplete = "off";       // o navegador não sugere palavras
            campo.spellcheck = false;         // sem sublinhado vermelho de ortografia
            campo.setAttribute("autocapitalize", "characters"); // teclado do celular em maiúsculas
            campo.setAttribute("aria-label", "Linha " + (l + 1) + ", coluna " + (c + 1));
            casa.appendChild(campo);
            campos[l].push(campo);
        }

        tabuleiro.appendChild(casa);
    }
}

// Coloca o número da pista na casa onde cada palavra começa
for (let i = 0; i < palavras.length; i++) {
    const p = palavras[i];
    const casa = campos[p.linha][p.coluna].parentElement;

    const numero = document.createElement("span");
    numero.classList.add("numero");
    numero.textContent = p.numero;
    casa.appendChild(numero);
}


// ===== PARTE D: mostrar as pistas =====

const listaHorizontais = document.getElementById("pistas-horizontais");
const listaVerticais = document.getElementById("pistas-verticais");

// Monta o texto de uma pista, por exemplo: "5. Memória rápida..."
function textoDaPista(p) {
    return p.numero + ". " + p.pista;
}

for (let i = 0; i < palavras.length; i++) {
    const p = palavras[i];

    const item = document.createElement("li");
    item.textContent = textoDaPista(p);

    // Clicar na pista seleciona a palavra e leva o cursor para a primeira casa vazia dela
    // (as funções selecionarPalavra e primeiraCasaVazia estão na PARTE G)
    item.addEventListener("click", function () {
        selecionarPalavra(p);
        primeiraCasaVazia(p).focus();
    });

    // Cada pista vai para a lista da sua direção
    if (p.direcao === "H") {
        listaHorizontais.appendChild(item);
    } else {
        listaVerticais.appendChild(item);
    }

    // Guarda o item dentro da própria palavra, para marcar certo/errado depois
    p.item = item;
}


// ===== PARTE E: botão Conferir e contador de acertos =====

const contador = document.getElementById("contador");
const barraPreenchida = document.getElementById("barra-preenchida");
const botaoConferir = document.getElementById("botao-conferir");

// Escreve "X de 16 palavras" e enche a barra de progresso na mesma proporção
function atualizarContador(acertos) {
    contador.textContent = acertos + " de " + palavras.length + " palavras";

    // Regra de três: acertos / total * 100 = porcentagem da barra
    const porcentagem = acertos / palavras.length * 100;
    barraPreenchida.style.width = porcentagem + "%";
}

// Começa mostrando zero acertos
atualizarContador(0);

// Devolve a lista de campos (inputs) de uma palavra, na ordem das letras
function camposDaPalavra(p) {
    const lista = [];
    for (let j = 0; j < p.palavra.length; j++) {
        if (p.direcao === "H") {
            lista.push(campos[p.linha][p.coluna + j]);
        } else {
            lista.push(campos[p.linha + j][p.coluna]);
        }
    }
    return lista;
}

// Tira as marcações de certo/errado das casas e das pistas
function limparMarcacoes() {
    for (let i = 0; i < palavras.length; i++) {
        const p = palavras[i];
        const lista = camposDaPalavra(p);
        for (let j = 0; j < lista.length; j++) {
            lista[j].classList.remove("certa", "errada");
        }
        p.item.classList.remove("certa", "errada");
        p.item.textContent = textoDaPista(p);
    }
}

function conferir() {
    limparMarcacoes();
    let acertos = 0;

    // 1º passo: descobre quais palavras estão certas
    for (let i = 0; i < palavras.length; i++) {
        const p = palavras[i];
        const lista = camposDaPalavra(p);

        // Junta as letras digitadas numa palavra só
        let digitada = "";
        for (let j = 0; j < lista.length; j++) {
            digitada = digitada + lista[j].value.toUpperCase();
        }

        p.certa = (digitada === p.palavra);
        if (p.certa) {
            acertos++;
        }
    }

    // 2º passo: marca primeiro as erradas e depois as certas.
    // Assim, uma casa de cruzamento que faz parte de uma palavra certa fica "certa".
    for (let i = 0; i < palavras.length; i++) {
        const p = palavras[i];
        if (!p.certa) {
            const lista = camposDaPalavra(p);
            for (let j = 0; j < lista.length; j++) {
                lista[j].classList.add("errada");
            }
            p.item.classList.add("errada");
            p.item.textContent = textoDaPista(p) + " ✘";
        }
    }
    for (let i = 0; i < palavras.length; i++) {
        const p = palavras[i];
        if (p.certa) {
            const lista = camposDaPalavra(p);
            for (let j = 0; j < lista.length; j++) {
                lista[j].classList.remove("errada");
                lista[j].classList.add("certa");
            }
            p.item.classList.add("certa");
            p.item.textContent = textoDaPista(p) + " ✔";
        }
    }

    // Atualiza o contador e a barra
    atualizarContador(acertos);
    if (acertos === palavras.length) {
        contador.textContent = contador.textContent + " — parabéns, você completou tudo!";
    }
}

botaoConferir.addEventListener("click", conferir);


// ===== PARTE F: botão Reiniciar =====

const botaoReiniciar = document.getElementById("botao-reiniciar");

function reiniciar() {
    // Apaga todas as letras digitadas
    for (let l = 0; l < LINHAS; l++) {
        for (let c = 0; c < COLUNAS; c++) {
            if (campos[l][c] !== null) {
                campos[l][c].value = "";
            }
        }
    }

    // Tira as cores e as marcas ✔/✘, e zera o contador
    limparMarcacoes();
    atualizarContador(0);

    // Volta o cursor para a primeira palavra
    campos[palavras[0].linha][palavras[0].coluna].focus();
}

botaoReiniciar.addEventListener("click", reiniciar);


// ===== PARTE G: jogar pelo teclado e destacar a palavra atual =====

const caixaPistaAtual = document.getElementById("pista-atual");

let palavraAtual = null;  // a palavra que o jogador está preenchendo agora
let direcaoAtual = "H";   // direção preferida: "H" ou "V"

// Devolve as palavras que passam por um campo (1 palavra, ou 2 se for um cruzamento)
function palavrasDoCampo(campo) {
    const lista = [];
    for (let i = 0; i < palavras.length; i++) {
        if (camposDaPalavra(palavras[i]).includes(campo)) {
            lista.push(palavras[i]);
        }
    }
    return lista;
}

// Devolve a primeira casa vazia da palavra (ou a primeira casa, se estiver toda preenchida)
function primeiraCasaVazia(p) {
    const lista = camposDaPalavra(p);
    for (let j = 0; j < lista.length; j++) {
        if (lista[j].value === "") {
            return lista[j];
        }
    }
    return lista[0];
}

// Marca uma palavra como a "atual": pinta as casas, destaca a pista e mostra o texto em cima
function selecionarPalavra(p) {
    // 1. Tira o destaque da palavra anterior
    if (palavraAtual !== null) {
        const anteriores = camposDaPalavra(palavraAtual);
        for (let j = 0; j < anteriores.length; j++) {
            anteriores[j].classList.remove("atual");
        }
        palavraAtual.item.classList.remove("ativa");
    }

    // 2. Guarda a nova palavra e a direção dela
    palavraAtual = p;
    direcaoAtual = p.direcao;

    // 3. Destaca as casas e a pista da nova palavra
    const novas = camposDaPalavra(p);
    for (let j = 0; j < novas.length; j++) {
        novas[j].classList.add("atual");
    }
    p.item.classList.add("ativa");

    // 4. Escreve a pista na caixa em cima do tabuleiro
    let nomeDirecao = "Vertical";
    if (p.direcao === "H") {
        nomeDirecao = "Horizontal";
    }
    caixaPistaAtual.innerHTML = "<strong>" + p.numero + " · " + nomeDirecao + "</strong>" + p.pista;
}

// Anda dentro da palavra atual: passo 1 = próxima casa, passo -1 = casa anterior
function andarNaPalavra(campo, passo) {
    const lista = camposDaPalavra(palavraAtual);
    const posicao = lista.indexOf(campo);
    const destino = lista[posicao + passo];

    // Se passou do começo ou do fim da palavra, "destino" fica undefined e não faz nada
    if (destino !== undefined) {
        destino.focus();
    }
    return destino;
}

// Liga os eventos de teclado e mouse em cada campo do tabuleiro
for (let l = 0; l < LINHAS; l++) {
    for (let c = 0; c < COLUNAS; c++) {
        const campo = campos[l][c];
        if (campo === null) {
            continue; // casa vazia: não tem campo, pula para a próxima
        }

        // Quando o campo recebe o foco (clique, Tab ou o cursor andando sozinho)
        campo.addEventListener("focus", function () {
            const lista = palavrasDoCampo(campo);

            // Se a palavra atual passa por aqui, continua nela.
            // Senão, escolhe a palavra que tem a direção preferida (ou a única que tiver)
            if (!lista.includes(palavraAtual)) {
                let escolhida = lista[0];
                for (let i = 0; i < lista.length; i++) {
                    if (lista[i].direcao === direcaoAtual) {
                        escolhida = lista[i];
                    }
                }
                selecionarPalavra(escolhida);
            }

            campo.select(); // seleciona a letra: digitar outra troca a antiga
        });

        // Clicar de novo numa casa de cruzamento troca entre horizontal e vertical
        campo.addEventListener("mousedown", function () {
            const lista = palavrasDoCampo(campo);
            if (document.activeElement === campo && lista.length === 2) {
                if (lista[0] === palavraAtual) {
                    selecionarPalavra(lista[1]);
                } else {
                    selecionarPalavra(lista[0]);
                }
            }
        });

        // Toda vez que o jogador digita algo no campo
        campo.addEventListener("input", function () {
            // Pega só o último caractere e deixa em maiúscula
            let letra = campo.value.slice(-1).toUpperCase();

            // Aceita só letras de A a Z (sem acento, número ou símbolo)
            if (letra < "A" || letra > "Z") {
                letra = "";
            }
            campo.value = letra;

            // Se mudou a letra, a cor de certo/errado dessa casa não vale mais
            campo.classList.remove("certa", "errada");

            // Digitou uma letra válida: o cursor pula sozinho para a próxima casa
            if (letra !== "") {
                andarNaPalavra(campo, 1);
            }
        });

        // Teclas especiais: Backspace e setas
        campo.addEventListener("keydown", function (evento) {
            const tecla = evento.key;

            // Backspace numa casa vazia: volta uma casa e apaga a letra de lá
            if (tecla === "Backspace" && campo.value === "") {
                evento.preventDefault();
                const anterior = andarNaPalavra(campo, -1);
                if (anterior !== undefined) {
                    anterior.value = "";
                    anterior.classList.remove("certa", "errada");
                }
                return;
            }

            // Setas: descobre para que lado andar (dl = linhas, dc = colunas)
            let dl = 0;
            let dc = 0;
            if (tecla === "ArrowRight") { dc = 1; }
            if (tecla === "ArrowLeft")  { dc = -1; }
            if (tecla === "ArrowDown")  { dl = 1; }
            if (tecla === "ArrowUp")    { dl = -1; }

            if (dl === 0 && dc === 0) {
                return; // não era seta: deixa o navegador agir normalmente
            }
            evento.preventDefault(); // impede a página de rolar com as setas

            // Setas para os lados preferem a horizontal; para cima/baixo, a vertical
            if (dc !== 0) {
                direcaoAtual = "H";
            } else {
                direcaoAtual = "V";
            }

            // Vai para a casa vizinha, se ela existir e tiver letra
            const novaLinha = l + dl;
            const novaColuna = c + dc;
            const dentro = novaLinha >= 0 && novaLinha < LINHAS && novaColuna >= 0 && novaColuna < COLUNAS;
            if (dentro && campos[novaLinha][novaColuna] !== null) {
                const vizinho = campos[novaLinha][novaColuna];

                // Se o vizinho tem uma palavra na direção da seta, já seleciona ela
                const lista = palavrasDoCampo(vizinho);
                for (let i = 0; i < lista.length; i++) {
                    if (lista[i].direcao === direcaoAtual) {
                        selecionarPalavra(lista[i]);
                    }
                }
                vizinho.focus();
            }
        });
    }
}
