const { MessageEmbed } = require('discord.js');
const { convert: toMarkdown } = require('html-to-markdown');
const { decode } = require('he');
const requireText = require('require-text');

const seiyuu = requireText('../../assets/graphql/Seiyuu.graphql', require);
const text = require('../../util/string');

module.exports = {
  name: 'seiyuu',
  aliases: [ 'voice' , 'va' ],
  cooldown: {
    time: 10000,
    msg: 'Oops! Vous allez jeûner! Veuillez ralentir pour éviter d\'être limité!'
  },
  clientPermissions: [ 'EMBED_LINKS' ],
  group: '__**Anime**__',
  description: 'Search for seiyuu\'s on your favorite anime characters, or Mai\'s seiyuu if no query is provided!',
  parameters: [ 'search query' ],
  examples: [
    'seiyuu Yoshitsugu Matsuoka',
    'voice',
    'va'
  ],
  run: async ( client, message, args) => {

    const search = args.join(' ') || 'Yoshitsugu Matsuoka';

    const embed = new MessageEmbed().setColor('#3A871F')
    .setFooter(`Requête Seiyuu avec AL | \©️${new Date().getFullYear()} HorizonGame`)
    .setThumbnail('https://cdn.discordapp.com/avatars/688407554904162365/b91454b73477486d08be0830e383dc12.png?size=2048')
    .setDescription([
      `\u200B\nRecherche du personnage nommé **${search}** sur `,
      `[Anilist](https://anilist.co 'Anilist Homepage').\n\u200B`
    ].join(''));

    let mainpage = await message.channel.send(embed);

    let res = await client.anischedule.fetch(seiyuu, { search });

    if (res.errors && res.errors.some(e => e.message !== 'Not Found.')){
      embed.setColor('#3A871F')
      .setAuthor('Erreur de réponse','https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
      .setThumbnail('https://cdn.discordapp.com/avatars/688407554904162365/b91454b73477486d08be0830e383dc12.png?size=2048')
      .setDescription([
        `**${message.member.displayName}**, Une erreur inattendue s'est produite!\n\n`,
        `${res.errors.map(({ message }) => '• ' + message).join('\n')}\n`,
        `S'il vous plait, réessayez dans quelques minutes. Ceci est généralement causé par un temps d'arrêt du serveur.`
      ].join(''));

      return await mainpage.edit(embed).catch(()=> null) || message.channel.send(embed);
    };

    if (res.errors && res.errors.some(e => e.message === 'Not Found.')){
      embed.setColor('#3A871F')
      .setAuthor('Personne n\'est trouvé','https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
      .setThumbnail('https://cdn.discordapp.com/avatars/688407554904162365/b91454b73477486d08be0830e383dc12.png?size=2048')
      .setDescription([
        `**${message.member.displayName}**, Aucun résultat n'a été trouvé pour **${search}**!\n\n`,
        `Si vous pensez que ce seiyuu existe, essayez les méthodes suivantes:\n`,
        `• Essayez les noms alternatifs (par exemple anglais, natif, romaji).\n`,
        `• Essayez leur surnom (ce que ces seiyuu appelaient habituellement au travail).\n`,
        `• Vérifier l'orthographe. Peut-être que vous n'avez pas bien compris.`
      ].join(''));

      return await mainpage.edit(embed).catch(()=> null) || message.channel.send(embed);
    };

    const elapsed = Date.now() - message.createdTimestamp;

    embed.setColor('#3A871F')
    .setThumbnail(res.data.Staff.image.large)
    .setAuthor([
      res.data.Staff.name.full,
      res.data.Staff.name.native
    ].filter(Boolean).join('\u2000•\u2000'), null, res.data.Staff.siteUrl)
    .setDescription([
      client.anischedule.info.langflags.find(f => f.lang.toLowerCase() === res.data.Staff.language?.toLowerCase())?.flag,
      text.truncate(toMarkdown(decode(res.data.Staff.description || '\u200b')), 1000, `...[Read More](${res.data.Staff.siteUrl})`)
    ].join('\n'))
    .addFields([
      {
        name: `${res.data.Staff.name.full} a exprimé ces personnages`,
        value: text.joinArrayAndLimit(res.data.Staff.characters.nodes.map(x => {
          return `[${x.name.full}](${x.siteUrl.split('/').slice(0,5).join('/')})`;
        }), 1000, ' • ').text || 'None Found.'
      },{
        name: `${res.data.Staff.name.full} fait partie du staff de ces anime`,
        value: text.joinArrayAndLimit(res.data.Staff.staffMedia.nodes.map(s => {
          return `[${s.title.romaji}](${s.siteUrl.split('/').slice(0,5).join('/')})`;
        }), 1000, ' • ').text || 'None Found.'
      }
    ])
    .setFooter([
      `Durée de la recherche: ${Math.abs(elapsed / 1000).toFixed(2)} seconds`,
      `Requête Seiyuu avec AL | \©️${new Date().getFullYear()} HorizonGame`
    ].join('\u2000•\u2000'));

    return await mainpage.edit(embed).catch(()=>null) || message.channel.send(embed).then(()=>null);

  }
};
