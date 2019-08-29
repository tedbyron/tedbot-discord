const { RichEmbed } = require('discord.js');
const { PREFIX } = require('../../config');
const COLORS = require('../../helpers/colors');
const RESPONSES = require('../../helpers/responses');

const activityTypes = [
  'playing',
  'streaming',
  'listening to',
  'watching'
];

module.exports = {
  name: 'user',
  usage: `\`${PREFIX}user [@U]\`
  U: discord user tag`,
  description: 'print user and role information for the message author, or a specified user (U)',
  args: false,
  execute(message, args) {
    if (args.length > 1) {
      return RESPONSES.warning(message, `too many arguments for \`${PREFIX + this.name}\``, ['usage', this.usage]);
    }

    let user = message.author;

    // if a user is mentioned, get info from that user instead of the author
    if (args.length) {
      const id = args[0].match(/^<@!?(\d+)>$/);
      if (id[1]) user = message.client.users.get(id[1]);
    }

    // initialize embed for client response
    const embed = new RichEmbed()
      .setColor(COLORS.default)
      .addField('id', user.id, true)
      .addField('status', user.presence.status, true);

    // get user presence info
    if (user.presence.game) {
      let presence = `${activityTypes[user.presence.game.type]} **${user.presence.game.name}**`;

      if (user.presence.game.state) presence += `: ${user.presence.game.details}`;
      if (user.presence.game.details) presence += ` - ${user.presence.game.state}`;

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
      timeZoneName: 'short'
    }));

    message.guild.fetchMember(user)
      .then(member => {
        embed.setAuthor(member.displayName + (user.bot ? ` (${user.tag}) [bot]` : ` (${user.tag})`), user.avatarURL)
          .addField('joined', member.joinedAt.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short'
          }));
      })
      .then(() => {
        message.channel.send(embed);
      })
      .catch(error => {
        console.error(error);
      });
  }
};
