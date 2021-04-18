module.exports = {
  name: 'ban',
  aliases: [],
  guildOnly: true,
  permissions: [ 'BAN_MEMBERS' ],
  clientPermissions: [ 'BAN_MEMBERS' ],
  group: '__**modération**__',
  description: 'Ban mentioned user from this server.',
  parameters: [ 'User Mention | ID', 'Ban Reason'],
  examples: [
    'ban @user breaking server rules',
    'ban @user',
    'ban 7827342137832612783'
  ],
  run: async (client, message, [member = '', ...reason] ) => {

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`❌ | ${message.author}, Veuillez fournir l'ID ou mentionner l'utilisateur à bannir. [mentionner d'abord avant d'ajouter la raison]`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`❌ | ${message.author}, L'utilisateur n'a pas pu être trouvé! Veuillez vous assurer que la pièce d'identité fournie est valide. Mentionnez l'utilisateur pour plus de précision sur la localisation de l'utilisateur.`);
    };

    if (member.id === message.author.id){
      return message.channel.send(`❌ | ${message.author}, Vous ne pouvez pas vous ban!`);
    };

    if (member.id === client.user.id){
      return message.channel.send(`❌ | ${message.author}, S'il te plait ne me ban pas!`);
    };

    if (member.id === message.guild.ownerID){
      return message.channel.send(`❌ | ${message.author}, Vous ne pouvez pas bannir un propriétaire de serveur!`);
    };

    if (client.config.owners.includes(member.id)){
      return message.channel.send(`❌ | ${message.author}, Non, vous ne pouvez pas ban mes développeurs via moi!`)
    };

    if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`❌ | ${message.author}, Vous ne pouvez pas bannir cet utilisateur! Il / Elle a un rôle plus élevé que le vôtre`)
    };

    if (!member.bannable){
      return message.channel.send(`❌ | ${message.author}, Je ne pouvais pas bannir cet utilisateur!`);
    };

    await message.channel.send(`Êtes-vous sûr de vouloir ban **${member.user.tag}**? (y/n)`)

    const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
    const options = { max: 1, time: 30000, errors: ['time'] };
    const proceed = await message.channel.awaitMessages(filter, options)
    .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
    .catch(() => false);

    if (!proceed){
      return message.channel.send(`❌ | ${message.author}, annule la commande ban!`);
    };

    await member.send(`**${message.author.tag}** vous a banni de ${message.guild.name}!\n**Raison**: ${reason.join(' ') || 'Unspecified.'}`)
    .catch(() => null);

    return member.ban({ reason: `HorizonGame Ban: ${message.author.tag}: ${reason.join(' ') || 'Unspecified'}`})
    .then(_member => message.channel.send(`Ban avec succès **${_member.user.tag}**`))
    .catch(() => message.channel.send(`Échec de ban **${member.user.tag}**!`));
  }
};
