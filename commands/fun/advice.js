const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'advice',
  aliases: [ 'tips', 'advise' ],
  group: '__**Amusant**__',
  description: 'Generate a random useless advice',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'advice',
    'tips',
    'advise'
  ],
  run: async (client, message) => {

    const data = await fetch('https://api.adviceslip.com/advice')
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.channel.send(`Erreur serveur 5xx: l'API de conseil est actuellement en panne!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor('#3A871F')
      .setTitle(data.slip.advice)
      .setFooter(`Advice | \©️${new Date().getFullYear()} HorizonGame`)
    );
  }
};
