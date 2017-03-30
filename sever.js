    var express = require('express');
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);
users =[];  //保存所有用户在线昵称
app.use('/',express.static(__dirname+'/www'));
server.listen(8888);
io.on('connection',function(socket){

    //昵称设置
    socket.on('login',function(nickname){
        if(users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system',nickname,users.length,'login');
        }
        });
    //断开连接
        socket.on('disconnect',function() {
            users.splice(socket.userIndex,1);
            socket.broadcast.emit('system',socket.nickname,users.length,'logout')
        });

    //接收消息
    socket.on('posMsg',function(msg) {
        socket.broadcast.emit('newMsg',socket.nickname,msg);
    });
    //接收用户发来的图片
    socket.on('img',function(imgData) {
        socket.broadcast.emit('newImg',socket.nickname,imgData);
    });

});