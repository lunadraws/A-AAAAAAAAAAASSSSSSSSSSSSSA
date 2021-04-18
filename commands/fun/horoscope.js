const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const signs = require('../../util/constants').horoscope;

module.exports = {
  name: 'horoscope',
  aliases: [],
  group: '__**Amusant**__',
  description: 'Find out your horoscope for today!',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'horoscope libra',
    'horoscope sagittarius'
  ],
  run: async (client, message, [sign] ) => {

    if (!sign){
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, S'il vous plaît, donnez-moi un signe pour obtenir l'horoscope de!`);
    };

    if (!Object.keys(signs).includes(sign.toLowerCase())){
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, **${sign}** n'est pas un signe valide!`);
    };

    const data = await fetch(`http://sandipbgt.com/theastrologer/api/horoscope/${sign}/today`)
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.channel.send(`Erreur serveur 5xx: l'API Horoscope est actuellement hors service!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setFooter(`Horoscope | \©️${new Date().getFullYear()} HorizonGame`)
      .setAuthor(signs[sign.toLowerCase()] + ' ' + data.sunsign || sign)
      .setDescription(data.horoscope.replace('(c) Kelli Fox, l\'astrologue, http://new.theastrologer.com', ''))
      .addFields([
        { name: 'Ambiance', inline: true, value: data.meta.mood || '\u200b' },
        { name: 'Intensity', inline: true, value: data.meta.intensity || '\u200b' },
        { name: 'Keywords', inline: true, value: data.meta.keywords || '\u200b' }
      ])
    );
  }
};
