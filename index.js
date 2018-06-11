const DISCORD = require('discord.js');
const BOT = new DISCORD.Client();
const { prefix, token, servers } = require('./config.json');

BOT.on('ready', async () => {
  console.log(`Logged in as ${BOT.user.tag}`);

  try {
    let link = await BOT.generateInvite(134474881);
    console.log(link);
  } catch(err) {
    console.log(err.stack);
  }
});

BOT.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.channel.type !== "text" || message.author.bot) {
    return;
  }

  var allowed_server = false;
  for (i in servers) {
    if (message.guild.id === servers[i]) {
      allowed_server = true;
      break;
    }
  }
  if (!allowed_server) {
    return;
  }

  const ARGS = message.content.slice(prefix.length).split(/ +/);
  const COMMAND = ARGS.shift().toLowerCase();

  if (COMMAND === `beep`) {
    if (!ARGS.length) {
      message.channel.send(`boop`);
    } else {
      message.channel.send(`error: unknown option \`${ARGS[0]}\`\nusage: \`${prefix}beep\``);
    }
  } else if (COMMAND === 'man') {
    if (!ARGS.length) {
        return message.channel.send(`error: no arguments provided\nusage \`${prefix}man [command]\``);
    } else {
      if (ARGS[0] === 'beep') {
        return message.channel.send(`name: \`beep\` - returns \"boop\"\nusage: \`${prefix}beep\``);
      } else if (ARGS[0] === 'ping') {
        return message.channel.send(`name: \`ping\` - returns \"pong\"\nusage: \`${prefix}ping\``);
      } else if (ARGS[0] === 'man') {
        return message.channel.send(`name: \`man\` - ${BOT.user.username}\'s reference manuals\nusage: \`${prefix}man [command]\``);
      } else if (ARGS[0] === 'me') {
        return message.channel.send(`name: \`me\` - alias of \`${prefix}user --me\`\nusage: \`${prefix}me\``);
      } else if (ARGS[0] === 'prune') {
        return message.channel.send(`name: \`prune\` - prunes specified amount of messages\nusage: \`${prefix}prune [integer (1-99)]\``);
      } else if (ARGS[0] === 'server') {
        return message.channel.send(`name: \`server\` - returns information about the server\nusage: \`${prefix}server\``);
      } else if (ARGS[0] === 'user') {
        return message.channel.send(`name: \`user\` - returns information about the specified user\nusage: \`${prefix}user [@username#tag] [--id integer] [--me]\`\noptions:\n\t--id\n\t\treturns information about a user selected by id\n\t--me\n\t\treturns information about the issuer of the command`);
      } else {
        message.channel.send(`\`${prefix}${ARGS[0]}\` is not a ${BOT.user.username} command, see \`${prefix}help\``);
      }
    }
  } else if (COMMAND === `ping`) {
    if (!ARGS.length) {
      message.channel.send(`pong`);
    } else {
      message.channel.send(`error: unknown argument \`${ARGS[0]}\`\nusage: \`${prefix}ping\``);
    }
  } else if (COMMAND === `prune`) {
    if (!ARGS.length) {
      message.channel.send(`error: you must provide arguments for \`${prefix}prune [integer (1-99)]\``);
    } else {
      const amount = parseInt(ARGS[0]) + 1;

      if (isNaN(amount)) {
        message.channel.send(`error: unknown argument \`${ARGS[0]}\`\nusage: \`${prefix}prune [integer (1-99)]\``);
      } else if (amount < 1 || amount > 100) {
        message.channel.send(`error: invalid argument \`${ARGS[0]}\`\nusage: \`${prefix}prune [integer (1-99)]\``);
      } else {
        message.channel.bulkDelete(amount, true).catch(err => {
          console.error(err);
          message.channel.send(`error: could not prune messages in ${message.channel.name}`);
        });
      }
    }
  } else if (COMMAND === `server`) {
    if (!ARGS.length) {
      message.channel.send(`server: ${message.guild.name}\nserver id: ${message.guild.id}\nowner: ${message.guild.owner}\nowner id: ${message.guild.ownerID}\ncreated on: ${message.guild.createdAt}\nregion: ${message.guild.region}\nmembers: ${message.guild.memberCount}`);
    } else {
      message.channel.send(`error: unknown argument \`${ARGS[0]}\`\nusage: \`${prefix}server\``);
    }
  } else if (COMMAND === `user`) {
    if (!ARGS.length) {
      return message.channel.send(`error: no arguments provided\nusage: \`${prefix}user [@username#tag] [--id integer] [--me]\``);
    } else if (ARGS.length === 1) {
      if (message.mentions.users.first()) {
        const MENTIONED_USER = message.mentions.users.first();
        if (MENTIONED_USER.presence.game) {
          message.channel.send(`user: ${MENTIONED_USER}\nusername: ${MENTIONED_USER.tag}\nid: ${MENTIONED_USER.id}\nstatus: ${MENTIONED_USER.presence.status}\ncurrent game: ${MENTIONED_USER.presence.game.name}`);
        } else {
          message.channel.send(`user: ${MENTIONED_USER}\nusername: ${MENTIONED_USER.tag}\nid: ${MENTIONED_USER.id}\nstatus: ${MENTIONED_USER.presence.status}\ncurrent game: none`);
        }
      } else if (ARGS[0] === "--me") {
        if (message.author.presence.game) {
          message.channel.send(`user: ${message.author}\nusername: ${message.author.tag}\nid: ${message.author.id}\nstatus: ${message.author.presence.status}\ncurrent game: ${message.author.presence.game.name}`);
        } else {
          message.channel.send(`user: ${message.author}\nusername: ${message.author.tag}\nid: ${message.author.id}\nstatus: ${message.author.presence.status}\ncurrent game: none`);
        }
      } else {
        message.channel.send(`error: unknown argument \`${ARGS[0]}\`\nusage: \`${prefix}user [@username#tag] [--id integer] [--me]\``);
      }
    } else if (ARGS.length === 2) {
      if (ARGS[0] === "--id") {
        if (message.guild.members.get(ARGS[1])) {
          const USER_ID = message.guild.members.get(ARGS[1]).user;
          if (USER_ID.presence.game) {
            message.channel.send(`user: ${USER_ID}\nusername: ${USER_ID.tag}\nid: ${USER_ID.id}\nstatus: ${USER_ID.presence.status}\ncurrent game: ${USER_ID.presence.game.name}`);
          } else {
            message.channel.send(`user: ${USER_ID}\nusername: ${USER_ID.tag}\nid: ${USER_ID.id}\nstatus: ${USER_ID.presence.status}\ncurrent game: none`);
          }
        } else {
          message.channel.send(`error: invalid user id \`${ARGS[0]}\`\nusage: \`${prefix}user [@username#tag] [--id integer] [--me]\``);
        }
      } else {
        message.channel.send(`error: unknown argument \`${ARGS[0]}\`\nusage: \`${prefix}user [@username#tag] [--id integer] [--me]\``);
      }
    } else {
      message.channel.send(`error: invalid number of arguments\nusage: \`${prefix}user [@username#tag] [--id integer] [--me]\``);
    }
  } else if (COMMAND.length !== 0) {
    message.channel.send(`\`${prefix}${COMMAND}\` is not a ${BOT.user.username} command, see \`${prefix}help\``);
  }
});

BOT.login(token);
