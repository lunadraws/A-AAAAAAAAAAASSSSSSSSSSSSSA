module.exports = {
  name: 'nuke',
  aliases: [ 'clearall' ],
  guildOnly: true,
  permissions: [ 'MANAGE_MESSAGES', 'MANAGE_CHANNELS' ],
  clientPermissions: [ 'MANAGE_CHANNELS' ],
  group: '__**modération**__',
  description: 'Removes all messages in the channel (Deletes the old channel and makes a copy of it with permissions intact)',
  examples: [
    'nuke',
    'clearall'
  ],
  run: async (client, message) => {

    await message.channel.send(`Cela supprimera toutes les conversations de ce canal et peut entraîner des conflits pour les bots utilisant l'ID pour suivre le salon. Continuer?(y/n)`);

    const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
    const options = { max: 1, time: 30000, errors: ['time'] };
    const proceed = await message.channel.awaitMessages(filter, options)
    .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
    .catch(() => false);

    if (!proceed){
      return message.channel.send(`\\❌ | **${message.author.tag}**, vous avez annulé la commande nuke!`);
    };

    return message.channel.send(`L'arme nucléaire a été déployée, disant au revoir à **#${message.channel.name}** dans 10s`)
    .then(() => setTimeout(() => message.channel.clone()
    .then(() => message.channel.delete().catch(() => null)), 10000))
  }
};
