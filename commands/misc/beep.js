const { RichEmbed } = require('discord.js');

module.exports = {
  name: 'beep',
  description: 'beep boop i\'m a bot',
  execute(message, _) {
    message.channel.send(
      new RichEmbed()
        .setColor(0xFFFFFF)
        .setTitle('boop')
    );
  },
}
