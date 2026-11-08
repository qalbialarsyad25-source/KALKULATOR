const layarHasil = document.getElementById('hasil');
const layarRiwayat = document.getElementById('riwayat');

const ERROR = 'Tidak terdefinisi';

let angkaSekarang = '0';
let angkaSebelumnya = null;
let operator = null;
let resetLayar = false;

const simbol = { '+': '+', '-': '-', '*': 'x', '/': '/' };

function format(angka){
    return angka.replace('.', ',');
}

function tampilkan(){
    layarHasil.textContent = format(angkaSekarang);
}

function inputAngka(a){
    if (a === ',') a = '.';

    if (resetLayar){
        angkaSekarang = '0';
        resetLayar = false;
    }

    if (a === '.' && angkaSekarang.includes('.')){
        return;
    }

    angkaSekarang = angkaSekarang === '0' && a !== '.' ? a : angkaSekarang + a;
    tampilkan();
}

function hitung(a, b, op){
    a = parseFloat(a);
    b = parseFloat(b);
    switch (op){
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return b === 0 ? ERROR : a / b;
    }
}

function bulatkan(n){
    if (n === ERROR){
        return n;
    }

    return String(parseFloat(n.toFixed(10)));
}

function pilihOperator(op){
    if (angkaSekarang === ERROR){
        return;
    }

    if (operator && !resetLayar){
        const hasil = bulatkan(hitung(angkaSebelumnya, angkaSekarang, operator));
        angkaSekarang = hasil;
        tampilkan();
    }

    angkaSebelumnya = angkaSekarang;
    operator = op;
    resetLayar = true;
    layarRiwayat.textContent = format(angkaSebelumnya) + ' ' + simbol[op];
}

function sama(){
    if (!operator){
        return;
    }

    const hasil = bulatkan(hitung(angkaSebelumnya, angkaSekarang, operator));
    layarRiwayat.textContent = format(angkaSebelumnya) + ' ' + simbol[operator] + ' ' + format(angkaSekarang) + ' =';
    angkaSekarang = hasil;
    operator = null;
    resetLayar = true;
    tampilkan();
}

function bersihkan(){
    angkaSekarang = '0';
    angkaSebelumnya = null;
    operator = null;
    resetLayar = false;
    layarRiwayat.textContent = '';
    tampilkan();
}

function hapusSatu(){
    if (resetLayar || angkaSekarang === ERROR){
        return bersihkan();
    }
    angkaSekarang = angkaSekarang.length > 1 ? angkaSekarang.slice(0, -1) : '0';
    tampilkan();
}

document.querySelector('.tombol').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.dataset.angka) inputAngka(btn.dataset.angka);
    else if (btn.dataset.op) pilihOperator(btn.dataset.op);
    else if (btn.dataset.aksi === 'sama') sama();
    else if (btn.dataset.aksi === 'clear') bersihkan();
    else if (btn.dataset.aksi === 'hapus') hapusSatu();
});

document.addEventListener('keydown', (e) => {
    if (/^[0-9.,]$/.test(e.key)) inputAngka(e.key);
    else if (['+', '-', '*', '/'].includes(e.key)) pilihOperator(e.key);
    else if (e.key === 'Enter' || e.key === '='){ e.preventDefault(); sama(); }
    else if (e.key === 'Backspace') hapusSatu();
    else if (e.key === 'Escape') bersihkan();
});