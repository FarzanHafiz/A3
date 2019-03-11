$(function () {
    var socket = io();
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
        $('#users').empty();

        var message = "";
        for (i = 0; i < msg.length; i += 2)
        {
            message += "<b>" + msg[i] + "</b>" + "<br/>"
        }
        $('#users').append($('<li>').html(message));
    });

    //display user list
    socket.on('userNameTitle', function(msg){	
        $('#userNameTitle').html(msg);
    });

    //display chat messages
    socket.on('chat message', function(msg1, name, msg2, color){
        var entireMessage;
        name = name.fontcolor(color);
        entireMessage = msg1 + name + msg2;
        $('#messages').append($('<li>').html(entireMessage));
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });

    //bold own message
    socket.on('bold message', function(msg1, name, msg2, color){
        var completeMessage;
        name = name.fontcolor(color);
        completeMessage = "<b>" + msg1 + name + msg2 + "</b>";
        $('#messages').append($('<li>').html(completeMessage));
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });

    //chat history displayed in italics font
    socket.on('chat history', function(msg){
        msg = "<i>" + msg + "</i>";
        $('#messages').append($('<li>').html(msg));
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });
  });