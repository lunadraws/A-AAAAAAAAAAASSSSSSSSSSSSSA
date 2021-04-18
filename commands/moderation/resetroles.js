module.exports = {
  name: 'resetroles',
  aliases: [ 'resetrole', 'removeroles', 'removerole', 'purgerole' ],
  guildOnly: true,
  permissions: [ 'MANAGE_ROLES' ],
  clientPermissions: [ 'MANAGE_ROLES' ],
  group: '__**modération**__',
  description: 'Removes **all** custom roles from a user. (@everyone will be excluded)',
  parameters: [ 'User Mention | ID' ],
  examples: [
    'resetroles @user',
    'resetrole 7283746571920016374'
  ],
  run: async (client, message, [member = '']) => {

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`\\❌ | ${message.author}, Veuillez fournir l'ID ou mentionner l'utilisateur à exclure. [mentionner d'abord avant d'ajouter la raison]`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`\\❌ Impossible de réinitialiser les rôles de l'utilisateur: utilisateur introuvable.`);
    } else if (member.id === client.user.id){
      return message.channel.send(`\\❌ ${message.author}, Je ne recommande pas de réinitialiser mes rôles!`);
    } else if (member.user.bot){
      return message.channel.send(`\\❌ ${message.author}, Je ne recommande pas de réinitialiser les rôles de bot! (Peut affecter l'intégration des rôles)`);
    } else if (message.member.id === member.id){
      return message.channel.send(`\\❌ ${message.author}, Vous ne pouvez pas réinitialiser vos propres rôles!`);
    } else if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`\\❌ ${message.author}, Vous ne pouvez pas modifier les rôles de l'utilisateur qui a une autorisation plus élevée que la vôtre!`);
    } else if (!Boolean(member.roles.cache.size - 1)){
      return message.channel.send(`\\❌ ${message.author}, **${member.user.tag}** n'a aucun rôle à supprimer.`);
    };

    await message.channel.send(`Cela supprimera tous les rôles de **${member.user.tag}** , y compris des rôles spéciaux comme le rôle mute. Continuer?`);

    const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
    const options = { max: 1, time: 30000, errors: ['time'] };
    const proceed = await message.channel.awaitMessages(filter, options)
    .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
    .catch(() => false);

    if (!proceed){
      return message.channel.send(`\\❌ | **${message.author.tag}**, vous avez annulé la commande resetrole!`);
    };

    const prevRoleCount = member.roles.cache.size - 1;
    return member.roles.set([])
    .then(member => message.channel.send(`\\✔️ Supprimé avec succès **${prevRoleCount}** rôles de **${member.user.tag}**!`))
    .catch(() => message.channel.send(`\\❌ Impossible de supprimer tout les rôles de **${member.user.tag}**`))
  }
};
