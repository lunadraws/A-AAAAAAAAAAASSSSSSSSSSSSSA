const profile = require('../../models/Profile');

module.exports = {
  name: 'togglevotenotif',
  aliases: [],
  group: '**__Configuration__**',
  description: 'Toggles your vote notification on/off',
  requiresDatabase: true,
  parameters: [ ],
  examples: [ ],
  run: (client, message) => profile.findById(message.author.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    };

    if (!doc){
      doc = new profile();
    };

    const status = doc.data.vote.notification;
    doc.data.vote.notification = !status;

    return doc.save()
    .then(() => message.channel.send(`\\✔️ | **${message.author.tag}**, avec succès __${status ? 'Disabled' : 'Enabled'}__ les notifications de vote. Vous allez maintenant **${status ? 'stop' : 'start'}** recevoir des notifications de DM lors du vote pour moi sur **top.gg**.`))
    .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
  })
};
