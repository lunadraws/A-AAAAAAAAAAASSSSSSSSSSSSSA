const { MessageEmbed } = require('discord.js');
const { randomQuote } = require('animequotes');
const { searchAnime } = require('node-kitsu');

module.exports = {
  name: "aniquote",
  aliases: [ 'aq', 'animequote' ],
  group: '__**Anime**__',
  clientPermissions: [ 'EMBED_LINKS' ],
  description: 'Generate a random anime quote.',
  parameters: [],
  examples: [ 'aniquote', 'aq', 'animequote' ],
  run: async ( client, message) => {

    const { quote, anime, id, name } = randomQuote();

    const res = await searchAnime(anime,0).catch(()=>{}) || [];

    const image = res?.[0]?.attributes?.coverImage?.original || null;

    return message.channel.send(
      new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .addField(`*Cité de ${anime}*`,`${quote}\n\n-*${name}*`)
      .setImage(image)
      .setTimestamp()
      .setFooter(`Citations D'animés | \©️${new Date().getFullYear()} HorizonGame`)
    );
  }
};
