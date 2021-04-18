const profile = require('../../models/Profile');

module.exports = {
  name: 'setbio',
  aliases: [],
  rankcommand: true,
  clientPermissions: [],
  group: '**__Économie__**',
  description: 'Sets the profile bio for your profile card.',
  requiresDatabase: true,
  paramters: [ 'bio' ],
  examples: [
    'setbio'
  ],
  run: async (client, message, args ) => profile.findById(message.author.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc){
      doc = new profile({ _id: message.author.id });
    };

    if (!args.length){
      return message.channel.send(`\\❌ **${message.author.tag}**, Veuillez ajouter le texte de votre bio (max 200 car.)`);
    } else if (args.join(' ').length > 200){
      return message.channel.send(`\\❌ **${message.author.tag}**, Le texte bio ne doit pas dépasser 200 caractères.`);
    } else {
      doc.data.profile.bio = args.join(' ');

      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, votre bio a été mise à jour!`))
      .catch(() => message.channel.send(`\\❌ **${message.author.tag}**, votre mise à jour bio a échoué!`))
    };
  })
}
