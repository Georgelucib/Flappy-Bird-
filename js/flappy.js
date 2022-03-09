//Função que irá criar um novo elemento que serão os canos
function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}
//Constructor que irá criar as barreiras e barreiras reversas
function Barreira (reversa = false){
    this.elemento = novoElemento('div', 'barreira')
    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height =`${altura}px`
}


// const b = new Barreira(true)
// b.setAltura(300)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)


// Constructor que irá colocar as barreiras no flex container 
function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras')
//O "this" serve para que o atributo possa ser usado fora da função
    this.superior = new Barreira(true) 
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

// Aqui é uma função que irá sortear a altura superior e inferior
    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }
    // Aqui estamos pegando o X, splitando ele do px e transformando de string para number
    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    // Aqui estamos alterando o x a partir do x que foi passado   
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth
    this.sortearAbertura()
    this.setX(x)
}

// const b = new ParDeBarreiras(700, 200, 100)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

//Função para controlar multiplas barreiras
    function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
        this.pares = [
            new ParDeBarreiras(altura, abertura, largura),
            new ParDeBarreiras(altura, abertura, largura + espaco),
            new ParDeBarreiras(altura, abertura, largura + espaco *2),
            new ParDeBarreiras(altura, abertura, largura + espaco *3)
        ]
// Aqui denominamos o deslocamento e criamos uma função que irá mover as barreiras
        const deslocamento = 3
        this.animar = () => {
            this.pares.forEach(par => {
                par.setX(par.getX() - deslocamento)

                // Quando o elemento sair da área do jogo
                if (par.getX() <- par.getLargura()) {
                    par.setX(par.getX()+ espaco * this.pares.length)
                    par.sortearAbertura()
                }
                const meio = largura / 2
                const cruzouOMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
                if(cruzouOMeio) notificarPonto()
            })
        }
    }
 //Função que irá criar e controlar o pássaro
    function Passaro(alturaJogo) {
        let voando = false
        this.elemento = novoElemento('img', 'passaro')
        this.elemento.src = 'imgs/passaro.png'
        
        this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
        this.setY = y => this.elemento.style.bottom = `${y}px`

        window.onkeydown = e => voando = true
        window.onkeyup = e => voando = false
 //Função que irá animar o pássaro e um if else para se certificar que o pássaro irá ficar dentro da área do game       
        this.animar = () => {
            const novoY = this.getY() + (voando ? 8 : -5)
            const alturaMaxima = alturaJogo - this.elemento.clientHeight

            if (novoY <= 0){
                this.setY(0)
            } else if (novoY >= alturaMaxima){
                this.setY(alturaMaxima)
            } else{
                this.setY(novoY)
            }
        }
        this.setY(alturaJogo / 2)
        
    }


    function Progresso() {
        this.elemento = novoElemento('span', 'progresso')    
        this.atualizarPontos = pontos => {
            this.elemento.innerHTML = pontos 
        }
        this.atualizarPontos(0)
    }



    
    // const barreiras = new Barreiras(700, 1200, 200, 400 )
    // const passaro = new Passaro(700)
    // const areaDoJogo = document.querySelector('[wm-flappy]')

    // areaDoJogo.appendChild(passaro.elemento)
    // areaDoJogo.appendChild(new Progresso().elemento)
    // barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
    // setInterval(() => {
    //     barreiras.animar()
    //     passaro.animar()
    // },20)


function estaoSobrepostos(elementoA, elementoB){
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()
    
    const horizontal = a.left + a.width >= b.left
        && b.left + a.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    return horizontal && vertical
}

function colidiu(passaro, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(parDeBarreiras =>{
        if (!colidiu){
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            colidiu = estaoSobrepostos(passaro.elemento, superior)
             || estaoSobrepostos(passaro.elemento, inferior)
        }
    })
    return colidiu 
}


//Criação de uma função que irá criar o jogo 
    function FlappyBird(){
        let pontos = 0 

//Area, altura e largura do jogo

        const areaDoJogo = document.querySelector('[wm-flappy]')
        const altura = areaDoJogo.clientHeight
        const largura = areaDoJogo.clientWidth

// Criação do progresso, barreiras e atualizando os pontos
        const progresso = new Progresso()
        const barreiras = new Barreiras(altura, largura, 200, 400,
            () => progresso.atualizarPontos(++pontos))
        const passaro = new Passaro(altura)

 // Colocando os elementos na tela       
        areaDoJogo.appendChild(progresso.elemento)
        areaDoJogo.appendChild(passaro.elemento)
        barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

// Função que irá começar o jogo
        this.start = () => {
            //loop do jogo
            const temporizador = setInterval (() => {
                barreiras.animar()
                passaro.animar()
                if(colidiu(passaro, barreiras)) {
                    clearInterval(temporizador)
                }
            },20)
        }
    }

    new FlappyBird().start()