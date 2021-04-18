const { Collection } = require('discord.js');
const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'beg',
  aliases: [ 'plead', 'gimme' ],
  guildOnly: true,
  group: '**__Économie__**',
  description: 'Want to earn money some more? Why don\'t you try begging, maybe someone will give you.',
  requiresDatabase: true,
  examples: [
    'beg',
    'plead',
    'gimme'
  ],
  run: (client, message) => profile.findById(message.author.id, (err,doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Vous n'avez pas encore de * portefeuille *! Pour en créer un, tapez \`${client.prefix}register\`.`);
    } else {

      const now = Date.now();
      const duration = Math.floor(Math.random() * 7200000) + 3600000;
      const beg = client.collections.economy.get('beg') || client.collections.economy.set('beg', new Collection()).get('beg');
      const userprofile = beg.get(message.author.id) || beg.set(message.author.id, { date: 0 }).get(message.author.id);
      let overflow = false, excess = null;

      if (userprofile.date > now){
        return message.channel.send(`\\❌ **${message.member.displayName}**, Vous avez déjà reçu des *pièces* plus tôt! Veuillez réessayer plus tard.`);
      };

      userprofile.date = Date.now() + duration;
      const amount = Math.floor(Math.random() * 200) + 100;

      if (doc.data.economy.wallet + amount > 50000){
        overflow = true;
        excess = doc.data.economy.wallet + amount - 50000
      };

      doc.data.economy.wallet = overflow ? 50000 : doc.data.economy.wallet + amount;

      return doc.save()
      .then(() => message.channel.send([
        `\\✔️ **${message.member.displayName}**, Tu as reçu **${amount}** <a:emoji_49:832655502961934337 de moi.`,
        overflow ? `\n⚠️Avertissement de débordement! Veuillez déposer une partie de votre compte dans votre **banque**. Vous avez seulement reçu ${amount-excess} pour celui-ci!` :'',
        `\nPour vérifier votre solde, saisissez \`${client.prefix}bal\`\n`,
      ].join('')))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
    };
  })
};
