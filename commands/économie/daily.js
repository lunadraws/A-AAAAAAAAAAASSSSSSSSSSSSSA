const moment = require('moment');
const text = require('../../util/string');
const profile = require('../../models/Profile');
const market = require('../../assets/json/market.json');

// EXPERIMENTAL //
// This feature is still experimental and needs debugging.

module.exports = {
  name: 'daily',
  aliases: [ ],
  guildOnly: true,
  group: '**__Économie__**',
  description: 'Retrieve your daily reward <3',
  requiresDatabase: true,
  examples: [
    'daily'
  ],
  run: (client, message) => profile.findById(message.author.id, async (err,doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, Vous n'avez pas encore de *portefeuille*! Pour en créer un, tapez \`${client.prefix}register\`.`);
    } else {

      const now = Date.now();
      const baseamount = 500;
      const previousStreak = doc.data.economy.streak.current;
      const hasvoted = await client.votes.top_gg?.api.hasVoted(message.author.id);
      const rewardables = market.filter(x => ![1,2].includes(x.id));
      const item = rewardables[Math.floor(Math.random() * rewardables.length)];
      let overflow = false, excess = null, streakreset = false, itemreward = false;

      if (doc.data.economy.streak.timestamp !== 0 && doc.data.economy.streak.timestamp - now > 0){
        return message.channel.send(`\\❌ **${message.author.tag}**, Vous avez déjà reçu votre récompense quotidienne! \nVous pouvez obtenir votre prochaine récompense quotidienne dans ${moment.duration(doc.data.economy.streak.timestamp - now, 'milliseconds').format('H [heurs,] m [minutes, et] s [seconds]')}`);
      };

      if ((doc.data.economy.streak.timestamp + 864e5) < now){
        doc.data.economy.streak.current = 0;
        streakreset = true;
      };

      if (!streakreset){
        doc.data.economy.streak.current++
        if (!(doc.data.economy.streak.current%10)){
          itemreward = true;
          const old = doc.data.profile.inventory.find(x => x.id === item.id);
          if (old){
            const inv = doc.data.profile.inventory;
            let data = doc.data.profile.inventory.splice(inv.findIndex(x => x.id === old.id),1)[0];
            data.amount += 1;
            doc.data.profile.inventory.push(data)
          } else {
            doc.data.profile.inventory.push({
              id: item.id,
              amount: 1
            });
          };
        };
      };

      if (doc.data.economy.streak.alltime < doc.data.economy.streak.current){
        doc.data.economy.streak.alltime = doc.data.economy.streak.current;
      };

      doc.data.economy.streak.timestamp = now + 72e6;
      const amount = baseamount + 30 * doc.data.economy.streak.current;

      if (doc.data.economy.wallet + amount > 5e4){
        overflow = true
        excess = doc.data.economy.wallet + amount - 5e4;
      };

      doc.data.economy.wallet = overflow ? 5e4 : doc.data.economy.wallet + amount;

      // Include the streak state and overflow state in the confirmation message
      return doc.save()
      .then(() => message.channel.send([
        `\\✔️ **${message.author.tag}**, Tu as obtenue **${text.commatize(amount)}** de récompense quotidienne.`,
        itemreward ? `\n\\✔️**Vous avez reçu un élément de profil!**: Tu as reçu **x1 ${item.name} - ${item.description}** des récompenses quotidiennes. Il a été ajouté à votre inventaire!` : '',
        overflow ? `\n\\⚠️ **Avertissement de débordement**: Votre portefeuille vient de déborder! Vous devez transférer une partie de vos crédits à votre banque!` : '',
        streakreset ? `\n\\⚠️ **Série perdue **: Vous n'avez pas votre récompense quotidienne réussie. Votre séquence est réinitialisée (x1).` : `\n**Traînée x${doc.data.economy.streak.current}**`,
        hasvoted === false ? `\n\\⚠️ **Votez pour obtenir des récompenses**: votez maintenant pour recevoir des récompenses supplémentaires! -> <https://top.gg/bot/688407554904162365/vote>` : ''
      ].join('')))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
    };
  })
};
