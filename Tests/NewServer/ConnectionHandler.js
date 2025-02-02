/*
    When a new player connects, ConnectionHandler takes note and does setup
    Player disconnect and auto-reconnect and done here
*/

const Client = require('./Client.js');
const Logger = require('./Logger.js');
const AccountHandler = require('./AccountHandler.js');
const RulesHandler = require('./RulesHandler.js');
const DefaultRules = require('./DefaultRules.js');

const SocketTools = {
    verifySocketId: (socketId) => {
        return !(socketId === undefined || isNaN(socketId) || socketId == 0 || socketId == null);
    },
    verifyRulesReq: (type, data) => {
        if (typeof type !== 'string' || typeof data === 'function') {
            return false;
        }
        if (type !== 'get' && type !== 'set' && type !== 'template') {
            return false;
        }
        return true;
    }
}

const ConnectionHandler = {
    clients: [],
    callbacks: {},
    exists: (socketId) => {
        return !!ConnectionHandler.clients[socketId];
    },
    addClient: (socketId, args) => {
        ConnectionHandler.clients[socketId] = new Client(args);
    },
    loadData: (args) => {
        ConnectionHandler.clients[args.socketId].userInfo = args.info;
    },
    signInSuccess: (args) => {
        ConnectionHandler.clients[args.socketId].username = args.username;
        ConnectionHandler.clients[args.socketId].username = args.token;
    },
    sendTemplate: (args) => {
        SOCKET_LIST[args.socketId].emit('template', args.template);
    },
    sendTemplateList: (args) => {
        SOCKET_LIST[args.socketId].emit('templateList', DefaultRules.templateList);
    }
};

const { Server } = require("socket.io");
const io = new Server(3000);

const SOCKET_LIST = [];

io.on('connection', (socket) => {
    let socketId = socket.handshake.auth.token;
    if (!SocketTools.verifySocketId(socketId)) {
        socket.disconnect();//Illegal socket
        return;
    }
    if (!ConnectionHandler.exists(socketId)) {
        //New client
        ConnectionHandler.addClient(socketId, { id: socketId });
        SOCKET_LIST[socketId] = socket;

        AccountHandler.signIn({ username: socket.handshake.auth.username, token: socket.handshake.auth.signInToken, id: socketId });
        Logger.event('join',{socketId: socketId});
    }

    socket.on('rules', (type, data) => {
        if (!SocketTools.verifyRulesReq(type,data)) {
            return;
        }
        RulesHandler.userRequest({rules: ConnectionHandler.clients[socketId].rules, type: type, data: data, socketId: socketId});
    })

    socket.on('getTemplates', (callback) => {
        callback(DefaultRules.templateList);
    });

    socket.on('useTemplate', (template, callback) => {
        RulesHandler.useTemplate(ConnectionHandler.clients[socketId].rules, template);
        callback(ConnectionHandler.clients[socketId].rules.phasesList);
    });

    socket.on('getPhases', (callback) => {
        callback(ConnectionHandler.clients[socketId].rules.phasesList);
    });

    socket.on('getCustomTemplates', (callback) => {
        callback(ConnectionHandler.clients[socketId].templates);
    });
});

module.exports = ConnectionHandler;