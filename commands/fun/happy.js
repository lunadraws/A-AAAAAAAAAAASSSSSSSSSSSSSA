const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'happy',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: '__**Amusant**__',
  description: 'Sends a roleplay gif `happy` to the chat. Usually interpreted as ã The user who used this command is happy (shiawase da!!) ã. Use to indicate that you are currently happy (context may vary). May be used in a similar context to the emoji đ.',
  examples: [ 'happy' ],
  parameters: [],
  run: async ( client, message ) => {

    return message.channel.send(
      new MessageEmbed()
      .setDescription(`${message.author} est heureux.`)
      .setColor('#3A871F')
      .setImage(client.images.happy())
      .setFooter(`Happy | \ÂŠī¸${new Date().getFullYear()} HorizonGame`)
    );
  }
};
