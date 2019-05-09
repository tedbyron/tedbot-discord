const { RichEmbed } = require('discord.js');
const { PREFIX } = require('../../config');

module.exports = {
  name: 'beep',
  usage: `${PREFIX}beep`,
  description: 'beep boop i\'m a bot',
  args: false,
  execute(message) {
    message.channel.send(
      new RichEmbed()
        .setColor(0xFFFFFF)
        .setTitle('boop')
    );
  },
}
