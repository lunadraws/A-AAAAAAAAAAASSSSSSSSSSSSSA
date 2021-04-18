module.exports = {
  name: 'softlockdown',
  aliases: [ 'softlock', 'softld', 'softlockchannel' ],
  guildOnly: true,
  permissions: [ 'MANAGE_MESSAGES', 'MANAGE_CHANNELS' ],
  clientPermissions: [ 'MANAGE_CHANNELS' ],
  group: '__**modération**__',
  description: `[Prevent/Allow] users without special permissions from sending messages in the current channel. Permission Overwrites will be kept.`,
  examples: [
    'softlockdown',
    'softlock'
  ],
  run: (client, message) => message.channel.updateOverwrite(
    message.guild.roles.everyone,
    {
      SEND_MESSAGES: !message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')
    },
    `HorizonGame Soft-Lockdown: ${message.author.tag}`)
  .then((ch) => message.channel.updateOverwrite(client.user, { SEND_MESSAGES: true }))
  .then((ch) => message.channel.send(
    ch.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')
    ? '\\✔️ Verrouillage terminé! Tout le monde peut désormais envoyer des messages sur cette chaîne'
    : '\\✔️ Le verrouillage a commencé! Les utilisateurs sans rôles ni autorisations spéciales ne pourront pas envoyer de messages ici!'
  )).catch(() => message.channel.send(
    message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')
    ? '\\❌ Impossible de verrouiller en douceur ce salon!'
    : '\\❌ Impossible de restaurer ce salon!'
  ))
};
