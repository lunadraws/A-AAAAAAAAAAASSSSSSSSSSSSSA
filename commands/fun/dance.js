const { MessageEmbed } = require('discord.js');
module.exports = {
  name: 'dance',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: '__**Amusant**__',
  description: 'Sends a roleplay gif `dance` to the chat. Usually interpreted as 「 The user who used this commnd is dancing (in joy) 」. Use to indicate that you are currently dancing (context may vary).',
  examples: [ 'dance' ],
  parameters: [],
  run: async ( client, message ) => {
    return message.channel.send(
      new MessageEmbed()
      .setColor('#3A871F')
      .setDescription(`${message.author} a commencé à danser!`)
      .setImage(client.images.dance())
      .setFooter(`dance | \©️${new Date().getFullYear()} HorizonGame`)
    );
  }
}
