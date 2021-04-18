const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'pay',
  aliases: [ 'transfer' ],
  guildOnly: true,
  group: '**__Économie__**',
  description: 'Transfer some of your credits to your friends!',
  requiresDatabase: true,
  parameters: [ 'User ID/Mention', 'Amount' ],
  examples: [
    'transfer @user 5000',
    'transfer 768564403847563546 10000'
  ],
  run: (client, message, [ friend='', amount='' ]) => profile.findById(message.author.id, async (err, doc) => {

    const fr = friend;
    friend = await message.guild.members.fetch(friend.match(/\d{17,19}/)?.[0]||' ')
    .catch(()=>{});

    amount = Math.round(amount.split(',').join('')) || 'Nothing';

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: \`${err.name}\``);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, Vous n'avez pas encore de **portefeuille**!\nPour en créer un, tapez \`${client.prefix}register\`.`);
    } else if (doc.data.economy.bank === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, Vous n'avez pas encore de **banque**!\nPour en créer un, tapez \`${client.prefix}bank\`.`);
    } else if (!fr){
      return message.channel.send(`\\❌ **${message.author.tag}**, veuillez spécifier l'utilisateur auquel vous souhaitez attribuer des crédits!`);
    } else if (!friend){
      return message.channel.send(`\\❌ **${message.author.tag}**, Je n'ai pas pu trouver \`${fr}\` dans ce serveur!`);
    } else if (!amount || amount === 'Nothing'){
      return message.channel.send(`\\❌ **${message.author.tag}**, **${amount}** n'est pas un montant valide!`);
    } else if (amount < 100 || amount > 20000){
      return message.channel.send(`\\❌ **${message.author.tag}**, seul le montant valide à transférer est compris entre **100** et **20 000**!`);
    } else if (Math.ceil(amount * 1.1) > doc.data.economy.bank){
      return message.channel.send(`\\❌ **${message.author.tag}**, Crédits insuffisants! Vous avez seulement **${text.commatize(doc.data.economy.bank)}** dans votre banque! (Des frais de 10% s'appliquent)`);
    };

    const friendName = friend.user.tag;
    friend = await profile.findById(friend.id).catch(err => err);

    if (!friend || friend.data.economy.bank === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, **${friendName}** doesn't have a bank yet! He is not yet eligible to receive credits!`);
    };

    doc.data.economy.bank = doc.data.economy.bank - Math.floor(amount * 1.1);
    friend.data.economy.bank = friend.data.economy.bank + amount;

    return Promise.all([ doc.save(), friend.save() ])
    .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, transféré avec succès **${amount}** a **${friendName}**`))
    .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: \`${err.name}\``));
  })
};
