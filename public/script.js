document.addEventListener('DOMContentLoaded', function () {
    // Check if userId and token are present in localStorage
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token || isTokenExpired()) {
        // Redirect the user to the login page if not logged in
        window.location.href = '/login'; // Update with the actual login page URL
    } else {
        // User is logged in, continue with your existing code
        mostraInfoJogador();
        buscarArmaEquipada();
        atualizarTempo();
        // ... (other code)
    }
});

const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');
const $nome = document.querySelector('#nome');
const $estamina = document.querySelector('#estamina');
const $barraEstamina = document.querySelector('.barra-estamina div');
const $atributosJ = document.querySelectorAll('.stats-n');
const $btnRoubar = document.querySelector('.btn-roubar button');
const $tabelaRoubos = document.querySelector('.centro-tabela table');
const $selectRoubos = document.querySelector('#lista-oponentes');
const $modalRoubos = document.querySelector('.modal-roubos');
const $horas = document.querySelector('.horas');
const $dias = document.querySelector('.dias');
const $objetivos = document.querySelector('.objetivos');
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
        console.log(`Juros: ${juros[n]}`);
        console.log(`Rendimento: ${rendimento}`)
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


//objetos criados tempo jogador roubos armas coletes
let tempoJogo =  atualizarTempo();

let jogador1 = new Jogador1('Nome Jogador', 2, 100, 5, 5000, 3, '', '', 0, '', 0, 0, 0);

let SrCabeçadeBatata = new Roubos('Sr Cabeça de Batata', 2, 2, '$5 - $11', 5, 11, 1, 1, 1);
let Roz = new Roubos('Roz', 5, 8, '$12 - $26', 3, 26, 1, 3, 1);
let SenhorBurns  = new Roubos('Senhor Burns ', 10, 35, '$120 - $265', 90, 265, 3, 6, 3);
let Vingador = new Roubos('Vingador', 12, 40, '$266 - $761', 266, 761, 4, 8, 3);
let Shrek = new Roubos('Shrek', 20, 80, '$762 - $1.983', 762, 1983, 5, 10, 6);
let MacacoLoco = new Roubos('Macaco Loco', 22, 200, '$2.408 - $4.753', 4408, 8753, 7, 13, 8);
let RondaRousey = new Roubos('Ronda Rousey', 27, 350, '$4.754 - $8.850', 8754, 14850, 8, 14, 9);
let AndersonSilva = new Roubos('Anderson Silva', 30, 800, '$8.851 - $18.587', 14851, 28587, 9, 16, 10);
let LordVoldemort  = new Roubos('Lord Voldemort', 33, 1900, '$18.588 - $21.268', 28588, 51268, 10, 18, 11);
let DarthVader = new Roubos('Darth Vader', 37, 3150, '$21.269 - $48.880', 51269, 98880, 11, 20, 12);
let Hulk = new Roubos('Hulk', 40, 7200, '$48.881 - $87.589', 98881, 167589, 12, 24, 14);
let escolhaRoubos = {nome: '- [Escolha...]',powerNecessario: ''};
let roubosGrupo = [
    escolhaRoubos, SrCabeçadeBatata, Roz,  SenhorBurns, Vingador , Shrek,
    MacacoLoco, RondaRousey, AndersonSilva, LordVoldemort, DarthVader ,Hulk
];


//listiners botao roubos, seleção do roubo e movimentaçao do banco
$selectRoubos.addEventListener('change', ()=>{
    mostraSelect($selectRoubos.value);
})

$btnRoubar.addEventListener('click', ()=>{
    efetuaRoubo($selectRoubos.value);
})


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
    $modalRoubos.style.backgroundColor = 'rgb(223, 240, 216)';
    criaElementos('p', 'Yah! Mais fácil do que roubar bananas de um macaco!', $modalRoubos);
    
    let ul = criaElementos('ul',null,$modalRoubos);
    criaLi(`Você conseguiu $${roubosGrupo[i].valorTotal.toLocaleString('pt-BR')}`,ul);
    criaLi(`Sua inteligencia aumentou ${attTxt}`,ul);
    criaLi(`Sua força aumentou ${attTxt}`,ul);
    criaLi(`Seu carisma aumentou ${attTxt}`,ul);
    criaLi(`Sua resistencia aumentou ${attTxt}`,ul);
    

    let meusAtributos = criarAtributos(attTxt);

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
function criaSelectRoubos(){
    let i = 0
    $selectRoubos.innerHTML= '';
    roubosGrupo.forEach(function(rg){
        
        let option1 = document.createElement('option')
        option1.value = i;
        option1.text = `${rg.nome} - ${rg.powerNecessario}`;
        $selectRoubos.append(option1);
        i++;
    })
}


//faz as lutas
let id = 0;
function efetuaRoubo(i) {

    //mostraInfoJogador();
    console.log("jogador1.estamina", jogador1.estamina, roubosGrupo[i].estaminaR);

    if (jogador1.estamina < roubosGrupo[i].estaminaR) {
        $modalRoubos.innerHTML = '';
        $modalRoubos.style.backgroundColor = 'rgb(223, 240, 216)';
        $modalRoubos.innerHTML = `<p><i class="fas fa-syringe"></i> Falta estamina!</p>` 
        console.log("Falta estamina");
        return;
    }

    if (jogador1.powerRS >= roubosGrupo[i].powerNecessario) {
        console.log("jogador1.powerRS >= roubosGrupo[i].powerNecessario", jogador1.powerRS , "roubosGrupo[i].powerNecessario", roubosGrupo[i].powerNecessario)
        roubosGrupo[i].recompensa = geraNAleatorio(roubosGrupo[i].rMax, roubosGrupo[i].rMin);

        jogador1.estamina -= roubosGrupo[i].estaminaR;
        gravarLS('estaminaJ', jogador1.estamina);

        jogador1.nRoubos++;
        gravarLS('RoubosRealizados', jogador1.nRoubos);

        if (arrMissoes[id] === undefined) {
            jogador1.grana += roubosGrupo[i].valorTotal;
        } else {
            jogador1.grana += roubosGrupo[i].valorTotal;
            arrMissoes[id].criaMissao();
            gravarLS('idMissao', id);
        }

        gravarLS('grana', jogador1.grana);
        attTxt = roubosGrupo[i].atributosTotal;
        jogador1.atributosJ += attTxt;
        gravarLS('atributos', jogador1.atributosJ);

        jogador1.powerRS = calculaPR();
        gravarLS('powerRS', jogador1.powerRS);
        calculaRespeito($selectRoubos.value);

        gravarLS('respeito', jogador1.respeito);
        apaceModal($selectRoubos.value);

        mostraInfoJogador();
    } else {
        console.log("jogador1.powerRS >= roubosGrupo[i].powerNecessario", jogador1.powerRS , "roubosGrupo[i].powerNecessario", roubosGrupo[i].powerNecessario)

        tempoJogo.penalidade = 30;
        $modalRoubos.className = 'modal-roubos-habilitado';
        $btnRoubar.disabled = true;

        let funcaoChamada = false;
        let penalidadeInterval; 

        if (!penalidadeInterval) {
            penalidadeInterval = setInterval(() => {
                tempoJogo.penalidade--;

                jogador1.estamina -= roubosGrupo[i].estaminaR;
                gravarLS('estaminaJ', jogador1.estamina);

                if (tempoJogo.penalidade !== 0) {
                    $modalRoubos.innerHTML = '';
                    $modalRoubos.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
                    criaElementosespancado('i', null, $modalRoubos, 'fas fa-thumbs-down');
                    criaElementosespancado('p', 'Você foi espancado, otário!', $modalRoubos);
                    criaElementosespancado('p', 'Você perdeu 10% de seu respeito!', $modalRoubos);
                    criaElementosespancado('p', 'E perdeu 15% da sua grana!', $modalRoubos);
                    criaElementosespancado('div', `Tempo de recuperação: ${tempoJogo.penalidade}s`, $modalRoubos);

                    if (!funcaoChamada) {
                        const data = {
                            respeito: jogador1.respeito * 0.90,
                            estamina: jogador1.estamina,
                            grana: jogador1.grana * 0.85,
                        };
                        console.log("DATA>", data);

                        atualizarDadosJogador(data);
                        mostraInfoJogador();
                        funcaoChamada = true;
                    }
                } else {
                     // Limpa o intervalo quando a penalidade termina
                    $btnRoubar.disabled = false;
                    $modalRoubos.innerHTML = '';
                    $modalRoubos.style.backgroundColor = 'rgb(223, 240, 216)';

                    clearInterval(penalidadeInterval);
                    criaElementos('i', null, $modalRoubos, 'fas fa-bomb');
                    criaElementos('p', 'Você está recuperado. Volte à luta!', $modalRoubos);
                }
            }, 1000);
            $btnRoubar.disabled = true;
        }
    }

    const data = {
        respeito: jogador1.respeito,
        estamina: jogador1.estamina,
        grana: jogador1.grana,
        powerjogador: jogador1.powerRS,
        inteligencia: jogador1.atributosJ,
        forca: jogador1.atributosJ,
        carisma: jogador1.atributosJ,
        resistencia: jogador1.atributosJ
    };

    atualizarDadosJogador(data);
    mostraInfoJogador();
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
        console.log('Dados do jogador atualizados', data);
        mostraInfoJogador();
        // Lógica adicional após a atualização, se necessário
    })
    .catch(error => {
       console.error('Erro ao atualizar dados do jogador:', error);
    });
}


//calcula o poder de roubos
function calculaPR() {
    let bonusRS = 0;

    let armaforca = localStorage.getItem('armaForca');
    //jogador1.arma.forca = armaforca;
    console.log( "armaforca:", armaforca)

    if (armaforca == undefined) {
        bonusRS = 0;
    } else {
        let armapBonus = localStorage.getItem('pBonus');
        jogador1.powerRS = parseInt(jogador1.powerRS);
       // pBonus
        armaforca = parseFloat(armaforca);
        console.log("armaforca", armaforca)
        console.log("jogador1.powerRS", jogador1.powerRS);
        console.log("jogador1.arma.pBonus", armapBonus);
        bonusRS = armaforca + (jogador1.powerRS * (armapBonus));
        console.log("bonusRS", bonusRS)
    }

    
    console.log("jogador1.atributosJ", jogador1.atributosJ)
    let pr = ((jogador1.atributosJ*0.9) + bonusRS);
    console.log("pr antes da adição: ", pr);
    pr = pr + (0.5 / 100);
    console.log("pr depois da adição: ", pr);
    pr = pr.toFixed(0);
    console.log("pr> ", pr);
    return pr 
}

//faz o calculo do respeito
function calculaRespeito(i){
    let rr = roubosGrupo[i].respeitoR;
    rr = parseInt(rr);
    jogador1.respeito += rr;
}


//mostra o select dos roubos na tela
function mostraSelect(i){
    $tabelaRoubos.innerHTML = '';

    criaTabela($tabelaRoubos, `Estamina requerida:`, `${roubosGrupo[i].estaminaR}%`,null,null);
    criaTabela($tabelaRoubos, `Power de roubo:`, roubosGrupo[i].powerNecessario,null,null);
    criaTabela($tabelaRoubos, `Recompensa:`, roubosGrupo[i].recompensaTxt,null,null);
    
    $tabelaRoubos.classList.add('visivel');
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
           // cabareG1.espacoTotal += 5;
            $modalMissoes.classList.add('modal-missoes-aberto')
            id++;
            //localStorage.setItem('meuCabare', JSON.stringify(cabareG1))
            console.log(jogador1.bonusReconpensa)
        }
    }
}

let missao01 = new Missoes(200,50000,'Faca', 50, 10000,  0.01);
let missao02 = new Missoes(800,350000, 'Serra-Eletrica', 150, 150000, 0.01);
let missao03 = new Missoes(2000,1500000, 'Taurus 889 .38', 300, 400000, 0.01);
let missao04 = new Missoes(4000,3000000,'Bereta 92X .9mm', 450, 800000,  0.01);
let missao05 = new Missoes(8000,10000000,'Uzi', 1000, 3000000, 0.01);
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


let criaElementos = (tag, txt, $dom, classe) => {
    let elemento = document.createElement(tag);
    elemento.textContent = txt;
    elemento.className = classe;
    $dom.appendChild(elemento);
    return elemento;
}



let criaElementosespancado = (tag, txt, $dom, classe) => {
    let elemento = document.createElement(tag);
    elemento.textContent = txt;
    elemento.className = classe;
    $dom.appendChild(elemento);
    return elemento;
}


//mostra e atualiza as informações do jogador na tela
criaSelectRoubos();
async function  mostraInfoJogador(){
    
    try {
        
        const response = await fetch(`http://localhost:3000/obter_informacoes_jogador?id=${userId}`);
        
        const data = await response.json();

        //Atualiza as propriedades do jogador1 com os dados do servidor
        jogador1.respeito = data.players[0].respeito;
        jogador1.estamina = data.players[0].estamina;
        jogador1.grana = parseFloat(data.players[0].grana);
        jogador1.bonusRS = data.players[0].bonusRS;
        jogador1.saldoConta = data.players[0].saldoConta
        jogador1.nome = data.players[0].nome;
        jogador1.inteligencia = data.players[0].inteligencia;
        jogador1.powerRS = data.players[0].powerjogador;
  
        //grava no localstorage do navegador
        gravarLS('atributos', data.players[0].inteligencia)
        gravarLS('estaminaJ', data.players[0].estamina)
        gravarLS('grana', data.players[0].grana)
        gravarLS('saldoConta', data.players[0].bonus_recompensa)
        gravarLS('nome', data.players[0].nome)
        gravarLS('inteligencia', data.players[0].inteligencia)
        gravarLS('powerRS', data.players[0].powerjogador)
        gravarLS('respeito', data.players[0].respeito);
        gravarLS('bonusRS', data.players[0].bonusRS);


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


        jogador1.atributosJ = recuperaLS('atributos', jogador1.atributosJ);
        jogador1.granaTxt = jogador1.grana.toLocaleString('pt-BR');
        jogador1.nRoubos = recuperaLS('RoubosRealizados', jogador1.nRoubos);

        $estamina.innerHTML = `${data.players[0].estamina}%`;
        $barraEstamina.style.width = `${data.players[0].estamina}%`;
    
    } catch (error) {
        console.log("resultadoBuscaerro: " + error);
    }
}


function logout() {
    // Function to handle logout
    localStorage.removeItem('userId');
    localStorage.removeItem('token');

    const keysToPreserve = ['dias', 'horas', 'min'];

    // Obtém todas as chaves atualmente no localStorage
    const allKeys = Object.keys(localStorage);

    // Itera sobre as chaves e remove aquelas que não devem ser preservadas
    allKeys.forEach(key => {
        if (!keysToPreserve.includes(key)) {
            localStorage.removeItem(key);
        }
    });

    // Redirect the user to the login page or perform other actions
    window.location.href = '/login'; // Update with the actual login page URL
}


function isTokenExpired() {
    const expiration = localStorage.getItem('expiration');

    // Check if the token is expired
    return !expiration || Date.now() >= parseInt(expiration);
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
            gravarLS('armaForca',arma.forca); arma.forca;
            localStorage.setItem('pBonus', arma.pBonus)
        } else {
            // Caso o jogador não tenha nenhuma arma equipada, exiba uma mensagem padrão ou deixe vazio
            document.getElementById('nomeEquipado').innerText = 'Vazio';
        }
    } catch (error) {
        console.error('Erro ao buscar arma equipada:', error);
    }
}


async function atualizarTempo() {
    try {

        const response = await fetch('http://localhost:3000/obter-tempo');
        const tempo = await response.json();

        console.log('Tempo recebido:', tempo.dias);

        gravarLS('min', `${tempo.minutos}`);
        gravarLS('horas', `${tempo.horas}`);
        gravarLS('dias', tempo.dias);

        $horas.innerHTML = `<i class="far fa-clock"></i> ${tempo.horas} : ${tempo.minutos}`;
        $dias.innerHTML = `<i class="far fa-calendar-alt"></i> Dia: ${tempo.dias}` ;

    } catch (error) {
        console.error('Erro ao obter o tempo:', error);
    }
}

// Função para calcular o poder de roubos com base na arma equipada
async function calcularPR(idArma) {
    try {
        const response = await fetch('/calcularPR', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idArma: idArma,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao calcular PR.');
        }

        const data = await response.json();
        console.log('PR calculado:', data.bonusRS);

        gravarLS('powerRS', data.bonusRS);
        // Atualize a interface do usuário com o novo PR, se necessário
        // Exemplo: document.getElementById('prAtual').innerText = data.pr;

    } catch (error) {
        console.error('Erro ao calcular PR:', error);
        alert('Erro ao calcular PR. Tente novamente mais tarde.');
    }
}


// Configurar intervalo para atualizar a cada minuto (ou conforme necessário)
setInterval(atualizarTempo, 60000); // Atualiza a cada 1 minuto (60000 milissegundos)
//setInterval(renewToken, 300);
setInterval(mostraInfoJogador, 25000); 
window.onload = () => {
    buscarArmaEquipada();
};