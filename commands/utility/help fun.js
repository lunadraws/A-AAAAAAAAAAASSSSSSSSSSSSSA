const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
  name: 'help-fun',
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
      .setAuthor('Liste complète des commandes amusant de HorizonGame!')
      .setImage('https://cdn.discordapp.com/attachments/766973870350663730/814984024233345024/standard.gif')
      .setTimestamp()
      
      .setFooter(`help | \©️${new Date().getFullYear()} HorizonGame`)

       .addField(
        '<:fun:885078041175400468>』__**amusant**__',
        "> `quiz`, `numberfacts`, `create-quiz`, `8ball`, `advice`, `baka`, `birdfacts`, `blush`, `catfacts`, `comment`, `cry`, `dance`, `disgust`, `dogfacts`, `feed`, `fortune`, `happy`, `holdhands`, `horoscope`, `hug`, `invert`, `joke`, `kill`, `kiss`, `lick`, `meme`, `midfing`, `pandafacts`, `pat`, `poke`, `pokemon`, `rate`, `respect`, `reverse`, `roll`, `slap`, `sleep`, `smile`, `smug`, `suicide`, `tickle`, `triggered`, `wave`, `wink`"
       )
       
       
       
    );
  }
};
