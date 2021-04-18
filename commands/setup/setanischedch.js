const list = require('../../models/GuildWatchlist');

module.exports = {
  name: 'setanischedch',
  aliases: [ 'setanischedulechannel', 'setanischedulech', 'setanischedchannel' ],
  guildOnly: true,
  adminOnly: true,
  group: '**__Configuration__**',
  description: 'Where will i post the announcement for recently aired anime?',
  requiresDatabase: true,
  parameters: ['Channel ID/Mention'],
  examples: [
    'setanischedch #anime-updates',
    'setanischedulech 728394059683726123'
  ],
  run: (client, message, [channel='']) => list.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc){
      doc = new list({ _id: message.guild.id });
    };

    const channelID = channel.match(/\d{17,19}/)?.[0];
    channel = message.guild.channels.cache.get(channelID);

    if (!channel || !['text', 'news'].includes(channel.type)){
      return message.channel.send(`\\❌ **${message.member.displayName}**, veuillez fournir un identifiant de chaîne ou une mention de chaîne valide.`);
    } else if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
      return message.channel.send(`\\❌ **${message.member.displayName}**, J'ai besoin que vous m'autorisiez à **Envoyer des messages** sur ${channel} et essayez à nouveau.`);
    } else if (!channel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
      return message.channel.send(`\\❌ **${message.member.displayName}**, J'ai besoin que vous m'autorisiez à **intégrer des liens** sur ${channel} et essayez à nouveau.`);
    };

    doc.channelID = channel.id;
    return doc.save()
    .then(() => {

      return message.channel.send(`\\✔️ Définit avec succès le salon de notification de diffusion d'anime sur ${channel}!`)
    }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`))
  })
};
