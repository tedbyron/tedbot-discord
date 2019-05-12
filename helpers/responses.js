const { RichEmbed } = require('discord.js');
const COLORS = require('./colors');

const embedTitles = {
  info:    'ℹ info',
  warning: '⚠ warning',
  error:   '⛔ error',
};

/**
 * @param {string}      type        type of response to send
 * @param {Message}     message     discord.js message to respond to
 * @param {string}      description description of the event
 * @param {...string[]} fields      fields to add to the embed
 */
function sendResponse(type, message, description, ...fields) {
  const embed = new RichEmbed()
    .setColor(COLORS[type])
    .setTitle(embedTitles[type])
    .setDescription(description);

  if (fields) {
    fields.forEach(cur => {
      embed.addField(cur[0], cur[1], cur[2]);
    });
  }

  message.channel.send(embed);
}

module.exports.info = (message, description, ...fields) => {
  sendResponse('info', message, description, ...fields);
}

module.exports.warning = (message, description, ...fields) => {
  sendResponse('warning', message, description, ...fields);
}

module.exports.error = (message, description, ...fields) => {
  sendResponse('error', message, description, ...fields);
}
