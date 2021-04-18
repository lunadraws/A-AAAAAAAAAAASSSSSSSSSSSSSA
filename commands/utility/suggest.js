const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'suggest',
  aliases: [],
  guildOnly: true,
  group: '**__utile__**',
  description: 'Suggest something for the server. If you have suggestion for the bot instead please use the feedback command or join our support server',
  clientPermissions: [ 'EMBED_LINKS', 'ADD_REACTIONS' ],
  parameters: [ 'Suggestion Message' ],
  examples: [
    'suggest please remove some of the inactive members...'
  ],
  run: async (client, message, args) => {

    const embed = new MessageEmbed()
    .setFooter(`Suggestion | \©️${new Date().getFullYear()} HorizonGame`)
    .setColor(message.guild.me.displayHexColor);

    if (!args.length){
      return message.channel.send(
        embed.setAuthor('Pas de message', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setDescription(`**${message.member.displayName}**, Veuillez inclure votre **message de suggestion**!`)
        .addField('Exemple', '```m!suggest merci de kick les inactif xD...```')
      );
    };

    const id = client.guildProfiles.get(message.guild.id).suggestChannel;
    const channel = message.guild.channels.cache.get(id);

    if (!channel){
      return message.channel.send(
        embed.setAuthor('Salon introuvable!', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setDescription([
          `**${message.member.displayName}**, Impossible de trouver le **Salon de suggestion** pour ce serveur!\n`,
          `Si vous êtes un administrateur de serveur, vous pouvez définir le canal en tapant:`,
          `\`${client.config.prefix}setsuggestch <channel ID | channel mention>\``
        ].join('\n'))
      )
    };

    if (!channel.permissionsFor(message.guild.me).has('VIEW_CHANNEL','SEND_MESSAGES','EMBED_LINKS')){
      return message.channel.send(
        embed.setAuthor('Permissions manquantes', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setDescription([
          `**${message.member.displayName}**,Le salon ${channel} ne me permet pas d'y poster votre suggestion!`,
          `J'ai besoin des autorisations suivantes: \`Afficher le salon\`, \`Envoyer des messages\` et \`Intégrer des liens\`\n\n`
          `Si vous êtes un administrateur / modérateur de serveur, veuillez modifier mes autorisations d'écrasement sur le salon susmentionné.`
        ].join(''))
      );
    };

    return channel.send(
      embed.setTitle(`${message.member.displayName}'s Suggestion`)
      .setColor(message.guild.me.displayHexColor)
      .setDescription(args.join(' '))
      .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true}))
      .addField('Status', 'le staff examine votre suggestion', true)
    ).then(() => message.react('✅'));
  }
};
