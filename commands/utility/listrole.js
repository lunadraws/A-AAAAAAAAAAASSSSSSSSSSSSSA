const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = {
  name: 'listrole',
  aliases: [ 'roles' ],
  group: '**__utile__**',
  guildOnly: true,
  description: 'Displays in list all of the roles this server has',
  examples: [
    'listrole',
    'roles'
  ],
  run: async (client, message) => message.channel.send(
    new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setAuthor(`💮 ${message.guild.name} Liste des rôles`)
    .setFooter(`Listrole | \©️${new Date().getFullYear()} HorizonGame`)
    .addFields(
      _.chunk(message.guild.roles.cache.array()
        .filter(x => x.id !== message.guild.id)
        .sort((A,B) => B.rawPosition - A.rawPosition), 10)
        .map(x => {
          return {
            name: '\u200b', inline: true,
            value: '\u200b' + x.map(x => `\u2000•\u2000${x}`).join('\n')
          };
        })
    )
  )
};
