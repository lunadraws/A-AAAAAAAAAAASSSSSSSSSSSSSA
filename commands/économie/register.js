const profile = require('../../models/Profile');

module.exports = {
  name: 'register',
  aliases: [ ],
  guildOnly: true,
  group: '**__Économie__**',
  description: 'Start earning credits. Register to keep track of your earned credits!',
  requiresDatabase: true,
  examples: [
    'register'
  ],
  run: (client, message) => profile.findById(message.author.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (doc && doc.data.economy.wallet !== null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Vous aviez déjà un **portefeuille**!\nPour vérifier votre solde, saisissez \`${client.prefix}bal\``);
    } else if (!doc){
      doc = new profile({ _id: message.author.id })
    };

    doc.data.economy.wallet =  Math.floor(Math.random() * 250) + 250;

    return doc.save()
    .then(() => message.channel.send(`\\✔️ **${message.member.displayName}**, vous avez été enregistré avec succès! Tu as reçu **${doc.data.economy.wallet}** comme cadeau!\nPour vérifier votre solde, saisissez \`${client.prefix}bal\``))
    .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
  })
};
