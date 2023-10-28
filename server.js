var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static("../dmitri"));

app.get("/", function (req, res) {
    res.redirect("index.html");
});

server.listen(3000, function () {
    console.log("App is running on port 3000");
});

const random = require("./random");
const Grass = require('./grass')
const GrassEater = require('./grassEater')
const Gishatich = require('./gishatich')
const Zombi = require('./zombi')
const Virus = require('./Virus')

matrix = [];
grassArr = []
grassEaterArr = []
gishatichArr = []
zombi = []
virusArr = []
var n = 20
var m = 20

for (let i = 0; i < m; i++) {
    matrix.push([]);
    for (let j = 0; j < n; j++) {
        matrix[i].push(0);
    }
}

function createGame() {
    function characters(index, count) {
        for (let a = 0; a < count; a++) {
            var v = Math.floor(random(n))
            var w = Math.floor(random(m))
            matrix[v][w] = index
        }
    }
    characters(1, 20)
    characters(2, 8)
    characters(3, 4)
    characters(4, 4)

    for (let y = 0; y < matrix.length; y++) {
        for (var x = 0; x < matrix[y].length; x++) {

            if (matrix[y][x] == 1) {
                let grass = new Grass(x, y, 1)
                grassArr.push(grass)
            }
            else if (matrix[y][x] == 2) {
                let grassEater = new GrassEater(x, y, 2)
                grassEaterArr.push(grassEater)
            }
            else if (matrix[y][x] == 3) {
                let gishatich = new Gishatich(x, y, 3)
                gishatichArr.push(gishatich)
            }
            else if (matrix[y][x] == 4) {
                let virus = new Virus(x, y, 4)
                virusArr.push(virus)
            }
        }
    }
}

function drawGame() {
    for (var i in grassArr) {
        grassArr[i].mul()
    }
    for (var i in grassEaterArr) {
        grassEaterArr[i].eat()
    }
    for (var i in gishatichArr) {
        gishatichArr[i].eat()
    }
    for (var i in virusArr) {
        virusArr[i].eat()
    }
    io.emit("matrix", matrix)
}

createGame()

let intervalID;

function startGame() {
   clearInterval(intervalID)
   createGame()
   intervalID = setInterval(() => {
      drawGame()
   }, 200)
}

io.on("connection", (socket) => {
   socket.emit("matrix", matrix)
   startGame()
})
