module.exports = {
  name: 'hackban',
  aliases: [],
  guildOnly: true,
  permissions: [ 'BAN_MEMBERS' ],
  clientPermissions: [ 'BAN_MEMBERS' ],
  group: '__**modération**__',
  description: 'bans a user even if they are not in the server.',
  parameters: [ 'User ID', 'Ban Reason'],
  examples: [
    'hackban 7823713678123123123',
    'hackban 2345678765423567817 not following discord tos'
  ],
  run: async (client, message, [user = '', ...reason] ) => {

    if (!user.match(/\d{17,19}/)){
      return message.channel.send(`❌ | ${message.author}, Veuillez fournir l'ID de l'utilisateur à bannir.`);
    };

    user = await client.users
    .fetch(user.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!user){
      return message.channel.send(`❌ | ${message.author}, L'utilisateur n'a pas pu être trouvé! Veuillez vous assurer que la pièce d'identité fournie est valide.`);
    };

    if (user.id === message.guild.ownerID){
      return message.channel.send(`❌ | ${message.author}, Vous ne pouvez pas bannir un propriétaire de serveur!`);
    };

    member = await message.guild.members
    .fetch(user.id)
    .catch(() => false);

    if (!!member){
      return message.channel.send(`❌ | ${message.author}, Hackban sautera une vérification de validation de rôle! Veuillez utiliser la commande \`ban\` à la place si l'utilisateur est sur votre serveur.`);
    };

    if (user.id === message.author.id){
      return message.channel.send(`❌ | ${message.author}, Vous ne pouvez pas vous ban!`);
    };

    if (user.id === client.user.id){
      return message.channel.send(`❌ | ${message.author}, S'il te plait ne me ban pas!`);
    };

    if (client.config.owners.includes(user.id)){
      return message.channel.send(`❌ | ${message.author}, Non, vous ne pouvez pas ban mes développeurs par mon intermédiaire!`)
    };

    await message.channel.send(`Êtes-vous sûr de vouloir ban **${user.tag}** depuis ce serveur? (y/n)`)

    const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
    const options = { max: 1, time: 30000, errors: ['time'] };

    const proceed = await message.channel.awaitMessages(filter, options)
    .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
    .catch(() => false);

    if (!proceed){
      return message.channel.send(`❌ | ${message.author}, annulé la commande hackban!`);
    };

    return message.guild.members.ban(user, { reason: `HorizonGame Hackban: ${message.author.tag}: ${reason.join(' ') || 'Unspecified'}`})
    .then(_user => message.channel.send(`ban avec succès **${_user.tag}** depuis ce serveur!`))
    .catch(() => message.channel.send(`Échec de ban **${user.tag}**!`));
  }
};
