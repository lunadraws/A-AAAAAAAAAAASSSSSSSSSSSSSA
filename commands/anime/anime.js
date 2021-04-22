const moment = require('moment');
const { getInfoFromName } = require('mal-scraper');
const { MessageEmbed } = require('discord.js');

const malProducers = require('../../assets/json/MAL_Producers.json');
const { malGenres } = require('../../util/constants');
const text = require('../../util/string');

module.exports = {
  name: 'anime',
  aliases: [ 'ani', 'as', 'anisearch'],
  cooldown: {
    time: 10000,
    message: 'You are going too fast. Please slow down to avoid getting rate-limited!'
  },
  clientPermissions: [ 'EMBED_LINKS' ],
  group: '__**Anime**__',
  description: 'Searches for a specific anime in <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net "Homepage"), or shows horizonGame\'s anime series information if no query is provided.',
  parameters: [ 'Search Query' ],
  examples: [
    'anime',
    'as fire force',
    'ani dr stone',
    'anisearch sao'
  ],
  run: async ( client, message, args ) => {

    const query = args.join(' ') || 'sao';

    // Indicate that the bot is doing something in the background
    message.channel.startTyping();

    const data = await new Promise((resolve,reject) => {
      setTimeout(() => reject('TIMEOUT'), 10000);

      return getInfoFromName(query)
      .then(res => resolve(res))
      .catch(err => reject(err));
    }).catch((err)=> err !== 'TIMEOUT' ? null : err)

    if (!data){
      return message.channel.send([
        `\\<a:a_ERROR:828230829687046155> **${message.author.tag}**, Aucun résultat n'a été trouvé pour **${query}**`,
        'Si vous pensez que cet anime existe, essayez les méthodes suivantes:',
        '\u2000•\u2000Essayez les noms alternatifs (par exemple anglais, natif, romanisé)',
        '\u2000•\u2000Incluez le numéro de saison (le cas échéant)',
        '\u2000•\u2000Incluez le type (par exemple OVA, ONA, TV Shorts).'
      ]
    } else if (data === 'TIMEOUT'){
      return message.channel.send([
        `\\<a:a_ERROR:828230829687046155> **${message.author.tag}**, MyAnimeList a mis plus de temps à répondre.`,
        'Veuillez réessayer plus tard, cela peut être dû à un temps d\'arrêt du serveur.'
      ].join('\n')).then(() => message.channel.stopTyping());
    };

    message.channel.stopTyping();

    const isHentai = data.genres.some(x => x === 'Hentai');
    const nsfwch = message.guild.channels.cache.filter(x => x.nsfw).map(x => x.toString());

    if (isHentai && message.channel.nsfw === false){
      return message.channel.send(`\\<a:a_ERROR:828230829687046155> | **${message.author.tag}**, vous avez recherché \`Hentai\` sur une chaîne sfw!\n\nVotre requête, **${
        query
      }**, a renvoyé un titre hentai de **${data.studios?.[0]}**. Veuillez essayer d'interroger les entrées hentai sur les chaînes nsfw${
        nsfwch.length ? ` tel que ${text.joinArray(nsfwch)}` : ''
      }. Pendant que vous y êtes, vous pouvez interroger ces genres à partir de ** hanime ** en utilisant \`hanime\` .`)
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setURL(data.url)
      .setThumbnail(data.picture || null)
      .setFooter(`Requête d'anime avec MAL | \©️${new Date().getFullYear()} HorizonGame`)
      .setTitle(text.truncate(data.englishTitle || data.title, 200))
      .setDescription([
        [
          `[\\⭐](https://myanimelist.net/anime/${data.id}/stats 'Score'): ${data.score}`,
          `[\\🏅](https://myanimelist.net/info.php?go=topanime 'Rang'): ${isNaN(data.ranked.slice(1)) ? 'N/A' : text.ordinalize((data.ranked).slice(1))}`,
          `[\\✨](https://myanimelist.net/info.php?go=topanime 'Popularité'): ${data.popularity || '~'}`,
          `[\` ▶ \`](${data.trailer} 'Regarde la bande-annonce')`
        ].join('\u2000\u2000•\u2000\u2000'),
        `\n${text.joinArray(data.genres.map(g =>
          `[${g}](https://myanimelist.net/anime/genre/${malGenres[g.toLowerCase()]})`
        )||[])}`,
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      ].filter(Boolean).join('\n'))
      .addFields([
        {
          name: 'Source', inline: true,
          value: data.source ? [data.source].map(x => {
            const valid_sources = {
              'Light novel':'lightnovels',
              'Manga':'manga',
              'Web manga':'manhwa',
              'One-shot':'oneshots',
              'Doujinshi':'doujin',
              'Novel':'novels',
              'Manhwa':'manhwa',
              'Manhua':'manhua'
            };
            return x ? `[**${x}**](https://myanimelist.net/topmanga.php?type=${valid_sources[x] || 'manga'})` : x;
          }) : 'Unknown'
        },{
          name: 'Épisodes', inline: true,
          value: `[**${data.episodes}**](https://myanimelist.net/anime/${data.id}/_/episode)` || 'Unknown'
        },{
          name: 'Durée', inline: true,
          value: data.duration || 'Unknown'
        },{
          name: 'Type', inline: true,
          value: data.type ? `[**${data.type}**](https://myanimelist.net/topanime.php?type=${encodeURI(data.type.toLowerCase())})` : 'showType Unavailable'
        },{
          name: 'Première', inline: true,
          value: data.premiered ? `[**${data.premiered}**](https://myanimelist.net/anime/season/${data.premiered.split(' ')[1]}/${data.premiered.split(' ')[0]?.toLowerCase()})` : 'Unknown'
        },{
          name: 'Studio', inline: true,
          value: `[**${data.studios?.[0]}**](https://myanimelist.net/anime/producer/${malProducers[data.studios?.[0]]}/)` || 'Unknown'
        },{
          name: '━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          value: text.truncate(data.synopsis||'No Synopsis', 500, `...\n\n[**\`📖 Read Full Synopsis\`**](${data.url} 'Read More on MyAnimeList')`) || 'No Synopsis Available.'
        },{
          name: '━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          value: [
            `**${data.status === 'Finished Airing' ? 'Aired' : 'Currently Airing' ? 'Currently Airing' : 'Airs on'} (*${moment(data.aired.split('to')[0], 'll').fromNow()}*):** ${data.aired || 'Unknown'}`,
            '',
            `**Les producteurs**: ${text.truncate(text.joinArray(data.producers?.map(x => x === 'None found, add some' ? x : `[${x}](https://myanimelist.net/anime/producer/${malProducers[x]}/)`)||[]) || 'Unknown' ,900, '...')}`,
            '',
            `**Notation**: *${data.rating.replace('None', '') || 'Unrated'}*`,
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          ].join('\n')
        }
      ])
    );
  }
};
