var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var userCount = 0;
var userNameList = [];
var chatHistory = [];
var users = [];

app.use(express.static('public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// io.on('connection', function(socket){
//     socket.on('chat message', function(msg){
//        io.emit('chat message', msg);
//     });
// });

http.listen(3000, function(){
  console.log('listening on port:3000');
});

io.on('connection', function (socket) {
    userCount++;
    console.log('User connected', userCount);

    //add user
    socket.on('adduser', function(){
        socket.nickname = 'User ' + userCount;
        userNameList.push(socket.nickname);
        var color = 'black';
        userNameList.push(color);
        socket.emit('userNameTitle', "You are " + socket.nickname);
        for (i = 0; i < chatHistory.length; i++){
          socket.emit('chat history', chatHistory[i]);
        }
    });

    //get online users
    socket.on('update userlist', function(){
        io.emit('onlineUsers', userNameList);
    });

    //disconnect user
    socket.on('disconnect', function(){
        for (i = 0; i < userNameList.length; i += 2){
          if (socket.nickname === userNameList[i]){
            userNameList.splice(i, 2);
          }
        }
        io.emit('onlineUsers', userNameList);
        console.log('user disconnected', userCount);
        userCount--;
    });

    //send message to everyone
    socket.on('chat message', function(msg){
        var hours = new Date().getHours();
        var minutes = new Date().getMinutes();
        var seconds = new Date().getSeconds();
        if (hours < 10){
            hours = "0" + hours;
        }
        if (minutes < 10){
            minutes = "0" + minutes;
        }
        if (seconds < 10){
            seconds = "0" + seconds;
        }

        //nickname change command
        if (msg.startsWith("/nick ")){
            var nameChange;
            var invalidName = false;
            nameChange = msg.substring(6);
            for (i = 0; i < userNameList.length; i += 2){
              if (nameChange === userNameList[i]){                  
                invalidName = true;
              }
            }
            if (invalidName == false){
                for (j = 0; j < userNameList.length; j += 2){
                  if (socket.nickname === userNameList[j]){
                    socket.nickname = nameChange;
                    userNameList[j] = socket.nickname;
                  }
                }
                socket.emit('userNameTitle', "Nick name is: " + socket.nickname);
                
                io.emit('onlineUsers', userNameList);
            }
        }

        //color change
        else if (msg.startsWith("/nickcolor ")){
          var colorChange;
          colorChange = msg.substring(11);
          for (i = 0; i < userNameList.length; i += 2){
            if (socket.nickname === userNameList[i]){
              userNameList[i+1] = colorChange;
            }
          }
          socket.emit('chat message', "Nickname color changed!");
        }
        else{
            if(chatHistory.length == 200){
                chatHistory.shift();
                chatHistory.push(hours + ":" + minutes + ":" + seconds + " - " + socket.nickname + ": " + msg);
            }
            else{
                chatHistory.push(hours + ":" + minutes + ":" + seconds + " - " + socket.nickname + ": " + msg);
            }
            var userColor;
            for (i = 0; i < userNameList.length; i += 2){
                if (socket.nickname === userNameList[i]){
                    userColor = userNameList[i+1];
                }
            }
            socket.broadcast.emit('chat message', hours + ":" + minutes + ":" + seconds + " - ", socket.nickname, ": " + msg, userColor);
            socket.emit('bold message', hours + ":" + minutes + ":" + seconds + " - ", socket.nickname, ": " + msg, userColor);
        }
    });
});