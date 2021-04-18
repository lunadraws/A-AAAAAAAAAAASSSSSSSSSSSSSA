const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'catfacts',
  aliases: [ 'catfact', 'neko', 'cf' ],
  group: '__**Amusant**__',
  description: 'Generate a random useless cat facts',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'catfacts',
    'catfact',
    'neko',
    'cf'
  ],
  run: async (client, message) => {

    const data = await fetch('https://catfact.ninja/facts')
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.channel.send(`Erreur serveur 5xx: l'API Catfact est actuellement en panne!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setThumbnail('https://i.imgur.com/KeitRew.gif')
      .setColor(message.guild.me.displayHexColor)
      .setDescription(data.data[0].fact)
      .setFooter(`Catfact | \©️${new Date().getFullYear()} HorizonGame`)
    );
  }
};
