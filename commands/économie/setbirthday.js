const profile = require('../../models/Profile');
const moment = require('moment');

module.exports = {
  name: 'setbirthday',
  aliases: [],
  rankcommand: true,
  clientPermissions: [],
  group: '**__Économie__**',
  description: 'Sets the profile birthday for your profile card.',
  requiresDatabase: true,
  parameters: [ 'Date <DD-MM format>' ],
  examples: [
    'setbirthday 02-07'
  ],
  run: async (client, message, [date] ) => profile.findById(message.author.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc){
      doc = new profile({ _id: message.author.id });
    };

    if (!date){
      return message.channel.send(`\\❌ **${message.author.tag}**, Veuillez ajouter la date`);
    } else {
      date = moment(date, 'DD-MM');

      if (!date.isValid()){
        return message.channel.send(`\\❌ **${message.author.tag}**, Veuillez ajouter la date au format JJ-MM`);
      };

      doc.data.profile.birthday = date.format('Do MMMM');

      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, votre anniversaire a été mis à jour en **${date.format('Do MMMM')}**!`))
      .catch(() => message.channel.send(`\\❌ **${message.author.tag}**, votre mise à jour d'anniversaire a échoué!`))
    };
  })
}
