const list = require('../../models/GuildWatchlist');

module.exports = {
  name: 'disableanisched',
  aliases: [ 'anischedoff' ],
  guildOnly: true,
  adminOnly: true,
  group: '**__Configuration__**',
  description: 'Disable the anisched feature for this server',
  requiresDatabase: true,
  examples: [
    'disableanisched',
    'anischedoff'
  ],
  parameters: [],
  run: (client, message) => list.findById(message.guild.id, (err,doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    };

    if (!doc){
      doc = new list({ _id: message.guild.id });
    };

    if (doc.channelID === null){
      return message.channel.send(`\\❌ Anischedule est déjà désactivé sur ce serveur! Vous pouvez le réactiver via \`${client.prefix}setanischedch\``)
    };

    doc.channelID = null;
    return doc.save()
    .then(() =>  message.channel.send(`\\✔️ Désactivé avec succès la fonction Anisched! Vous pouvez le réactiver via \`${client.prefix}setanischedch\``))
    .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
  })
};
