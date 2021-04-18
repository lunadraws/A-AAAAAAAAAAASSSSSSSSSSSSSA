module.exports = {
  name: 'addroles',
  aliases: [ 'addrole' ],
  guildOnly: true,
  permissions: [ 'MANAGE_ROLES' ],
  clientPermissions: [ 'MANAGE_ROLES' ],
  group: '__**modération**__',
  description: 'Adds the mentioned roles and/or supplied role IDs to the mentioned user',
  examples: [
    'addroles @user @role1 @role2 @role3',
    'addrole @user @role'
  ],
  run: async (client, message, [member = '', ...rawRoles] ) => {

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`❌ | ${message.author}, Veuillez fournir l'ID ou mentionner le membre auquel vous souhaitez ajouter des rôles.`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`❌ | ${message.author}, Impossible de trouver le membre fourni sur ce serveur`)
    };

    if (!rawRoles.length){
      return message.channel.send(`❌ | ${message.author}, Veuillez fournir l'ID ou mentionner les rôles que vous souhaitez ajouter à ce membre`);
    };

    const roles = [...new Set([...rawRoles
    .filter(r => r.match(/\d{17,19}/))
    .filter(r => message.guild.roles.cache.has(r.match(/\d{17,19}/)))
    .filter(r => !message.member.roles.cache.has(r.match(/\d{17,19}/)))
    .map(r => r.match(/\d{17,19}/)[0])])];

    if (!roles.length){
      return message.channel.send(`❌ | ${message.author}, Soit **${member.user.tag}** avait déjà ces rôles, ou aucun des ID de rôle fournis n'était valide.`);
    };

    return member.roles.add(roles)
    .then(_member => message.channel.send(`Ajouté avec succès **${roles.length}** rôles à **${_member.user.tag}**!`))
    .catch(() => message.channel.send(`Impossible d'ajouter des rôles à **${member.user.tag}**`));
  }
};
