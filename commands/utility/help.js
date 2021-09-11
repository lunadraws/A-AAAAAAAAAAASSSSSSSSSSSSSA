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
      new MessageEmbed()
      .setColor('#3A871F')
      .setAuthor('HorizonGame!')
      .setImage('https://media.discordapp.net/attachments/885198288234622996/886339731254829056/standard_1.gif')
      .setTimestamp()
      
      .setFooter(`help | \©️${new Date().getFullYear()} HorizonGame`)
         
      .addField(
         '<:search:885115865417261066>』**__Informations__**',
         "> `help-mod`, `help-eco`, `help-anime`, `help-antiraid`, `help-invite`, `help-level`, `help-music`, `help-fun`, `help-utile`, `help-config`"
       )
         
       
       
    );
  }
};
