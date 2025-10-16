const nave = document.querySelector('.nave');
const campoDeBatalha = document.querySelector('.main');
const coracao = document.querySelector('.coracao')

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

const moveRandomRate = 0.02;
const vidaInicial = 3;
const step = 0.4;
const keys = {}
const cooldownTiroPlayer = 400;
const cooldownTiroInvader = 3500;
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

function move() {
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
move();

function atirar(shooter) {
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

    let balaY = parseFloat(bala.style.top);
    let jogadorAtirando = isPlayerShooter

    const intervalo = setInterval(() => {
        if (jogadorAtirando) {
            balaY -= 1;

            listaInvaders.forEach((invader, i) => {
                if (colidiu(invader, bala)) {
                    listaInvaders.splice(i, 1)
                    invader.remove();
                    bala.remove();
                    clearInterval(intervalo);
                }
            })
        }
        else {

            balaY += 1;

            if (colidiu(nave, bala)) {
                bala.remove();
                listaCoracoes.pop().remove()
                clearInterval(intervalo)
                if (listaCoracoes.length <= 0) {
                    //Configurar o game over   <<<<<<<<<<<<<<<<<<<<<
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
    if (!podeCriarInvader) return;
    podeCriarInvader = false;

    const posX = Math.floor(Math.random() * (maxXInvader - minXInvader)) + minXInvader;
    const posY = Math.floor(Math.random() * (maxYInvader - minYInvader)) + minYInvader;

    const invader = document.createElement('img');
    invader.classList.add('invader');
    invader.src = '../images/invader 1.png';
    invader.style.left = `${posX}%`;
    invader.style.top = `${posY}%`;
    listaInvaders.push(invader)

    campoDeBatalha.appendChild(invader);
    moverInvader(invader);

    const intervalo = setInterval(() => {
        atirar(invader);
    }, cooldownTiroInvader);

    setTimeout(() => {
        podeCriarInvader = true;
        gerarInvader();
    }, cooldownInvader);
}
gerarInvader();

function moverInvader(invader) {
    let direcao = mudarDirecaoInvader();
    let posX = parseFloat(invader.style.left);
    let posY = parseFloat(invader.style.top);

    const intervalo = setInterval(() => {
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

    }, 50);
    atirar(invader);
}


function mudarDirecaoInvader() {
    const direcao = ["up", "down", "left", "right"]
    let escolha = Math.floor(Math.random() * 4);
    return direcao[escolha];

}

function colidiu(alvo, bala) {
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