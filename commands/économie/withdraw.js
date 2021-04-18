const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'withdraw',
  aliases: [ ],
  guildOnly: true,
  group: '**__Économie__**',
  description: 'Withdraw some of your money from the bank.',
  requiresDatabase: true,
  parameters: [ 'Amount' ],
  examples: [
    'withdraw 1400',
    'withdraw all'
  ],
  run: (client, message, [amount='']) => profile.findById(message.author.id, (err,doc) =>{

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Vous n'avez pas encore de *portefeuille*! Pour en créer un, tapez \`${client.prefix}register\`.`);
    } else if (doc.data.economy.bank === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Vous n'avez pas encore de *banque*! Pour en créer un, tapez \`${client.prefix}bank\`.`);
    } else {

      const amt = amount;
      if (amount.toLowerCase() === 'all'){
        amount = Math.round(doc.data.economy.bank);
      } else {
        amount = Math.round(amount.split(',').join('')) / 0.95;
      };

      if (!amount){
        return message.channel.send(`\\❌ **${message.member.displayName}**, [ **${amt}** ] n'est pas un montant valide!.`);
      } else if (amount < 100){
        return message.channel.send(`\\❌ **${message.member.displayName}**, Le montant à retirer doit être d'au moins **100**.`);
      } else if (amount > doc.data.economy.bank){
        return message.channel.send([
          `\\❌ **${message.member.displayName}**, Vous n'avez pas suffisamment de crédits dans votre banque pour procéder à cette transaction.`,
          ` Vous avez seulement **${text.commatize(doc.data.economy.bank)}**, **${text.commatize(amount - doc.data.economy.bank + Math.ceil(amount * 0.05))}** inférieur au montant que vous souhaitez retirer (frais de transaction de 5% inclus)`,
          `Pour retirer tous les crédits à la place, veuillez taper \`${client.prefix}withdraw all\`.`
        ].join('\n'));
      } else if (amount + doc.data.economy.wallet > 50000){
        return message.channel.send(`\\❌ **${message.member.displayName}**, Vous ne pouvez pas retirer cette grosse somme d'argent (débordement imminent)!`)
      };

      doc.data.economy.bank = Math.round(doc.data.economy.bank - amount);
      doc.data.economy.wallet = doc.data.economy.wallet + Math.round(amount * 0.95);

      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${message.member.displayName}**, vous vous êtes retiré avec succès **${text.commatize(amount * 0.95)}** crédits de votre banque! (+ 5% de frais).`))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
    }
  })
};
