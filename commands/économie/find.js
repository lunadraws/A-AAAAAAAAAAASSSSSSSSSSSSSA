const { Collection } = require('discord.js');
const profile = require('../../models/Profile');

module.exports = {
  name: 'find',
  aliases: [ 'find' ],
  guildOnly: true,
  group: '**__Économie__**',
  description: 'You can find hidden credits on your surrounding if you try!',
  requiresDatabase: true,
  examples: [
    'find',
    'search'
  ],
  run: (client, message) => profile.findById(message.author.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Vous n'avez pas encore de *portefeuille*! Pour en créer un, tapez \`${client.prefix}register\`.`);
    };

    const now = Date.now();
    const duration = Math.floor(Math.random() * 7200000) + 3600000;
    const beg = client.collections.economy.get('find') || client.collections.economy.set('find', new Collection()).get('find');
    const userprofile = beg.get(message.author.id) || beg.set(message.author.id, { date: 0 }).get(message.author.id);
    let overflow = false, excess = null;

    if (userprofile.date > now){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Vous avez essayé de chercher ... mais vous n'avez rien trouvé. Attendez peut-être un peu plus longtemps jusqu'à ce que quelqu'un abandonne ses crédits?`);
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
      `\\✔️ **${message.member.displayName}**, Tu as trouvé **${amount}** de toute cette recherche.`,
      overflow ? `\n⚠️Avertissement de débordement! Veuillez déposer une partie de votre compte dans votre **banque**. Vous avez seulement reçu ${amount-excess} pour celui-ci!` :'',
      `\nPour vérifier votre solde, saisissez \`${client.prefix}bal\`\n`,
    ].join('')))
    .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
  })
}
