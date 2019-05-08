// imports
const FS = require('fs');
const DISCORD = require('discord.js');
const { PREFIX, TOKEN, SERVERS, ACTIVITY_TYPE, ACTIVITY } = require('./config.json');

const CLIENT = new DISCORD.Client();        // initialize client
CLIENT.commands = new DISCORD.Collection(); // initialize commands
const commandDirs = {};
commandDirs.admin = FS.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));
commandDirs.info  = FS.readdirSync('./commands/info').filter(file => file.endsWith('.js'));
commandDirs.misc  = FS.readdirSync('./commands/misc').filter(file => file.endsWith('.js'));
commandDirs.music = FS.readdirSync('./commands/music').filter(file => file.endsWith('.js'));

// set commands
for (const group in commandDirs) {
  for (const file of commandDirs[group]) {
    const command = require(`./commands/${group}/${file}`);
    CLIENT.commands.set(command.name, command);
  }
}

// on ready event listener
CLIENT.on('ready', async () => {
  console.log(`Logged in as ${CLIENT.user.tag}`);
  CLIENT.user.setActivity(ACTIVITY, { type: ACTIVITY_TYPE });

  // log client invite URI
  try {
    let link = await CLIENT.generateInvite(8);
    console.log(link);
  } catch(error) {
    console.warn(error.stack);
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
  const commandArgs = message.content.slice(PREFIX.length).trim().toLowerCase().split(/ +/);
  const commandName = commandArgs.shift();

  // return if command is not in loaded commands
  if (!CLIENT.commands.has(commandName)) return;

  const command = CLIENT.commands.get(commandName);

  try {
    command.execute(message, commandArgs);
  } catch (error) {
    console.error(error);
    message.reply(`there was an error executing \`${PREFIX + commandName}\`. Check the log for more details.`);
  }
});

// client login
CLIENT.login(TOKEN);
