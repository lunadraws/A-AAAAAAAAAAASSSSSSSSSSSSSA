const moment = require('moment');
const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'tip',
  aliases: [ ],
  guildOnly: true,
  group: '**__Économie__**',
  description: 'Give tip to your friends!',
  requiresDatabase: true,
  parameters: [ 'User Mention/ID'],
  examples: [
    'tip @user',
    'tip 87374756574839348'
  ],
  run: (client, message, [user='']) => profile.findById(message.author.id, async (err, tipper) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`);
    } else if (!tipper){
      tipper = new profile({ _id: member.id });
    };

    const now = Date.now();

    if (tipper.data.tips.timestamp !== 0 && tipper.data.tips.timestamp - now > 0){
      return message.channel.send(`\\❌ **${message.author.tag}**, vous avez déjà utilisé votre pourboire. Vous pouvez attendre ${moment.duration(tipper.data.tips.timestamp - now).format('H [heurs,] m [minutes, and] s [seconds]')} donner à nouveau un pourboire à quelqu'un.`);
    } else if (!user){
      return message.channel.send(`\\✔️ **${message.author.tag}**, vous pouvez maintenant donner un pourboire à quelqu'un de ce serveur!`);
    };

    const member = await message.guild.members
    .fetch(user.match(/\d{17,19}/)?.[0] || 'let-fetch-fail')
    .catch(() => {});

    if (!member){
      return message.channel.send(`\\❌ **${message.author.tag}**, n'a pas pu ajouter de pourboire à cet utilisateur. Raison: utilisateur introuvable!`);
    } else if (member.id === message.author.id){
      return message.channel.send(`\\❌ **${message.author.tag}**, vous ne pouvez pas vous donner de pourboire!`);
    } else if (member.user.bot){
      return message.channel.send(`\\❌ **${message.author.tag}**, vous ne pouvez pas donner de pourboire à un bot!`);
    };

    return profile.findById(member.id, async (err, doc) => {
      if (err){
        return message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`);
      } else if (!doc){
        doc = new profile({ _id: member.id });
      };

      const amount = 350;
      let overflow = false, excess = null, unregistered = false;

      if (doc.data.economy.wallet === null){
        unregistered = true;
      } else if (doc.data.economy.wallet + amount > 50000){
        overflow = true;
        excess = doc.data.economy.wallet + amount - 50000;
        doc.data.economy.wallet = 50000;
      } else {
        doc.data.economy.wallet += amount;
      };

      tipper.data.tips.timestamp = now + 432e5;
      tipper.data.tips.given++;
      doc.data.tips.received++;

      return Promise.all([ doc.save(), tipper.save() ])
      .then(() => message.channel.send([
        `\\✔️ **${message.author.tag}**, pourboire **${amount}** pour **${member.user.tag}**.`,
        overflow ? `\n\\⚠️ **Avertissement de débordement**: **${member.user.tag}**'s wallet juste débordé! Vous devez transférer une partie de vos crédits à votre banque!` : '',
        unregistered ? `\n\\⚠️ **Non enregistré**: **${member.user.tag}** n'est pas enregistré, les crédits bonus ne seront pas ajoutés.` : ''
      ].join('')))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`))
    });
  })
};
