module.exports = {
  name: 'kick',
  aliases: [],
  guildOnly: true,
  permissions: [ 'KICK_MEMBERS' ],
  clientPermissions: [ 'KICK_MEMBERS' ],
  group: '__**modération**__',
  description: 'Kick mentioned user from this server.',
  parameters: [ 'User Mention | ID', 'Kick Reason'],
  examples: [
    'kick @user breaking server rules',
    'kick @user',
    'kick 7827342137832612783'
  ],
  run: async (client, message, [member = '', ...reason] ) => {

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`\\❌ | ${message.author}, Veuillez fournir l'ID ou mentionner l'utilisateur à exclure. [mentionner d'abord avant d'ajouter la raison]`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`\\❌ | ${message.author}, L'utilisateur n'a pas pu être trouvé! Veuillez vous assurer que la pièce d'identité fournie est valide. Mentionnez l'utilisateur pour plus de précision sur la localisation de l'utilisateur.`);
    };

    if (member.id === message.author.id){
      return message.channel.send(`\\❌ | ${message.author}, Vous ne pouvez pas vous expulsez!`);
    };

    if (member.id === client.user.id){
      return message.channel.send(`\\❌ | ${message.author}, S'il te plait ne me kick pas!`);
    };

    if (member.id === message.guild.ownerID){
      return message.channel.send(`\\❌ | ${message.author}, Vous ne pouvez pas kick un propriétaire de serveur!`);
    };

    if (client.config.owners.includes(member.id)){
      return message.channel.send(`\\❌ | ${message.author}, Non, vous ne pouvez pas kick mes développeurs à travers moi!`)
    };

    if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`\\❌ | ${message.author}, Vous ne pouvez pas expulser cet utilisateur! Il / Elle a un rôle plus élevé que le vôtre`)
    };

    if (!member.kickable){
      return message.channel.send(`\\❌ | ${message.author}, Je ne pouvais pas kick cet utilisateur!`);
    };

    await message.channel.send(`Etes-vous sûr de vouloir kick **${member.user.tag}**? (y/n)`)

    const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
    const options = { max: 1, time: 30000, errors: ['time'] };
    const proceed = await message.channel.awaitMessages(filter, options)
    .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
    .catch(() => false);

    if (!proceed){
      return message.channel.send(`\\❌ | ${message.author}, commande kick annulé!`);
    };

    await member.send(`**${message.author.tag}** vous a viré de ${message.guild.name}!\n**Raison**: ${reason.join(' ') || 'Unspecified.'}`)
    .catch(() => null);

    return member.kick({ reason: `HorizonGame Kick: ${message.author.tag}: ${reason.join(' ') || 'Unspecified'}`})
    .then(_member => message.channel.send(`\\✔️ kick avec succès **${_member.user.tag}**`))
    .catch(() => message.channel.send(`\\❌ Échec du kick **${member.user.tag}**!`));
  }
};
