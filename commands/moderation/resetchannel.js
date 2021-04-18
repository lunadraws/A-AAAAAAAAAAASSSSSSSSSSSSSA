module.exports = {
  name: 'resetchannel',
  aliases: [ 'resetch' ],
  guildOnly: true,
  permissions: [ 'MANAGE_CHANNELS' ],
  clientPermissions: [ 'MANAGE_CHANNELS' ],
  group: '__**modération**__',
  description: `Removes all permission overwrites and resets @everyone permissions to \`unset\``,
  examples: [
    'resetchannel',
    'resetch'
  ],
  run: (client, message) => message.channel.overwritePermissions([
    { id: message.guild.roles.everyone.id }
  ])
  .then(ch => message.channel.send('\\✔️ Réinitialisation des autorisations effectuer avec succès.'))
  .catch(() => message.channel.send('\\❌ Impossible de réinitialiser les autorisations pour ce salon.'))
};
