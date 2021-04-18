const profile = require('../../models/Profile');

module.exports = {
  name: 'addcredits',
  aliases: [ ],
  group: '**__Économie__**',
  guildOnly: true,
  ownerOnly: true,
  requiresDatabase: true,
 
  run: async (client, message, [user, amount]) => {

    amount = Number(amount);

    if (!user){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Veuillez spécifier l'utilisateur.`);
    } else if (!amount){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Veuillez spécifier la valeur.`);
    };

    user = await client.users.fetch(user.match(/\d{17,19}/)?.[0]).catch(()=>{});

    if (!user){
      return message.channel.send(`\\❌ **${message.member.displayName}**, 404 User Not Found.`);
    }

    return profile.findById(user.id, (err, doc) => {

      if (err){
        return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
      } else if (!doc || doc.data.economy.wallet === null){
        return message.channel.send(`\\❌ **${message.member.displayName}**, **L'utilisateur n'a pas de portefeuille.**`);
      };

      const tba = doc.data.economy.wallet + amount

      doc.data.economy.wallet = tba > 50000 ? 50000 : Math.floor(tba);

      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${message.member.displayName}**, ajouté avec succès ${amount} à **${user.tag}**!`))
      .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
    })
  }
};
