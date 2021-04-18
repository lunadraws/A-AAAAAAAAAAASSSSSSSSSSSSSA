const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'dogfacts',
  aliases: [ 'dogfact', 'inu', 'df' ],
  group: '__**Amusant**__',
  description: 'Generate a random useless dog facts',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'dogfacts',
    'dogfact',
    'inu',
    'df'
  ],
  run: async (client, message) => {

    const data = await fetch('https://dog-api.kinduff.com/api/facts')
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.channel.send(`Erreur serveur 5xx: l'API Dogfact est actuellement hors service!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setThumbnail('https://i.imgur.com/oTVVqHQ.gif')
      .setColor(message.guild.me.displayHexColor)
      .setDescription(data.facts)
      .setFooter(`Dogfact | \©️${new Date().getFullYear()} Mai`)
    );
  }
};
