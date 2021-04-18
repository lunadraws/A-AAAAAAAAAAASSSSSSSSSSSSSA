const { MessageEmbed, GuildEmoji } = require('discord.js');
const moment = require('moment');
const fetch = require('node-fetch');

const Pages = require('../../struct/Paginate');
const text = require('../../util/string');

module.exports = {
  name: "manga",
  aliases: [ 'comic', 'manhwa', 'manhua' ],
  guildOnly: true,
  cooldown: {
    time: 10000,
    message: 'Oops! Vous allez trop vite! Veuillez ralentir pour éviter d\'être limité!'
  },
  clientPermissions: [ 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS'],
  group: '__**Anime**__',
  description: 'Searches for a Manga / Manhwa / Manhua in <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net.co "Homepage"), or shows Seishun Buta Yarou if no query is provided.',
  parameters: [ 'Search Query' ],
  examples: [
    'manga king\'s avatar',
    'comic king\'s avatar',
    'manhwa king\'s avatar',
    'manhua king\'s avatar'
  ],
  run: async (client, message, args) => {

    const query = args.join(' ') || 'sword art online';

    const embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setDescription(`Recherche de manga intitulé **${query}** sur [MyAnimeList](https://myanimelist.net 'Homepage').`)
    .setThumbnail('https://cdn.discordapp.com/avatars/688407554904162365/b91454b73477486d08be0830e383dc12.png?size=2048')
    .setFooter(`Requête manga avec MAL | \©️${new Date().getFullYear()} HorizonGame`);

    let msg = await message.channel.send(embed);

    const data = await fetch(`https://api.jikan.moe/v3/search/manga?q=${encodeURI(query)}&page=1`).then( res => res.json())

    embed.setColor(message.guild.me.displayHexColor).setAuthor(
        !data.error && !data.results.length
        ? 'None Found'
        : 'Response Error'
        ,'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096'
      ).setDescription(
        !data.error && !data.results.length
        ? [
          `**${message.member.displayName}**, Aucun résultat n'a été trouvé pour **${query}**!\n`,
          `Si vous pensez que ce manga existe, essayez les méthodes suivantes:`,
          `• Essayez les noms alternatifs (par exemple anglais, natif, romaji).`,
          `• Inclure le numéro de volume (s'il existe).`
        ].join('\n')
        : `[MyAnimeList](https://myanimelist.net 'Homepage') a répondu avec un code d'erreur ${data.status}.`
      );

    if (!data || data.error || !data.results.length){
      return await msg.edit(embed).catch(()=> null) || message.channel.send(embed);
    };

    const elapsed = Date.now() - message.createdAt;
    const pages = new Pages();

    for (const res of data.results.slice(0,10)) {
      pages.add(
        new MessageEmbed()
        .setAuthor(res.title, res.image_url, res.url)
        .setColor(message.guild.me.displayHexColor)
        .setThumbnail(res.image_url)
        .setFooter([
          `Durée de la recherchen: ${Math.abs(elapsed / 1000).toFixed(2)} secondes`,
          `Page ${pages.size + 1} sur ${data.results.slice(0,10).length}`,
          `Requête manga avec MAL | \©️${new Date().getFullYear()} HorizonGame`
        ].join('\u2000\u2000•\u2000\u2000'))
        .addFields([
          { name: 'Type', value: res.type, inline: true },
          { name: 'Statut', value: res.publishing ? 'Publishing' : 'Finished', inline: true},
          { name: 'Chapitres', value: res.chapters, inline: true },
          { name: 'Membres', value: text.commatize(res.members), inline: true },
          { name: 'Score', value: res.score, inline: true },
          { name: 'Volumes', value: res.volumes, inline: true },
          { name: 'Date de début', value: moment(res.start_date).format('dddd, Do MMMM YYYY'), inline: true },
          { name: 'Date de fin', value: res.end_date ? moment(res.end_date).format('dddd, Do MMMM YYYY') : 'Unknown', inline: true },
          { name: '\u200b', value: res.synopsis || '\u200b', inline: false }
        ])
      );
    }

    msg = await msg.edit(pages.firstPage).catch(()=>null) || await message.channel.send(pages.firstPage);

    if (pages.size === 1){
      return;
    };

    const prev = client.emojis.cache.get('768824643166535711') || '◀';
    const next = client.emojis.cache.get('768824781784481803') || '▶';
    const terminate = client.emojis.cache.get('769218376542847008') || '❌';

    const filter = (_, user) => user.id === message.author.id;
    const collector = msg.createReactionCollector(filter);
    const navigators = [ prev, next, terminate ];
    let timeout = setTimeout(()=> collector.stop(), 90000);

    for (let i = 0; i < navigators.length; i++) {
      await msg.react(navigators[i]);
    };

    collector.on('collect', async reaction => {

      switch(reaction.emoji.name){
        case prev instanceof GuildEmoji ? prev.name : prev:
          msg.edit(pages.previous());
        break;
        case next instanceof GuildEmoji ? next.name : next:
          msg.edit(pages.next());
        break;
        case terminate instanceof GuildEmoji ? terminate.name : terminate:
          collector.stop();
        break;
      };

      await reaction.users.remove(message.author.id);
      timeout.refresh();
    });

  collector.on('end', async () => await msg.reactions.removeAll());

  }
};
