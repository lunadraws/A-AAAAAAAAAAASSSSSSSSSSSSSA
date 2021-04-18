const { MessageEmbed } = require('discord.js');
const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'xpenable',
  aliases: ['enablexp', 'enablexpon', 'xpenableon'],
  guildOnly: true,
  adminOnly: true,
  group: '**__Configuration__**',
  description: 'Enable collecting xp on **Disabled** mentioned channels',
  requiresDatabase: true,
  examples: [
    'xpenable'
  ],
  run: (client, message) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    const channels = message.mentions.channels.map( c => c.id);

    if (!channels.length){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Veuillez mentionner la ou les chaînes sur lesquelles vous souhaitez que je récupère xp.`);
    };

    let nonavail = []
    let avail = []

    for (const channelID of channels) {
      if (doc.xp.exceptions.includes(channelID)){
        avail.push(channelID);
      } else {
        nonavail.push(channelID);
      };
    };

    if (!avail.length){
      const oldch = channels.map(x => `<#${x}>`).join(', ');
      return message.channel.send(`\\❌ **${message.member.displayName}**, Les canaux mentionnés ${oldch} ne figurent pas sur la liste des exonérés.`);
    };

    for (const channel of avail){
      const index = doc.xp.exceptions.indexOf(channel);
      doc.xp.exceptions.splice(index, 1);
    };

    return doc.save()
    .then(() => {
      client.guildProfiles.get(message.guild.id).xp.exceptions = doc.xp.exceptions;
      return message.channel.send(
        new MessageEmbed()
        .setColor()
        .setFooter(`XP | \©️${new Date().getFullYear()} HorizonGame`)
        .setDescription([
          '\u2000\u2000\u2000\u2000|\u2000\u2000',
          'XP [Système de points d\'expérience] ont été réactivés le ',
           avail.map(c => client.channels.cache.get(c).toString()).join(', '),
           nonavail.length ? `\n\n⚠️\u2000\u2000|\u2000\u2000${nonavail.map(c => client.channels.cache.get(c).toString()).join(', ')} are not on excempted list.`: '',
           '\n\nPour voir quels salons ne donnent pas xp, utilisez la commande `nonxpchannels`'
        ].join(''))
      );
    }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
  })
};
