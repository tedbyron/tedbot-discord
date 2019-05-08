const { RichEmbed } = require('discord.js');

const activityTypes = [
  'Playing',
  'Streaming',
  'Listening to',
  'Watching',
];

module.exports = {
  name: 'user',
  description: 'get discord user info',
  execute(message, args) {
    // if no user was mentioned, default to the author
    const user = message.mentions.users.first()
      ? message.mentions.users.first()
      : message.author;

    // get user presence info
    let presence = 'none';
    if (user.presence.game) {
      presence = `${activityTypes[user.presence.game.type]} **${user.presence.game.name}**`;

      if (user.presence.game.state) {
        presence += `: ${user.presence.game.state}`;
      }
      if (user.presence.game.details) {
        presence += ` - ${user.presence.game.details}`;
      }
    }

    message.channel.send(
      new RichEmbed()
        .setColor(0xFFFFFF)
        .setThumbnail(user.avatarURL)
        .setTitle(user.tag + (user.bot ? ' (bot)' : ''))
        .addField('id', user.id, true)
        .addField('status', user.presence.status, true)
        .addField('created', user.createdAt)
        .addField('activity', presence)
    );
  },
}
