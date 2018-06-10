const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (message.content.startsWith(`${prefix}ping`)) {
    message.channel.send('pong');
  } else if (message.content.startsWith(`${prefix}beep`)) {
    message.channel.send('boop');
  }
});

client.login(token);
