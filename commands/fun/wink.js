const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'wink',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: '__**Amusant**__',
  description: 'Wink at a user.',
  examples: [ 'wink @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.wink();
    const embed = new MessageEmbed()
    .setColor('#3A871F')
    .setImage(url)
    .setFooter(`Wink | \©️${new Date().getFullYear()} HorizonGame`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      return message.channel.send(embed.setDescription(`${message.author} winks!`));

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(embed.setImage(client.images.blush()).setDescription(`${message.author} baka`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.author} wink!`));

    } else {

      return message.channel.send(
        embed.setDescription(`${message.author} winks à ${args[0]}!`)
      );

    };
  }
};
