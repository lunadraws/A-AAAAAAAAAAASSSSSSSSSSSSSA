const { MessageEmbed, version: discord_version } = require('discord.js');
const { version, author } = require('../../package.json');
const { release, cpus } = require('os');
const moment = require('moment');

const text = require(`${process.cwd()}/util/string`);

module.exports = {
  name: 'stats',
  aliases: [ 'status', 'botstatus' ],
  group: 'bot',
  description: 'Displays the status of the current bot instance.',
  clientPermissions: [ 'EMBED_LINKS', 'ATTACH_FILES' ],
  parameters: [],
  examples: [
    'stats',
    'status',
    'botstatus'
  ],
  run: async (client, message) => {

    const { heapUsed, heapTotal } = process.memoryUsage();

    const messages_cached = client.channels.cache
    .filter(x => x.send )
    .reduce((m, c) => m + c.messages.cache.size, 0);

    const top_command = client.commands.registers
    .sort((A,B) => B.used - A.used).first();

    function round(amount, digit = 1000){
      // for rounding decimals, use Math.round
      return (amount / digit) > 1 ? `${text.commatize(Math.round(amount / digit) * digit)}+` : `< ${text.commatize(digit)}`;
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor('#3A871F')
      .setURL('https://zbdfd.ml/')
      .setTitle(`${client.user.username}v4.0.0`)
      .addFields([
        {value:'━━━━━━━━━━━━━━━━━━━━━━━━━━━━',name:'\u200b'},{
          name: '<:emoji_19:885087722828611625>\u2000__**MESSAGES**__', value: [
            `Sent:\u2000\u2000**${round(client.messages.sent)}**`,
            `Received:\u2000\u2000**${round(client.messages.received)}**`,
            `Cached:\u2000\u2000**${round(client.channels.cache.filter(x => x.send).reduce((acc, cur) => acc + cur.messages.cache.size, 0))}**`
          ].join('\n'), inline: true,
        },{
          name: '<:user:885128850806288385>\u2000**__INFOS__**', value: [
            `Users:\u2000\u2000**${round(client.guilds.cache.reduce((acc, cur) => acc + cur.memberCount, 0))}**`,
            **Servers:\u2000\u2000${client.guilds.cache.size}**`
          ].join('\n'), inline: true,
        },{value:'━━━━━━━━━━━━━━━━━━━━━━━━━━━━',name:'\u200b'},{
          name: '<:search:885115865417261066>\u2000__**COMMANDS**__', value: [
            `Total:\u2000\u2000**230**`,
            `Times accessed:\u2000\u2000**${round(client.commands.registers.reduce((acc,cur) => acc + cur.used, 0))}**`,
            `Most used:\u2000\u2000**\`${top_command.name} [${round(top_command.used)}]\`**`
          ].join('\n'), inline: true,
        },{
          name: '<:config:885078094426279977>\u2000**__MEMORY__**', value: [
            `Total (*heap*):\u2000\u2000[**\` ${(heapTotal / 1024 / 1024).toFixed(0)} MB \`**]`,
            `Used (*heap*):\u2000\u2000[**\` ${(heapUsed / 1024 / 1024).toFixed(0)} MB \`**]`
          ].join('\n'), inline: true,
        },{value:'━━━━━━━━━━━━━━━━━━━━━━━━━━━━',name:'\u200b'},{
          name: '<:lock:885096669958512641>\u2000**__SYSTEM__**', value: [
            `OS:\u2000\u2000**${process.platform} ${release}**`,
            `DiscordJS:\u2000\u2000**v13**`,
            `Node:\u2000\u2000**16.x**`,
            `CPU:\u2000\u2000**${cpus()[0].model}**`,
          ].join('\n'),
        },{value:'━━━━━━━━━━━━━━━━━━━━━━━━━━━━',name:`**__Uptime__**:\u2000${moment.duration(client.uptime, 'ms').format('D [days,] H [hours, and] m [minutes]')}.`}
      ]).setFooter(`Bot Status | \©️${new Date().getFullYear()} HorizonGame`)
    );
  }
};
