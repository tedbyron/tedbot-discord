// imports
const fs = require('fs')
const discord = require('discord.js')
const { PREFIX, TOKEN, SERVERS, ACTIVITY_TYPE, ACTIVITY } = require('./config.json')
const RESPONSES = require('./helpers/responses')

const client = new discord.Client() // initialize client
client.commands = new discord.Collection() // initialize commands
const commands = {
  info: fs.readdirSync('./commands/info').filter(file => file.endsWith('.js')),
  misc: fs.readdirSync('./commands/misc').filter(file => file.endsWith('.js'))
}

// set commands
for (const dir in commands) {
  for (const file of commands[dir]) {
    const command = require(`./commands/${dir}/${file}`)
    client.commands.set(command.name, command)
  }
}

// on ready event listener
client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`)
  client.user.setActivity(ACTIVITY, { type: ACTIVITY_TYPE })

  // log client invite URI
  try {
    const link = await client.generateInvite(8)
    console.log(link)
  } catch (error) {
    console.error(error)
  }
})

// on message event listener
client.on('message', async message => {
  // return if the message should be ignored
  if (!message.content.startsWith(PREFIX) || // message does not begin with the prefix
  Object.values(SERVERS).indexOf(message.guild.id) < 0 || // guild is not in whitelist
  message.channel.type !== 'text' || // message is in a non-text channel
  message.author.bot || // message author is bot
  message.content[PREFIX.length] === undefined || // no characters after the prefix
  /\s/.test(message.content[PREFIX.length])) { // whitespace after the prefix
    return
  }

  // slice the command prefix, split the command and arguments on spaces
  const commandArgs = message.content.slice(PREFIX.length)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .split(' ')
  const commandName = commandArgs.shift()

  // return if requested command does not exist
  if (!client.commands.has(commandName)) return

  const command = client.commands.get(commandName)

  // return if arguments are required by the command
  if (command.args && !commandArgs.length) {
    return RESPONSES.warning(message, `\`${PREFIX + commandName}\` has required arguments`, ['usage', command.usage])
  }

  // execute the command
  try {
    command.execute(message, commandArgs)
  } catch (error) {
    console.error(error)
    return RESPONSES.error(message, `execution of \`${PREFIX + commandName}\` failed`)
  }
})

// client login
client.login(TOKEN)
