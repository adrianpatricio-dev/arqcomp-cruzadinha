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
            // Casa com letra: vira um campo que aceita só 1 caractere
            const campo = document.createElement("input");
            campo.maxLength = 1;
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

    // Clicar na pista leva o cursor para a primeira casa da palavra
    item.addEventListener("click", function () {
        campos[p.linha][p.coluna].focus();
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
