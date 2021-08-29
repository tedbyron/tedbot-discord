const { RichEmbed } = require('discord.js')
const COLORS = require('./colors')

const EMBED_TITLES = {
  info: 'ℹ️ info',
  warning: '⚠️ warning',
  error: '⛔ error'
}

/**
 * @param {string}      type        type of response to send
 * @param {Message}     message     discord.js message to respond to
 * @param {string}      description description of the event
 * @param {...string[]} fields      fields to add to the embed
 */
function sendResponse (type, message, description, ...fields) {
  const EMBED = new RichEmbed()
    .setColor(COLORS[type])
    .setTitle(EMBED_TITLES[type])
    .setDescription(description)

  if (fields) {
    fields.forEach(cur => {
      EMBED.addField(cur[0], cur[1], cur[2])
    })
  }

  message.channel.send(EMBED)
}

module.exports.info = (message, description, ...fields) => {
  sendResponse('info', message, description, ...fields)
}

module.exports.warning = (message, description, ...fields) => {
  sendResponse('warning', message, description, ...fields)
}

module.exports.error = (message, description, ...fields) => {
  sendResponse('error', message, description, ...fields)
}
