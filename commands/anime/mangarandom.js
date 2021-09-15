const { MessageEmbed } = require('discord.js');
const { convert: toMarkdown } = require('html-to-markdown');
const { decode } = require('he');

const text = require('../../util/string');
const mangaDB = require('../../assets/json/manga.json');

module.exports = {
  name: 'mangarandom',
  aliases: [ 'mangarand' ],
  cooldown: {
    time: 15000,
    message: 'Vous allez trop vite. Veuillez ralentir pour éviter d\'être limité!'
  },
  group: '__**Anime**__',
  description: 'Generates a random manga recommendation. Recommends a Hentai if used on a nsfw channel.',
  clientPermissions: [ 'EMBED_LINKS' ],
  parameter: [],
  examples: [
    'mangarandom',
    'mangarand'
  ],
  run: async ( client, message ) => {

    message.channel.startTyping()

    const { ids: { al: id }} = message.channel.nsfw
    ? mangaDB.filter(a => a.isAdult)[Math.floor(Math.random() * mangaDB.filter(a => a.isAdult).length)]
    : mangaDB.filter(a => !a.isAdult)[Math.floor(Math.random() * mangaDB.filter(a => !a.isAdult).length)]

    const { errors , data } = await client.anischedule.fetch(`query ($id: Int) { Media(id: $id){ siteUrl id idMal isAdult format startDate { year month day } chapters volumes genres studios(isMain:true){ nodes{ name siteUrl } } coverImage{ large color } description title { romaji english native userPreferred } } }`, { id });

    const embed = new MessageEmbed().setColor('#3A871F')
    .setFooter(`Recommandation aléatoires | \©️${new Date().getFullYear()} HorizonGame`);

    // If errored due to ratelimit error
    if (errors && errors.some(x => x.status === 429)){
      return message.channel.send(
        embed.setAuthor('Oh non! HorizonGame a été limité', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setDescription([
          `**${message.member.displayName}**,veuillez réessayer dans une minute.\n\n`,
          `Si cette erreur se produit fréquemment, veuillez contacter **FloxYTB#9674**.`
        ].join(''))
      );
    };

    // If errored due to validation errors
    if (errors && errors.some(x => x.status === 400)){
      return message.channel.send(
        embed.setAuthor('Oops! Un bug sauvage 🐛 est apparu!', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setDescription([
          `**${message.member.displayName}**, cette erreur n'était pas censée se produire.\n\n`,
          `Veuillez contacter **Nettles#9674** pour une solution rapide.\n`,
        ].join(''))
      );
    };

    // If errored due to other reasons
    if (errors){
      return message.channel.send(
        embed.setAuthor('Oops! Une erreur inattendue s\'est produite!', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setDescription([
          `**${message.member.displayName}**, cette erreur n'était pas censée se produire.\n\n,`
          `Cela pourrait être un problème du côté d'Anilist. Veuillez réessayer dans une minute\n`,
          `Si cela ne résout pas dans quelques heures, vous pouvez contacter **FloxYTB#9674**`,
        ].join(''))
      );
    };

    return message.channel.send(
      embed.setColor('#3A871F')
      .setAuthor([
        text.truncate(data.Media.title.romaji || data.Media.title.english || data.Media.title.native),
        client.anischedule.info.mediaFormat[data.Media.format]
      ].join('\u2000|\u2000'), null, data.Media.siteUrl)
      .setDescription((data.Media.studios.nodes || []).map(x => `[${x.name}](${x.url})`).join('\u2000|\u2000'))
      .addFields([
        {
          name: 'Autres titres',
          value: [
            `•\u2000**Originaire de**:\u2000${data.Media.title.native || 'None'}.`,
            `•\u2000**Romanisé**: ${data.Media.title.romaji || 'None'}.`,
            `•\u2000**Anglais**: ${data.Media.title.english || 'None'}.`
          ].join('\n')
        },{
          name: 'Genres',
          value: text.joinArray(data.Media.genres) || '\u200b'
        },{
          name: 'A débuté',
          value: [
            client.anischedule.info.months[data.Media.startDate.month || 0],
            data.Media.startDate.day || '',
            data.Media.startDate.year || ''
          ].filter(Boolean).join(' ') || 'Unknown',
          inline: true
        },{
          name: 'Chapitres',
          value: data.Media.chapters || 'Unknown',
          inline: true
        },{
          name: 'Volumes',
          value: data.Media.volumes || 'Unknown',
          inline: true
        },{
          name: '\u200b',
          value: text.truncate(toMarkdown(decode((data.Media.description || '').replace(/<br>/g,''))), 1000, ` […Read More](https://myanimelist.net/anime/${data.Media.idMal})`) || '\u200b'
        }
      ]).setThumbnail(data.Media.coverImage.large)
    ).then(() => message.channel.stopTyping());
  }
};
