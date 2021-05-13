const { MessageEmbed } = require("discord.js");

module.exports = (client, message, queue) => {

  const embed = new MessageEmbed()
  .setAuthor("Player Stopped")
  .setColor(`#b01e0b`)
  .setDescription("I have been disconnected from the channel")
  .setFooter(`Music System | \©️${new Date().getFullYear()} HorizonGame`);

  message.channel.send(embed);
};
