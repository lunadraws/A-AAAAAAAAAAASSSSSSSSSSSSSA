const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'emoji',
  aliases: [],
  group: '**__utile__**',
  desciption: 'Display the larger version of the supplied emoji',
  parameters: [ 'emoji' ],
  examples: [
    'emoji :exampleonly:'
  ],
  get examples(){ return [ this.name + ' <emoji>'];},
  run: (cient, message, [emoji = '']) => {

    if (!emoji.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)){
      return message.channel.send(`\\❌ | ${message.author}, veuillez saisir un emoji personnalisé valide!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setImage('https://cdn.discordapp.com/emojis/' + emoji.match(/\d{17,19}/)[0])
      .setFooter(`Emoji: ${emoji.match(/\w{2,32}/)[0]} | \©️${new Date().getFullYear()} HorizonGame`)
    );
  }
};
