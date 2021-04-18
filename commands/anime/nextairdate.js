require('moment-duration-format');
const { duration } = require('moment');
const { MessageEmbed } = require('discord.js');
const requireText = require('require-text');

const withQuery = requireText('../../assets/graphql/AirDateQuery.graphql', require);
const withoutQuery = requireText('../../assets/graphql/AirDateNoQuery.graphql', require);

module.exports = {
  name: 'nextairdate',
  aliases: [ 'nextairing', 'nextair', 'nextep', 'nextepisode' ],
  cooldown: {
    time: 10000,
    message: '!'
  },
  clientPermissions: [ 'EMBED_LINKS' ],
  group: '__**Anime**__',
  description: 'Shows the remaining time for the next episode of given anime. Returns this day\'s schedule, if no anime is specified',
  parameters: [ 'Search Query' ],
  examples: [
    'nextairdate',
    'nextair boruto',
    'nextairing black clover',
    'nextep attack on titan',
    'nextepisode fire force'
  ],
  run: async ( client, message, args ) => {

    const search = args.join(' ') || null;
    const query = search ? withQuery : withoutQuery;
    const variables = search ? { search , status: 'RELEASING'} : {};

    const res = await client.anischedule.fetch(query, variables);

    const embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setThumbnail('https://cdn.discordapp.com/avatars/688407554904162365/b91454b73477486d08be0830e383dc12.png?size=2048')
    .setFooter(`Requête Airdate avec AL | \©️${new Date().getFullYear()} HorizonGame`);

    if (res.errors && res.errors.some(e => e.message !== 'Not Found.')){
      return message.channel.send(
        embed.setAuthor('Erreur de réponse','https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setDescription([
          `**${message.member.displayName}**, Une erreur inattendue s'est produite!\n\n`,
          `${res.errors.map(({ message }) => '• ' + message).join('\n')}`,
          `S'il vous plait, réessayez dans quelques minutes. Cela est généralement dû à un temps d'arrêt du serveur.`
       ].join(''))
     );
    };

    if (res.errors && res.errors.some(e => e.message === 'Not Found.')){
      return message.channel.send(
        embed.setAuthor('None Found','https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setDescription([
           `**${message.member.displayName}**, Cet anime a peut-être déjà ** Diffusion terminée **, `,
           `avoir ** la prochaine Airdate inconnue **, ou cet anime n'a peut-être ** jamais existé ** du tout!`
         ].join(''))
      );
    };

    const [ now, next, later ] = [ res.data.Media || res.data.Page.media ].flat().filter(x => x.nextAiringEpisode).sort((A,B) => A.nextAiringEpisode.timeUntilAiring - B.nextAiringEpisode.timeUntilAiring )

    if (!now){
      return message.channel.send(
        embed.setAuthor('None Found','https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        .setDescription([
           `**${message.member.displayName}**, Cet anime a peut-être déjà ** Diffusion terminée **, `,
           `avoir ** la prochaine Airdate inconnue **, ou cet anime n'a peut-être ** jamais existé ** du tout!`
         ].join(''))
      );
    } else if (variables.status){
      return message.channel.send(
        embed.setAuthor('',null)
        .setColor(now.coverImage.color)
        .setThumbnail(now.coverImage.large)
        .setTitle(now.title.english || now.title.romaji || now.title.native)
        .setDescription([
          `${now.title.native || '*'} \n`,
          `${now.title.romaji || '*'} \n\n`,
          now.nextAiringEpisode ? [
            `Épisode **${now.episodes === now.nextAiringEpisode.episode ? `${now.nextAiringEpisode.episode} (Final Episode)` : now.nextAiringEpisode.episode}**`,
            `sur [${now.title.english || now.title.romaji || now.title.native}](${now.siteUrl})`,
            `sera diffusé dans environ **${duration(now.nextAiringEpisode.timeUntilAiring, 'seconds').format('D [days] H [hours and] m [minutes]')}**\n\n`,
          ].join(' ') : [
            `Date de diffusion de l'épisode suivant pour [${now.title.english || now.title.romaji || now.title.native}](${now.siteUrl})`,
            `est actuellement inconnu.`
          ].join(' '),
          `${now.id}\u2000|\u2000${now.studios.edges.map(x => `[${x.node.name}](${x.node.siteUrl})`).join('\u2000|\u2000')}`
        ].join(''))
      );
    } else {
      return message.channel.send(
        embed.setColor(now.coverImage.color || next.coverImage.color || later.coverImage.color )
        .setThumbnail(now.coverImage.large)
        .setAuthor(`Airs suivant\u2000|\u2000${now.title.english || now.title.romaji || now.title.native}.`, null, now.siteUrl)
        .setDescription([
          [
            `[**${now.title.english || now.title.romaji || now.title.native}**](${now.siteUrl})`,
            `\u2000\u2000*${now.title.english ? now.title.romaji : now.title.native}*`,
            `\u2000\u2000*${now.title.romaji ? now.title.native : '~'}*`
          ].join('\n'),
          now.nextAiringEpisode.timeUntilAiring ? [
            `Épisode **${now.episodes === now.nextAiringEpisode.episode ? `${now.nextAiringEpisode.episode} (Final Episode)` : now.nextAiringEpisode.episode}**`,
            `airs dans **${duration(now.nextAiringEpisode.timeUntilAiring, 'seconds').format('D [days] H [hours and] m [minutes]')}**.\n\u200b`
          ].join(' ') : 'Le prochain épisode est actuellement **inconnu**.\n\u200b'
        ].join('\n'))
        .addFields([
          {
            name: 'Diffusion plus tard',
            value: next ? [
              [
                `[**${next.title.english || next.title.romaji || next.title.native}**](${next.siteUrl})`,
                `\u2000\u2000*${next.title.english ? next.title.romaji : next.title.native}*`,
                `\u2000\u2000*${next.title.romaji ? next.title.native : '~'}*`
              ].join('\n'),
              next.nextAiringEpisode.timeUntilAiring ? [
                `Épisode **${next.episodes === next.nextAiringEpisode.episode ? `${next.nextAiringEpisode.episode} (Final Episode)` : next.nextAiringEpisode.episode}**`,
                `airs dans **${duration(next.nextAiringEpisode.timeUntilAiring, 'seconds').format('D [days] H [hours and] m [minutes]')}**.\n\u200b`
              ].join(' ') : 'Le prochain épisode est actuellement **inconnu**.\n\u200b'
            ].join('\n') : 'Aucun anime n\'a été trouvé les 7 prochains jours.\n\u200b'
          },{
            name: 'Diffusion plus tard',
            value: later ? [
              [
                `[**${later.title.english || later.title.romaji || later.title.native}**](${later.siteUrl})`,
                `\u2000\u2000*${later.title.english ? later.title.romaji : later.title.native}*`,
                `\u2000\u2000*${later.title.romaji ? later.title.native : '~'}*`
              ].join('\n'),
              later.nextAiringEpisode.timeUntilAiring ? [
                `Épisode **${later.episodes === later.nextAiringEpisode.episode ? `${later.nextAiringEpisode.episode} (Final Episode)` : later.nextAiringEpisode.episode}**`,
                `airs dans **${duration(later.nextAiringEpisode.timeUntilAiring, 'seconds').format('D [days] H [hours and] m [minutes]')}**.`
              ].join(' ') : 'Le prochain épisode est actuellement **inconnu**.'
            ].join('\n') : 'Aucun anime n\'a été trouvé les 7 jours suivants.'
          }
        ])
      );
    };
  }
};
