const { MessageEmbed } = require("discord.js");

module.exports = (client, message, track) => {

  const embed = new MessageEmbed()
  .setAuthor("Now Playing", "https://i.imgur.com/2UOMwYK.gif")
  .setColor(`#0400ff`)
  .setTitle(track.title)
  .addField('Volume', client.musicPlayer.getQueue(message).volume, true)
  .addField('Requested by', track.requestedBy.username, true)
  .addField('Progress bar', client.musicPlayer.createProgressBar(message, { timecodes: true }))
  .setFooter(`Music System | \©️${new Date().getFullYear()} HorizonGame`);

  return message.channel.send(embed);
};
