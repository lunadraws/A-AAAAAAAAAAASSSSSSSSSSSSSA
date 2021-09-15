const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'cry',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: '__**Amusant**__',
  description: 'Sends a roleplay gif `cry` to the chat. Usually interpreted as 「 The user who used this commnd is crying 」. Use to indicate that you are currently crying. May be used in a similar context to the emoji 😢.',
  examples: [ 'cry' ],
  parameters: [],
  run: async ( client, message ) => {

    return message.channel.send(
      new MessageEmbed()
      .setColor('#3A871F')
      .setDescription(`${message.author} a commencé à pleurer!`)
      .setImage(client.images.cry())
      .setFooter(`Cry | \©️${new Date().getFullYear()} HorizonGame`)
    );
  }
};
