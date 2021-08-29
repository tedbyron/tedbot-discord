const { RichEmbed } = require('discord.js')
const { PREFIX } = require('../../config')
const COLORS = require('../../helpers/colors')

module.exports = {
  name: 'beep',
  usage: `${PREFIX}beep`,
  description: 'beep boop i\'m a bot',
  args: false,
  execute (message) {
    message.channel.send(
      new RichEmbed()
        .setColor(COLORS.default)
        .setTitle('boop')
    )
  }
}
