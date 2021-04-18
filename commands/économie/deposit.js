const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'deposit',
  aliases: [ 'dep' ],
  guildOnly: true,
  group: '**__Économie__**',
  description: 'Deposit your credits to safeguard it!',
  parameters: [ 'Amount' ],
  requiresDatabase: true,
  examples: [
    'deposit 14',
    'dep all'
  ],
  run: (client, message, [amount]) => profile.findById(message.author.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Vous n'avez pas encore de *portefeuille*! Pour en créer un, tapez \`${client.prefix}register\`.`);
    } else if (doc.data.economy.bank === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Vous n'avez pas encore de *banque*! Pour en créer un, tapez \`${client.prefix}bank\`.`);
    } else {

      const amt = amount;

      if (amount?.toLowerCase() === 'all'){
        amount = Math.floor(doc.data.economy.wallet * 0.95);
      } else {
        amount = Math.round(amount?.split(',').join(''));
      };

      if (!amount){
        return message.channel.send(`\\❌ **${message.member.displayName}**, [ **${amt || 0}** ] n'est pas un montant valide!.`);
      } else if (amount < 100){
        return message.channel.send(`\\❌ **${message.member.displayName}**, Le montant à déposer doit être d'au moins **100**.`);
      } else if (amount * 1.05 > doc.data.economy.wallet){
        return message.channel.send([
          `\\❌ **${message.member.displayName}**, Vous n'avez pas assez de crédits dans votre portefeuille pour procéder à cette transaction.`,
          ` Vous avez seulement **${text.commatize(doc.data.economy.wallet)}**, **${text.commatize(amount - doc.data.economy.wallet + Math.ceil(amount * 0.05))}** inférieur au montant que vous souhaitez déposer (frais de transaction de 5% inclus)`,
          `Pour déposer tous les crédits à la place, veuillez saisir \`${client.prefix}dep all\`.`
        ].join('\n'));
      };

      doc.data.economy.bank = doc.data.economy.bank + amount;
      doc.data.economy.wallet = doc.data.economy.wallet - Math.floor(amount * 1.05);

      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${message.member.displayName}**, vous avez déposé avec succès **${text.commatize(amount)}** crédits à votre banque! (+ 5% de frais).`))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
    };
  })
};
