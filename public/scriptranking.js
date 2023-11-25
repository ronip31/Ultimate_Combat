document.addEventListener('DOMContentLoaded', function () {
    // Check if userId and token are present in localStorage
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        // Redirect the user to the login page if not logged in
        window.location.href = '/login'; // Update with the actual login page URL
    } else {
        // User is logged in, continue with your existing code
        mostraInfoJogador();
        // ... (other code)
    }
});

const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');
const $nome = document.querySelector('#nome');
const $respeito = document.querySelector('#respeito');
const $estamina = document.querySelector('#estamina');
const $barraEstamina = document.querySelector('.barra-estamina div');
const $atributosJ = document.querySelectorAll('.stats-n');
const $btnRoubar = document.querySelector('.btn-roubar button');
const $tabelaRoubos = document.querySelector('.centro-tabela table');
const $selectRoubos = document.querySelector('#lista-oponentes');
const $modalRoubos = document.querySelector('.modal-roubos');
const $horas = document.querySelector('.horas');
const $dias = document.querySelector('.dias');
//const $btnRave = document.querySelector('.btn-rave');
const $equipamentos = document.querySelectorAll('.equipamento div');
const $tabelaArmasCompradas = document.querySelector('#tabela-armas');
const $tabelaMercado = document.querySelector('#tabela-mercado');
const $tabelaDrogas = document.querySelector('#tabela-drogas');
const $tabelaMercadoColetes = document.querySelector('#tabela-coletes');
const $tabelaMochilaColete = document.querySelector('#mochila-colete')
const $btnTransferir = document.querySelector('#btn-transferir');
const $selectBanco = document.querySelector('#select-banco');
const $inputBanco = document.querySelector('#input-banco');
const $valorSaldo = document.querySelector('#valor-saldo');
const $tabelaPutas = document.querySelector('#tabela-putas');
const $tabelaMeuCabare = document.querySelector('#tabela-minhas-putas');
const $infoCabare = document.querySelector('.info-cabare');
const $objetivos = document.querySelector('.objetivos');
//const $bonusRecompensa = document.querySelector('#bonus-recompensa');
const $modalMissoes = document.querySelector('.modal-missoes');

//classes jogador roubos armas coletes
class Jogador1{
    constructor(nome, respeito, estamina, atributosJ, grana, powerRS, arma, colete, saldoConta, granaTxt, bonusReconpensa, nRoubos, nArmas){
        this.nome = nome;
        this.respeito = respeito;
        this.estamina = estamina;
        this.atributosJ = atributosJ;
        this.grana = grana;
        this.powerRS = powerRS;
        this.arma = arma;
        this.colete = colete;
        this.saldoConta = saldoConta;
        this.granaTxt = granaTxt;
        this.bonusReconpensa = bonusReconpensa;
        this.nRoubos = nRoubos;
        this.nArmas = nArmas;
    }

    get rendimento(){
        return this.calculaRendimento();
    }
    get saldoContaTxt(){
        return this.criaSaldoTxt();
    }

    calculaRendimento(){
        let n = geraNAleatorio(2, 0);
        let juros = [0.01, 0.02, 0.03];
        let rendimento = this.saldoConta * juros[n];
        //console.log(`Juros: ${juros[n]}`);
        //console.log(`Rendimento: ${rendimento}`)
        return rendimento;
    }

    criaSaldoTxt(){
        let saldoTxt = this.saldoConta.toLocaleString('pt-BR')
        return saldoTxt;
    }
}

class Roubos{
    constructor(nome, estaminaR, powerNecessario, recompensaTxt, rMin, rMax, atributosMin, atributosMax, respeitoR){
        this.nome = nome;
        this.estaminaR = estaminaR;
        this.powerNecessario = powerNecessario;
        this.recompensaTxt = recompensaTxt;
        this.rMin = rMin;
        this.rMax = rMax;
        this.atributosMin = atributosMin;
        this.atributosMax = atributosMax;
        //this.atributosTotal = atributosTotal;
        this.respeitoR = respeitoR;
    }

    get valorTotal(){
        return this.calculaValorTotal();
    }
    get atributosTotal(){
        return this.calculaAtibutosTotal();
    }

    calculaValorTotal(){
        let total = this.recompensa + (this.recompensa * jogador1.bonusReconpensa);
        total = parseInt(total.toFixed(0));

        return  total;
    }

    calculaAtibutosTotal(){
        let atriTotal = geraNAleatorio(this.atributosMax, this.atributosMin);
        return atriTotal;
    }
}

class Armas{
    constructor(nome, forca, preco, pBonus, id, precoTxt){
        this.nome = nome;
        this.forca = forca;
        this.preco = preco;
        this.pBonus = pBonus;
        this.id = id;
        this.precoTxt = precoTxt;
    }

    get bonusArma(){
        return this.calculaBonusArma();
    }

    calculaBonusArma(){

        let bonusRS = 0;
        if(this.forca == undefined){
            bonusRS = 0;
        }else{
            jogador1.powerRS = parseInt(jogador1.powerRS);
            bonusRS = this.forca + (jogador1.powerRS * (this.pBonus));
        }
        return bonusRS
    }
}


class Coletes{
    constructor(nome, resistencia, preco, resBonus, id, precoTxt){
        this.nome = nome;
        this.resistencia = resistencia;
        this.preco = preco;
        this.resBonus = resBonus;
        this.id = id;
        this.precoTxt = precoTxt;
    }
}

class Relogio{
    constructor(segundos, minutos, horas, dias, penalidade, comeco){
        this.segundos = segundos;
        this.minutos =  minutos;
        this.horas = horas;
        this.dias = dias;
        this.penalidade = penalidade;
        this.comeco = comeco;
    }
}

// class DrogasRave{
//     constructor(nome, estaminaRecuperada, preco){
//         this.nome = nome;
//         this.estaminaRecuperada = estaminaRecuperada;
//         this.preco = preco;
//     }
// }

class Putas{
    constructor(nome, foto, pagamentoDia, preco, ganhos, quantidade, id, precoTxt){
        this.nome = nome;
        this.foto = foto;
        this.pagamentoDia = pagamentoDia;
        this.preco = preco;
        this.ganhos = ganhos;
        this.quantidade = quantidade;
        this.id = id;
        this.precoTxt = precoTxt;
    }
}

class Cabare{
    constructor(ganhos, pagamentoDia, quantidade, espacoOcupado, espacoTotal, espacoGanho, ganhosTxt){
        this.ganhos = ganhos;
        this.pagamentoDia = pagamentoDia;
        this.quantidade = quantidade;
        this.espacoOcupado = espacoOcupado;
        this.espacoTotal = espacoTotal;
        this.espacoGanho = espacoGanho;
        this.ganhosTxt = ganhosTxt;
    }
}

//objetos criados tempo jogador roubos armas coletes
let tempoJogo =  new Relogio(0,0,0,1, 300, true);

let jogador1 = new Jogador1('Alexey', 2, 100, 5, 5000, 3, '', '', 0, '', 0, 0, 0);

let SrCabeçadeBatata = new Roubos('Sr Cabeça de Batata', 2, 2, '$5 - $11', 5, 11, 1, 1, 1);
let Roz = new Roubos('Roz', 10, 8, '$12 - $26', 3, 26, 1, 3, 1);
let SenhorBurns  = new Roubos('Senhor Burns ', 5, 40, '$90 - $265', 90, 265, 3, 6, 3);
let Vingador = new Roubos('Vingador', 10, 80, '$266 - $761', 266, 761, 4, 8, 3);
let Shrek = new Roubos('Shrek', 12, 160, '$762 - $1.983', 762, 1983, 5, 10, 6);
let MacacoLoco = new Roubos('Macaco Loco', 13, 350, '$4.408 - $8.753', 4408, 8753, 7, 13, 8);
let RondaRousey = new Roubos('Ronda Rousey', 15, 700, '$8.754 - $14.850', 8754, 14850, 8, 14, 9);
let AndersonSilva = new Roubos('Anderson Silva', 17, 1200, '$14.851 - $28.587', 14851, 28587, 9, 16, 10);
let LordVoldemort  = new Roubos('Lord Voldemort', 20, 2100, '$28.588 - $51.268', 28588, 51268, 10, 18, 11);
let DarthVader = new Roubos('Darth Vader', 24, 3700, '$51.269 - $98.880', 51269, 98880, 11, 20, 12);
let Hulk = new Roubos('Hulk', 25, 7200, '$98.881 - $167.589', 98881, 167589, 12, 24, 14);
let escolhaRoubos = {nome: '- [Escolha...]',powerNecessario: ''};
let roubosGrupo = [
    escolhaRoubos, SrCabeçadeBatata, Roz,  SenhorBurns, Vingador , Shrek,
    MacacoLoco, RondaRousey, AndersonSilva, LordVoldemort, DarthVader ,Hulk
];

let bastaoBaseball = new Armas('Bastão Baseball', 10, 1240, 0.02, 0, '$1.240');
let faca = new Armas('Faca', 20, 6700, 0.03, 1, '$6.700');
let machado = new Armas('Machadinha', 35, 13250, 0.03, 2, '$13.250');
let serraEletrica = new Armas('Serra-Eletrica', 150, 74800, 0.04, 3, '$74.800');
let revolver22 = new Armas('Taurus 96 .22', 180, 110500, 0.05, 4, '$110.500');
let revolver38 = new Armas('Taurus 889 .38', 280, 205500, 0.05, 5, '$205.500');
let revolver357 = new Armas('Magnum .357', 410, 389000, 0.05, 6, '$389.000');
let glock39 = new Armas('Glock 39 .45',740, 675000, 0.06, 7, '$675.000');
let bereta92x = new Armas('Bereta 92X .9mm', 1140, 925000, 0.06, 8, '$925.000');
let fnp90 = new Armas('FN P90', 1800, 1420000, 0.075, 9, '$1.420.000');
let uzi = new Armas('Uzi', 2700, 2250000, 0.075, 10, '$2.250.000');
let mp5 = new Armas('MP5', 4150, 3890000, 0.075, 11, '$3.890.000');
let ak47 = new Armas('AK-47', 7200, 5200000, 0.08, 12, '$5.200.000');
let ar15 = new Armas('AR-15', 11500, 8750000, 0.08, 13, '$8.750.000');
let m16 = new Armas('M16', 17450, 12980000, 0.08, 14, '$12.980.000');
let mercadoArmas = [bastaoBaseball, faca ,machado, serraEletrica, revolver22, revolver38, 
revolver357, glock39, bereta92x, fnp90, uzi, mp5, ak47, ar15, m16];
let mochilaArmas = [];

let fraldinha = new Coletes('Fraudinha', 0.01, 1000, 0, 0, '$1.000');
let terno = new Coletes('Terno', 0.02, 4800, 0, 1, '$4.800');
let jaquetaCouro = new Coletes('Jaqueta de Couro', 0.03, 12300, 0, 2, '$12.300');
let kevlarNv1 = new Coletes('Colete Kevlar Nv. I', 0.04, 28600, 0, 3, '$28.600');
let kevlarNv2 = new Coletes('Colete Kevlar Nv. II', 0.05, 51900, 0, 4, '$51.900');
let kevlarNv3 = new Coletes('Colete Kevlar Nv. III', 0.06, 150000, 0, 5, '$150.000');
let nanoNv1 = new Coletes('Colete Nano Fibra Nv. I', 0.075, 278000, 0, 6, '$278.000');
let nanoNv2 = new Coletes('Colete Nano Fibra Nv. II', 0.08, 620000, 0, 7, '$620.000');
let nanoNv3 = new Coletes('Colete Nano Fibra Nv. III', 0.09, 940000, 0, 8, '$940.000');
let mark1 = new Coletes('Mark I', 0.10, 2100000, 0, 9, '$2.100.000');
let markL = new Coletes('Mark L', 0.20, 10000000, 0,  10, '$10.000.000');
let mercadoColetes = [fraldinha, terno, jaquetaCouro, kevlarNv1, kevlarNv2, kevlarNv3,
nanoNv1, nanoNv2, nanoNv3, mark1, markL];
let mochilaColete = [];

// let haxixe = new DrogasRave('Haxixe', 100, 1200);
// let maconha = new DrogasRave('Maconha', 20, 200);
// let pinga51 = new DrogasRave('Caninha 51', 5, 54);
// let festaRaveDrogas = [pinga51, maconha, haxixe];

let putaFeia = new Putas('Feia da Esquina', '0.jpg', 15, 150, 0, 0, 0, '$150');
let putaPobre = new Putas('Puta Pobre', '1.jpg', 45, 450, 0, 0, 1, '$450');
let putaConic = new Putas('Puta do Conic', '2.jpg', 100, 1000, 0, 0, 2, '$1.000');
let puta315Norte = new Putas('Puta da 315N', '3.jpg', 190, 2700, 0, 0, 3, '$2.700');
let putasGrupo = [ putaFeia, putaPobre, putaConic, puta315Norte];
let meuCabare = [];

let cabareG1 = new Cabare(0, 0, 0, 0, 20, 100,'' );



//listiners botao roubos, seleção do roubo e movimentaçao do banco
// $selectRoubos.addEventListener('change', ()=>{
//     mostraSelect($selectRoubos.value);
// })

// $btnRoubar.addEventListener('click', ()=>{
//     efetuaRoubo($selectRoubos.value);
//     //.log("$selectRoubos.value", $selectRoubos.value)
// })


//inicia o tempo do jogo minunos horas e dias
function iniciarCronometro(){
    
    intervaloTempo = setInterval(function(){

        tempoJogo.segundos++;
        
        if(tempoJogo.segundos < 10){
            tempoJogo.segundos = '0'+tempoJogo.segundos;
        }
        if(tempoJogo.segundos < 60  && tempoJogo.minutos === 0){
            tempoJogo.minutos=0;
            tempoJogo.minutos = '0'+tempoJogo.minutos;
        }
        
        if(tempoJogo.segundos === 60){
            tempoJogo.minutos++;
            tempoJogo.segundos = '0'+0;
            if(tempoJogo.minutos < 10){
                tempoJogo.minutos = '0'+tempoJogo.minutos;
            }
        }

        if(tempoJogo.minutos === 60){
            tempoJogo.minutos = 0;
            tempoJogo.horas++;
            if(tempoJogo.horas < 10){
                tempoJogo.horas = '0'+tempoJogo.horas;
            }
        }

        if(tempoJogo.horas == 24){
            tempoJogo.horas = 0;
            tempoJogo.dias++
        }

        //Ganho de estamina por tempo
       if(tempoJogo.minutos % 5 == 0 && tempoJogo.segundos == 0 && jogador1.estamina < 100){
            jogador1.estamina++;
            //const id_jogador = 2; 

            const data2 = {// ID do jogador que está sendo atualizado
                estamina:  jogador1.estamina
            }

            atualizarDadosJogador(data2);
           // console.log("jogador1.estamina atualizado!", jogador1.estamina)
            
            gravarLS('estaminaJ', jogador1.estamina);
            mostraInfoJogador();
        }

        //Tempo referente ao rendimento no banco
        if(tempoJogo.horas % 1 == 0 && tempoJogo.minutos == 0 && tempoJogo.segundos == 0){
            jogador1.saldoConta += jogador1.rendimento;
            jogador1.saldoConta = parseInt(jogador1.saldoConta);
            //console.log(`saldo: ${jogador1.saldoConta}`)
            gravarLS('saldo', jogador1.saldoConta);
            mostraInfoJogador(); 
        }

        //Ganhos diários do cabaré
        if(tempoJogo.horas % 6 == 0 && tempoJogo.minutos == 0 && tempoJogo.segundos == 0){
            if(cabareG1.pagamentoDia == null){
                return
            }else{
                cabareG1.ganhos = parseInt(cabareG1.ganhos)
                cabareG1.ganhos += (cabareG1.pagamentoDia);
                localStorage.setItem('meuCabare', JSON.stringify(cabareG1))
               // mostraMeuCabare()
            } 
        }
        
        gravarLS('min', tempoJogo.minutos);
        gravarLS('horas', tempoJogo.horas);
        gravarLS('dias', tempoJogo.dias);
        
        $horas.innerHTML = `<i class="far fa-clock"></i> ${tempoJogo.horas} : ${tempoJogo.minutos}`;
        $dias.innerHTML = `<i class="far fa-calendar-alt"></i> Dia: ${tempoJogo.dias}` ;
    },100)  
}

//gera dois numeros aleatóris
function geraNAleatorio(max, min){
    let n1 = Math.floor(Math.random() * (max - min + 1) + min);
    return n1;
}

//cria as tabelas
function criaTabela($tag, coluna1, coluna2, coluna3, coluna4){
    let linha = $tag.insertRow();
    linha.insertCell(0).innerHTML = coluna1;
    linha.insertCell(1).innerHTML = coluna2;
    linha.insertCell(2).innerHTML = coluna3;
    linha.insertCell(3).innerHTML = coluna4;
}

//Gravar e recuperar dados no Local Storage
function gravarLS(key,valor){
    localStorage.setItem(key, valor)
}
function recuperaLS(key,valor){
    let valorBD = localStorage.getItem(key)
    if(valorBD == null){
        valor = valor
    }else{
        valor = valorBD
    }
    valor = parseFloat(valor);

    return valor;
}

//mostra o modal que apresenta o resultado dos roubos
let attTxt = 0;
function apaceModal(i){
    
    $modalRoubos.innerHTML = '';
    criaElementos('p', 'Yah! Mais fácil do que roubar bananas de um macaco!', $modalRoubos);
    let ul = criaElementos('ul',null,$modalRoubos);
    criaLi(`Você conseguiu $${roubosGrupo[i].valorTotal.toLocaleString('pt-BR')}`,ul);
    criaLi(`Sua inteligencia aumentou ${attTxt}`,ul);
    criaLi(`Sua força aumentou ${attTxt}`,ul);
    criaLi(`Seu carisma aumentou ${attTxt}`,ul);
    criaLi(`Sua resistencia aumentou ${attTxt}`,ul);
    
    // Adicionando os valores de attTxt às variáveis
    // let inteligencia = attTxt;
    // let forca = attTxt;
    // let carisma = attTxt;
    // let resistencia = attTxt;

    let meusAtributos = criarAtributos(attTxt);
    //console.log("meusAtributos", meusAtributos);

    //console.log(" inteligencia, força, carisma e resistencia ", atributos)

    $modalRoubos.className = 'modal-roubos-habilitado';
}

function criarAtributos(attTxt) {
    let atributosx = {
        inteligencia: attTxt,
        forca: attTxt,
        carisma: attTxt,
        resistencia: attTxt
    };
    return atributosx;
}

//cria os selects dos roubos
// function criaSelectRoubos(){
//     let i = 0
//     //$selectRoubos.innerHTML= '';
//     roubosGrupo.forEach(function(rg){
        
//         let option1 = document.createElement('option')
//         option1.value = i;
//         option1.text = `${rg.nome} - ${rg.powerNecessario}`;
//         $selectRoubos.append(option1);
//         i++;
//     })
// }


//faz os roubos 
let id = 0;
function efetuaRoubo(i){
    if(jogador1.powerRS >= roubosGrupo[i].powerNecessario){
        roubosGrupo[i].recompensa = geraNAleatorio(roubosGrupo[i].rMax, roubosGrupo[i].rMin);

        if(jogador1.estamina >= roubosGrupo[i].estaminaR){
            jogador1.estamina -= roubosGrupo[i].estaminaR;
            gravarLS('estaminaJ', jogador1.estamina)
        }else{
            $modalRoubos.innerHTML = `<p><i class="fas fa-syringe"></i> Falta estamina!</p>` 
            return
        }
        
        if(jogador1.estamina < 0){
            jogador1.estamina = 0;
        }
        
        if(jogador1.respeito >= cabareG1.espacoGanho){
            cabareG1.espacoTotal += 5;
            cabareG1.espacoGanho += (cabareG1.espacoGanho);
            //mostraMeuCabare()
        }

        //missao
        jogador1.nRoubos++;
        gravarLS('RoubosRealizados', jogador1.nRoubos)
        if(arrMissoes[id] === undefined){
            jogador1.grana += roubosGrupo[i].valorTotal;
        }else{
            jogador1.grana += roubosGrupo[i].valorTotal;
            arrMissoes[id].criaMissao();

            gravarLS('idMissao', id); 
        }
        //gravarLS('bonusRecompensa', jogador1.bonusReconpensa);
        //console.log(roubosGrupo[i].recompensa,jogador1.bonusReconpensa, roubosGrupo[i].valorTotal)
        gravarLS('grana', jogador1.grana);
        attTxt = roubosGrupo[i].atributosTotal;
        jogador1.atributosJ += attTxt;

        gravarLS('atributos', jogador1.atributosJ);
        //console.log("jogador1.atributosJ", jogador1.atributosJ)

        jogador1.powerRS = calculaPR();
        gravarLS('powerRS', jogador1.powerRS);

        // const id_jogador = 2; 

        //     const data3 = {// ID do jogador que está sendo atualizado
        //         powerjogador:  jogador1.powerRS
        //     }

        //     atualizarDadosJogador(data3, id_jogador);
        //     console.log("jogador1.powerRS atualizado!", jogador1.powerRS)


        calculaRespeito($selectRoubos.value);
        gravarLS('respeito', jogador1.respeito);

        apaceModal($selectRoubos.value);



        mostraInfoJogador();
    }else{
        tempoJogo.penalidade = 30;
        $modalRoubos.className = 'modal-roubos-habilitado';
        $btnRoubar.disabled = true;
        penalidade = setInterval(()=>{
            tempoJogo.penalidade--
            if(tempoJogo.penalidade != 0){
                $modalRoubos.innerHTML = '';
                criaElementos('i',null,$modalRoubos,'fas fa-thumbs-down')
                criaElementos('p', 'Você foi espancado, otário!',$modalRoubos);
                criaElementos('div', `Tempo de recuperação: ${tempoJogo.penalidade}s`,$modalRoubos);
            }else{
                $btnRoubar.disabled = false;
                $modalRoubos.innerHTML = '';
                clearInterval(penalidade)
                criaElementos('i',null,$modalRoubos,'fas fa-bomb')
                criaElementos('p', 'Você está recuperado Volta a luta!.',$modalRoubos);
            }
        },1000)
    }

    //console.log("jogador1> ", jogador1)
    const data = {
        respeito: jogador1.respeito,
        estamina: jogador1.estamina,
        grana: jogador1.grana,
        powerjogador: jogador1.powerRS,
        inteligencia: jogador1.atributosJ,
        forca: jogador1.atributosJ,
        carisma: jogador1.atributosJ,
        resistencia: jogador1.atributosJ
        // Adicione outros campos que você deseja atualizar no banco de dados aqui
    };
    //console.log("DATA>" , data);
    
    //const id_jogador = userId;

    atualizarDadosJogador(data);
}

    // atualizar Dados Jogador 
function atualizarDadosJogador(data) {
    fetch('http://localhost:3000/atualizar_informacoes_jogador', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, userId }),
    })
    .then(response => response.json())
    .then(data => {
        //console.log('Dados do jogador atualizados:', data);
        mostraInfoJogador();
        // Lógica adicional após a atualização, se necessário
    })
    .catch(error => {
        //console.error('Erro ao atualizar dados do jogador:', error);
    });
}


//calcula o poder de roubos
function calculaPR(){
    let bonusRS = 0;
    if(jogador1.arma.forca == undefined){
        bonusRS = 0;
    }else{
        jogador1.powerRS = parseInt(jogador1.powerRS);
        bonusRS = jogador1.arma.forca + (jogador1.powerRS * (jogador1.arma.pBonus));
    }

    let bonusColete = 0;
    if(jogador1.colete.resBonus == undefined){
        bonusColete = 0;
    }else{
        jogador1.colete.resBonus = parseInt(jogador1.colete.resBonus)
        bonusColete = jogador1.colete.resBonus;
    }

    let pr = ((jogador1.atributosJ*4)/4)*(70/100) + bonusRS + bonusColete;
    pr = pr + (.5/100);
    pr = pr.toFixed(0);
    return pr 
}

//faz o calculo do respeito
function calculaRespeito(i){
    let rr = roubosGrupo[i].respeitoR;
    rr = parseInt(rr);
    jogador1.respeito += rr;
}

//efetua a compra , a venda e equipa a arma
function compraArma(i){

    if(mochilaArmas.length == 0){
        if(jogador1.grana < mercadoArmas[i].preco){
            console.log('Falta din!!!')
        }else{
            mochilaArmas.push(mercadoArmas[i])
                
            jogador1.grana -= mercadoArmas[i].preco 
        }
    }else{
        for(let j in mochilaArmas){
            if(i == mochilaArmas[j].id){
                console.log('Já tem esta arma!')
                return
            }
        }
        if(jogador1.grana < mercadoArmas[i].preco){
            console.log('Falta din!!!')
        }else{
            jogador1.nArmas++;
            mochilaArmas.push(mercadoArmas[i])
            localStorage.setItem(`arma${i}`, JSON.stringify(mercadoArmas[i]))
            jogador1.grana -= mercadoArmas[i].preco 
        }
    }
    gravarLS('grana', jogador1.grana);   
    mostraInfoJogador()
}
function vendeArma(i){
    //localStorage.removeItem(`arma${i}`)
    console.log(`arma${i}`)
    jogador1.nArmas--;
    jogador1.grana += (mochilaArmas[i].preco / 2)
    gravarLS('grana', jogador1.grana);
    mochilaArmas.splice(i,1)
    mostraInfoJogador()
}
function equipaArma(i){
    jogador1.arma = mochilaArmas[i]
    $equipamentos[0].innerHTML = jogador1.arma.nome
        
    localStorage.setItem('armaAtual', JSON.stringify(jogador1.arma))

    mostraInfoJogador()
}

//efetua a compra, a venda e equipa coletes
function comprarColete(i){
    if(mochilaColete.length == 0){
        if(jogador1.grana < mercadoColetes[i].preco){
            console.log('Falta din!!!')
        }else{
            mochilaColete.push(mercadoColetes[i])
                
            jogador1.grana -= mercadoColetes[i].preco 
        }
    }else{
        for(let j in mochilaColete){
            if(i == mochilaColete[j].id){
                console.log('Já tem este colete!')
                return
            }
        }
        if(jogador1.grana < mercadoColetes[i].preco){
            console.log('Falta din!!!')
        }else{
            mochilaColete.push(mercadoColetes[i])
                
            jogador1.grana -= mercadoColetes[i].preco 
        }
    }
    console.log(mochilaColete)
    gravarLS('grana', jogador1.grana);   
    mostraInfoJogador()
}
function vendeColete(i){
    jogador1.grana += (mochilaColete[i].preco / 2)
    gravarLS('grana', jogador1.grana);
    mochilaColete.splice(i,1)
    mostraInfoJogador()
}
function equipaColete(i){
    jogador1.colete = mochilaColete[i]
    $equipamentos[1].innerHTML = jogador1.colete.nome
        
    localStorage.setItem('coleteAtual', JSON.stringify(jogador1.colete))
    
    mochilaColete[i].resBonus = parseInt(mochilaColete[i].resBonus)
    console.log(mochilaColete[i].resBonus,jogador1.atributosJ)

    gravarLS('atributos', jogador1.atributosJ);
    mostraInfoJogador()
}

//recupera a arma e colete atual do local storage
function armaAtual(){
    let armaAtual = JSON.parse(localStorage.getItem('armaAtual'));
    
    if(armaAtual == null){
        jogador1.arma = '';
    }else{
       jogador1.arma = armaAtual;

        $equipamentos[0].innerHTML = jogador1.arma.nome;

        mochilaArmas.push(jogador1.arma); 
    } 
}
function coleteAtual(){
    let coleteAtual = JSON.parse(localStorage.getItem('coleteAtual'));

    if(coleteAtual == null){
        jogador1.colete = '';
    }else{
        jogador1.colete = coleteAtual;
        $equipamentos[1].innerHTML = jogador1.colete.nome;
        mochilaColete.push(jogador1.colete);
    }
}

//função da festa rave
function festaRave(e, p){
    if(jogador1.estamina == 100){
        jogador1.estamina = 100;
    }else{
        jogador1.estamina += e;
        if(jogador1.estamina >= 100){
            jogador1.estamina = 100;
        }
        jogador1.grana -= p;
        p +=  p*(p/(p/0.50))
        console.log(p)
        p = parseInt(p.toFixed(0))
        //gravarLS()
        console.log(p)
    }
    gravarLS('grana',jogador1.grana);
    gravarLS('estaminaJ', jogador1.estamina);
    mostraInfoJogador();
}

//mostra o select dos roubos na tela
function mostraSelect(i){
    $tabelaRoubos.innerHTML = '';

    criaTabela($tabelaRoubos, `Estamina requerida:`, `${roubosGrupo[i].estaminaR}%`,null,null);
    criaTabela($tabelaRoubos, `Power de roubo:`, roubosGrupo[i].powerNecessario,null,null);
    criaTabela($tabelaRoubos, `Recompensa:`, roubosGrupo[i].recompensaTxt,null,null);
    
    $tabelaRoubos.classList.add('visivel');
}

//mostra a as informaçoes das putas do select na tabebela
function meuCabareAtual(){
    let cabareAtual = JSON.parse(localStorage.getItem('meuCabare'));
    
    if(cabareAtual == null){
        cabareG1 = cabareG1;
    }else{
        cabareG1 = cabareAtual;
        cabareG1.ganhos = parseInt(cabareG1.ganhos)
        cabareG1.quantidade = parseInt(cabareG1.quantidade)
    }
    
}



//missões do jogo
class Missoes{
    constructor(respeitoN, granaN, armaN, roubosN, recompensaM, bonusM){
        this.respeitoN = respeitoN;
        this.granaN = granaN;
        this.armaN = armaN;
        this.roubosN = roubosN;
        this.recompensaM = recompensaM;
        this.bonusM = bonusM;
    }

    get novaMissao(){
         this.criaMissao()
    }

    criaMissao(){
        if(jogador1.respeito >= this.respeitoN && jogador1.grana >= this.granaN && jogador1.arma.nome === this.armaN && jogador1.nRoubos >= this.roubosN){
            jogador1.grana += this.recompensaM;
            jogador1.bonusReconpensa += this.bonusM;
            jogador1.bonusReconpensa = parseFloat(jogador1.bonusReconpensa.toFixed(2))
            cabareG1.espacoTotal += 5;
            $modalMissoes.classList.add('modal-missoes-aberto')
            id++;
            localStorage.setItem('meuCabare', JSON.stringify(cabareG1))
            //console.log(jogador1.bonusReconpensa)
        }
    }
}

let missao01 = new Missoes(200,50000,'Faca', 50, 10000, putaFeia.pagamentoDia, putaFeia.nome, 0.01);
let missao02 = new Missoes(800,350000, 'Serra-Eletrica', 150, 150000, putaFeia.pagamentoDia, putaFeia.nome, 0.01);
let missao03 = new Missoes(2000,1500000, 'Taurus 889 .38', 300, 400000, putaPobre.pagamentoDia, putaPobre.nome, 0.01);
let missao04 = new Missoes(4000,3000000,'Bereta 92X .9mm', 450, 800000, putaConic.pagamentoDia, putaConic.nome, 0.01);
let missao05 = new Missoes(8000,10000000,'Uzi', 1000, 3000000, puta315Norte.pagamentoDia, puta315Norte.nome, 0.01);
let arrMissoes = [missao01, missao02, missao03, missao04, missao05];
//console.log(missao01,missao01.criaMissao)

let criaElementosObjetivos = (txt1, txt2)=>{
    let div1 = document.createElement('div');
    div1.className = 'missoes-lista';
    $objetivos.appendChild(div1)

    let p1 = document.createElement('p');
    p1.textContent = txt1;
    div1.appendChild(p1);

    let p2 = document.createElement('p');
    p2.className = 'p2-obj';
    p2.textContent = txt2;
    div1.appendChild(p2);
}
let criaLi = (txt, ul)=>{
    let li1 = document.createElement('li');
    li1.textContent = txt;
    ul.appendChild(li1);
}


let criaElementos = (tag,txt,$dom,classe)=>{
    let elemento = document.createElement(tag);
    elemento.textContent = txt;
    elemento.className = classe;
    $dom.appendChild(elemento);
    return elemento
}


//mostra a tabela de armas do mercado
function mostraMochilaArmas(){
    $tabelaArmasCompradas.innerHTML ='';
    for(let i in mochilaArmas){
        
        let bonus = mochilaArmas[i].forca + (jogador1.powerRS * (mochilaArmas[i].pBonus/100));
        bonus = bonus.toFixed(0);
        let valorVenda = (mochilaArmas[i].preco / 2).toLocaleString('pt-BR');

        criaTabela($tabelaArmasCompradas, mochilaArmas[i].nome,
            `${mochilaArmas[i].forca}+${jogador1.powerRS}*${mochilaArmas[i].pBonus*100}% = ${bonus} Bônus`,
            `$${valorVenda}`,
            `<button onclick="equipaArma(${i})">Equipar</button><button onclick="vendeArma(${i})">Vender</button>`);
        
    }
}

//mostra a tebela do mercado de coletes
function mostraMercadoColetes(){
    let i = 0
    $tabelaMercadoColetes.innerHTML = '';
    mercadoColetes.forEach((mc)=>{
        let bonusResistencia = jogador1.atributosJ * mc.resistencia;
        bonusResistencia= bonusResistencia.toFixed(0)

        criaTabela($tabelaMercadoColetes, mc.nome, `${jogador1.atributosJ}*${mc.resistencia*100}% = ${bonusResistencia} Bônus`, mc.precoTxt, `<button onclick="comprarColete(${i})">Compar</button>`);
        i++
    })
}



function mostraMochilaColetes(){
    $tabelaMochilaColete.innerHTML ='';
    for(let i in mochilaColete){
        
        mochilaColete[i].resBonus = jogador1.atributosJ * mochilaColete[i].resistencia;
        mochilaColete[i].resBonus= mochilaColete[i].resBonus.toFixed(0)
        let valorVenda = (mochilaColete[i].preco / 2).toLocaleString('pt-BR');

        criaTabela($tabelaMochilaColete, 
            `${mochilaColete[i].nome}`, 
            `${jogador1.atributosJ}*${mochilaColete[i].resistencia} = ${mochilaColete[i].resBonus} Bônus`,
            `$${valorVenda}`, 
            `<button onclick="equipaColete(${i})">Equipar</button><button onclick="vendeColete(${i})">Vender</button>`);
    }
}


function mochilaStorage(){
    for(let n = 0; n < mercadoArmas.length;n++){
        let arma = JSON.parse(localStorage.getItem(`arma${n}`));
         console.log(arma)
        if(arma === null){
          continue
        }else{
             if(arma){
                 mochilaArmas.push(arma)
                 console.log('deu certo')
             }else{
                 console.log('não achou nada',n,`arma${n}`)
             }
        } 
     }
}



//mostra e atualiza as informações do jogador na tela/
//criaSelectRoubos();
async function  mostraInfoJogador(){
    
    try {
        
        const response = await fetch(`http://localhost:3000/obter_informacoes_jogador?id=${userId}`);
        
        const data = await response.json();
        //console.log("response mostraInfoJogador", response)
        //console.log("UserId na função mostraInfoJogador:", userId);
        //console.log("data2", data);

        // Atualiza as propriedades do jogador1 com os dados do servidor
        jogador1.respeito = data.players[0].respeito;
        jogador1.estamina = data.players[0].estamina;
        jogador1.grana = data.players[0].grana;
        jogador1.powerRS = data.players[0].bonus_recompensa;
        jogador1.saldoConta = data.players[0].saldoConta
        jogador1.nome = data.players[0].nome;
        jogador1.inteligencia = data.players[0].inteligencia;
        jogador1.powerRS = data.players[0].powerjogador;
      



        // Atualiza os elementos HTML com as informações do jogador
        document.getElementById('nome').textContent = data.players[0].nome;
        document.getElementById('respeito').textContent = data.players[0].respeito;
        document.getElementById('estamina').textContent = data.players[0].estamina + '%';
        document.getElementById('inteligencia').textContent = data.players[0].inteligencia;
        document.getElementById('forca').textContent = data.players[0].forca;
        document.getElementById('carisma').textContent = data.players[0].carisma;
        document.getElementById('resistencia').textContent = data.players[0].resistencia;
        document.getElementById('grana').textContent = '$' + data.players[0].grana;
        document.getElementById('power').textContent =  data.players[0].powerjogador;

        //jogador1.saldoConta = data.players[0].saldoConta;

        jogador1.atributosJ = recuperaLS('atributos', jogador1.atributosJ);
        //jogador1.grana = recuperaLS('grana', jogador1.grana);
       // jogador1.powerRS = recuperaLS('powerRS', jogador1.powerRS);
       //jogador1.saldoConta = recuperaLS('saldo', jogador1.saldoConta);
        jogador1.granaTxt = jogador1.grana.toLocaleString('pt-BR');
        jogador1.nRoubos = recuperaLS('RoubosRealizados', jogador1.nRoubos);
        

        //console.log(jogador1.bonusReconpensa)

    
    
        for(let j in putasGrupo){
            putasGrupo[j].preco = recuperaLS(`puta${j}`, putasGrupo[j].preco);
            putasGrupo[j].precoTxt = putasGrupo[j].preco.toLocaleString('pt-BR');
        }

        if(tempoJogo.comeco){
            tempoJogo.minutos = recuperaLS('min', tempoJogo.minutos);
            tempoJogo.horas = recuperaLS('horas', tempoJogo.horas);
            tempoJogo.dias = recuperaLS('dias', tempoJogo.dias);
            console.log("tempoJogo", tempoJogo)
            iniciarCronometro();
            armaAtual();
            coleteAtual();
           // meuCabareAtual();
            tempoJogo.comeco = false;
        }


        jogador1.nRoubos = recuperaLS('RoubosRealizados',jogador1.nRoubos)

  
        $estamina.innerHTML = `${jogador1.estamina}%`;
        $barraEstamina.style.width = `${jogador1.estamina}%`;
    
    } catch (error) {
        console.log("resultadoBuscaerro: " + error);
    }
}



function logout() {
    // Function to handle logout
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    
    // Redirect the user to the login page or perform other actions
    window.location.href = '/login'; // Update with the actual login page URL
}

let tabelaPreenchida = false;

// Função para buscar todas as armas e preencher a tabela
// async function buscarArmas() {
//     try {
//         // Se a tabela já foi preenchida, não faça a busca novamente
//         if (tabelaPreenchida) {
//             return;
//         }

//     const response = await fetch('/getarmas');
//     const data = await response.json();

//         const tabelaMercado = document.getElementById('tabela-mercado');

//         data.armas.forEach(arma => {
//             const row = tabelaMercado.insertRow();
//             row.innerHTML = `<td>${arma.nome}</td><td>${arma.forca}</td><td>${arma.precoTxt}</td><td><button onclick="comprarArma(${arma.id})">Comprar</button></td>`;
//         });

//         // Marcar a tabela como preenchida para evitar chamadas repetidas
//         tabelaPreenchida = true;
//     } catch (error) {
//         console.error('Erro ao buscar armas:', error);
//     }
// }


// Função para buscar as armas que o jogador já comprou
// async function buscarArmasJogador() {
//     try {
//         const timestamp = new Date().getTime();
//         const response = await fetch(`/armasJogador?id=${userId}`);
//         const data = await response.json();

//         const tabelaArmasJogador = document.getElementById('tabela-armas');

//         // Limpar a tabela antes de preenchê-la novamente
//         tabelaArmasJogador.innerHTML = '';

//         data.armasJogador.forEach(arma => {
//             const row = tabelaArmasJogador.insertRow();
//             row.innerHTML = `
//                 <td>${arma.nome}</td>
//                 <td>${arma.forca}</td>
//                 <td>${arma.precoTxt}</td>
//                 <td>
//                     <button onclick="venderArma(${arma.id})">Vender</button>
//                 </td>
//             `;
//         });
//     } catch (error) {
//         console.error('Erro ao buscar armas do jogador:', error);
//     }
// }


// Função para simular a compra de uma arma
function comprarArma(idArma) {
    console.log('Comprar arma com o ID:', idArma);

    // Adicione lógica adicional aqui, como enviar uma solicitação para o servidor para registrar a compra
    fetch('/comprarArma', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idArma: idArma,
            userId: userId, // Certifique-se de que a variável userId está definida antes de chamar a função
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao comprar arma.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);

        if (data.error) {
            // Se o servidor retornar um erro, exiba um alerta com a mensagem de erro específica
            alert(data.error);
        } else if (data.message) {
            // Se o servidor retornar uma mensagem, exiba um alerta com a mensagem de sucesso
            alert(data.message);
            // Depois, chame buscarArmasJogador() para atualizar a tabela de armas do jogador
            buscarArmasJogador();
            mostraInfoJogador()
            console.log("comprarArma CHAMADO 0");
        } else {
            console.log('Compra realizada com sucesso!');
            // Depois, chame buscarArmasJogador() para atualizar a tabela de armas do jogador
            buscarArmasJogador();
            mostraInfoJogador()
            console.log("comprarArma CHAMADO");
        }
    })
    .catch(error => {
        console.error('Erro ao comprar arma:', error);

        // Exiba um alerta específico para erros relacionados à compra de arma
        alert('Erro ao comprar a arma. Tente novamente mais tarde.');
    });
}


function venderArma(idArma) {
    console.log('Vender arma com o ID:', idArma);

    // Adicione lógica adicional aqui, como enviar uma solicitação para o servidor para registrar a venda
    fetch('/venderArma', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idArma: idArma,
            userId: userId,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao vender arma.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);
       
        if (data.message) {
            alert(data.message);
            buscarArmasJogador();
            mostraInfoJogador()
            console.log("venderArma CHAMADO-1")
        } else {
            console.log('Venda realizada com sucesso!');
            buscarArmasJogador(); // Atualize a tabela de armas do jogador após a venda
            mostraInfoJogador()
            console.log("venderArma CHAMADO-2")
        }
    })
    .catch(error => {
        console.error('Erro ao vender arma:', error);
        alert('Erro ao vender a arma. Tente novamente mais tarde.');
    });
}

async function equiparArma(idArma, botaoEquipar) {
    console.log('Equipar arma com o ID:', idArma);

    try {
        const response = await fetch('/equiparArma', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idArma: idArma,
                userId: userId,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao equipar arma.');
        }

        const data = await response.json();
        console.log('Resposta do servidor:', data);

        if (data.armaEquipada) {
            alert('Arma equipada com sucesso!');
            // Adicione o status de equipamento à arma equipada
            data.armaEquipada.equipada = true;
            gravarLS('idArma', idArma);
            calcularPR(idArma,userId);

            // Atualize o botão e a tabela com base nos dados recebidos
            botaoEquipar.innerText = 'Desequipar';
            botaoEquipar.onclick = function() {
                desequiparArma(data.armaEquipada.id, botaoEquipar);
            };

            // Atualize a página HTML
            buscarEquipamentoJogador();
        }
    } catch (error) {
        console.error('Erro ao equipar arma:', error);
        alert('Erro ao equipar a arma. Tente novamente mais tarde.');
    }
}



async function desequiparArma(idArma, botaoDesequipar) {
    console.log('Desequipar arma com o ID:', idArma);

    try {
        const response = await fetch('/desequiparArma', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idArma: idArma,
                userId: userId,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao desequipar arma.');
        }

        const data = await response.json();
        console.log('Resposta do servidor:', data);

        if (data.message) {
            alert(data.message);
            // Atualize a tabela de equipamento do jogador após o desequipamento
            buscarEquipamentoJogador();

            // Atualizar o texto do botão para "Equipar"
            botaoDesequipar.innerText = 'Equipar';
            // Adicionar um evento de clique para chamar a função equiparArma
            botaoDesequipar.onclick = function() {
                equiparArma(idArma, botaoDesequipar);
            };
        } else {
            console.log('Erro ao desequipar arma:', data.error);
        }
    } catch (error) {
        console.error('Erro ao desequipar arma:', error);
        alert('Erro ao desequipar a arma. Tente novamente mais tarde.');
    }
}



async function buscarEquipamentoJogador() {
    try {
        const timestamp = new Date().getTime();

        // Buscar a arma equipada antes de listar as armas do jogador
        const armaEquipadaData = await fetch(`/armaEquipada?id=${userId}`);
        const armaEquipada = (await armaEquipadaData.json()).armaEquipada;

        const tabelaArmasJogador = document.getElementById('tabela-mochila');

        // Limpar a tabela antes de preenchê-la novamente
        tabelaArmasJogador.innerHTML = '';

        // Buscar a lista de armas do jogador
        const armasJogadorData = await fetch(`/armasJogador?id=${userId}`);
        const data = await armasJogadorData.json();

        data.armasJogador.forEach(arma => {
            const row = tabelaArmasJogador.insertRow();
            const botaoEquipar = document.createElement('button');

            if (arma && arma.equipada) {
                // Se a arma estiver equipada, configure o botão para desequipar
                botaoEquipar.innerText = 'Desequipar';
                botaoEquipar.onclick = function() {
                    desequiparArma(arma.id, botaoEquipar);
                };
            } else {
                // Se a arma não estiver equipada, configure o botão para equipar
                botaoEquipar.innerText = 'Equipar';
                botaoEquipar.onclick = function() {
                    equiparArma(arma.id, botaoEquipar);
                };
            }

            const cellNome = row.insertCell();
            const cellForca = row.insertCell();
            const cellPreco = row.insertCell();
            const cellEquipar = row.insertCell();

            cellNome.textContent = arma.nome;
            cellForca.textContent = arma.forca;
            cellPreco.textContent = arma.precoTxt;
            cellEquipar.appendChild(botaoEquipar);

            // Se esta arma é a equipada, atualize o botão e evento de clique
            if (arma && armaEquipada && arma.id === armaEquipada.id) {
                botaoEquipar.innerText = 'Desequipar';
                botaoEquipar.onclick = function() {
                    desequiparArma(arma.id, botaoEquipar);
                };
            }
        });

        // Atualizar a informação da arma equipada
        atualizarInformacaoArmaEquipada(armaEquipada);

    } catch (error) {
        console.error('Erro ao buscar armas do jogador:', error);
    }
}



// Função para atualizar as informações da arma equipada
function atualizarInformacaoArmaEquipada(armaEquipada) {
    if (armaEquipada) {
        // Atualize as divs correspondentes com as informações da arma equipada
        document.getElementById('nomeEquipado').innerText = armaEquipada.nome;
        console.log("armaEquipada.pBonus>", armaEquipada.pBonus)
        localStorage.setItem('pBonus', armaEquipada.pBonus)
        //jogador1.powerRS = data.players[0].powerjogador; = armaEquipada.forca;
    } else {
        // Caso o jogador não tenha nenhuma arma equipada, exiba uma mensagem padrão ou deixe vazio
        document.getElementById('nomeEquipado').innerText = 'Vazio';
    }
}



async function buscarArmaEquipada() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/armaEquipada?id=${userId}`);
        const data = await response.json();

        if (data.armaEquipada) {
            const arma = data.armaEquipada;

            // Atualize as divs correspondentes com as informações da arma equipada
            document.getElementById('nomeEquipado').innerText = arma.nome;
            console.log("arma.pBonus>", arma.pBonus)
            localStorage.setItem('pBonus', arma.pBonus)
            //jogador1.powerRS = data.players[0].powerjogador; = arma.forca;
        } else {
            // Caso o jogador não tenha nenhuma arma equipada, exiba uma mensagem padrão ou deixe vazio
            document.getElementById('nomeEquipado').innerText = 'Vazio';
        }
    } catch (error) {
        console.error('Erro ao buscar arma equipada:', error);
    }
}

async function calcularPR(idArma,userId) {
    try {
        const response = await fetch('/calcularPR', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idArma: idArma,
                userId: userId,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao calcular PR.');
        }

        const data = await response.json();
        console.log('PR calculado:', data);
        atualizarDadosJogador(data.bonusRS)
        // Atualize a interface do usuário com o novo PR, se necessário
        // Exemplo: document.getElementById('prAtual').innerText = data.pr;

    } catch (error) {
        console.error('Erro ao calcular PR:', error);
        alert('Erro ao calcular PR. Tente novamente mais tarde.');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
      const jogadores = await getJogadores();
  
      // Ordenar jogadores em ordem decrescente de respeito
      const jogadoresOrdenados = jogadores.players.sort((a, b) => b.respeito - a.respeito);
  
      const tabelaRanking = document.getElementById('tabela-ranking');
  
      jogadoresOrdenados.forEach((jogador) => {
        const row = tabelaRanking.insertRow();
        const cellNome = row.insertCell(0);
        const cellRespeito = row.insertCell(1);
  
        cellNome.textContent = jogador.nome;
        cellRespeito.textContent = jogador.respeito;
      });
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
    }
  });
  
  async function getJogadores() {
    try {
      const response = await fetch('/jogadores');
      const data = await response.json();
  
      if (data && data.players) {
        return data;
      } else {
        throw new Error('Formato de dados inválido na resposta');
      }
    } catch (error) {
      throw new Error('Erro ao buscar jogadores');
    }
  }
  
 
  document.addEventListener('DOMContentLoaded', init);
  
// Configurar intervalo para atualizar a cada minuto (ou conforme necessário)
setInterval(atualizarTempo, 60000); // Atualiza a cada 1 minuto (60000 milissegundos)
//setInterval(renewToken, 300);
setInterval(mostraInfoJogador, 25000); 

//FUNÇÃO PARA CHAMAR AO ABRIR A PÁGINA.
window.onload = () => {
    buscarEquipamentoJogador();
    buscarArmaEquipada();
    init();
};

