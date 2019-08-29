// imports
const FS = require('fs');
const DISCORD = require('discord.js');
const { PREFIX, TOKEN, SERVERS, ACTIVITY_TYPE, ACTIVITY } = require('./config.json');
const RESPONSES = require('./helpers/responses');

const CLIENT = new DISCORD.Client();        // initialize client
CLIENT.commands = new DISCORD.Collection(); // initialize commands
const COMMANDS = {
  info: FS.readdirSync('./commands/info').filter(file => file.endsWith('.js')),
  misc: FS.readdirSync('./commands/misc').filter(file => file.endsWith('.js')),
};

// set commands
for (const DIRECTORY in COMMANDS) {
  for (const FILE of COMMANDS[DIRECTORY]) {
    const COMMAND = require(`./commands/${DIRECTORY}/${FILE}`);
    CLIENT.commands.set(COMMAND.name, COMMAND);
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
    console.error(error);
  }
});

// on message event listener
CLIENT.on('message', async message => {
  // return if the message should be ignored
  if (!message.content.startsWith(PREFIX)                 // message does not begin with the prefix
  || Object.values(SERVERS).indexOf(message.guild.id) < 0 // guild is not in whitelist
  || message.channel.type !== 'text'                      // message is in a non-text channel
  || message.author.bot                                   // message author is bot
  || message.content[PREFIX.length] === undefined         // no characters after the prefix
  || /\s/.test(message.content[PREFIX.length])) {         // whitespace after the prefix
    return;
  }

  // slice the command prefix, split the command and arguments on spaces
  const COMMAND_ARGS = message.content.slice(PREFIX.length)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .split(' ');
  const COMMAND_NAME = COMMAND_ARGS.shift();

  // return if requested command does not exist
  if (!CLIENT.commands.has(COMMAND_NAME)) return;

  const COMMAND = CLIENT.commands.get(COMMAND_NAME);

  // return if arguments are required by the command
  if (COMMAND.args && !COMMAND_ARGS.length) {
    return RESPONSES.warning(message, `\`${PREFIX + COMMAND_NAME}\` has required arguments`, ['usage', COMMAND.usage]);
  }

  // execute the command
  try {
    COMMAND.execute(message, COMMAND_ARGS);
  } catch(error) {
    console.error(error);
    return RESPONSES.error(message, `execution of \`${PREFIX + COMMAND_NAME}\` failed`);
  }
});

// client login
CLIENT.login(TOKEN);
