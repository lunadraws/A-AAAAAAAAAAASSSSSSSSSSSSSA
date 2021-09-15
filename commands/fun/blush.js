const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'blush',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: '__**Amusant**__',
  description: 'Blushes at a user.',
  examples: [ 'blush @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.blush();
    const embed = new MessageEmbed()
    .setColor('#3A871F')
    .setImage(url)
    .setFooter(`Blush | \©️${new Date().getFullYear()} HorizonGame`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      return message.channel.send(embed.setDescription(`${message.author} Blushes`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.author} Blushes`));

    } else {

      return message.channel.send(
        embed.setDescription(`${message.author} rougit à ${args[0]}!`)
      );

    };
  }
};
