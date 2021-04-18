module.exports = {
  name: 'softban',
  aliases: [],
  guildOnly: true,
  permissions: [ 'BAN_MEMBERS' ],
  clientPermissions: [ 'BAN_MEMBERS' ],
  group: '__**modération**__',
  description: 'Kicks a user and deletes all their messages in the past 7 days',
  parameters: [ 'user Mention/ID' ],
  examples: [
    'softban @user',
    'softban 7283746574829102938'
  ],
  run: async (client, message, [ member = '' ]) => {

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`\\❌ | ${message.author}, Veuillez préciser l'ID ou mentionner l'utilisateur à softban.`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`\\❌ | ${message.author}, L'utilisateur n'a pas pu être trouvé! Veuillez vous assurer que la pièce d'identité fournie est valide.`);
    } else if (member.id === message.author.id){
      return message.channel.send(`\\❌ | ${message.author}, Vous ne pouvez pas vous bannir!`);
    } else if (member.id === client.user.id){
      return message.channel.send(`\\❌ | ${message.author}, S'il te plaît, ne me softban pas!`);
    } else if (member.id === message.guild.ownerID){
      return message.channel.send(`\\❌ | ${message.author}, Vous ne pouvez pas softban un propriétaire de serveur!`);
    } else if (client.config.owners.includes(member.id)){
      return message.channel.send(`\\❌ | ${message.author}, Non, vous ne pouvez pas softban mes développeurs à travers moi!`);
    } else if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`\\❌ | ${message.author}, Vous ne pouvez pas softban cet utilisateur! Il / Elle a un rôle plus élevé que le vôtre`);
    } else if (!member.bannable){
      return message.channel.send(`\\❌ | ${message.author}, Je ne pouvais pas softban cet utilisateur!`)
    };

    return message.guild.members.ban(member, { reason:  `HorizonGame_SOFTBANS: ${message.author.tag}`, days: 7 })
    .then(() => message.guild.members.unban(member, { reason: `HorizonGame_SOFTBANS: ${message.author.tag}` }))
    .then(() => message.channel.send(`\\✔️ Softbanned avec succès **${member.user.tag}**`))
    .catch(() => message.channel.send(`\\❌ | ${message.author}, Impossible de softban **${member.user.tag}**!`));
  }
};
