const profile = require('../../models/Profile');

module.exports = {
  name: 'setcolor',
  aliases: [],
  rankcommand: true,
  clientPermissions: [],
  group: '**__Économie__**',
  description: 'Sets the color for your profile card.',
  requiresDatabase: true,
  parameters: [ 'hex code' ],
  examples: [
    'setcolor #e567da'
  ],
  run: async (client, message, [color] ) => profile.findById(message.author.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` La base de données a répondu avec une erreur: ${err.name}`);
    } else if (!doc){
      doc = new profile({ _id: message.author.id });
    };

    const hex = color?.match(/[0-9a-f]{6}|default/i)?.[0];

    if (!hex){
      return message.channel.send(`\\❌ **${message.author.tag}**, veuillez fournir un HEX valide pour la couleur. Vous pouvez taper \`defaul\` pour rétablir la couleur par défaut.`);
    };

    doc.data.profile.color = hex === 'default' ? null : String('#' + hex);

    return doc.save()
    .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, la couleur de votre profil a été mise à jour pour **${hex}**!`))
    .catch(() => message.channel.send(`\\❌ **${message.author.tag}**, la mise à jour de la couleur de votre profil a échoué!`));
  })
}
