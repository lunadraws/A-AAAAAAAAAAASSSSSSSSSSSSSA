const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'respect',
  aliases: [ 'f', 'rp', '+rp' ],
  group: '__**Amusant**__',
  description: 'Show thy respect. Accepts arguments.',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'respect',
    'f Kyoto Animation',
    'rp @user',
  ],
  run: async (client, message, args) => {

    const rep = await message.channel.send(
      new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setFooter(`Appuyez sur F pour payer le respect | \©️${new Date().getFullYear()} HorizonGame`)
      .setDescription(`${message.member} a payé leur respect${args.length ? ` a ${args.join(' ')}.` : ''}`)
    );

    await message.delete().catch(() => null);

    return rep.react("🇫")
  }
};
