const { MessageEmbed, GuildEmoji } = require('discord.js');
const { HAnimeAPI } = require('hanime');
const { decode } = require('he');
const moment = require('moment');
const hanime = new HAnimeAPI();

const Pages = require('../../struct/Paginate');
const text = require('../../util/string');

module.exports = {
  name: 'hanime',
  aliases: [ 'searchhentai', 'hanisearch', 'hs' ],
  cooldown: {
    time: 10000,
    message: 'Vous allez trop vite! Veuillez ralentir pour éviter d\'être limité par le taux.',
  },
  clientPermissions: [ 'EMBED_LINKS', 'MANAGE_MESSAGES' ],
  group: '__**Anime**__',
  nsfw: true,
  description: 'Queries hanime.tv for a specific hentai. Returns a maximum of 10 results',
  parameters: [ 'Search Query' ],
  examples: [
    'hanime',
    'searchhentai',
    'hanisearch',
    'hs'
  ],
  run: async function (client, message, args){

    const query = args.join(' ');

    if (!query){
      client.commands.cooldowns.get(this.name).users.delete(message.author.id);
      return message.channel.send('\\<a:a_ERROR:828230829687046155> Veuillez inclure votre requête **hanime**!');
    };

    const res = await hanime.search(query);

    if (!res.hits){
      return message.channel.send(`\\<a:a_ERROR:828230829687046155> **${message.author.tag}**, Aucun résultat ne correspond à votre recherche **${query}**!`);
    };

    const pages = new Pages(res.videos.splice(0,10).map((entry, i, a) =>
      new MessageEmbed()
      .setColor('#3A871F')
      .setTitle(entry.name)
      .setURL(`https://hanime.tv/videos/hentai/${entry.slug}`)
      .setImage(reviseURL(entry.poster_url))
      .setThumbnail(reviseURL(entry.cover_url))
      .setAuthor('hanime.tv', 'https://i.imgur.com/fl2V0QV.png','https://hanime.tv/')
      .setDescription([
        `[**${entry.brand}**](https://hanime.tv/browse/brands/${entry.brand.toLowerCase().replace(/ +/gi, '\-')})`,
        entry.tags.sort().map(x => `[\`${x.toUpperCase()}\`](https://hanime.tv/browse/tags/${encodeURI(x)})`).join(' ')
        ].join('\n\n'))
      .setFooter([
        `Page ${i + 1} sur ${a.length}`,
        `requête hanime.tv | \©️${new Date().getFullYear()} HorizonGame`
      ].join('\u2000\u2000•\u2000\u2000'))
      .addFields([
        { name: 'Publié', value: moment(new Date(entry.released_at * 1000)).format('dddd, do MMMM YYYY'), inline: true },
        { name: 'Rang', value: text.ordinalize(entry.monthly_rank).replace('0th', 'Unranked'), inline: true },
        { name: 'Téléchargements', value: text.commatize(entry.downloads), inline: true },
        { name: `Likes (${Math.round((entry.likes / (entry.likes + entry.dislikes)) * 100)}%)`,
          value: text.commatize(entry.likes) , inline: true },
        { name: 'Interests', value: text.commatize(entry.interests), inline: true },
        { name: 'Vues', value: text.commatize(entry.views), inline: true },
        {
          name: '\u200b',
          value: [
            text.truncate(decode(entry.description).replace(/\<\/?(p|br)\>/gi,''), 500),
            `[**\\▶ Regarder** \`${entry.is_censored ? 'CENSORED' : 'UNCENSORED' }\` sur **hanime.tv**](https://hanime.tv/videos/hentai/${entry.slug})`
          ].join('\n\n')
        }
      ])
    ));

    msg = await message.channel.send(pages.firstPage);

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

function reviseURL(url){
  const baseurl = 'https://i1.wp.com/static-assets.droidbuzz.top/';
  const ext = String(url).match(/images\/(covers|posters)\/[\-\w]{1,}\.(jpe?g|png|gif)/i);
  return ext ? baseurl + ext[0] : null;
};;
