
const campoDeBatalha = document.querySelector('.main');
const coracao = document.querySelector('.coracao')
let elementoTelaGameOver;

// da pra esquematizar com encapsulamento
const minXInvader = 5;
const minYInvader = 5;
const maxXInvader = 95;
const maxYInvader = 35;

const minXPlayer = 5;
const minYPlayer = 40;
const maxXPlayer = 95;
const maxYPlayer = 95;

let estaVivo = true;

let naveX = 50;
let naveY = 80;

let gameOver = false;
const speed = 50;
const moveRandomRate = 0.02;
const vidaInicial = 3;
const step = 0.4;
const keys = {}
const cooldownTiroPlayer = 400;
const cooldownTiroInvader = 200;
const cooldownInvader = 5000;
let podeAtirar = true;
let podeCriarInvader = true;
let listaInvaders = []
let listaCoracoes = []


document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.code === 'Space') atirar(nave);
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

function gerarNave() {
    naveX = 50;
    naveY = 80;
    nave = document.createElement('img')
    nave.classList.add('nave')
    nave.src = "../images/ship.png"
    nave.style.left = `${naveX}%`;
    nave.style.top = `${naveY}%`;
    campoDeBatalha.appendChild(nave)
    nave = nave
    move();
}
gerarNave();

function move() {
    if (gameOver) return;
    if (keys['a']) naveX -= step;
    if (keys['d']) naveX += step;
    if (keys['w']) naveY -= step;
    if (keys['s']) naveY += step;

    naveX = Math.max(minXPlayer, Math.min(maxXPlayer, naveX));
    naveY = Math.max(minYPlayer, Math.min(maxYPlayer, naveY));

    nave.style.left = `${naveX}%`;
    nave.style.top = `${naveY}%`;

    requestAnimationFrame(move);
}

function atirar(shooter) {
    if (gameOver) return;
    const isPlayerShooter = shooter === nave;
    if (isPlayerShooter && !podeAtirar) return;

    const bala = document.createElement('div');
    bala.classList.add('bala');
    bala.style.left = `${shooter.style.left}`;
    bala.style.top = `${shooter.style.top}`;

    campoDeBatalha.appendChild(bala);

    moverTiro(bala, isPlayerShooter);

    if (isPlayerShooter) {
        podeAtirar = false;
        setTimeout(() => {
            podeAtirar = true;
        }, cooldownTiroPlayer);
    }
};

function moverTiro(bala, isPlayerShooter) {
    if (gameOver) return;
    let balaY = parseFloat(bala.style.top);
    let jogadorAtirando = isPlayerShooter

    const intervalo = setInterval(() => {
        if (jogadorAtirando) {
            balaY -= 1;

            for (let i = listaInvaders.length - 1; i >= 0; i--) {
                const invaderData = listaInvaders[i]
                const invader = invaderData.objeto
                if (colidiu(invader, bala)) {
                    destruirInvader(invaderData, i)
                    bala.remove();
                    clearInterval(intervalo);
                }
            }
        }
        else {

            balaY += 1;

            if (colidiu(nave, bala)) {
                bala.remove();
                listaCoracoes.pop().remove()
                clearInterval(intervalo)
                if (listaCoracoes.length <= 0) {
                    for (let i = listaInvaders.length - 1; i >= 0; i--) {
                        gameOver = true;
                        bala.remove()
                    }
                    fecharJogo()
                    clearInterval(intervalo)
                    return
                }
            }
        }
        if (balaY <= 0 || balaY >= 98) {
            bala.remove();
            clearInterval(intervalo);
        }

        bala.style.top = `${balaY}%`;

    }, 10);
}

function gerarInvader() {
    if (gameOver) return;
    if (!podeCriarInvader) return;
    podeCriarInvader = false;

    const posX = Math.floor(Math.random() * (maxXInvader - minXInvader)) + minXInvader;
    const posY = Math.floor(Math.random() * (maxYInvader - minYInvader)) + minYInvader;

    const invader = document.createElement('img');
    invader.classList.add('invader');
    invader.src = '../images/invader 1.png';
    invader.style.left = `${posX}%`;
    invader.style.top = `${posY}%`;
    const invaderData = { objeto: invader, intervalos: [] };
    listaInvaders.push(invaderData)

    campoDeBatalha.appendChild(invader);
    moverInvader(invaderData);

    setTimeout(() => {
        podeCriarInvader = true;
        gerarInvader();
    }, cooldownInvader);
}
gerarInvader();

function moverInvader(invaderData) {
    if (gameOver) return;
    const invader = invaderData.objeto;
    let direcao = mudarDirecaoInvader();
    let posX = parseFloat(invader.style.left);
    let posY = parseFloat(invader.style.top);

    const intervaloMovimento = setInterval(() => {
        if (Math.random() <= moveRandomRate) direcao = mudarDirecaoInvader();

        //da pra esquematizar com o encapsulamento 

        if (posY <= minYInvader && direcao === "up") {
            direcao = mudarDirecaoInvader();
            return
        }
        if (posY >= maxYInvader && direcao === "down") {
            direcao = mudarDirecaoInvader();
            return
        }
        if (posX <= minXInvader && direcao === "left") {
            direcao = mudarDirecaoInvader();
            return
        }
        if (posX >= maxXInvader && direcao === "right") {
            direcao = mudarDirecaoInvader();
            return
        }

        if (direcao === "up") posY -= step;
        else if (direcao === "down") posY += step;
        else if (direcao === "left") posX -= step;
        else if (direcao === "right") posX += step;

        invader.style.left = `${posX}%`;
        invader.style.top = `${posY}%`;

    }, speed);

    const intervaloTiro = setInterval(() => {
        atirar(invader);
    }, cooldownTiroInvader);
    invaderData.intervalos.push(intervaloMovimento, intervaloTiro);
    console.log(invaderData)
}

function mudarDirecaoInvader() {
    if (gameOver) return;
    const direcao = ["up", "down", "left", "right"]
    let escolha = Math.floor(Math.random() * 4);
    return direcao[escolha];
}

function destruirInvader(invaderData, index) {

    invader = invaderData.objeto
    invader.remove();
    listaInvaders.splice(index, 1);

    if (invaderData.intervalos) {
        invaderData.intervalos.forEach(intervalo => clearInterval(intervalo));
    }
}

function colidiu(alvo, bala) {
    if (gameOver) return;
    let alvoX = parseFloat(alvo.style.left)
    let alvoY = parseFloat(alvo.style.top)
    let balaX = parseFloat(bala.style.left)
    let balaY = parseFloat(bala.style.top)

    let alvoRadius = 2.5

    return balaX >= alvoX - alvoRadius && balaX <= alvoX + alvoRadius &&
        balaY >= alvoY - alvoRadius && balaY <= alvoY + alvoRadius
};

function renderLife() {

    for (let i = 0; i < vidaInicial; i++) {

        let coracao = document.createElement('img')
        coracao.classList.add('coracao')
        coracao.src = '../images/heartpoint.png'
        coracao.style.top = `${97}%`;
        coracao.style.left = `${3 + i * 4}%`;
        listaCoracoes.push(coracao);
        campoDeBatalha.appendChild(coracao);
    }
}
renderLife()

function reiniciarJogo() {
    console.log("executado restart")
    elementoTelaGameOver.remove()
    elementoTelaGameOver = null

    gameOver = false
    

    gerarNave()
    gerarInvader()
    renderLife()
    

}

function fecharJogo() {
    for (let i = listaInvaders.length - 1; i >= 0; i--) {
        let invaderData = listaInvaders[i]
        destruirInvader(invaderData, i)
    }
    nave.remove()

    const template = document.getElementById('telaGameOver');
    const telaGameOver = template.content.cloneNode(true);

    campoDeBatalha.appendChild(telaGameOver)
    elementoTelaGameOver = campoDeBatalha.querySelector('.gameOver');

    const botaoReiniciar = campoDeBatalha.querySelector('.botaoReiniciar');
    botaoReiniciar.addEventListener('click', reiniciarJogo);
}

