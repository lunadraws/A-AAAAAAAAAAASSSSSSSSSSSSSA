const { MessageEmbed } = require('discord.js');
const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'setmute',
  aliases: [ 'setmuterole' ],
  guildOnly: true,
  adminOnly: true,
  group: '**__Configuration__**',
  description: 'Set up the mute role.',
  requiresDatabase: true,
  parameters: ['Role <ID/Mention/Name>'],
  examples: [
    'setmute @muted',
    'setmute 73847566859304855',
    'setmute muted'
  ],
  run: (client, message, [ role ]) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    const guildprofile = client.guildProfiles.get(message.guild.id);

    if (!role){
      if (!guildprofile?.roles?.muted){
        return message.channel.send(`\\❌ **${message.author.tag}**, Muterole non définie!`);
      } else {
        const role = message.guild.roles.cache.get(guildprofile.roles.muted);
        if (!role){
          return message.channel.send(`\\❌ **${message.author.tag}**, Impossible de trouver le muterole désigné de ce serveur!`);
        } else {
          return message.channel.send(`**${message.author.tag}**, la muterole actuelle est ${role}`);
        };
      };
    } else {
      role = message.guild.roles.cache.get((role.match(/\d{17,19}/)||[])[0]) ||
      message.guild.roles.cache.find(r => r.name === role);

      if (!role){
        return message.channel.send(`\\❌ **${message.author}**, Rôle non valide - Veuillez fournir la mention du rôle, l'ID du rôle ou son nom de rôle.`)
      } else {

        if (!guildprofile){
          client.guildProfiles.set(message.guild.id, doc);
        } else {
          // do nothing..
        };

        doc.roles.muted = role.id;

        return doc.save()
        .then(() => {
          client.guildProfiles.get(message.guild.id).roles.muted = doc.roles.muted;
          return message.channel.send(`\\✔️ **${message.author.tag}**, Réglez avec succès la muterole sur ${role}!`);
        }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`))
      };
    };
  })
};
