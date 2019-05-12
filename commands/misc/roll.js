const { RichEmbed } = require('discord.js');
const { PREFIX } = require('../../config');
const COLORS = require('../../helpers/colors');
const RESPONSES = require('../../helpers/responses');

/**
 * @param   {number} times number of times to roll the die
 * @param   {number} sides number of sides on the die
 * @returns {object}       object with an array of rolls and their sum
 */
function roll(times, sides) {
  const rolls = [];

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
  usage: `\`${PREFIX}roll [T|TdS]\`
  T > 0: number of times to roll the die
  S > 1: number of sides on the die`,
  description: 'roll a six-sided die once, or if arguments are provided, roll a six-sided die T times or an S-sided die T times',
  args: false,
  execute(message, args) {
    // return if too many arguments
    if (args.length > 1) {
      return RESPONSES.warning(message, `too many arguments for \`${PREFIX + this.name}\``, ['usage', this.usage]);
    }

    const embed = new RichEmbed()
      .setColor(COLORS.default)
      .setTitle(`🎲 ${this.name}(${args[0] ? args[0].includes('d') ? args[0] : args[0] + 'd6' : '1d6' })`);
    let times = 1, sides = 6; // default for a roll with no arguments

    // validate arguments if they exist
    if (args[0]) {
      if (args[0].split('').every(ele => !isNaN(parseInt(ele)))) {
        times = parseInt(args[0]);
      } else {
        [times, sides] = args[0].split('d').map(cur => parseInt(cur));
      }
    }

    // return if arguments are invalid
    if (!times || !sides || times < 1 || sides < 2) {
      return RESPONSES.warning(message, `invalid argument for \`${PREFIX + this.name}\``, ['usage', this.usage]);
    }

    // roll the die
    const result = roll(times, sides);
    if (result.rolls.length > 1) {
      embed.addField('sum', result.sum.toString());
      embed.addField('rolls', result.rolls.join(' '));
    } else {
      embed.setDescription(result.rolls[0].toString());
    }

    // send response
    message.channel.send(embed);
  },
};
