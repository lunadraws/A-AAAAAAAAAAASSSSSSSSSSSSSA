const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'setsuggestch',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: '**__Configuration__**',
  description: 'Set up the suggestion channel',
  requiresDatabase: true,
  parameters: ['Channel ID/Mention'],
  examples: [
    'setsuggestch 6273849506948347573',
    'setsuggestch #suggestions'
  ],
  run: (client, message, [channel]) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc){
      doc = new list({ _id: message.guild.id });
    };

    const channelID = (channel.match(/\d{17,19}/)||[])[0];
    channel = message.guild.channels.cache.get(channelID);

    if (!channel || channel.type !== 'text'){
      return message.channel.send(`\\❌ **${message.member.displayName}**, veuillez fournir un identifiant de salon ou une mention de salon valide.`);
    } else if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
      return message.channel.send(`\\❌ **${message.member.displayName}**, J'ai besoin que vous me donniez la permission d'envoyer des messages sur ${channel} et essayez à nouveau.`);
    } else if (!channel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
      return message.channel.send(`\\❌ **${message.member.displayName}**, J'ai besoin que vous m'autorisiez à intégrer des liens sur ${channel} et essayez à nouveau.`);
    };

    doc.channels.suggest = channel.id;
    return doc.save()
    .then(() => {
      client.guildProfiles.get(message.guild.id).featuredChannels.suggest = channel.id;
      return message.channel.send(`\\✔️ Définit avec succès le salon de suggestion sur ${channel}!`);
    })
    .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Impossible d'enregistrer le document dans la base de données, veuillez réessayer plus tard!`))
  })
};
