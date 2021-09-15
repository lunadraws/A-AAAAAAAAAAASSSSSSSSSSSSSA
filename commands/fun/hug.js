const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'hug',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: '__**Amusant**__',
  description: 'Sends a roleplay gif `hug` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user whom this command is directed to has been hugged 」. Use to indicate that you are / wanted to hug the mentioned user (context may vary). May be used in a similar context to the emoji 🤗.',
  examples: [ 'hug @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.hug();
    const embed = new MessageEmbed()
    .setColor('#3A871F')
    .setImage(url)
    .setFooter(`Hug | \©️${new Date().getFullYear()} HorizonGame`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      return message.channel.send(embed.setDescription(`${message.author} H ~ ici! Je pensais que tu avais besoin d'un câlin!`));

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.author} H ~ tu es attentionné! Merci!`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.author} H ~ ici! Je pensais que tu avais besoin d'un câlin!`));

    } else {

      return message.channel.send(
        embed.setDescription(`${args[0]} était étreint par${message.author}!`)
      );

    };
  }
};
