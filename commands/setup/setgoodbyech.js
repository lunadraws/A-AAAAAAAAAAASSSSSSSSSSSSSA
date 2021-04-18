const { MessageEmbed } = require('discord.js');
const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'setgoodbyech',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: '**__Configuration__**',
  description: 'Set up the goodbye channel',
  requiresDatabase: true,
  parameters: ['Channel ID/Mention'],
  examples: [
    'setgoodbyech #member-leaves',
    'setgoodbyech 728374657482937465'
  ],
  run: (client, message, [channel='']) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    const channelID = (channel.match(/\d{17,19}/)||[])[0];
    channel = message.guild.channels.cache.get(channelID);

    if (!channel || channel.type !== 'text'){
      return message.channel.send(`\\❌ **${message.member.displayName}**, please provide a valid channel ID or channel mention.`);
    } else if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
      return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`);
    } else if (!channel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
      return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`);
    };

    doc.greeter.leaving.channel = channel.id;
    return doc.save()
    .then(() => {
      const profile = client.guildProfiles.get(message.guild.id);
      profile.greeter.leaving.channel = doc.greeter.leaving.channel;

      return message.channel.send(
        new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setFooter(`Annonceur membre sortant | \©️${new Date().getFullYear()} HorizonGame`)
        .setDescription([
          '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
          `Définit avec succès le salon au revoir sur ${channel}!\n\n`,
          !profile.greeter.leaving.isEnabled ? `\\⚠️ L'accueil de bienvenue est désactivé! Pour activer, tapez \`${client.prefix}goodbyetoggle\`\n` :
          `Pour désactiver cette fonction, utilisez la commande \`${client.prefix}goodbyetoggle\``
        ].join(''))
      );})
    .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard! `))
  })
};
