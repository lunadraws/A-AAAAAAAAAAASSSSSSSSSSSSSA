const { MessageEmbed } = require('discord.js');
const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'welcometoggle',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: '**__Configuration__**',
  description: 'Toggle the \`Member Greeter\` on and off.',
  requiresDatabase: true,
  examples: [
    'welcometoggle'
  ],
  run: (client, message) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    };

    if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    doc.greeter.welcome.isEnabled = !doc.greeter.welcome.isEnabled;

    doc.save()
    .then(() => {
      const state = ['Disabled', 'Enabled'][Number(doc.greeter.welcome.isEnabled)];
      const profile = client.guildProfiles.get(message.guild.id);
      profile.greeter.welcome.isEnabled = doc.greeter.welcome.isEnabled;

      return message.channel.send(
        new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setFooter(`accueil des membres | \©️${new Date().getFullYear()} HorizonGame`)
        .setDescription([
          '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
          `La fonction d'accueil des membres a été réussie **${state}**!\n\n`,
          `Pour **${!doc.greeter.welcome.isEnabled ? 're-enable' : 'disable'}** ce`,
          `fonctionnalité, utilisez la commande \`${client.prefix}welcometoggle\``,
          !profile.greeter.welcome.message ? '\n\u2000 \\⚠️ Le message de bienvenue n\'a pas été configuré.' : '',
          !profile.greeter.welcome.channel ? `\n\u2000 \\⚠️ Le salon de bienvenue n'a pas été défini! Définissez-en un en utilisant la commande \`${client.config.prefix}setwelcomech\`` : ''
        ].join(' '))
      );}).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
  })
};
