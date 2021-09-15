const { MessageEmbed } = require('discord.js');
const { decode } = require('he');
const requireText = require('require-text');

const userquery = requireText('../../assets/graphql/User.graphql',require);
const text = require('../../util/string');

module.exports = {
  name: 'alprofile',
  aliases: [ 'al-of', 'alof', 'alstat', 'aluser' ],
  cooldown: { time: 10000 },
  clientPermissions: [ 'EMBED_LINKS' ],
  group: '__**Anime**__',
  description: 'Finds user profile on [Anilist](https://anilist.co) based on the provided query.',
  parameters: [ 'Anilist Username' ],
  examples: [
    'alprofile',
    'al-of flox',
    'alof flox',
    'alstat flox',
    'aluser flox'
  ],
  run: async function ( client, message, args ) {

    const query = args.join(' ');

    if (!query){
      client.commands.cooldowns.get(this.name).users.delete(message.author.id);
      return message.channel.send('\\<:error:885075491416047616> Veuillez inclure l\'utilisateur à trouver sur Anilist!');
    };

    const response = await client.anischedule.fetch(userquery, { search: query });

    if (response.errors){
      let err;
      if (response.errors[0].status === 404){
        err = `\\<:error:885075491416047616> Je ne trouve pas **${query}** sur Anilist!`;
      } else if (response.errors.some(x => x.status >= 500)){
        err = `\\<:error:885075491416047616> Anilist n'a pas pu être atteint pour le moment! Veuillez réessayer plus tard. [err ${response.errors[0].status}]`;
      } else if (response.errors.some(x => x.status >= 400)){
        err =`\`<:error:885075491416047616> CLIENT_ERR \`: HorizonGame a tenté d\'envoyer une requête invalidée à AniList. Veuillez contacter mon développeur pour corriger ce bug.`;
      } else {
        err = `\\<:error:885075491416047616> Un problème est survenu. Veuillez réessayer plus tard`;
      };
      return message.channel.send(err);
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor('#3A871F')
      .setImage(response.data.User.bannerImage)
      .setThumbnail(response.data.User.avatar.medium)
      .setAuthor(response.data.User.name, null, response.data.User.siteUrl)
      .setDescription(text.truncate(decode(response.data.User.about?.replace(/(<([^>]+)>)/ig,'') || ''), 250))
      .setFooter(`Profile | \©️${new Date().getFullYear()} HorizonGame`)
      .addFields(Object.entries(response.data.User.favourites).map(([topic, target]) => {
        topic = topic.charAt(0).toUpperCase() + topic.slice(1);
        return {
          name: `Top 5 ${topic}${'\u2000'.repeat(12-topic.length)}\u200b` , inline: true,
          value: target.edges.map(entry => {
            const identifier = entry.node.title || entry.node.name;
            const name = typeof identifier === 'object' ? identifier.userPreferred || identifier.full : identifier;

            return `• [**${name}**](${entry.node.siteUrl})`;
          }).join('\n') || 'Aucun répertorié'
        };
      }))
    );
  }
};
