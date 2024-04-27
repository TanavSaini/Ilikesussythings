const WebSocket = require('ws');
const fetch = require('node-fetch');
const express = require('express');
const app = express();
app.use(express.json());

// config
const token = 'gapi_ZoxOoFlzLVdGcY143KTwmYZ1u/DguGd/ez/ZyGHzuXatep2UUrxofavmnPcAORGZFsRtw10REt0mzc+GQyBtKQ==';
const socket = new WebSocket('wss://www.guilded.gg/websocket/v1', {
  headers: {
    Authorization: `Bearer ${token}`
  },
});

socket.on('open', function() {
  console.log('connected to Guilded!');
});

let lastmessage = {
  message: ""
}

socket.on('message', async function incoming(data) {
  const json = JSON.parse(data);
  const {t: eventType, d: eventData} = json;
  if (eventType === 'ChatMessageCreated' || eventType === 'ChatMessageUpdated') {
    const {message: {id: messageId, content, channelId, createdBy}} = eventData;

    // Fetch user details
    const response = await fetch(`https://www.guilded.gg/api/users/${createdBy}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    const userData = await response.json();

    const userName = userData.user.name;

    lastmessage.message = userName + " said" + " " + content;

    console.log(lastmessage.message)
  }
});

app.get('/lastmessage', (req, res) => {
  res.json(lastmessage);
});

app.listen(3000, () => console.log('Server started on port 3000'));
