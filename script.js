// ===== PARTE A: os dados do tabuleiro =====

// Tamanho da grade (igual ao desenho que fizemos)
const LINHAS = 16;
const COLUNAS = 15;

// Cada objeto é uma palavra: onde começa (linha e coluna, contando a partir de 0)
// e para onde vai ("H" = horizontal, "V" = vertical)
const palavras = [
    { numero: 1,  palavra: "MEMORIADEMASSA",   linha: 0,  coluna: 2,  direcao: "V" },
    { numero: 2,  palavra: "MICROCONTROLADOR", linha: 0,  coluna: 11, direcao: "V" },
    { numero: 3,  palavra: "DMA",              linha: 2,  coluna: 1,  direcao: "H" },
    { numero: 4,  palavra: "CPU",              linha: 2,  coluna: 11, direcao: "H" },
    { numero: 5,  palavra: "CACHE",            linha: 3,  coluna: 9,  direcao: "V" },
    { numero: 6,  palavra: "REGISTRADORES",    linha: 4,  coluna: 2,  direcao: "H" },
    { numero: 7,  palavra: "EEPROM",           linha: 4,  coluna: 13, direcao: "V" },
    { numero: 8,  palavra: "ADDRESSBUS",       linha: 5,  coluna: 0,  direcao: "V" },
    { numero: 9,  palavra: "DATABUS",          linha: 6,  coluna: 4,  direcao: "V" },
    { numero: 10, palavra: "UC",               linha: 6,  coluna: 6,  direcao: "V" },
    { numero: 11, palavra: "DUALCORE",         linha: 7,  coluna: 2,  direcao: "H" },
    { numero: 12, palavra: "RAM",              linha: 7,  coluna: 8,  direcao: "V" },
    { numero: 13, palavra: "ROM",              linha: 9,  coluna: 11, direcao: "H" },
    { numero: 14, palavra: "FLASH",            linha: 12, coluna: 9,  direcao: "H" },
    { numero: 15, palavra: "ULA",              linha: 13, coluna: 0,  direcao: "H" },
    { numero: 16, palavra: "QUADCORE",         linha: 15, coluna: 5,  direcao: "H" }
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
