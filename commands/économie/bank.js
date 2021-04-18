const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'bank',
  aliases: [ 'registerbank' ],
  guildOnly: true,
  group: '**__Économie__**',
  description: 'Begin storing your credits on bank. Required because wallet maximum capacity is 50000.',
  requiresDatabase: true,
  examples: [
    'bank',
    'registerbank'
  ],
  run: (client, message) => profile.findById(message.author.id, (err,doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, La banque a besoin de pièces pour s'inscrire, mais vous n'avez pas encore de *portefeuille*! Pour en créer un, tapez \`${client.prefix}register\`.`);
    } else if (doc.data.economy.bank !== null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Vous avez déjà un compte bancaire.\n`);
    } else if (doc.data.economy.wallet < 2500){
      return message.channel.send(`\\❌ **${message.member.displayName}**,  il semble que vous n'ayez pas assez de pièces pour vous inscrire dans une banque ((***${text.commatize(2500 - doc.data.economy.wallet)}** plus de pièces sont nécessaires*).`)
    } else {
      doc.data.economy.wallet = doc.data.economy.wallet - 2500;
      doc.data.economy.bank = 2500;

      return doc.save()
      .then(() => message.channel.send(`✔️ **${message.member.displayName}**, Enregistré dans une banque! Les frais de **2 500** ont été transférés à votre banque. Pour vérifier votre solde, saisissez \`${client.prefix}bal\``))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
    };
  })
};
