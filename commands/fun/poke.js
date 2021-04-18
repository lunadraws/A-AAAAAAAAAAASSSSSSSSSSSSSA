const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'poke',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: '__**Amusant**__',
  description: 'Sends a roleplay gif `poke` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The mentioned user ignores you, so you poke them 」. Use to indicate that you are in need of attention from the mentioned user (context may vary).',
  examples: [ 'poke @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.poke();
    const embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setImage(url)
    .setFooter(`Poke | \©️${new Date().getFullYear()} Mai`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      return message.channel.send(`\\❌ **${message.author.tag}**, qui suis-je censé piquer?`);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(
        embed.setDescription('Je suis déjà là! Besoin de quelque chose?')
      );

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(`\\❌ Non **${message.author.tag}**!`);

    } else {

      return message.channel.send(
        embed.setDescription(`${message.member} fourré ${args[0]}`)
      );

    };
  }
};
