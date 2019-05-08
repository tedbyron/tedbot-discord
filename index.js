// imports
const DISCORD = require('discord.js');
const CLIENT = new DISCORD.Client();
const { PREFIX, TOKEN, SERVERS, ACTIVITY_TYPE, ACTIVITY } = require('./config.json');

// on ready event listener
CLIENT.on('ready', async () => {
  console.log(`Logged in as ${CLIENT.user.tag}`);
  CLIENT.user.setActivity(ACTIVITY, { type: ACTIVITY_TYPE });

  // log client invite URI
  try {
    let link = await CLIENT.generateInvite(134474881);
    console.log(link);
  } catch(err) {
    console.warn(err.stack);
  }
});

// on message event listener
CLIENT.on('message', async message => {
  // return if the message is not a command
  if (!message.content.startsWith(PREFIX)                     // message does not begin with the prefix
      || Object.values(SERVERS).indexOf(message.guild.id) < 0 // guild is not in whitelist
      || message.channel.type !== 'text'                      // message is in a non-text channel
      || message.author.bot                                   // message author is bot
      || message.content[PREFIX.length] === undefined         // no characters after the prefix
      || /\s/.test(message.content[PREFIX.length])) {         // whitespace after the prefix
    return;
  }

  // slice the command prefix, split command + arguments on spaces
  const ARGS = message.content.slice(PREFIX.length).trim().toLowerCase().split(/ +/);
  const COMMAND = ARGS.shift();

  if (COMMAND === 'beep') {
    message.channel.send(
      new DISCORD.RichEmbed()
        .setColor(0xFFFFFF)
        .setTitle('boop')
    );
  }

  if (COMMAND === 'user') {
    message.channel.send(
      new DISCORD.RichEmbed()
        .setColor(0xFFFFFF)
        .setThumbnail(message.author.avatarURL)
        .setTitle(message.author.tag)
        .addField('id', message.author.id)
        .addField('created', message.author.createdAt)
        .addField('status', message.author.presence.status)
        .addField('activity', message.author.presence.game || 'none')
    );
  }
});

// client login
CLIENT.login(TOKEN);
