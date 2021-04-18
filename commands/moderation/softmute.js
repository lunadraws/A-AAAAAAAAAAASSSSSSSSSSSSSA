module.exports = {
  name: 'softmute',
  aliases: [ ],
  guildOnly: true,
  permissions: [ 'MANAGE_ROLES' ],
  group: '__**modération**__',
  description: 'Toggle to prevent a user from sending a message in this channel',
  parameters: [ 'User Mention | ID' ],
  examples: [
    'softmute @user',
    'softmute 7783454657483920192'
  ],
  run: async (client, message, [member = '']) => {

    const muteID = (client.guildProfiles
    .get(message.guild.id) || {})
    .roles.muted;

    const muted = message.guild.roles.cache.get(muteID) || {};

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`\\❌ Veuillez fournir l'ID ou mentionner l'utilisateur à désactiver.`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`\\❌ Impossible de softmute l'utilisateur: utilisateur introuvable.`);
    } else if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`\\❌ ${message.author}, vous ne pouvez pas softmute un utilisateur dont les rôles sont supérieurs aux vôtres!`);
    } else if (member.id === client.user.id){
      return message.channel.send(`\\❌ ${message.author}, non ne me softmute pas!`);
    } else if (member.user.bot){
      return message.channel.send(`\\❌ ${message.author}, vous ne pouvez pas softmute les bots!`);
    } else if (message.member.id === member.id){
      return message.channel.send(`\\❌ ${message.author}, vous ne pouvez pas vous softmute!`);
    } else if (member.roles.cache.has(muted.id)){
      return message.channel.send(`\\❌ ${message.author}, **${member.user.tag}** est déjà softmute à l'échelle du serveur!`);
    };

    return message.channel.updateOverwrite(member, {
      SEND_MESSAGES: !message.channel.permissionsFor(member).has('SEND_MESSAGES')
    }).then((ch) => message.channel.send(
      ch.permissionsFor(member).has('SEND_MESSAGES')
      ? `\\✔️ **${member.user.tag}** a été réactivé sur ce salon!`
      : `\\✔️ **${member.user.tag}** a été désactivé depuis ce salon!`
    )).catch(() => message.channel.send(
      message.channel.permissionsFor(member).has('SEND_MESSAGES')
      ? `\\❌ Unable to mute **${member.user.tag}** sur ce salon!`
      : `\\❌ Unable to unmute **${member.user.tag}** sur ce salon!`
    ));
  }
};
