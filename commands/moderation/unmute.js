module.exports = {
  name: 'unmute',
  aliases: [ 'undeafen', 'unsilence', 'speak' ],
  guildOnly: true,
  permissions: [ 'MANAGE_ROLES' ],
  group: '__**modération**__',
  description: 'Unmutes a muted user from this server.',
  parameters: [ 'User Mention | ID' ],
  examples: [
    'unmute @user',
    'unmute 7783746574829102938'
  ],
  run: async (client, message, [member = ''] ) => {

    const muteID = (client.guildProfiles
    .get(message.guild.id) || {})
    .roles.muted;

    if (!muteID){
      return message.channel.send('\\❌ Muterole n\'est pas encore défini! Faites-le en utilisant la commande `setmute`.');
    };

    const muted = message.guild.roles.cache.get(muteID);

    if (!muted){
      return message.channel.send('\\❌ Impossible de trouver le jeu de rôles pour les membres en sourdine! Définissez-en un nouveau en utilisant la commande `setmute`.');
    };

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`\\❌ Veuillez fournir l'ID ou mentionner l'utilisateur à unmute.`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`\\❌ Impossible de unmute l'utilisateur: utilisateur introuvable.`);
    } else if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`\\❌ ${message.author}, vous ne pouvez pas unmute l'utilisateur dont les rôles sont supérieurs aux vôtres!`)
    } else if (member.id === client.user.id){
      return message.channel.send(`\\❌ ${message.author}, Ouais, j'ai été unmute!`);
    } else if (member.user.bot){
      return message.channel.send(`\\❌ ${message.author}, Je ne peux pas unmute les bots!`);
    } else if (message.member.id === member.id){
      return message.channel.send(`\\❌ ${message.author}, pourquoi, tu es déjà unmute!`);
    } else if (!member.roles.cache.has(muted.id)){
      return message.channel.send(`\\❌ ${message.author}, **${member.user.tag}** n'est pas mute!`);
    };

    return member.roles.remove(muted)
    .then(member => message.channel.send(`\\✔️ **${member.user.tag}** a été unmute!`))
    .catch(() => message.channel.send(`\\❌ ${message.author}, Je ne parviens pas à unmute **${member.user.tag}**`));
  }
};
