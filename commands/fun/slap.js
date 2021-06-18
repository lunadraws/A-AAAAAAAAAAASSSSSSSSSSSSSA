const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'slap',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: '__**Amusant**__',
  description: 'Sends a roleplay gif `slap` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user whom this command is directed to has been slapped 」. Use to indicate that you are / wanted to slap the mentioned user (context may vary).',
  examples: [ 'slap @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.slap();
    const embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setImage(url)
    .setFooter(`Slap | \©️${new Date().getFullYear()} HorizonGame`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      message.channel.send(`\\❌ **${message.author.tag}**, quelle est l'idée de gifler le néant? Au moins mentionner un utilisateur!`);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send([`Aie! Comment osez-vous me gifler!`,`Arrête ça!`,`Ça fait mal!`][Math.floor(Math.random() * 3)]);

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(`\\❌ J'accepterais volontiers! Mais je pense que tu as besoin d'un examen mental **${message.author.tag}**!`);

    } else {

      return message.channel.send(
        embed.setDescription(`${args[0]} a été giflé par ${message.author}! Ça a dû être douloureux~`)
      );

    };
  }
};
