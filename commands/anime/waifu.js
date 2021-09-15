const { MessageEmbed } = require('discord.js');
const waifuDB = require('../../assets/json/waifulist.json');
const text = require('../../util/string.js');

module.exports = {
  name: 'waifu',
  aliases: [],
  group: '__**Anime**__',
  description: 'Generates random waifu.',
  clientPermissions: [ 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY' ],
  parameters: [],
  examples: [
    'waifu'
  ],
  run: (client, message) => {

//---------------------------------WORK IN PROGRESS-----------------------------------//
    if (!message.channel.nsfw){
      return message.channel.send(`Cette commande est toujours en cours de progression. Les images peuvent parfois être NSFW, pour voir comment cette commande fonctionne, accédez à un canal NSFW.`)
    };
//--------------------------------WORK IN PROGRESS------------------------------------//

    const waifu = waifuDB[Math.floor(Math.random() * (waifuDB.length))];
    const no = Math.floor(Math.random() * waifu.images.length);

    message.channel.startTyping();

    const embed = new MessageEmbed()
    .setColor('#3A871F')
    .setAuthor(text.truncate([ waifu.names.en, waifu.names.jp, waifu.names.alt ].filter(Boolean).join('\n'), 200), waifu.avatar || null)
    .setDescription([ waifu.from.name, waifu.from.type].filter(Boolean).map(x => `*${x}*`).join('\n'))
    .setImage(waifu.images[no])
    .setFooter([
      `❣️${(100 * (((1 - waifu.statistics.hate / (waifu.statistics.love + waifu.statistics.fav)) * 0.6) + ((waifu.statistics.upvote / (waifu.statistics.upvote + waifu.statistics.downvote)) * 0.4))).toFixed(2)}`,
      `${ no + 1 } sur ${ waifu.images.length }`,
      `\©️${new Date().getFullYear()} HorizonGame`
    ].join('\u2000|\u2000'));

    return message.channel.send(embed).then( m => m.react('💖')).then(() => message.channel.stopTyping())

  }
};
