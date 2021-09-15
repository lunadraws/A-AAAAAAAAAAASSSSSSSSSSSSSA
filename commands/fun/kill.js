const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'kill',
  aliases: [],
  nsfw: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: '__**Amusant**__',
  description: 'Sends a roleplay gif `kill` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user who used this command wants to kill the mentioned user 」. Use to indicate that you are / wanted to kill the mentioned user (context may vary). This is a roleplay command and is meant to be used as a joke, however, this will be limited to a nsfw channel due to sensitive nature of this command. Context should not include real crimes.',
  examples: [ 'kill @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x));

    const url = client.images.kill();
    const embed = new MessageEmbed()
    .setColor('#3A871F')
    .setImage(url)
    .setFooter(`Kill | \©️${new Date().getFullYear()} HorizonGame`);

    if (!message.mentions.members.size){

      return message.channel.send(embed);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(
        embed.setDescription(`Stop ${message.member}! Tu ne peux pas me tuer!`)
      );

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed);

    } else {

      return message.channel.send(
        embed.setDescription(`${message.member} à juste tué ${args[0]}! Réanimation en t-moins n secondes.`)
      );

    };
  }
};
