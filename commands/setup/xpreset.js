const profile = require('../../models/Profile');

module.exports = {
  name: 'xpreset',
  aliases: [ 'resetxp', 'resetserverxp' ],
  guildOnly: true,
  adminOnly: true,
  rankcommand: true,
  group: '**__Configuration__**',
  description: 'Resets the xp of all users for this server',
  requiresDatabase: true,
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'xpreset'
  ],
  run: async (client, message ) => {

    await message.channel.send(`Cela va **réinitialiser** tous les points d'expérience de ce serveur (action irréversible). Continuer? (y/n)`);
    const collector = message.channel.createMessageCollector( res => message.author.id === res.author.id);

    const continued = await new Promise(resolve => {
      setTimeout(()=> collector.stop('TIMEOUT'), 30000);
      collector.on('collect', message => {
        if (['y','yes'].includes(message.content.toLowerCase())) return resolve(true);
        if (['n','no'].includes(message.content.toLowerCase())) return resolve(false);
      }).on('end', () => resolve(false));
    });

    if (!continued){
      return message.channel.send(`\\❌ **${message.author.tag}**, annulé la commande xpreset!`);
    };


    return profile.updateMany({'data.xp.id': message.guild.id }, {
      $pull: { 'data.xp' : { id: message.guild.id }}
    }, (err, res) => {
      if (err){
        return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
      } else if (res.nModified == 0){
        return message.channel.send(`\\❌ **${message.author.tag}**, ce serveur n'a pas de données xp à effacer!`);
      } else {
        return message.channel.send(`\\✔️ **${message.author.tag}**, xp de ce serveur a été réinitialisé. (Effacé **${res.nModified}** xpdocs)`);
      };
    });
  }
};
