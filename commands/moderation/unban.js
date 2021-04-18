module.exports = {
  name: 'unban',
  aliases: [],
  guildOnly: true,
  permissions: [ 'BAN_MEMBERS' ],
  clientPermissions: [ 'BAN_MEMBERS' ],
  group: '__**modération**__',
  description: 'Unbans a user from this server',
  parameters: [ 'user Mention/ID', 'Unban Reason' ],
  examples: [
    'unban 728374657483920192',
  ],
  run: async (client, message, [ user = '', ...args ]) => {

    if (!user.match(/\d{17,19}/)){
      return message.channel.send(`❌ | ${message.author}, Veuillez fournir l'ID de l'utilisateur à unban`);
    };

    user = user.match(/\d{17,19}/)[0];

    return message.guild.members.unban(user, { reason: `HorizonGame Unban: ${message.author.tag}: ${args.join(' ') || 'None'}`})
    .then(user => message.channel.send(`\\✔️ unban réussie **${user.tag}**!`))
    .catch(() => message.channel.send(`\\❌ Impossible d'annuler le bannissement de l'utilisateur avec son ID ${user}. L'argument fourni n'est peut-être pas un identifiant d'utilisateur valide ou l'utilisateur n'est pas banni.`));
  }
};
