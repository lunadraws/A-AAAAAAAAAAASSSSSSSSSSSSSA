const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
  name: 'help-config',
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
      new MessageEmbed()
      .setColor('#3A871F')
      .setAuthor('Liste complète des commandes de configuration de HorizonGame!')
      .setImage('https://cdn.discordapp.com/attachments/766973870350663730/814984024233345024/standard.gif')
      .setTimestamp()
      
      .setFooter(`help | \©️${new Date().getFullYear()} HorizonGame`)
      
       .addField(
        '<:config:885078094426279977>』__**configuration**__',
        "> `auto-music`, `autoping`, `auto-publish`, `auto-reactions`, `auto-responders`, `autonick`, `autorole`, `boost-message`, `botautonick`, `botautorole`, `chatbot`, `count-channel`, `glogs`, `language`, `counter`, `rolereact`, `set-sugg`, `set-logs`, `setprefix`, `tempvoc`, `ticket-system`, `youtube-alerts`, `disableanisched`, `setanischedch`, `unwatch`, `watch`"
       )
       
       
       
    );
  }
};
