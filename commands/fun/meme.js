const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'meme',
  aliases: [ 'humorme' ],
  group: '__**Amusant**__',
  description: 'Generate a random meme from a select subreddit.',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'meme',
    'humorme'
  ],
  run: async (client, message) => {

    const data = await fetch(`https://meme-api.herokuapp.com/gimme`)
    .then(res => res.json())
    .catch(()=>null);

    if (!data){
      return message.channel.send(`Erreur serveur 5xx: l'API Meme est actuellement en panne!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setImage(data.url)
      .setAuthor(data.title, null, data.postLink)
      .setFooter(`${data.subreddit}:Meme | \©️${new Date().getFullYear()} Horizongame`)
    );
  }
};
