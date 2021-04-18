const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'smile',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: '__**Amusant**__',
  description: 'Smiles at a user.',
  examples: [ 'smile @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.smile();
    const embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setImage(url)
    .setFooter(`Smile | \©️${new Date().getFullYear()} HorizonGame`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      return message.channel.send(embed.setDescription(`${message.author} sourit!`));

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.author} sourit en retour`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.author} sourit`));

    } else {

      return message.channel.send(
        embed.setDescription(`${message.author} sourit à ${args[0]}!`)
      );

    };
  }
};
