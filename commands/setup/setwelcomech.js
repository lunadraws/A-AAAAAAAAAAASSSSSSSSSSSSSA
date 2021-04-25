const { MessageEmbed } = require('discord.js');
const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'setwelcomech',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: '**__Configuration__**',
  description: 'Set up the welcome channel',
  requiresDatabase: true,
  parameters: ['Channel ID/Mention'],
  examples: [
    'setwelcomech 72838485961627384',
    'setwelcomech #member-joins'
  ],
  run: (client, message, [channel='']) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    const channelID = (channel.match(/\d{17,19}/)||[])[0];
    channel = message.guild.channels.cache.get(channelID);

    if (!channel || channel.type !== 'text'){
      return message.channel.send(`\\❌ **${message.member.displayName}**, veuillez fournir un identifiant de salon ou une mention de salon valide.`);
    } else if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
      return message.channel.send(`\\❌ **${message.member.displayName}**, J'ai besoin que vous me donniez la permission d'envoyer des messages sur ${channel} et essayez à nouveau.`);
    } else if (!channel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
      return message.channel.send(`\\❌ **${message.member.displayName}**, J'ai besoin que vous m'autorisiez à intégrer des liens sur ${channel} et essayez à nouveau`);
    };

    doc.greeter.welcome.channel = channel.id;
    return doc.save()
    .then(() => {
      const profile = client.guildProfiles.get(message.guild.id);
      profile.greeter.welcome.channel = doc.greeter.welcome.channel;

      return message.channel.send(
        new MessageEmbed()
        .setColor('GREEN')
        .setFooter(`Member Greeter | \©️${new Date().getFullYear()} Horizongame`)
        .setDescription([
          '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
          `Définit avec succès le canal de bienvenue sur ${channel}!\n\n`,
          !profile.greeter.welcome.isEnabled ? `\\⚠️ L'accueil de bienvenue est désactivé! Pour activer, tapez \`${client.prefix}welcometoggle\`\n` :
          `Pour désactiver cette fonction, utilisez la commande \`${client.prefix}welcometoggle\``
        ].join(''))
      );})
    .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`))
  })
};
