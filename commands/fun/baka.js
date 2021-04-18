const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'baka',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: '__**Amusant**__',
  description: 'Sends a roleplay gif `baka` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user whom this command is directed to is an idiot (in a kawaii-context) 」.',
  examples: [ 'baka @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.baka();
    const embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setImage(url)
    .setFooter(`baka | \©️${new Date().getFullYear()} HorizonGame`);

    if (message.guild && !message.mentions.members.size){

      return message.channel.send(embed);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.react('💢');

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(`\\❌ Non **${message.author.tag}**, tu n'es pas Baka!`);

    } else {

      return message.channel.send(
        embed.setDescription(`${args[0]} B~baka!`)
      );

    };
  }
};
