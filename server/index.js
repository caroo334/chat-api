//Configuracion inicial
import express from "express";
import morgan from 'morgan'; //Esto sirve para ver en la consola las rutas donde se hacen las peticiones
import {Server as socketServer} from 'socket.io';
import http from 'http';
import cors from 'cors';

import {PORT} from './config.js';


const app = express()
const server = http.createServer(app);
const io = new socketServer(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
}); // le vamos a pasar dentro un servidor http

app.use(cors());
app.use(morgan("dev"));

io.on('connection', (socket) => {
    console.log(socket.id) //este id es el id del cliente conectado
    // console.log('a user connected')
    socket.on('message', (message) => {   //quiero que escuches cuando pasa un evento y le paso el evento por parametros
        console.log(message) //aca veo el mensaje que me envia el front
        //como este dato llega ahora al back ahora puedo guardarlo en una base de datos

        //AHORA QUIERO ENVIAR ESE MENSAJE A TODOS LOS USUARIOS:
        socket.broadcast.emit('message', {
            body: message,
            from: socket.id
        });
    })
})

server.listen(PORT); // TENER EN CUENTA QUE CAMBIAMOS EL APP POR EL SERVER.LISTEN
console.log(`server statrterd on port ${PORT}`);