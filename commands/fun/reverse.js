module.exports = {
  name: 'reverse',
  aliases: [],
  group: '__**Amusant**__',
  description: 'Reverses the supplied text',
  examples: [
    'reverse This text will be reversed.'
  ],
  run: (client, message, args) =>
  message.channel.send(args.join(' ').split('').reverse().join(' ') || 'Aucun texte à inverser.')
};
