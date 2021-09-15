const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'holdhands',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: '__**Amusant**__',
  description: 'Hold hands of someone special.',
  examples: [ 'holdhands @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.holdhands();
    const embed = new MessageEmbed()
    .setColor('#3A871F')
    .setImage(url)
    .setFooter(`holdhands | \©️${new Date().getFullYear()} HorizonGame`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      return message.channel.send(`\\❌ **${message.author.tag}**, à qui tiens-tu les mains?!`);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

     return message.channel.send(embed.setImage(client.images.slap()).setDescription(`${message.author} baka!`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(`\\❌ **${message.author.tag}**, srsly, dont les mains tenez-vous même?`);

    } else {

      return message.channel.send(
        embed.setDescription(`${message.author} tient la main de ${args[0]}!`)
      );

    };
  }
};
