const { MessageEmbed, GuildEmoji } = require('discord.js');
const { convert: toMarkdown } = require('html-to-markdown');
const { decode } = require('he');

const Paginate = require('../../struct/Paginate');
const Profile = require('../../struct/DiscoveryProfile');
const text = require('../../util/string');

module.exports = {
  name: 'discover',
  aliases: [],
  guildOnly: true,
  group: '__**Anime**__',
  description: 'Generate a set of handpicked <Anime/Manga> recommendations for a user.',
  clientPermissions: [ 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS' ],
  parameter: [ 'Manga', 'Anime' ],
  examples: [
    'discover anime',
    'discover manga'
  ],
  run: async ( client, message, [category = '']) => {

    category = category.toLowerCase();

    const embed = new MessageEmbed()
    .setDescription(`**${message.member.displayName}**, Veuillez préciser s'il s'agit de \`ANIME\` ou \`MANGA\`.`)
    .setAuthor('Catégorie non reconnue!','https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
    .setThumbnail('https://cdn.discordapp.com/avatars/688407554904162365/b91454b73477486d08be0830e383dc12.png?size=2048')
    .setColor(message.guild.me.displayHexColor)
    .setFooter(`discover | \©️${new Date().getFullYear()} HorizonGame`);

    if (!category || !['anime','manga'].includes(category)){
      return message.channel.send(embed);
    };

    if (!client.collections.exists('discovery', message.author.id)){
      client.collections.setTo('discovery', message.author.id, new Profile(message.member));
    };

    const profile = client.collections.getFrom('discovery', message.author.id);
    let res;

    if (!profile.hasData){
      res = await profile.generateList().fetch();
    };

    if (profile.isExpired){
      res = await profile.clearList().generateList().fetch();
    };

    if (res && res.errors.length){
      return message.channel.send(
        embed.setAuthor('Oops! Une erreur inattendue s\'est produite!', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setThumbnail(null)
        .setDescription([
          `**${message.member.displayName}**, cette erreur n'était pas censée se produire.\n\n`,
          'Cela pourrait être un problème du côté d\'Anilist. Veuillez réessayer dans une minute\n',
          'Si cela ne résout pas dans quelques heures, vous pouvez contacter **FloxYTB#9674**.',
        ].join(' '))
      );
    };

    let index = 0;
    const data = profile.get(category);
    const topic = category.charAt(0).toUpperCase() + category.slice(1);

    const discoveryPages = new Paginate(
      new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setTitle(`Obtenez aléatoirement ${topic} Recommandations avec votre file d'attente de découverte!`)
      .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .setDescription([
        `Votre ${topic} La file d'attente de découverte des recommandations est unique et générée de manière totalement aléatoire.`,
        `5 genres aléatoires sur 17 genres au total sont sélectionnés et aléatoirements ${topic} choisis.`,
        `de ces genres pour vous. Vous obtenez un différent ${topic} recommandations tous les jours, alors ne le faites pas`,
        '.'
      ].join(' '))
      .setFooter(`Discover ${topic}\u2000|\u2000\©️${new Date().getFullYear()} HorizonGame`)
      .addFields([
        {
          name: '\u200b',
          value: profile[category].genres.map(g => `\\🟢 ${g}`).join('\n')
        },
        {
          name: ![true][profile[category].viewcount - 1] ? `Heures consultées aujourd'hui:\u2000**${profile[category].viewcount}**` : '\u200b',
          value: '\u200b'
        },
        {
          name: '\u200b',
          value: 'Démarrez votre file d\'attente en cliquant sur <:7_:733674973553492020> ci-dessous !!'
        }
      ])
    );

    for (const info of data){
      discoveryPages.add(
        new MessageEmbed()
        .setColor(info.coverImage.color || 'GREY')
        .setAuthor([
          profile[category].genres[index],
          text.truncate(info.title.romaji || info.title.english || info.title.native),
          client.anischedule.info.mediaFormat[info.format]
        ].join('\u2000|\u2000'))
        .setDescription((info.studios.nodes || []).slice(0,1).map( x => `[${x.name}](${x.siteUrl})`).join(''))
        .setThumbnail(info.coverImage.large)
        .setFooter(`Discover ${topic}\u2000|\u2000\©️${new Date().getFullYear()} HorizonGame`)
        .addFields([
          {
            name: 'Autres titres',
            value: [
              `•\u2000\**Originaire de:**\u2000${info.title.native || 'None'}.`,
              `•\u2000\**Romanisé:**\u2000${info.title.romaji || 'None'}`,
              `•\u2000\**Anglais:**\u2000${info.title.english || 'None'}`
            ]
          },
          {
            name: 'Genres',
            value: text.joinArray(info.genres) || 'MISSING_INFO'
          },
          {
            name: 'A débuté',
            value: [
              client.anischedule.info.months[info.startDate.month - 1],
              info.startDate.day,
              info.startDate.year
            ].filter(Boolean).join(' ') || 'Unknown',
            inline: true
          },
          {
            name: category === 'anime' ? 'Épisodes' : 'Chapitres',
            value: info.episodes || info.chapters || 'Unknown',
            inline: true
          },
          {
            name: category === 'anime' ? 'Durée (en minutes)' : 'Volumes',
            value: info.duration || info.volumes || 'Unknown',
            inline: true
          },
          {
            name: '\u200b',
            value: text.truncate(toMarkdown(decode(info.description || '').replace(/<br>/g,'\n')), 1000, `[…Read More](https://myanimelist.net/anime/${info.idMal})`) || '\u200b'
          }
        ])
      );
      index++;
    };

    const discoveryPrompt = await message.channel.send(discoveryPages.currentPage);
    const next = client.emojis.cache.get('733674973553492020') || '▶';
    const filter = (_, user) => user.id === message.author.id;
    const collector = discoveryPrompt.createReactionCollector(filter);

    await discoveryPrompt.react(next);
    let timeout = setTimeout(() => collector.stop(), 90000);

    collector.on('collect', async (reaction) => {
      if (next === reaction.emoji.name){
        await discoveryPrompt.edit(discoveryPages.next());
      } else if (next instanceof GuildEmoji){
        if (reaction.emoji.name === next.name){
          await discoveryPrompt.edit(discoveryPages.next());
        } else {
          // Do nothing
        };
      };

      if (discoveryPages.currentIndex === discoveryPages.size - 1){
        return collector.stop();
      };

      await reaction.users.remove(message.author.id);
      return timeout.refresh();
    });

    collector.on('end', () => discoveryPrompt.reactions.removeAll());

    return;
  }
};
