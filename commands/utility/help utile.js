const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
  name: 'help',
  aliases: [ 'help cmd', 'help command' ],
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
        '<:emoji_18:885087400534089728>』__**utile**__',
        "> `birthdays-list`, `calculation`, `holidays`, `addemoji`, `admins-list`, `avatar`, `botinfo`, `color`, `deleteemoji`, `discrim`, `help`, `permissions`, `ping`, `premium`, `remind`, `restrictemoji`, `roleinfo`, `serverinfo`, `snipe`, `suggest`, `tiktok`, `translate`, `uptime`, `userinfo`"
       )
      
       
       
    );
  }
};
