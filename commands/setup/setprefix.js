const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'setprefix',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: '**__Configuration__**',
  description: 'Set up custom prefix for this server.',
  requiresDatabase: true,
  parameters: [ 'prefix' ],
  examples: [
    'setprefix ?'
  ],
  run: (client, message, [prefix]) => guilds.findById(message.guild.id, (err, doc) => {

    if (!prefix){
      return message.channel.send(`\\❌ **${message.author.tag}**, Aucun nouveau préfixe détecté! Veuillez saisir le nouveau préfixe.`);
    } else if (prefix.length > 5){
      return message.channel.send(`\\❌ **${message.author.tag}**, Préfixe invalide. Les préfixes ne peuvent pas dépasser 5 caractères!`);
    } else {

      if (err){
        return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
      } else if (!doc){
        doc = new guilds({ _id: message.guild.id });
      };

      doc.prefix = [prefix, null][Number(!!prefix.match(/clear|reset/i))];

      return doc.save()
      .then(() => {
        client.guildProfiles.get(message.guild.id).prefix = doc.prefix;
        return message.channel.send([
          `\\✔️ **${message.author.tag}**, Avec succès`,
          [
            'supprimé le préfixe de ce serveur! \nPour ajouter un préfixe, passez simplement le préfixe souhaité en paramètre.',
            `définir le préfixe de ce serveur sur \` ${doc.prefix} \`!\nPour supprimer le préfixe, il suffit de passer \`reset\` ou \`clear\` comme paramètre.`
          ][Number(!!doc.prefix)]
        ].join(' '));
      }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
    };
  })
};
