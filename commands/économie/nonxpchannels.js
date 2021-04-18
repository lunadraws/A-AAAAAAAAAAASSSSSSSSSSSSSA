const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
  name: 'nonxpchannels',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: '**__Économie__**',
  description: 'See which channels do not give xp',
  requiresDatabase: true,
  examples: [
    'nonxpchannels'
  ],
  run: (client, message) => {

    let totalch = message.guild.channels.cache.filter(c => c.send).size;
    let channels = client.guildProfiles.get(message.guild.id).xp.exceptions;
    channels = channels.map(x => client.channels.cache.get(x).toString());

    if (!channels.length){
      return message.channel.send(`\\✔️ **${message.member.displayName}**, Tous les canaux de ce serveur sont activés pour XP!`);
    } else if (totalch === channels.length){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Tous les canaux de ce serveur sont désactivés par XP!`);
    } else {
      return message.channel.send(
        new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setFooter(`XP | \©️${new Date().getFullYear()} HorizonGame`)
        .setDescription([
            '\\⚠️\u2000\u2000|\u2000\u2000',
            `systéme xp est désactivé sur ${text.joinArray(channels)}`
        ].join(''))
      )
    };
  }
};
