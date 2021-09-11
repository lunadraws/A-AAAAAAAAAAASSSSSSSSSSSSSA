const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
  name: 'help-level',
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
      .setAuthor('Liste complète des commandes du système de niveau de HorizonGame!')
      .setImage('https://media.discordapp.net/attachments/885198288234622996/886339731254829056/standard_1.gif')
      .setTimestamp()
      
      .setFooter(`help | \©️${new Date().getFullYear()} HorizonGame`)
      
       .addField(
         '<:level:885078162613108746>』**__système de niveau__**',
         "> `addlevel`, `addxp`, `leaderboard`, `rank`, `remove-rank`, `reset-levels`, `add-rank`, `ranks`"
         )
       
       
    );
  }
};
