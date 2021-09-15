const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'pandafacts',
  aliases: [ 'pandafact', 'pf' ],
  group: '__**Amusant**__',
  description: 'Generate a random useless pandaa facts',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'pandafacts',
    'pandafact',
    'pf'
  ],
  run: async (client, message) => {

    const data = await fetch('https://some-random-api.ml/facts/panda')
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.channel.send(`Erreur serveur 5xx: l'API Pandafact est actuellement hors service!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setThumbnail('https://i.imgur.com/QUF4VQX.gif')
      .setColor('#3A871F')
      .setDescription(data.fact)
      .setFooter(`Pandafact | \©️${new Date().getFullYear()} HorizonGame`)
    );
  }
};
