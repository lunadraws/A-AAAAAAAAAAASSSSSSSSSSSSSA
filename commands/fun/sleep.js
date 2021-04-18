
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'sleep',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: '__**Amusant**__',
  description: 'Puts a user to sleep..',
  examples: [ 'hug @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.sleep();
    const embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setImage(url)
    .setFooter(`Sleep | \©️${new Date().getFullYear()} HorizonGame`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      return message.channel.send(embed.setDescription(`${message.author} s'endort!`));

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.author}, Je ne suis pas si endormi....`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.author} s'endort!`));

    } else {

      return message.channel.send(
        embed.setDescription(`${message.author} s'endort avec ${args[0]}!`)
      );

    };
  }
};
