const { MessageEmbed } = require('discord.js');
const profile = require('../models/Profile');
const text = require('../util/string');

module.exports = (client, req, res) => profile.findById(req.vote.user, async (err, doc) => {

  const user = await client.users.fetch(req.vote.user).catch(()=>{ return {}});
  const isWeekend = req.vote.isWeekend;
  const reward =  isWeekend ? 1500 : 750;
  const reason = [
    'une erreur s\'est produite lors de l\'accès à votre profil à partir de la base de données!',
    'vous ne vous êtes pas d\'abord inscrit au système économique. Utilisez la commande `register` pour vous inscrire et recevoir des récompenses de vote.'
  ];

  if (err){
    return user?.send([
      `\\❌ | **${user.tag}**, il semble que tu m'as voté sur top.gg, mais ${reason[0]}`,
      `Si vous recevez ce message, veuillez contacter FloxYTB#9674 immédiatement. Préparez également une capture d'écran de ce message.`
    ].join('\n')).catch(() => {
      return console.log(`[VOTE_EVENT]: Impossible d'envoyer le message à l'utilisateur ${req.vote.user}`);
    });
  };

  if (!doc){
    return user?.send([
      `\\❌ | **${user.tag}**, il semble que tu m'as voté sur top.gg, mais ${reason[1]}`
    ].join()).catch(() => {
      return console.log(`[VOTE_EVENT]: Impossible d'envoyer le message à l'utilisateur ${req.vote.user}`);
    });
  };

  let overflow = false, excess = null;

  if (doc.data.economy.wallet + reward > 5e4){
    overflow = true;
    excess = doc.data.economy.wallet + amount - 5e4;
  };

  doc.data.economy.wallet += overflow ? reward - excess : reward;

  return doc.save()
  .then(() => {
    const message = [
      `<a:animatedcheck:758316325025087500> | **${user.tag}**, Merci d'avoir voté!`,
      `Tu as reçu **${text.commatize(reward)}** ${isWeekend ? '**(Récompense double week-end)**' : ''} des crédits en récompense!`,
      overflow ? `\n⚠️Avertissement de débordement! Veuillez déposer une partie de votre compte dans votre **banque**. Vous avez seulement reçu ${reward - excess} pour celui-ci!` :'',
      `Vous ne voulez pas être informé de chaque vote que vous faites? Utilisez la commande \`${client.prefix}togglevotenotif\` pour enable/disable vote notifications!\n(Ne vous empêche pas de recevoir des récompenses)`
    ].join('\n')

    if (doc.data.vote.notification){
      user?.send(message).catch(()=>{
        return console.log(`[VOTE_EVENT]: Impossible d'envoyer le message à l'utilisateur ${req.vote.user}`);
      });
    };

    return;
  });
});
