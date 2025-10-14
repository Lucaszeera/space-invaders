const nave = document.querySelector('.nave');
const campoDeBatalha = document.querySelector('.main');

const minX = 5;
const minY = 5;
const maxX = 95;
const maxY = 35;

let naveX = 50;
let naveY = 80;
let tiroX = 0;
let tiroY = 0;

const step = 0.4;
const keys = {}
const cooldownTiro = 400;
const cooldownInvader = 4000;
let podeAtirar = true;
let podeCriarInvader = true;

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.code === 'Space') tiro();
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

function move() {
    if (keys['a']) naveX -= step;
    if (keys['d']) naveX += step;
    if (keys['w']) naveY -= step;
    if (keys['s']) naveY += step;

    naveX = Math.max(5, Math.min(95, naveX));
    naveY = Math.max(40, Math.min(90, naveY));

    nave.style.left = `${naveX}%`;
    nave.style.top = `${naveY}%`;

    requestAnimationFrame(move);
}
move();

const tiro = () => {
    if (!podeAtirar) return;
    podeAtirar = false;

    const bala = document.createElement('div');
    bala.classList.add('bala');
    bala.style.left = `${naveX}%`;
    bala.style.top = `${naveY - 6}%`;
    tiroX = naveX

    campoDeBatalha.appendChild(bala);
    moverTiro(bala);

    setTimeout(() => {
        podeAtirar = true;
    }, cooldownTiro);
};

function moverTiro(bala) {
    let posY = parseFloat(bala.style.top);

    const intervalo = setInterval(() => {
        posY -= 1;
        bala.style.top = `${posY}%`;
        tiroY = bala.style.top
        if (posY <= 0) {
            bala.remove();
            clearInterval(intervalo);
        }
    }, 10);
}

function moverInvader(invader) {
    let direcao = mudarDirecaoInvader();
    let posX = parseFloat(invader.style.left);
    let posY = parseFloat(invader.style.top);

    const intervalo = setInterval(() => {
        if (Math.random() >= 0.9) direcao = mudarDirecaoInvader();

        if (posY <= minY && direcao === 3) {
            direcao = mudarDirecaoInvader();
            return
        }
        if (posX <= minX && direcao === 2) {
            direcao = mudarDirecaoInvader();
            return
        }
        if (posX >= maxX && direcao === 0) {
            direcao = mudarDirecaoInvader();
            return
        }
        if (posY >= maxY && direcao === 1) {
            direcao = mudarDirecaoInvader();
            return
        }
        if (direcao === 0) posX += 0.4;
        else if (direcao === 1) posY += 0.4;
        else if (direcao === 2) posX -= 0.4;
        else if (direcao === 3) posY -= 0.4;

        invader.style.left = `${posX}%`;
        invader.style.top = `${posY}%`;

        if (posY > 100 || posX > 100 || posX < -5) {
            invader.remove();
            clearInterval(intervalo);
        }
    }, 50);
}

function mudarDirecaoInvader() {
    const direcao = Math.floor(Math.random() * 4);
    return direcao;

}

function gerarInvader() {
    if (!podeCriarInvader) return;
    podeCriarInvader = false;

    const posX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const posY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    const invader = document.createElement('img');
    invader.classList.add('invader');
    invader.src = '../images/invader 1.png';
    invader.style.left = `${posX}%`;
    invader.style.top = `${posY}%`;

    campoDeBatalha.appendChild(invader);
    moverInvader(invader);

    setTimeout(() => {
        podeCriarInvader = true;
        gerarInvader();
    }, cooldownInvader);
}
gerarInvader();