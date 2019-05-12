// imports
const FS = require('fs');
const DISCORD = require('discord.js');
const { PREFIX, TOKEN, SERVERS, ACTIVITY_TYPE, ACTIVITY } = require('./config.json');
const RESPONSES = require('./helpers/responses');

const CLIENT = new DISCORD.Client();        // initialize client
CLIENT.commands = new DISCORD.Collection(); // initialize commands
const commandDirs = {
  info: FS.readdirSync('./commands/info').filter(file => file.endsWith('.js')),
  misc: FS.readdirSync('./commands/misc').filter(file => file.endsWith('.js')),
};

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
    console.log(link + '\n');
  } catch(error) {
    console.warn(error.stack);
  }
});

// on message event listener
CLIENT.on('message', async message => {
  // return if the message is not a command
  if (!message.content.startsWith(PREFIX)                 // message does not begin with the prefix
  || Object.values(SERVERS).indexOf(message.guild.id) < 0 // guild is not in whitelist
  || message.channel.type !== 'text'                      // message is in a non-text channel
  || message.author.bot                                   // message author is bot
  || message.content[PREFIX.length] === undefined         // no characters after the prefix
  || /\s/.test(message.content[PREFIX.length])) {         // whitespace after the prefix
    return;
  }

  // slice the command prefix, split the command and arguments on spaces
  const commandArgs = message.content.slice(PREFIX.length)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .split(' ');
  const commandName = commandArgs.shift();

  // return if requested command does not exist
  if (!CLIENT.commands.has(commandName)) return;

  const command = CLIENT.commands.get(commandName);

  // return if arguments are required by the command
  if (command.args && !commandArgs.length) {
    return RESPONSES.warning(message, `\`${PREFIX + commandName}\` has required arguments`, ['usage', command.usage]);
  }

  // execute the command
  try {
    command.execute(message, commandArgs);
  } catch (error) {
    console.error(error);
    return RESPONSES.error(message, `execution of \`${PREFIX + commandName}\` failed`);
  }
});

// client login
CLIENT.login(TOKEN);
