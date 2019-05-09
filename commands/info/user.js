const { RichEmbed } = require('discord.js');
const { PREFIX } = require('../../config');
const { COLOR_DEFAULT } = require('../../helpers/colors');

const activityTypes = [
  'playing',
  'streaming',
  'listening to',
  'watching',
];

module.exports = {
  name: 'user',
  usage: `${PREFIX}user [OPTION]... [@USER]`,
  description: 'print user and role information for the specified USER, or (when USER is omitted) for the current user',
  args: false,
  execute(message, args) {
    // if no user was mentioned, default to the author
    const user = message.mentions.users.first()
      ? message.mentions.users.first()
      : message.author;

    // embed for client response
    const embed = new RichEmbed()
      .setColor(COLOR_DEFAULT)
      .setAuthor(user.tag + (user.bot ? ' (bot)' : ''), user.avatarURL)
      .addField('id', user.id, true)
      .addField('status', user.presence.status, true);

    // get user presence info
    if (user.presence.game) {
      let presence = `${activityTypes[user.presence.game.type]} **${user.presence.game.name}**`;

      if (user.presence.game.state) presence += `: ${user.presence.game.state}`;
      if (user.presence.game.details) presence += ` - ${user.presence.game.details}`;

      embed.addField('activity', presence);

      if (user.presence.game.assets) {
        embed.setThumbnail(user.presence.game.assets.largeImageURL);
      }
    }

    embed.addField('created', user.createdAt.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }));

    // send response
    message.channel.send(embed);
  },
}
