const { RichEmbed } = require('discord.js');
const { PREFIX } = require('../../config');
const { COLOR_DEFAULT, COLOR_WARNING } = require('../../helpers/colors');

function roll(input) {
  const rolls = [];
  let times = 1, sides = 6;

  // reassign times and sides if an input is specified
  if (input) {
    // check that every character is an integer
    if (input.split('').every(ele => !isNaN(parseInt(ele)))) {
      times = parseInt(input);
    } else {
      [times, sides] = input.split('d').map(cur => parseInt(cur));
    }
  }

  // return if times is NaN or less than one
  if (!times || times < 1 || !sides) return;

  // calculate rolls and the sum of the rolls
  for (let i = 0; i < times; i++) {
    rolls.push(Math.floor(Math.random() * sides + 1));
  }
  const sum = rolls.reduce((acc, cur) => acc + cur);

  return {
    sum: sum,
    rolls: rolls,
  };
}

module.exports = {
  name: 'roll',
  usage: `${PREFIX}roll [N|'NdM']`,
  description: 'rolls a six-sided once unless an option is specified, in which case it rolls a six-sided die N times or an M-sided die N times',
  args: false,
  execute(message, args) {
    const embed = new RichEmbed()
      .setColor(COLOR_DEFAULT)
      .setTitle(`🎲 ${this.name}(${args[0] ? args[0].includes('d') ? args[0] : args[0] + 'd6' : '1d6' })`);
    let res = roll(args[0]);

    if (!res) {
      return message.channel.send(
        new RichEmbed()
          .setColor(COLOR_WARNING)
          .setTitle('warning')
          .setDescription(`invalid usage of \`${PREFIX + this.name}\``)
          .addField('usage', `\`${this.usage}\``)
      );
    }

    if (res.rolls.length > 1) {
      embed.addField('sum', res.sum.toString());
      embed.addField('rolls', res.rolls.join(' '));
    } else {
      embed.setDescription(res.rolls[0].toString());
    }

    // send response
    message.channel.send(embed);
  },
}
