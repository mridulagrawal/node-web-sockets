var socket = io();

const scrollToBottom = () => {

};

const formattedTime = (timeStamp) => {
    return moment(timeStamp).format('hh:mm a');
}

socket.on('connect', function () {
    console.log('server connected');
})

socket.on('disconnect', function () {
    console.log('server disconnected');
})

socket.on('newMessage', function (message) {
    let li = document.createElement('li');
    li.innerHTML = `${message.from} ${formattedTime(message.createdAt)}: ${message.text}`;
    document.getElementById('msg-received').appendChild(li);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.setAttribute("target", "_blank");
    a.setAttribute("href", message.url);
    a.innerHTML = "my current location";
    li.innerText = `${message.from} ${formattedTime(message.createdAt)}: `;
    li.appendChild(a);
    document.getElementById('msg-received').appendChild(li);
    scrollToBottom();
});

document.getElementById('chat-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let msg = document.getElementById('msg').value;
    socket.emit('createMessage', {
        from: 'User',
        text: msg
    });
});

document.getElementById('geo-location').addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('not supported bro!')
    }
    navigator.geolocation.getCurrentPosition((pos) => {
        let crd = pos.coords;
        socket.emit('sendLocationMessage', {
            from: 'User',
            latitude: crd.latitude,
            longitude: crd.longitude
        });
    }, () => {
        alert('unable to fetch');
    });
});