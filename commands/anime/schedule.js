const { MessageEmbed, GuildEmoji } = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');

const Paginate = require('../../struct/Paginate');
const text = require('../../util/string');
const weekdays = require('../../util/constants').weeks;

module.exports = {
  name: 'schedule',
  aliases: [ 'anitoday' , 'airinglist' , 'airing' ],
  guildOnly: true,
  cooldown: {
    time: 60000
    , message: 'You are going too fast! Please slow down to avoid being rate-limited!'
  },
  clientPermissions: [ 'EMBED_LINKS' , 'ADD_REACTIONS' , 'USE_EXTERNAL_EMOJIS' ],
  group: '__**Anime**__',
  description: 'Displays the list of currently airing anime for today\'s date or given weekday.',
  parameters: [ 'Weekday' ],
  examples: [
    'schedule monday',
    'anitoday',
    'airinglist sunday',
    'airing saturday'
  ],
  run: async (client, message, [ day ]) => {

    if (!day || !weekdays.includes(day.toLowerCase())){
      day = weekdays[new Date().getDay()]
    };

    const embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setThumbnail('https://cdn.discordapp.com/avatars/688407554904162365/b91454b73477486d08be0830e383dc12.png?size=2048')
    .setDescription(`\u200B\n Aller chercher **${day}** horaires d'anime à partir de [MyAnimeList](https://myanimelist.net 'MyAnimeList Homepage').\n\u200B`)
    .setFooter(`Programmer une requête avec MAL | \©️${new Date().getFullYear()} HorizonGame`)

    let msg = await message.channel.send(embed)

    let res = await fetch(`https://api.jikan.moe/v3/schedule/${day}`).then(res => res.json())

    if (!res || res.error){
      res = res ? res : {};

      embed.setColor(message.guild.me.displayHexColor)
      .setAuthor(res.error === 'Bad Request' ? 'Unknown day' : 'Response Error','https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
      .setDescription([
        `**${message.member.displayName}**, ${res.error === 'Bad Request' ? 'Could not recognize input' : 'An unexpected error occured!'}\n\n`,
        `${res.error === 'Bad Request' ? `**${day}** seems to be an invalid day, please select from Monday - Sunday.` : jikanError(res.status)}`
      ].join(''))
      .setThumbnail('https://cdn.discordapp.com/avatars/688407554904162365/b91454b73477486d08be0830e383dc12.png?size=2048');

      return await msg.edit(embed).catch(()=>null) || await message.channel.send(embed);
    };

    const elapsed = Date.now() - message.createdTimestamp
    const pages = new Paginate()

    for ( const info of res[day] ){
      pages.add(
        new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setThumbnail(info.image_url)
        .setDescription([
          `${info.score ? `**Score**:\u2000${info.score}\n`: ''}`,
          `${info.genres.map(x => `[${x.name}](${x.url})`).join(' • ')}\n\n`,
          `${text.truncate(info.synopsis,300,`...[Read More](${info.url})`)}`
        ].join(''))
        .setAuthor(info.title, null, info.url)
        .setFooter([
          `Durée de la recherche: ${Math.abs(elapsed / 1000).toFixed(2)} seconds`,
          `Page ${pages.size === null ? 1 : pages.size + 1} sur ${res[day].length}`,
          `Programmer une requête avec MAL | \©️${new Date().getFullYear()} HorizonGame`
        ].join('\u2000\u2000•\u2000\u2000'))
        .addFields([
          { name: 'Type',      value: info.type || 'Unknown', inline: true },
          { name: 'A débuté',   value: moment(info.airing_start).format('dddd, do MMMM YYYY'), inline: true },
          { name: 'Source',    value: info.source || 'Unknown' , inline: true },
          { name: 'Les producteurs', value: info.producers.map(x => `[${x.name}](${x.url})`).join(' • ') || 'None', inline: true },
          { name: 'Concédants', value: info.licensors.join(' • ') || 'None', inline: true },
          { name: '\u200b',    value: '\u200b',   inline: true }
        ])
      );
    };

    msg = await msg.edit(pages.currentPage).catch(()=>null) || await message.channel.send(pages.currentPage);

    if (pages.size === 1){
      return;
    };

    const prev = client.emojis.cache.get('767062237722050561') || '◀'
    const next = client.emojis.cache.get('767062244034084865') || '▶'
    const terminate = client.emojis.cache.get('769218376542847008') || '❌'

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
}
