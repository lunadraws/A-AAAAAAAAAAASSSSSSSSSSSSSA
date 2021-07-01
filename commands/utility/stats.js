const { MessageEmbed, version: discord_version } = require('discord.js');
const { version, author } = require('../../package.json');
const { release, cpus } = require('os');
const moment = require('moment');

const text = require(`${process.cwd()}/util/string`);

module.exports = {
  name: 'stats',
  aliases: [ 'botstatus' ],
  group: '**__utile__**',
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
      .setColor('#0400FF')
      .setURL('https://horizongame.ml/')
      .setTitle(`${client.user.username} v3.0.0`)
      .setImage('https://cdn.discordapp.com/attachments/766973870350663730/814984024233345024/standard.gif')
      .addField(
        '**Liens**', 
        '**[Invite moi](https://discordapp.com/oauth2/authorize?client_id=688407554904162365&scope=bot&permissions=2146958847) | ' +
        '[Serveur de support](https://discord.gg/nA5968UFtP) | ' +
        '[Youtube](https://youtube.com/c/FloxYtbTuto)**'
      )
      .addFields([
        {value:'━━━━━━━━━━━━━━━━━━━━━━━━━━━━',name:`HorizonGame\u2000\u2000\n\*Serving ${client.guilds.cache.size} servers`},{
          name: '📧\u2000MESSAGES', value: [
            `Envoyé:\u2000\u2000**${round(client.messages.sent)}**`,
            `Reçu:\u2000\u2000**${round(client.messages.received)}**`,
            `En cache:\u2000\u2000**${round(client.channels.cache.filter(x => x.send).reduce((acc, cur) => acc + cur.messages.cache.size, 0))}**`
          ].join('\n'), inline: true,
        },{
          name: '👥\u2000USERS', value: [
            `Totale :\u2000\u2000**${round(client.guilds.cache.reduce((acc, cur) => acc + cur.memberCount, 0))}**`,
            `En cache:\u2000\u2000**${round(client.users.cache.size)}**`,
            `Ici:\u2000\u2000**${text.commatize(message.guild.memberCount)}**`
          ].join('\n'), inline: true,
        },{value:'━━━━━━━━━━━━━━━━━━━━━━━━━━━━',name:'\u200b'},{
          name: '⭐\u2000COMMANDES', value: [
            `Totale:\u2000\u2000**206**`,
            `Heures consultées:\u2000\u2000**${round(client.commands.registers.reduce((acc,cur) => acc + cur.used, 0))}**`,
            `Plus utilisé:\u2000\u2000**\`${top_command.name} [${round(top_command.used)}]\`**`
          ].join('\n'), inline: true,
        },{
          name: '🧠\u2000MEMOIRE', value: [
            `Totale (*heap*):\u2000\u2000[**\` ${(heapTotal / 1024 / 1024).toFixed(0)} MB \`**]`,
            `Utilisé (*heap*):\u2000\u2000[**\` ${(heapUsed / 1024 / 1024).toFixed(0)} MB \`**]`
          ].join('\n'), inline: true,
        },{value:'━━━━━━━━━━━━━━━━━━━━━━━━━━━━',name:'\u200b'},{
          name: '⚙️\u2000SYSTÈME', value: [
            `OS:\u2000\u2000**${process.platform} ${release}**`,
            `DiscordJS:\u2000\u2000**v${discord_version}**`,
            `Node:\u2000\u2000**${process.version}**`,
            `CPU:\u2000\u2000**${cpus()[0].model}**`,
          ].join('\n'),
        },{value:'━━━━━━━━━━━━━━━━━━━━━━━━━━━━',name:`Uptime:\u2000${moment.duration(client.uptime, 'ms').format('D [days,] H [hours, and] m [minutes]')}.`}
      ]).setFooter(`Bot Status | \©️${new Date().getFullYear()} HorizonGame`)
    );
  }
};
