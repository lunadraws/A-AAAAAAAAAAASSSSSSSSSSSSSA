const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'birdfacts',
  aliases: [ 'birdfact', 'tori', 'bird' ],
  group: '__**Amusant**__',
  description: 'Generate a random useless bird facts',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'birdfacts',
    'birdfact',
    'tori',
    'bird'
  ],
  run: async (client, message) => {

    const data = await fetch('https://some-random-api.ml/facts/bird')
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.channel.send(`Erreur serveur 5xx: l'API Birdfact est actuellement en panne!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setThumbnail('https://i.imgur.com/arkxS3f.gif')
      .setColor('#3A871F')
      .setDescription(data.fact)
      .setFooter(`Birdfact | \©️${new Date().getFullYear()} HorizonGame`)
    );
  }
};
