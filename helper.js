const RA_CARTA = 1.39 // Relação de aspeto da carta (64:89)
const CORES = [
    [35, 85, 172],
    [163, 12, 19],
    [225, 182, 21]
]

let historico = {
    pos: -1,
    dados: []
}

let cartas_descartadas = []      // Cartas que já foram utilizadas
let mesa = []                   // Lista de cartas que estão na mesa

let carta_escolhida = [-1, -1]  // Carta escolhida pelo utilizador
let mesaY = 0

function iniciarJogo() {
    for (let cor = 0; cor < 3; cor++) {
        cartas_descartadas.push([])
        for (let carta = 0; carta < 8; carta++)
        cartas_descartadas[cor].push(false)
    }
    
    mesa = [-1, -1, -1, -1, -1]
    adicionarAoHistorico()
}

function setup() {

    iniciarJogo()
    // Inicializar a framework Vue.js
    window.app = new Vue({
        el: '#app',
        data: {
            a: 0
        },
        methods: {
            combinacaoDisponivel(a, b, c, d=-1) {
                this.a
                return combinacaoDisponivel(a, b, c, d)
            }
        }
    })

    // Criar uma tela para desenhar o jogo
    let canvas = createCanvas(750, 430)
    canvas.parent('game')
}

function draw() {
    // Limpar canvas
    background(16, 16, 21)

    // Desenhar todas as cartas para selecionar
    let LARGURA_CARTA = width/(4*3)
    let ALTURA_CARTA = LARGURA_CARTA * RA_CARTA
    for (let cor = 0; cor < 3; cor++) {

        for (let carta = 1; carta <= 8; carta++) {
            // Calcular posição onde a carta deve ser desenhada
            let x, y
            if (carta_escolhida[0] == cor && carta_escolhida[1] == carta) {
                continue
                
            }
            else if (carta <= 4) {
                x = LARGURA_CARTA * (carta-1) + (cor * LARGURA_CARTA * 4)
                y = 0
            } else {
                x = LARGURA_CARTA * (carta%5) + (cor * LARGURA_CARTA * 4)
                y = ALTURA_CARTA
            }
        
            fill(CORES[cor])

            // Verificar se a carta ja foi utilizada
            if (cartas_descartadas[cor][carta-1]) fill(70)

            stroke(0)
            strokeWeight(1)
            rect(x, y, LARGURA_CARTA, ALTURA_CARTA)

            // Desenhar valor da carta
            let centro = {
                x: x + (LARGURA_CARTA / 2),
                y: y + (ALTURA_CARTA / 2)
            }

            fill(255)
            textAlign(CENTER, CENTER)
            textSize(24)
            stroke(0)
            strokeWeight(3)
            text(carta, centro.x, centro.y)
        }
    }


    // Desenhar cartas na mesa
    mesaY = ALTURA_CARTA * 2 + (height*.1)
    LARGURA_CARTA = width / 5
    ALTURA_CARTA = LARGURA_CARTA * RA_CARTA
    for (let pos = 0; pos < 5; pos++) {

        // Desenhar local onde ficam as cartas
        fill(16, 16, 21)
        stroke(255)
        strokeWeight(2)
        let x = pos * LARGURA_CARTA
        rect(x, mesaY, LARGURA_CARTA, ALTURA_CARTA)

        // Verificar se não existe uma carta nesta posição
        if (mesa[pos] == -1)
            continue
        
        // Desenhar carta
        let cor = mesa[pos][0]
        let valor = mesa[pos][1]

        fill(CORES[cor])
        stroke(255)
        strokeWeight(2)
        rect(x, mesaY, LARGURA_CARTA, ALTURA_CARTA)

        fill(255)
        textAlign(CENTER, CENTER)
        textSize(36)
        stroke(0)
        strokeWeight(3)
        let centro = {
            x: x + (LARGURA_CARTA / 2),
            y: mesaY + (ALTURA_CARTA / 2)
        }
        text(valor, centro.x, centro.y)
    }

    // Verificar se o utilizador tem uma carta na mão
    if (carta_escolhida[0] != -1 && carta_escolhida[1] != -1) {
        let cor = carta_escolhida[0]
        let valor = carta_escolhida[1]

        let x = mouseX - (LARGURA_CARTA / 2)
        let y = mouseY - (ALTURA_CARTA / 2)

        fill(CORES[cor])
        stroke(255)
        strokeWeight(2)
        rect(x, y, LARGURA_CARTA, ALTURA_CARTA)

        let centro = {
            x: x + (LARGURA_CARTA / 2),
            y: y + (ALTURA_CARTA / 2)
        }
        
        fill(255)
        textAlign(CENTER, CENTER)
        textSize(36)
        stroke(0)
        strokeWeight(3)
        text(valor, centro.x, centro.y)
        
    }
}

function mousePressed() {
    // Verificar se o utilizador carregou fora do canvas
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height)
        return
        

    let LARGURA_CARTA = width/(4*3)
    let ALTURA_CARTA = LARGURA_CARTA * RA_CARTA

    // Verificar se o utilizador escolheu uma carta
    if (mouseY < ALTURA_CARTA * 2) {
        // Obter carta escolhida pelo utilizador
        let cor = floor(mouseX / (width/3)) 
        
        let x = floor(mouseX / LARGURA_CARTA)
        let carta = x % 4 + 1
        if (mouseY > ALTURA_CARTA) carta += 4
        
        // Verificar se a carta ja foi utilizada
        if (cartas_descartadas[cor][carta-1])
            return

        carta_escolhida = [cor, carta]
    }
}

function mouseReleased() {
    // Verificar se o utilizador tinha uma carta na mão
    if (carta_escolhida[0] == -1 || carta_escolhida[1] == -1)
        return

    // Verificar se o utilizador largou a carta fora do canvas
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height)
        return

    let cor = carta_escolhida[0]
    let carta = carta_escolhida[1]

    // Posição onde começa a mesa
    let LARGURA_CARTA = width/5
    let ALTURA_CARTA = LARGURA_CARTA * RA_CARTA

    if (mouseY > mesaY && mouseY < (mesaY + ALTURA_CARTA)) {
        
        // Obter localização escolhida
        let pos = floor(mouseX / (width/5))
        
        if (mesa[pos] != -1) {
            // Obter carta antiga
            let carta_antiga = {
                cor: mesa[pos][0],
                valor: mesa[pos][1]
            }

            cartas_descartadas[carta_antiga.cor][carta_antiga.valor-1] = true
            app.a++
        }
        mesa[pos] = carta_escolhida
        adicionarAoHistorico()
    }

    //cartas_descartadas[cor][carta-1] = true
    
    carta_escolhida = [-1, -1]
}


/* Funções relativas ao historico */
function limpar() {
    historico.pos = 1
    desfazer()
}

function desfazer() {
    if (historico.pos < 1)
        return

    carregarDoHistorico(--historico.pos)
}

function refazer() {
    if (historico.pos >= historico.dados.length - 1)
        return
    
    carregarDoHistorico(++historico.pos)
}

function carregarDoHistorico(pos) {
    let dados = JSON.parse(JSON.stringify(historico.dados[pos]))

    cartas_descartadas = dados.cartas_descartadas
    mesa = dados.mesa
    app.a++
}

function adicionarAoHistorico() {
    if (historico.pos + 1 < historico.dados.length)
        historico.dados.splice(historico.pos + 1, historico.dados.length - historico.pos)
    
    historico.dados.push(
        JSON.parse(
            JSON.stringify(
                {
                    mesa,
                    cartas_descartadas
                }
            )
        )
    )

    historico.pos++
}

function cartaDisponivel(carta, cor) {
    return !cartas_descartadas[cor][carta-1]
}


function combinacaoDisponivel(a, b, c, cor=-1) {
    // Ordenar cartas pelos valores
    let ord = [a, b, c].sort()
    a = ord[0]
    b = ord[1]
    c = ord[2]

    // Verificar se a combinação são de cartas com o mesmo valor
    if (a == b && b == c) {
        return cartaDisponivel(a, 0) && cartaDisponivel(a, 1) && cartaDisponivel(a, 2)
    }

    // Verificar se é uma sequencia
    if (a + 1 == b && b + 1 == c) {
        // Verificar se a sequencia pode ser de qualquer cor
        if (cor == -1) {
            return (cartaDisponivel(a, 0) || cartaDisponivel(a, 1) || cartaDisponivel(a, 2)) 
                && (cartaDisponivel(b, 0) || cartaDisponivel(b, 1) || cartaDisponivel(b, 2))
                && (cartaDisponivel(c, 0) || cartaDisponivel(c, 1) || cartaDisponivel(c, 2))
        }

        return cartaDisponivel(a, cor) && cartaDisponivel(b, cor) && cartaDisponivel(c, cor)
    }
}