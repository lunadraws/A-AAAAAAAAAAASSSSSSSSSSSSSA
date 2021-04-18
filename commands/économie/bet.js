const { Util } = require('discord.js');
const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'bet',
  aliases: [ 'parie' ],
  guildOnly: true,
  group: '**__Économie__**',
  description: 'Rely on fate to increase your balance... or lower it.',
  requiresDatabase: true,
  parameters: [ 'Amount' ],
  examples: [
    'bet 5000',
    'parie 500'
  ],
  run: (client, message, [amount]) => profile.findById(message.author.id, (err,doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Vous n'avez pas encore de *portefeuille*! Pour en créer un, tapez \`${client.prefix}register\`.`);
    } else if (!doc.data.economy.bank === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Vous n'avez pas encore de **banque**! Les paris gagnés peuvent être supérieurs à la capacité du portefeuille en fonction du montant de votre pari. \nObtenez d'abord une banque en tapant \`${client.prefix}bank\`. Vous devez avoir au moins **2500** pièces pour vous inscrire à une banque!`);
    } else if (isNaN(amount)){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Veuillez saisir un montant valide.\nLes paris doivent être supérieurs à **499** pièces mais inférieurs à **5001**`);
    } else if (amount < 500 || amount > 5000){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Le montant est hors de portée. \nLes paris doivent être supérieurs à **499** pièces mais inférieurs à **5001**`);
    } else if (amount > doc.data.economy.wallet){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Vous n'avez pas assez de pièces dans votre portefeuille pour procéder à ce pari. \nObtenez plus de pièces de votre banque en tapant \`${client.prefix}withdraw\`.`);
    } else {

      doc.data.economy.wallet = doc.data.economy.wallet - Math.floor(amount);

      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${message.member.displayName}**, Vos **${Math.floor(amount)}** on été placé dans un pari. Veuillez attendre 1 minute pour le résultat.\nLes chances de gagner le pari sont de 1/3 et le montant gagné est deux fois plus élevé jusqu'à 10 fois plus grand que le pari initial!`))
      .then(async () => {
        await Util.delayFor(60000);

        const won = Math.floor(Math.random() * 4) === 2 ? true : false;
        const multiplier = Math.floor(Math.random() * 9) + 2;
        const prize = amount * multiplier;

        if (!won){
          return message.channel.send(`\\❌ **${message.member.displayName}**,Tu as perdu **${text.commatize(amount)}** pièces de votre pari précédent!\nVous pouvez obtenir des pièces plus fiables sans utiliser la commande bet!`);
        };

        doc.data.economy.bank = doc.data.economy.bank + prize;
        return doc.save()
        .then(() => message.channel.send(`\\✔️ **${message.member.displayName}**, Tu as gagné **${text.commatize(amount)}** pièces de votre pari précédent!\nVotre pari **${Math.floor(amount)}** les pièces se sont multipliées par **${multiplier}**.\nVous recevrez **${text.commatize(prize)}** pièces de monnaie comme prix. Vos gains ont été transférés à votre banque!`))
        .catch(() => message.channel.send(`\`❌ Oh non! ${message.member.displayName}, La machine à parier vient de casser! Tu as perdu **${text.commatize(amount)}** pièces de votre pari précédent.\nCela n'arrive généralement pas. Veuillez contacter mon développeur si vous recevez ce message.`))
      }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
    };
  })
};
