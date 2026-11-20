# Circuito Cruzado

Cruzadinha de Arquitetura Computacional para treinar os termos da aula de Tópicos de Arquitetura Computacional, direto no navegador.

**Jogue aqui:** _(colocar aqui o link do GitHub Pages depois de publicar)_

---

## Sobre o jogo

O site tem três partes, que ficam no menu do topo:

| Seção | O que tem |
|---|---|
| **Cruzadinha** (abre primeiro) | Tabuleiro com as 16 palavras da lista, todas cruzadas entre si, com pistas numeradas em Horizontais e Verticais. |
| **Processador** | Jogo de arrastar as peças (ULA, UC, Registradores, Memória e Entrada e saída) para montar o processador no lugar certo. |
| **Glossário** | Explicação curta de cada termo, com busca e filtro por categoria. Atenção: mostra as respostas da cruzadinha. |

Trocar de seção não apaga o que já foi digitado na cruzadinha.

## Como jogar

### Cruzadinha

1. Clique numa pista (nas colunas dos lados) ou numa casa do tabuleiro. A pista escolhida aparece em destaque em cima do tabuleiro.
2. Digite as letras. O cursor anda sozinho para a próxima casa.
3. Use as **setas** para andar pelo tabuleiro e o **Backspace** para apagar e voltar.
4. Numa casa de cruzamento, clique de novo para trocar entre a palavra horizontal e a vertical.
5. Clique em **Conferir**: as palavras certas ficam verdes, as erradas ficam vermelhas, e o contador mostra quantas você acertou (ex.: "8 de 16 palavras").
6. Clique em **Reiniciar** para limpar o tabuleiro e começar de novo.

Acertando as 16 palavras, aparece a tela de vitória.

### Processador

1. Arraste cada peça da bandeja até o espaço certo do diagrama. No celular, toque na peça e depois no espaço.
2. Embaixo de cada espaço há uma dica do que aquela parte faz.
3. Acertou: a peça se encaixa e aparece uma explicação curta sobre ela. Errou: o espaço treme e você pode tentar de novo.
4. **Recomeçar** embaralha as peças e esvazia o diagrama.

### Glossário

Digite na busca (ex.: "memória") ou use os botões de categoria para filtrar os termos.

## Palavras e pistas

O tabuleiro usa as **16 palavras** da lista da atividade.

> **Atenção:** as pistas marcadas como **rascunho** são provisórias e ainda vão ser reescritas com as minhas palavras, seguindo as regras da atividade (no máximo 15 palavras, sem a resposta, sem a sigla por extenso e levando a uma única resposta). No código (`script.js`) elas estão com `rascunho: true` e aparecem com a etiqueta "RASCUNHO" no jogo.

### Horizontais

| Nº | Palavra | Pista | Situação |
|---|---|---|---|
| 3 | DMA | Recurso que deixa um dispositivo transferir informações sem precisar da ajuda do processador. | rascunho |
| 4 | CPU | Cérebro do computador: busca, decodifica e executa as instruções dos programas. | rascunho |
| 6 | REGISTRADORES | Pequenas memórias dentro do processador, as mais rápidas de toda a hierarquia. | rascunho |
| 11 | DUALCORE | Processador com duas unidades de execução independentes dentro do mesmo chip. | rascunho |
| 13 | ROM | Memória gravada na fábrica, que o usuário não consegue alterar. | rascunho |
| 14 | FLASH | Memória permanente regravável em blocos, usada em pendrives e cartões SD. | rascunho |
| 15 | ULA | Parte do processador que soma, subtrai e compara valores. | rascunho |
| 16 | QUADCORE | Processador com quatro unidades de execução independentes dentro do mesmo chip. | rascunho |

### Verticais

| Nº | Palavra | Pista | Situação |
|---|---|---|---|
| 1 | MEMORIADEMASSA | Guarda arquivos de forma permanente e em grande quantidade, como HD e SSD. | rascunho |
| 2 | MICROCONTROLADOR | Chip único com processador, memória e periféricos, usado em sistemas embarcados como Arduino. | rascunho |
| 5 | CACHE | Memória rápida entre o processador e a memória principal, com os dados mais usados. | final |
| 7 | EEPROM | Memória permanente que pode ser regravada byte a byte, ideal para guardar configurações. | rascunho |
| 8 | ADDRESSBUS | Vias que indicam em qual posição da memória o processador vai ler ou escrever. | rascunho |
| 9 | DATABUS | Vias que levam os valores lidos ou escritos entre o processador e a memória. | rascunho |
| 10 | UC | Parte do processador que coordena as outras, dizendo o que fazer a cada passo. | rascunho |
| 12 | RAM | Memória principal e volátil, onde ficam os aplicativos que estão abertos. | rascunho |

## Arquivos do projeto

| Arquivo | Para que serve |
|---|---|
| `index.html` | Estrutura da página: topo com menu e as três seções. |
| `style.css` | Todo o visual (cores, layout, animações e versão para celular). |
| `script.js` | Cruzadinha (tabuleiro, pistas, teclado, Conferir, contador, Reiniciar e vitória) e o menu. |
| `processador.js` | Jogo de montar o processador arrastando as peças. |
| `glossario.js` | Termos do glossário, busca e filtros. |
| `README.md` | Este arquivo. |

## Tecnologias

- HTML, CSS e JavaScript puros, sem nenhuma biblioteca.
- Publicado como site estático no GitHub Pages.

Para rodar no computador, basta abrir o arquivo `index.html` no navegador.
