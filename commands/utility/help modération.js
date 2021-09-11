const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
  name: 'help modération',
  aliases: [ 'help moderation', 'help mod' ],
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
        '<:valide:885075251371835402>┇**__liens__**', 
        '> **[Invite moi](https://discordapp.com/oauth2/authorize?client_id=688407554904162365&scope=bot&permissions=2146958847) | ' +
        '[Support](https://discord.gg/5qbAGCykRd) | ' +
        '[Site web](https://zbdfd.ml/) | ' +
        '[Top.gg](https://top.gg/bot/688407554904162365/vote) | ' +
        '[Youtube](https://youtube.com/c/NettleYTBBDFD)**'
      )
      
       .addField(
         '<:hammers:885093621026680862>』__**modération**__',
         "> `ban-id`, `ban`, `banlist`, `case`, `cases-list`, `clear-warns`, `clear`, `delete-case`, `gend`, `greroll`, `gstart`, `infractions`, `kick`, `lock`, `massban`, `mod-logs`, `mute`, `nuke`, `massrole`, `roles`, `slowmode`, `softban`, `sugg-accept`, `sugg-delete`, `sugg-refuse`, `ticket-add`, `ticket-close`, `unban`, `unbanall`, `unlock`, `unmute`, `warn`"
       )
      
      
      
       
       
    );
  }
};
