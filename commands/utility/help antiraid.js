const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
  name: 'help-antiraid',
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
      .setAuthor('Liste complète des commandes antiraid de HorizonGame!')
      .setImage('https://cdn.discordapp.com/attachments/766973870350663730/814984024233345024/standard.gif')
      .setTimestamp()
      
      .setFooter(`help | \©️${new Date().getFullYear()} HorizonGame`)
         
      .addField(
         '<:error:885075491416047616>』**__antiRaid__**',
         "> `anti-dc`, `anti-pub`, `anti-caps`, `anti-mass-mentions`, `anti-spam`, `antiraid-logs`, `check-users`, `ignoreds`, `protect`, `verification`, `backup`"
       )
         
       
       
    );
  }
};
