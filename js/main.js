// Panalla del juego
var canvas;
// Contexto del canvas
var ctx;
// fotogramas por segundo
var FPS = 50;

var anchoF = 50;
var altoF = 50;

var muro = '#044f14';
var tierra = '#c6892f';
var puerta = '#3a1700';

var llave = '#c6bc00';

var colorProta = '#820c01';
var tileMap;
var enemigo = [];
var imagenAntorcha = [];


// empieza e la posicion 0 tanto en x como en y
var escenario = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 2, 0, 0, 2, 0],
    [0, 0, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0],
    [0, 0, 2, 2, 2, 0, 2, 2, 0, 3, 2, 0, 2, 2, 0],
    [0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0],
    [0, 2, 2, 2, 0, 0, 2, 2, 2, 0, 2, 0, 2, 2, 0],
    [0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0],
    [0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

];


function dibujaEscenario() {

    for (y = 0; y < 10; y++) {
        for (x = 0; x < 15; x++) {
            var tile = escenario[y][x]; //guarda el valor de la posición del escenario
            /*ctx.fillStyle = color;
            ctx.fillRect(x * anchoF, y * altoF, anchoF, altoF);
            ctx.strokeRect(this.x * anchoF, this.y * altoF, anchoF, altoF);
            */
            ctx.drawImage(tileMap, tile * 32, 0, 32, 32, anchoF * x, altoF * y, anchoF, altoF);
        }
    }
}

var antorcha = function(x,y){
    this.x=x;
    this.y=y;

    this.retraso =10;
    this.contador=0;
    this.fotograma= 0; // 0-3

    this.cambiaFotograma= function(){
        if(this.fotograma <3){
            this.fotograma++;
        }
        else{
            this.fotograma =0;
        }
    }
    this.dibuja = function(){
        ctx.drawImage(tileMap, this.fotograma*32, 64, 32, 32, anchoF * x, altoF * y, anchoF, altoF);
        if(this.contador < this.retraso){
            this.contador++;
        }
        else{
            this.contador = 0;
            this.cambiaFotograma();

        }
        
    }
}


// Clase enemigo

var malo = function (x, y) {
    this.x = x; //crea parametros para ubicar la posición de los enemigos
    this.y = y;


    this.direccion = Math.floor(Math.random() * 2);
    this.retraso = 30;
    this.fotograma = 0;

    this.dibuja = function () {
        ctx.drawImage(tileMap, 0, 32, 32, 32, this.x * anchoF, this.y * altoF, anchoF, altoF);
    }

    this.compurebaColision = function (x, y) {
        var colisiona = false;

        if (escenario[y][x] == 0) {
            colisiona = true;
        }
        return colisiona;
    }

    this.mueve = function () {

        protagonista.colisionEnemigo(this.x,this.y);

        if (this.contador < this.retraso) {
            this.contador++;
        } else {
            this.contador=0;



            // ARRIBA
            if (this.direccion == 0) {
                if (this.compurebaColision(this.x, this.y - 1) == false) {
                    this.y--;
                } else {
                    this.direccion = Math.floor(Math.random() * 2);
                }
            }

            // ABAJO

            if (this.direccion == 1) {
                if (this.compurebaColision(this.x, this.y + 1) == false) {
                    this.y++;
                } else {
                    this.direccion = Math.floor(Math.random() * 2);
                }
            }


            // IZQUIERDA
            if (this.direccion == 2) {
                if (this.compurebaColision(this.x - 1, this.y) == false) {
                    this.x--;
                } else {
                    this.direccion = Math.floor(Math.random() * 2);
                }
            }

            // DERECHA
            if (this.direccion == 3) {
                if (this.compurebaColision(this.x + 1, this.y) == false) {
                    this.x++;
                } else {
                    this.direccion = Math.floor(Math.random() * 2);
                }
            }

        }
    }

}


// Objeto Jugador
var jugador = function () {
    this.x = 1;
    this.y = 1;
    this.color = '#820c01';
    var llave = false;





    this.dibuja = function () {
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x * anchoF, this.y * altoF, anchoF, altoF);
        ctx.drawImage(tileMap, 32, 32, 32, 32, this.x * anchoF, this.y * altoF, anchoF, altoF);
    }

    this.colisionEnemigo = function(x,y){
        if(this.x ==x && this.y == y){
            this.muerte();
        }

    }


    // funcion que controla los margenes

    this.margenes = function (x, y) {
        var colision = false;

        if (escenario[y][x] == 0) {
            colision = true;
        }
        return (colision);
    }


    this.arriba = function () {
        if (this.margenes(this.x, this.y - 1) == false) {
            this.y--;
            this.logicaObjetos();
        }
    }

    this.abajo = function () {
        if (this.margenes(this.x, this.y + 1) == false) {
            this.y++;
            this.logicaObjetos();
        }


    }
    this.izquierda = function () {
        if (this.margenes(this.x - 1, this.y) == false) {
            this.x--;
            this.logicaObjetos();
        }
    }


    this.derecha = function () {
        if (this.margenes(this.x + 1, this.y) == false) {
            this.x++;
            this.logicaObjetos();
        }
    }


    this.victoria = function () {
        alert("¡¡¡¡Ganaste!!!!");
        this.x = 1;
        this.y = 1;
        this.llave = false; //el jugador no tiene la llave
        escenario[4][9] = 3; // se vuelve a poner la llave en su sitio
    }

    this.muerte = function () {
        alert("¡Has muerto!");
        this.x = 1;
        this.y = 1;
        this.llave = false; //el jugador no tiene la llave
        escenario[4][9] = 3; // se vuelve a poner la llave en su sitio
    }




    this.logicaObjetos = function () {
        var objeto = escenario[this.y][this.x];
        // obtiene llave
        if (objeto == 3) {
            this.llave = true;
            escenario[this.y][this.x] = 2;
            // una vez que se tiene la llave se convierte en tierra la posicion de la casilla

            alert("¡Obtuviste la llave!");

        }
        // Abrir la puerta
        if (objeto == 1) {
            if (this.llave == true)
                this.victoria();

            else {
                alert("Te falta la llave no puedes pasar");
            }
        }
    }
}


// Se declara fuera para que se pueda acceder desde fuera
var protagonista;



function inicializa() {
    canvas = document.getElementById('canvas');
    // se declara el tipo de contexto a visualizar en la pantalla
    ctx = canvas.getContext('2d');

    // inicializamos el tile map con los objetos dentro del juego
    tileMap = new Image();
    tileMap.src = 'img/tilemap.png';


    // Creamos al Jugador
    protagonista = new jugador();

// creamos la antorcha
    imagenAntorcha.push(new antorcha(0,0));
    imagenAntorcha.push(new antorcha(14,0));
    imagenAntorcha.push(new antorcha(14,9));
    imagenAntorcha.push(new antorcha(0,9));
    // imagenAntorcha.push(new antorcha(0,0));
    

    // Crear enemigos

    enemigo.push(new malo(13, 1));
    enemigo.push(new malo(2, 6));
    enemigo.push(new malo(7, 5));


    // Lectura del teclado
    document.addEventListener('keydown', function (tecla) {
        // arriba
        if (tecla.keyCode == 38) {
            protagonista.arriba();
        }
        // abajo
        if (tecla.keyCode == 40) {
            protagonista.abajo();
        }
        // izquierda
        if (tecla.keyCode == 37) {
            protagonista.izquierda();
        }
        // derecha
        if (tecla.keyCode == 39) {
            protagonista.derecha();
        }
    })


    setInterval(function () {
        principal();
    }, 1000 / FPS);
}




function borraCanvas() {
    canvas.width = 750;
    canvas.height = 500;
}



function principal() {

    borraCanvas();
    dibujaEscenario();
    protagonista.dibuja();
  

    for (c = 0; c < enemigo.length; c++) {
        enemigo[c].mueve();
        enemigo[c].dibuja();
    }

    for (e = 0; e < imagenAntorcha.length; e++) {
        imagenAntorcha[e].dibuja();
    }

}