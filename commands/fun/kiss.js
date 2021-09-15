const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'kiss',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: '__**Amusant**__',
  description: 'Sends a roleplay gif `kiss` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user whom this command is directed to has been kissed 」. Use to indicate that you are / wanted to kiss the mentioned user (context may vary). May be used in a similar context to the emoji 😘.',
  examples: [ 'kiss @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.kiss();
    const embed = new MessageEmbed()
    .setColor('#3A871F')
    .setImage(url)
    .setFooter(`Kiss | \©️${new Date().getFullYear()} HorizonGame`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      return message.channel.send(`\\❌ **${message.author.tag}**, vous êtes assez désespéré pour embrasser un utilisateur invisible?!`);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.author} E~ecchi!`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(`\\❌ **${message.author.tag}**, jamais entendu parler d'un miroir?`);

    } else {

      return message.channel.send(
        embed.setDescription(`${message.member} juste embrassé ${args[0]}!`)
      );

    };
  }
};
