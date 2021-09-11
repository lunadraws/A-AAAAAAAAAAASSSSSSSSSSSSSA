const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
  name: 'help utile',
  aliases: [ 'help utility', 'help utilitie' ],
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
      .setAuthor('Liste complète des commandes utile de HorizonGame!')
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
        '<:emoji_18:885087400534089728>』__**utile**__',
        "> `birthdays-list`, `calculation`, `holidays`, `addemoji`, `admins-list`, `avatar`, `botinfo`, `color`, `deleteemoji`, `discrim`, `help`, `permissions`, `ping`, `premium`, `remind`, `restrictemoji`, `roleinfo`, `serverinfo`, `snipe`, `suggest`, `tiktok`, `translate`, `uptime`, `userinfo`"
       )
      
       
       
    );
  }
};
