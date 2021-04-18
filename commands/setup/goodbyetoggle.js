const { MessageEmbed } = require('discord.js');
const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'goodbyetoggle',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: '**__Configuration__**',
  description: 'Toggle the \`Leaving Member Announcer\` on and off.',
  requiresDatabase: true,
  examples: [
    'goodbyetoggle'
  ],
  run: (client, message) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    };

    if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    doc.greeter.leaving.isEnabled = !doc.greeter.leaving.isEnabled;

    doc.save()
    .then(() => {
      const state = ['Disabled', 'Enabled'][Number(doc.greeter.leaving.isEnabled)];
      const profile = client.guildProfiles.get(message.guild.id);
      profile.greeter.leaving.isEnabled = doc.greeter.leaving.isEnabled;

      return message.channel.send(
        new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setFooter(`Annonceur membre sortant | \©️${new Date().getFullYear()} HorizonGame`)
        .setDescription([
          '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
          `La fonctionnalité de départ de l'annonceur de membre a été réussie **${state}**!\n\n`,
          `Pour **${!doc.greeter.leaving.isEnabled ? 're-enable' : 'disable'}** ce`,
          `fonctionnalité, utilisez la commande \`${client.prefix}goodbyetoggle\``,
          !profile.greeter.leaving.message ? '\n\u2000 \\⚠️ Le message LMA n\'a pas été configuré.' : '',
          !profile.greeter.leaving.channel ? `\n\u2000 \\⚠️ Le salon LMA n'a pas été défini! Définissez-en un en utilisant la commande \`${client.config.prefix}setgoodbyech\`` : ''
        ].join(' '))
      );}).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`));
  })
};
