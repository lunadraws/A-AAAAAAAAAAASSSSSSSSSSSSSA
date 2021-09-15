const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');

const text = require('../../util/string');

module.exports = {
  name: 'malprofile',
  aliases: [ 'mal-of', 'malof', 'malstat', 'maluser' ],
  cooldown: { time: 10000 },
  clientPermissions: [ 'EMBED_LINKS' ],
  group: '__**Anime**__',
  description: 'Finds user profile on myanimelist based on the provided query.',
  parameters: [ 'Myanimelist Username' ],
  examples: [
    'malprofile',
    'mal-of',
    'malof',
    'malstat',
    'maluser'
  ],
  run: async function (client, message, args ){

    const query = args.join(' ');

    if (!query){
      client.commands.cooldowns.get(this.name).users.delete(message.author.id);
      return message.channel.send('\\<a:a_ERROR:828230829687046155> Veuillez inclure l\'utilisateur à trouver sur mal!');
    };

    const response = await fetch(`https://api.jikan.moe/v3/user/${encodeURI(query)}/profile`)
    .then(res => res.json())
    .catch(() => {});

    if (!response || response.status){
      let err;
      if (response && response.status >= 500){
        err = `\\<a:a_ERROR:828230829687046155> Je viens de recevoir une erreur de serveur de Myanimelist. MAL est peut-être actuellement en panne. Veuillez réessayer plus tard.`
      } else if (response && response.status >=400){
        err = `\`<a:a_ERROR:828230829687046155> CLIENT_ERR\`: HorizonGame a tenté d'envoyer une demande invalidée à MAL. Veuillez contacter mon développeur pour corriger ce bogue.`
      } else {
        err = `\\<a:a_ERROR:828230829687046155> Je ne trouve pas **${query}** sur MAL`
      };
      return message.channel.send(err);
    };

    const fav_anime = text.joinArrayAndLimit(response.favorites.anime.map((entry) => {
      return `[${entry.name}](${entry.url.split('/').splice(0,5).join('/')})`;
    }), 1000, ' • ');
    const fav_manga = text.joinArrayAndLimit(response.favorites.manga.map((entry) => {
      return `[${entry.name}](${entry.url.split('/').splice(0,5).join('/')})`;
    }), 1000, ' • ');
    const fav_characters = text.joinArrayAndLimit(response.favorites.characters.map((entry) => {
      return `[${entry.name}](${entry.url.split('/').splice(0,5).join('/')})`;
    }), 1000, ' • ');
    const fav_people = text.joinArrayAndLimit(response.favorites.people.map((entry) => {
      return `[${entry.name}](${entry.url.split('/').splice(0,5).join('/')})`;
    }), 1000, ' • ');

    return message.channel.send(
      new MessageEmbed()
      .setColor('#3A871F')
      .setFooter(`MALProfile | \©️${new Date().getFullYear()} HorizonGame`)
      .setAuthor(`${response.username}'s Profile`, response.image_url, response.url)
      .setDescription([
        text.truncate((response.about || '').replace(/(<([^>]+)>)/ig, ''), 350, `...[Read More](${response.url})`),
        `• **Genre**:\u2000\u2000${response.gender || 'Unspecified'}`,
        `• **De**:\u2000\u2000${response.location || 'Unspecified'}`,
        `• **A rejoint MAL:**\u2000\u2000${moment(response.joined).format('dddd, do MMMM YYYY')}, *${moment(response.joined).fromNow()}*`,
        `• **Dernière vue:**\u2000\u2000${moment(response.last_online).format('dddd, do MMMM YYYY')}, *${moment(response.last_online).fromNow()}*`
      ].join('\n'))
      .addFields([
        {
          name: 'Statistiques d\'anime', inline: true,
          value: '```fix\n' + Object.entries(response.anime_stats).map(([key, value]) => {
            const cwidth = 28;
            const name = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
            const spacing = ' '.repeat(cwidth - (3 + name.length + String(value).length));

            return ' • ' + name + ':' + spacing + value;
          }).join('\n') + '```'
        },{
          name: 'Statistiques du manga', inline: true,
          value: '```fix\n' + Object.entries(response.manga_stats).splice(0,10).map(([key, value]) => {
            const cwidth = 28;
            const name = key.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
            const spacing = ' '.repeat(cwidth - (3 + name.length + String(value).length));

            return ' • ' + name + ':' + spacing + value;
          }).join('\n') + '```'
        },{
          name: 'Anime préféré',
          value: fav_anime.text + (!!fav_anime.excess ? ` et ${fav_anime.excess} plus!` : '') || 'None Listed.'
        },{
          name: 'Manga préféré',
          value: fav_manga.text + (!!fav_manga.excess ? ` et ${fav_manga.excess} plus!` : '') || 'None Listed.'
        },{
          name: 'Personnages préférés',
          value: fav_characters.text + (!!fav_characters.excess ? ` et ${fav_characters.excess} plus!` : '') || 'None Listed.'
        },{
          name: 'Personnel préféré',
          value: fav_people.text + (!!fav_people.excess ? ` et ${fav_people.excess} plus!` : '') || 'None Listed.'
        }
      ])
    );
  }
};
