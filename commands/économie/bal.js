const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'bal',
  aliases: [ 'balance', 'credits' ],
  guildOnly: true,
  group: '**__Économie__**',
  clientPermissions: [ 'EMBED_LINKS' ],
  description: 'Check your wallet, how much have you earned?',
  requiresDatabase: true,
  examples: [
    'bal',
    'balance',
    'credits'
  ],
  run: (client, message) => profile.findById(message.author.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`<a:a_ERROR:828230829687046155> [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    };

    if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\<a:a_ERROR:828230829687046155> **${message.member.displayName}**, vous n'avez pas encore de portefeuille! Pour en créer un, tapez \`${client.prefix}register\`.`);
    };

    return message.channel.send(
      new MessageEmbed().setDescription(
        `\u200B\n<a:emoji_49:832655502961934337> **${
          text.commatize(doc.data.economy.wallet)
        }** crédits en possession.\n\n${
          doc.data.economy.bank !== null
          ? `<a:emoji_50:832655556635525150> **${text.commatize(doc.data.economy.bank)}** crédits en banque!`
          : `On dirait que vous n'avez pas encore de banque. Créez-en un maintenant en tapant \`${
            client.config.prefix
          }bank\``
        }\n\nSérie quotidienne: **${doc.data.economy.streak.current}** (Meilleur de tous les temps: **${doc.data.economy.streak.alltime}**)`
      ).setAuthor(`${message.member.displayName}'s portefeuille`)
      .setColor(message.guild.me.displayHexColor)
      .setThumbnail(message.author.displayAvatarURL({dynamic: 'true'}))
      .setFooter(`Solde du profil | \©️${new Date().getFullYear()} HorizonGame`)
    );
  })
};
