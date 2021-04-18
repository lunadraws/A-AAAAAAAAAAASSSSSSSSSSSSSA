const text = require('../../util/string');

module.exports = {
  name: 'mute',
  aliases: [ 'deafen', 'silence', 'shut' ],
  guildOnly: true,
  permissions: [ 'MANAGE_ROLES' ],
  group: '__**modération**__',
  description: 'Prevents a user from sending a message in this server',
  parameters: [ 'User Mention | ID' ],
  examples: [
    'mute @user',
    'mute 798213718237181231'
  ],
  run: async (client, message, [member = ''] ) => {

    const muteID = (client.guildProfiles
    .get(message.guild.id) || {})
    .roles.muted;

    if (!muteID){
      return message.channel.send('\\❌ Le muterole n\'est pas encore défini! Faites-le en utilisant la commande `setmute`.');
    };

    const muted = message.guild.roles.cache.get(muteID);

    if (!muted){
      return message.channel.send('\\❌ Impossible de trouver le jeu de rôles pour les membres en sourdine! Définissez-en un nouveau en utilisant la commande `setmute`.');
    };

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`\\❌ Veuillez fournir l'ID ou mentionner l'utilisateur à désactiver.`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`\\❌ Impossible de désactiver l'utilisateur: utilisateur introuvable.`);
    } else if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`\\❌ ${message.author}, vous ne pouvez pas désactiver l'utilisateur dont les rôles sont plus élevés que les vôtres!`)
    } else if (member.id === client.user.id){
      return message.channel.send(`\\❌ ${message.author}, non ne me mute pas!`);
    } else if (member.user.bot){
      return message.channel.send(`\\❌ ${message.author}, vous ne pouvez pas mute les bots!`);
    } else if (message.member.id === member.id){
      return message.channel.send(`\\❌ ${message.author}, vous ne pouvez pas vous mute!`);
    } else if (member.roles.cache.has(muted.id)){
      return message.channel.send(`\\❌ ${message.author}, **${member.user.tag}** est déjà mute!`)
    };

    let _warn = ''
    // Checking if the muterole is a suitable muterole by checking if this disables
    // the send message permission
    if (muted.permissions.has('SEND_MESSAGES')){
      _warn = _warn + '\\⚠️ Le rôle désactivé sélectionné ne désactive pas les utilisateurs pour envoyer des messages, veuillez modifier l\'autorisation du rôle!\n'
    };

    // Checking if every role above the position of the mute role the use has
    // have a permission to send message, this will invalidate the function of
    // the mute command if they have one.
    let warns = member.roles.cache.filter(role => role.position > muted.position)
    .filter(role => role.permissions.has('SEND_MESSAGES'))
    .map(role => role.toString());

    if (warns.length){
      _warn = _warn + `\\⚠️ **${member.user.tag}** peut encore parler parce qu'il a le ${text.joinArray(warns)} rôle (s) qui accordent des autorisations pour envoyer des messages.`;
    };

    return member.roles.add(muted)
    .then(member => message.channel.send(`\\✔️ mute avec succès **${member.user.tag}**\n${_warn}`))
    .catch(() => message.channel.send(`\\❌ Échec du mute  **${member.user.tag}**.`))
  }
};
