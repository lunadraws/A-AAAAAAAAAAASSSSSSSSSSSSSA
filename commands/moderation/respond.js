const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'reponse',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: '__**modération**__',
  description: 'Respond to user suggestion',
  parameters: [ 'Message ID', 'accept/deny', 'reason' ],
  examples: [
    'respond 690105173087223812 deny Doesn\'t make much sense to do this'
  ],
  run: async (client, message, [id, action = '', ...reason]) => {

    const channelID = (client.guildProfiles
    .get(message.guild.id) || {})
    .featuredChannels.suggest;

    const embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setFooter(`Répondre à une suggestion | \©️${new Date().getFullYear()} HorizonGame`);

    if (!channelID){
      return message.channel.send(
        embed.setAuthor('le salon de suggestion n\'est pas défini!', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setDescription([
          `**${message.author.tag}**, le **salon de suggestion** pour ce serveur n'a pas été défini!`,
          'Si vous êtes un administrateur de serveur, vous pouvez définir le canal en tapant:\n',
          `\`${client.prefix}setsuggestch <channel ID | channel mention>\``
        ].join('\n'))
      );
    };

    const channel = message.guild.channels.cache.get(channelID);

    if (!channelID){
      return message.channel.send(
        embed.setAuthor('Salon suggérer non valide!', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setDescription([
          `**${message.author.tag}**, le **salon de suggestion** pour ce serveur a été invalidé.`,
          'Si vous êtes un administrateur de serveur, vous pouvez redéfinir le canal en tapant:\n',
          `\`${client.prefix}setsuggestch <channel ID | channel mention>\``
        ].join('\n'))
      );
    };

    if (!id){
      return message.channel.send(
        embed.setDescription('Vous devez fournir le **ID de message** de la suggestion')
        .setAuthor('ID de message introuvable!', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
      );
    };

    if (!['accept', 'deny'].includes(action.toLowerCase())){
      return message.channel.send(
        embed.setDescription('Veuillez préciser si vous souhaitez `accept` ou `deny` le suggestion')
        .setAuthor('Réponse indéfinie!', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
      );
    };

    if (!reason.length || reason.join(' ').length > 1024){
      return message.channel.send(
        embed.setDescription('Vous devez fournir une raison ne dépassant pas 1024 caractères')
        .setAuthor('Impossible d\'analyser la raison de la réponse!', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
      );
    };

    const suggestion = await channel.messages.fetch(id).catch(() => undefined);

    if (!suggestion ||
      suggestion.author.id !== client.user.id ||
      !suggestion.embeds.length ||
      !(suggestion.embeds[0].title || '').endsWith('Suggestion')
    ){
      return message.channel.send(
        embed.setAuthor('Suggestion introuvable', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setDescription(`Je n'arrive pas à trouver la suggestion avec l'ID de message **${id}** dans **${channel}**.`)
      );
    };

    if (suggestion.embeds[0].fields.length > 1){
      return message.channel.send(
        embed.setAuthor('quelqu\'un a déjà répondu au suggestion', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setDescription(`**${suggestion.embeds[0].fields[0].value.replace('Accepté par','')}** déjà répondu à cette suggestion!`)
      );
    };

    if (!suggestion.editable){
      return message.channel.send(
        embed.setAuthor('La suggestion ne peut pas être modifiée.', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setDescription('La suggestion a en quelque sorte été invalidée (cause inconnue)')
      );
    };

    suggestion.embeds[0].fields[0].value = action.toLowerCase() === 'accept'
    ? `Accepted by **${message.author.tag}**`
    : `Denied by **${message.author.tag}**`;

    return suggestion.edit(
      new MessageEmbed(suggestion.embeds[0])
      .setColor(action.toLowerCase() === 'accept' ? 'GREEN' : 'RED')
      .addField('Reason', reason.join(' '))
    ).then(()=> message.react('✅'))
    .catch(()=> embed.setAuthor('La suggestion ne peut pas être modifiée.', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
    .setDescription('La suggestion a en quelque sorte été invalidée (cause inconnue)'));
  }
};
