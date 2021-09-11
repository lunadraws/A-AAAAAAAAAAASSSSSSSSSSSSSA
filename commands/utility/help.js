const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
  name: 'help',
  group: 'core',
  description: 'Sends a list of all commands from each specific command groups',
  clientPermissions: [ 'EMBED_LINKS' ],
  parameters: [],
  examples: [
    'commands',
    'cmd',
    'command'
  ],
  run: (client, message) => {

    return message.channel.send(
      const embed = new MessageEmbed()
    .setColor('0400ff')
    .setDescription('Informations sur une commande
• Faîtes *help <commande>  Pour plus d'informations sur une commande et *help <catégorie> pour plus d'informations sur une catégorie.
Exemple: *help utilities
• Vous pouvez faire *help commands pour voir la liste des commandes sans passer par le site
`help <`mod , utile , eco , anime , invite , antiraid , level`>
Préfixe
Mon préfixe sur Support Horizongame est *.Pour éxécuter des commandes, mettez d'abord le préfixe puis le nom de la commande, exemple: *userinfo.
Faîtes `*setprefix` <prefix> pour changer le préfixe')
    
       
       
    );
  }


