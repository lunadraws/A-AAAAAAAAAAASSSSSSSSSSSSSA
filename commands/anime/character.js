const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const fetch = require('node-fetch');

const text = require('../../util/string');

const badge = '<:mal:767062339177676800> [MyAnimeList](https://myanimelist.net \'Homepage\')';

module.exports = {
  name: 'character',
  aliases: [ 'anichar' , 'char' , 'c' ],
  cooldown: {
    time: 10000,
    message: 'Vous allez trop vite. Veuillez ralentir pour éviter d\'être limité!'
  },
  clientPermissions: [ 'EMBED_LINKS' ],
  group: '__**Anime**__',
  description: 'Searches for a character in <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net "Homepage"), or hori\'s character information if no query is provided.',
  parameters: [ 'Search Query' ],
  examples: [
    'character',
    'anichar Asuna',
    'anichar Kirito',
    'char Natsu',
    'c Lucie'
  ],
  run: async (client, message, args) => {

    const query = args.join(' ') || 'Asuna Yuuki';

    const embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setDescription(`Recherche du personnage nommé **${query}** sur [MyAnimeList](https://myanimelist.net 'Homepage').`)
    .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
    .setFooter(`Requête de caractère avec MAL | \©️${new Date().getFullYear()}`);

    const msg = await message.channel.send(embed);

    let data = await fetch(`https://api.jikan.moe/v3/search/character?q=${encodeURI(query)}&page=1`).then(res => res.json());

    const errstatus = {
      "404": `Aucun résultat n'a été trouvé pour **${query}**!\n\nSi vous pensez que ce personnage existe, essayez leurs noms alternatifs.`,
      "429": `Je suis limité dans le taux ${badge}. Veuillez réessayer plus tard`,
      "500": `Impossible d’accéder ${badge}. Le site est peut-être actuellement indisponible pour le moment`,
      "503": `Impossible d’accéder ${badge}. Le site est peut-être actuellement indisponible pour le moment`,
    }

    embed.setColor(message.guild.me.displayHexColor)
    .setAuthor(data.status == 404 ? 'None Found' : 'Erreur de réponse','https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
    .setDescription(`**${message.member.displayName}**, ${errstatus[data.status] || `${badge} a répondu avec un code d'erreur HTTP a répondu avec un code d'erreur HTTP ${data.status}`}`)
    .setThumbnail('https://cdn.discordapp.com/avatars/688407554904162365/b91454b73477486d08be0830e383dc12.png?size=2048');

    if (!data || data.error){
      return await msg.edit(embed).catch(()=>null) || message.channel.send(embed);
    };

    const { results : [ { mal_id } ] } = data;

    let res = await fetch(`https://api.jikan.moe/v3/character/${mal_id}`)
    .then(res => res.json())
    .catch(() => {});

    embed.setDescription(`**${message.member.displayName}**, ${errstatus[data.status] || `${badge} a répondu avec un code d'erreur HTTP ${data.status}`}`);

    if (!res || res.error){
      return await msg.edit(embed).catch(()=>{}) || message.channel.send(embed);
    };

    const elapsed = Date.now() - msg.createdAt;
    const [ anime, manga ] = ['animeography', 'mangaography'].map(props => {
      const data = res[props]?.map(x => {
        const url = x.url.split('/').slice(0,5).join('/');
        return '[' + x.name + '](' + url + ') (' + x.role + ')';
      });
      return text.joinArrayAndLimit(data, 1000, ' • ');
    });
    const mediastore = { anime, manga };

    embed.setAuthor(`${res.name} ${res.name_kanji ? `• ${res.name_kanji}` : ''}`, null, res.url)
    .setThumbnail(res.image_url)
    .setColor(message.guild.me.displayHexColor)
    .setDescription(text.truncate(res.about.replace(/\\n/g,''),500,`... [Read More](${res.url})`))
    .setFooter(  `Requête de caractère avec MAL | \©️${new Date().getFullYear()} horizonGame`)
    .addFields([
      ...['Anime', 'Manga'].map(media => {
        const store = mediastore[media.toLowerCase()];
        return {
          name: `${media} (${res[media.toLowerCase() + 'ography']?.length || 0})`,
          value: `${store?.text || 'None'} ${store.excess ? `\n...and ${store.excess} more!` : ''}`
        };
      }),
      ..._.chunk(res.voice_actors ,3).slice(0,3).map((va_arr, index) => {
        return {
          inline: true,
          name: index === 0 ? `Seiyuu (${res.voice_actors.length})` : '\u200b',
          value: va_arr.map((va, i) => {
            const flag = client.anischedule.info.langflags
            .find(m => m.lang === va.language)?.flag;
            if (index === 2 && i === 2){
              return `...and ${res.voice_actors.length - 8} more!`;
            } else {
              return `${flag || va.language} [${va.name}](${va.url})`;
            };
          }).join('\n') || '\u200b'
        };
      })
    ]);

    return await msg.edit(embed).catch(()=>null) || message.channel.send(embed);
  }
};
