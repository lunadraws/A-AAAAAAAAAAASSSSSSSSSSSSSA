const { MessageEmbed } = require('discord.js');
const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'xptoggle',
  aliases: ['togglexp'],
  guildOnly: true,
  adminOnly: true,
  group: '**__Configuration__**',
  description: 'Toggle the xp system on/off for the server.',
  requiresDatabase: true,
  examples: [
    'xptoggle'
  ],
  run: (client, message) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    doc.xp.isActive = !doc.xp.isActive;

    doc.save()
    .then(() => {
      const state = ['Disabled', 'Enabled'][Number(doc.xp.isActive)];
      const profile = client.guildProfiles.get(message.guild.id);
      profile.xp.isActive = doc.xp.isActive;

      return message.channel.send(
        new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setFooter(`XP | \©️${new Date().getFullYear()} HorizonGame`)
        .setDescription([
          '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
          `La fonctionnalité XP a été réussie **${state}**!\n\n`,
          `Pour **${!doc.xp.isActive ? 're-enable' : 'disable'}** ce`,
          `fonctionnalité, utilisez la commande \`${client.prefix}xptoggle\``
        ].join(' '))
      );}).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
  })
};
