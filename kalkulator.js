$(function(){
    const $hasil = $('#hasil');
    const $riwayat = $('#riwayat');

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
        $hasil.text(format(angkaSekarang));
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
            angkaSekarang = bulatkan(hitung(angkaSebelumnya, angkaSekarang, operator));
            tampilkan();
        }

        angkaSebelumnya = angkaSekarang;
        operator = op;
        resetLayar = true;
        $riwayat.text(format(angkaSebelumnya) + ' ' + simbol[op]);
    }

    function sama(){
        if (!operator){
            return;
        }

        const hasil = bulatkan(hitung(angkaSebelumnya, angkaSekarang, operator));
        $riwayat.text(format(angkaSebelumnya) + ' ' + simbol[operator] + ' ' + format(angkaSekarang) + ' =');
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
        $riwayat.text('');
        tampilkan();
    }

    function hapusSatu(){
        if (resetLayar || angkaSekarang === ERROR){
            return bersihkan();
        }
        angkaSekarang = angkaSekarang.length > 1 ? angkaSekarang.slice(0, -1) : '0';
        tampilkan();
    }

    $('.tombol').on('click', 'button', function(){
        const $btn = $(this);
        const angka = $btn.attr('data-angka');
        const op = $btn.attr('data-op');
        const aksi = $btn.attr('data-aksi');

        if (angka !== undefined) inputAngka(angka);
        else if (op !== undefined) pilihOperator(op);
        else if (aksi === 'sama') sama();
        else if (aksi === 'clear') bersihkan();
        else if (aksi === 'hapus') hapusSatu();
    });

    $(document).on('keydown', function(e){
        if (/^[0-9.,]$/.test(e.key)) inputAngka(e.key);
        else if (['+', '-', '*', '/'].includes(e.key)) pilihOperator(e.key);
        else if (e.key === 'Enter' || e.key === '='){ e.preventDefault(); sama(); }
        else if (e.key === 'Backspace') hapusSatu();
        else if (e.key === 'Escape') bersihkan();
    });
});