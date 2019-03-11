$(function () {
    var socket = io();
    var chatMessage = "";
    var message;
    var fullMessage;

    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });

    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
      $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });

    //add user
    socket.on('connect', function(){
        socket.emit('adduser');
        socket.emit('update userlist');
    });

    //update user list
    socket.on('onlineUsers', function(msg){
        len = msg.length;
        $('#users').empty();
        for(i = 0; i < msg.length; i += 2){
          chatMessage += "<b>" + msg[i] + "</b>" + "<br/>";
        }
        $('#users').append($('<li>').html(chatMessage));
    });

    //display user list
    socket.on('userNameTitle', function(msg){	
        $('#userNameTitle').html(msg);
    });

    //display chat messages
    socket.on('chat message', function(msg1, name, msg2, color){
        name = name.fontcolor(color);
        message = msg1 + name + msg2;
        $('#messages').append($('<li>').html(message));
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });

    //chat history displayed in italics font
    socket.on('chat history', function(msg){
        msg = "<i>" + msg + "</i>";
        $('#messages').append($('<li>').html(msg));
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });

    //bold own message
    socket.on('bold message', function(msg1, name, msg2, color){
        name = name.fontcolor(color);
        fullMessage = "<b>" + msg1 + name + msg2 + "</b>";
        $('#messages').append($('<li>').html(fullMessage));
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });
  });