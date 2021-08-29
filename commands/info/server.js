const { RichEmbed } = require('discord.js')
const { PREFIX } = require('../../config')
const COLORS = require('../../helpers/colors')
const RESPONSES = require('../../helpers/responses')

const verificationLevels = {
  0: 'none (unrestricted)',
  1: 'low (members must have a verified email on their discord account)',
  2: 'medium (members must be registered on discord for longer than 5 minutes)',
  3: '(╯°□°）╯︵ ┻━┻ (members must be a member of this server for longer than 10 minutes)',
  4: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻ (members must have a verified phone on their discord account)'
}

module.exports = {
  name: 'server',
  usage: `\`${PREFIX}server\``,
  description: 'print server information',
  args: false,
  execute (message, args) {
    if (args.length > 0) {
      return RESPONSES.warning(message, `too many arguments for \`${PREFIX + this.name}\``, ['usage', this.usage])
    }

    const guild = message.guild

    // initialize embed for client response
    const embed = new RichEmbed()
      .setColor(COLORS.default)
      .setAuthor(guild.name, guild.iconURL)
      .addField('id', guild.id, true)
      .addField('member count', guild.memberCount, true)
      .addField('owner', `<@${guild.owner.id}>`)
      .addField('region', guild.region)
      .addField('verification level', verificationLevels[guild.verificationLevel])

    embed.addField('created', guild.createdAt.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    }))

    // send response
    message.channel.send(embed)
  }
}
