const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
  name: 'help-mod',
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
      .setAuthor('Liste complète des commandes de modération de HorizonGame!')
      .setImage('https://cdn.discordapp.com/attachments/766973870350663730/814984024233345024/standard.gif')
      .setTimestamp()
      
      .setFooter(`help | \©️${new Date().getFullYear()} HorizonGame`)
     
         .addField(
         '<:hammers:885093621026680862>』__**modération**__',
         "> `ban-id`, `ban`, `banlist`, `case`, `cases-list`, `clear-warns`, `clear`, `delete-case`, `gend`, `greroll`, `gstart`, `infractions`, `kick`, `lock`, `massban`, `mod-logs`, `mute`, `nuke`, `massrole`, `roles`, `slowmode`, `softban`, `sugg-accept`, `sugg-delete`, `sugg-refuse`, `ticket-add`, `ticket-close`, `unban`, `unbanall`, `unlock`, `unmute`, `warn`"
       )
      
      
      
       
       
    );
  }
};
