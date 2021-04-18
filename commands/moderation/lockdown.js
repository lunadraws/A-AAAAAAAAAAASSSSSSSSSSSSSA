module.exports = {
  name: 'lockdown',
  aliases: [ 'lock', 'ld', 'lockchannel' ],
  guildOnly: true,
  permissions: [ 'MANAGE_MESSAGES', 'MANAGE_CHANNELS' ],
  clientPermissions: [ 'MANAGE_CHANNELS' ],
  group: '__**modération**__',
  description: `[Prevent/Allow] users from sending messages in the current channel. Permission Overwrites will be lost.`,
  examples: [
    'lockdown',
    'lock',
    'ld',
    'lockchannel'
  ],
  run: (client, message) => message.channel.overwritePermissions([
    {
      id: message.guild.roles.everyone.id,
      deny: [ 'SEND_MESSAGES' ].slice(Number(
        !message.channel.permissionsFor(message.guild.roles.everyone)
        .has('SEND_MESSAGES'))),
      allow: [ 'SEND_MESSAGES' ].slice(Number(
        message.channel.permissionsFor(message.guild.roles.everyone)
        .has('SEND_MESSAGES')))
    },
    {
      id: message.guild.me.id,
      allow: [ 'SEND_MESSAGES' ]
    }
  ], `HorizonGame Lockdown: ${message.author.tag}`)
  .then((ch) => message.channel.send(
    ch.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')
    ? '\\✔️ Verrouillage terminé! Tout le monde peut désormais envoyer des messages sur cette chaîne'
    : '\\✔️ Le verrouillage a commencé! Les utilisateurs sans nos autorisations spéciales ne pourront pas envoyer de messages ici!'
  )).catch(() => message.channel.send(
    message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')
    ? '\\❌ Impossible de verrouiller ce salon'
    : '\\❌ Impossible de restaurer ce salon!'
  ))
};
