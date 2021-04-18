const { MessageEmbed } = require('discord.js');
const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'xpexcempt',
  aliases: ['excemptxp', 'disablexpon', 'xpdisableon'],
  guildOnly: true,
  adminOnly: true,
  group: '**__Configuration__**',
  description: 'Disable collecting xp on mentioned channels',
  requiresDatabase: true,
  parameters: [ 'channel ID/Mention' ],
  examples: [
    'xpexcempt 728374657483920192',
    'disablexpon #spam'
  ],
  run: (client, message) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    const channels = message.mentions.channels.map( c => c.id);

    if (!channels.length){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Veuillez mentionner le (s) canal (s) sur lequel (s) vous ne voulez pas que je récupère.`);
    };

    let newch = []
    let oldch = []

    for (const channelID of channels) {
      if (doc.xp.exceptions.includes(channelID)){
        oldch.push(channelID);
      } else {
        newch.push(channelID);
      };
    };

    if (!newch.length){
      oldch = oldch.map(c => client.channels.cache.get(c).toString().toString()).join(', ');
      return message.channel.send(`\\❌ **${message.member.displayName}**, Les salons mentionnés ${oldch} sont déjà dans la liste des exonérés.`);
    };

    doc.xp.exceptions.push(...newch);

    return doc.save()
    .then(() => {
      client.guildProfiles.get(message.guild.id).xp.exceptions = doc.xp.exceptions;
      return message.channel.send(
        new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setFooter(`XP | \©️${new Date().getFullYear()} HorizonGame`)
        .setDescription([
          '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
          'XP [Système de points d\'expérience] sera désormais désactivé dans ',
           newch.map(c => client.channels.cache.get(c).toString()).join(', '),
           oldch.length ? `\n\n⚠️\u2000\u2000|\u2000\u2000${oldch.map(c => client.channels.cache.get(c).toString()).join(', ')} sont déjà sur la liste des exclus.`: '',
           '\n\nPour voir quels salons ne donnent pas xp, utilisez la commande `nonxpchannels`'
        ].join(''))
      );
    }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
  })
};
