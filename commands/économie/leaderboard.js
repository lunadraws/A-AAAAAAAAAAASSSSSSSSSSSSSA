const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'leaderboard',
  aliases: [ 'lb', 'topxp' ],
  guildOnly: true,
  rankcommand: true,
  group: '**__Économie__**',
  description: 'Shows the top xp earners for this server',
  requiresDatabase: true,
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'leaderboard',
    'lb',
    'topxp'
  ],
  run: (client, message) => {

    const { exceptions, isActive } = client.guildProfiles.get(message.guild.id).xp;
    const embed = new MessageEmbed()
    .setFooter(`Classement XP | \©️${new Date().getFullYear()} HorizonGame`)
    .setThumbnail('https://cdn.discordapp.com/avatars/688407554904162365/b91454b73477486d08be0830e383dc12.png?size=2048')
    .setColor(message.guild.me.displayHexColor);

    if (!isActive){
      return message.channel.send(
        embed.setDescription([
          `**${message.member.displayName}**, XP est actuellement désactivé sur ce serveur.\n`,
          `Si vous êtes l'administrateur du serveur, vous pouvez l'activer en tapant \`${client.config.prefix}xptoggle\`.`,
        ].join('\n'))
        .setAuthor('Systèmes XP désactivés','https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
      );
    };

    if (exceptions.includes(message.channel.id)){
      return message.channel.send(
        embed.setDescription([
          `**${message.member.displayName}**, XP est actuellement désactivé dans cette chaîne.\n`,
          `Pour voir quels canaux sont désactivés par XP, utilisez la commande \`${client.config.prefix}nonxpchannels\``,
          `Si vous êtes l'administrateur du serveur, vous pouvez le réactiver ici en tapant \`${client.config.prefix}xpenable #${message.channel.name}\``,
        ].join('\n'))
        .setAuthor('Chaîne sur liste noire','https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
      );
    };

    return profile.find({ 'data.xp.id': message.guild.id }, async (err, docs) => {
      if (err) {
        return message.channel.send(
          embed.setAuthor('Erreur de la base de données','https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
          .setDescription('Le fournisseur de base de données de HorizonGame a répondu avec une erreur: ' + err.name)
        );
      };

      docs = docs.map(x => { return { id: x._id, data: x.data.xp.find(x => x.id === message.guild.id)};})
      .sort((A,B) => B.data.xp - A.data.xp) // Arrange by points, descending.
      .filter(x => x.data.xp); // Remove document where xp is 0.

      if (!docs.length){
        return message.channel.send(
          embed.setDescription([
            `**${message.member.displayName}**, Aucun XP trouvé.\n\n`,
            'Les utilisateurs de ce serveur n\'ont pas encore commencé à gagner de l\'XP!\n',
          ].join('\n'))
          .setAuthor('Pas de XP','https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
        );
      };

      const members = await message.guild.members
      .fetch({ user: docs.slice(0,10).map(x => x.id) })
      .catch(() => null)

      return message.channel.send(
        new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setFooter(`Classement XP | \©️${new Date().getFullYear()} HorizonGame`)
        .setAuthor(`🏆 ${message.guild.name} Classement`, message.guild.iconURL({format: 'png', dynamic: true }) || null)
        .addField(`**${members.get(docs[0].id)?.displayName || '<Unknown User>'}** classé le plus élevé avec **${text.commatize(docs[0].data.xp)}**XP!`,
        [
          '```properties',
          '╭═══════╤═══════╤════════╤════════════════════════════╮',
          '┃  Rank ┃ Level ┃     XP ┃ User                       ┃',
          '╞═══════╪═══════╪════════╪════════════════════════════╡',
          docs.slice(0,10).map((u,i) => {
            const rank = String(i+1);
            return [
              '┃' + ' '.repeat(6-rank.length) + rank,
              ' '.repeat(5-String(u.data.level).length) + u.data.level,
              ' '.repeat(6-text.compactNum(u.data.xp).length) + text.compactNum(u.data.xp),
              members.get(u.id)?.user.tag || '<Unknown User>'
            ].join(' ┃ ')
          }).join('\n'),
          '╞═══════╪═══════╪════════╪════════════════════════════╡',
          docs.filter(x => x.id === message.author.id).map((u,i,a) => {
            const user = a.find(x => x.id === message.author.id);
            const rank = docs.findIndex(x => x.id === message.author.id) + 1;
            return [
              '┃' + ' '.repeat(6-text.ordinalize(rank).length) + text.ordinalize(rank),
              ' '.repeat(5-String(u.data.level).length) + u.data.level,
              ' '.repeat(6-text.compactNum(u.data.xp).length) + text.compactNum(u.data.xp),
              text.truncate('vous (' + message.author.tag + ')', 26) + ' '.repeat(27-text.truncate('vous (' + message.author.tag + ')', 26).length) + '┃'
            ].join(' ┃ ')
          }).join(''),
          '╰═══════╧═══════╧════════╧════════════════════════════╯',
          '```'
        ].join('\n'))
      );
    });
  }
};
