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
      .addField(
         '<:level:885078162613108746>』**__Liens__**',
         "[Invite moi](https://discordapp.com/oauth2/authorize?client_id=884131896919994458&scope=bot&permissions=2146958847) | [Support](https://discord.gg/eCDp4jRvWu) | [Top.gg](https://top.gg/bot/688407554904162365/vote) | [Z-bdfd](https://zbdfd.ml/dc) | [Youtube](https://youtube.com/c/NettleYTBBDFD)"
       )

         
       
       
    );
  }
};
