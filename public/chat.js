const socket = io();

(() => {
  $("form").submit(function(e) {
    let li = document.createElement("li");
    e.preventDefault(); // stop page reload

    var msg = {
        message: $("#message").val(),
        sender: $("#username").val(),
        room: $("#rooms").val()
    }
    
    //Emit newMessage
    socket.emit("newMessage", msg);

    messages.appendChild(li).append($("#message").val());
    let span = document.createElement("span");
    messages.appendChild(span).append(`by ${msg.sender} just now`);
    
    $("#message").val(""); //Clear message
    
    return false;
  });

  socket.on("received", msg  =>  {
    let  li  =  document.createElement("li");
    let  span  =  document.createElement("span");
    let  messages  =  document.getElementById("messages");
    messages.appendChild(li).append(msg.message);
    messages.appendChild(span).append(`by ${msg.sender} just now`);
    });

    
})();

// Fetch API
(() => {
  fetch("/chat")
    .then(data => {
      return data.json();
    })
    .then(json => {
      json.map(data => {
        let li = document.createElement("li");
        let messages = document.getElementById("messages");
        let span = document.createElement("span");
        messages.appendChild(li).append(data.message);

        messages
          .appendChild(span)
          .append("by " + data.sender);
      });
    });
})();
