const profile = require('../../models/Profile');

module.exports = {
  name: 'userxpreset',
  aliases: ['resetuserxp','resetxpuser'],
  guildOnly: true,
  adminOnly: true,
  group: '**__Configuration__**',
  description: 'Reset the xp of a particular user in this server.',
  requiresDatabase: true,
  parameters: [ 'User Mention/ID' ],
  examples: [
    'userxpreset @user',
    'resetuserxp 782939405931123456'
  ],
  run: async (client, message ) => {
    const match = message.content.match(/\d{17,19}/)?.[0] || ' ';

    if (!match){
      return message.channel.send(`\\❌ **${message.author.tag}**, Veuillez mentionner l'utilisateur dont XP doit être réinitialisé.`);
    };

    const member = await message.guild.members.fetch(match).catch(() => {});

    if (!member){
      return message.channel.send(`\\❌ **${message.author.tag}**, Impossible de trouver ce membre sur ce serveur!`);
    } else if (member.user.bot){
      return message.channel.send(`\\❌ **${message.author.tag}**, Un bot ne peut pas gagner de points d'expérience!`);
    };

    await message.channel.send(`Cela va **réinitialiser** les points d'expérience de **${member.displayName}** sur ce serveur (Action irréversible). Continuer?`);
    const collector = message.channel.createMessageCollector( res => message.author.id === res.author.id );

    const continued = await new Promise( resolve => {
      const timeout = setTimeout(()=> collector.stop('TIMEOUT'), 30000)
      collector.on('collect', (message) => {
        if (['y','yes'].includes(message.content.toLowerCase())) return resolve(true)
        if (['n','no'].includes(message.content.toLowerCase())) return resolve(false)
      });
      collector.on('end', () => resolve(false));
    });

    if (!continued){
      return message.channel.send(`\\❌ **${message.author.tag}**, annulé la commande userxpreset!`);
    };

    return profile.findById(member.id, (err, doc) => {

      if (err){
        return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
      } else if (!doc){
        return message.channel.send(`\\❌ **${message.author.tag}**, **${member.user.tag}** n'a pas commencé à gagner de xp!`);
      };

      const index = doc.data.xp.findIndex(x => x.id === message.guild.id);

      if (index < 0){
        return message.channel.send(`\\❌ **${message.author.tag}**, **${member.user.tag}** n'a pas commencé à gagner de xp!`);
      };

      doc.data.xp.splice(index, 1);

      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${member.user.tag}**'s Les points d'expérience ont été réinitialisés avec succès!`))
      .catch(() => message.channel.send(`\\❌ **${member.user.tag}**'s La tentative de réinitialisation des points d'expérience a échoué!`))
    });
  }
};
