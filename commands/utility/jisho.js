const { MessageEmbed } = require('discord.js');
const { toRomaji } = require('wanakana');
const fetch = require('node-fetch');

module.exports = {
  name: 'jisho',
  aliases: [ 'weebify', 'kanji', 'nipponify' ],
  cooldown: {
    time: 10000,
    message: "Accessing Jisho has been rate limited to 1 use per user per 10 seconds"
  },
  group: '**__utile__**',
  description: 'Searches for Japanese words and Kanji on Jisho!',
  parameters: [ 'word <kana/romaji>' ],
  examples: [
    'jisho nani',
    'nipponify oyasumi',
    'weebify wakarimashita'
  ],
  run: async function run(client, message, [query]){

    if (!query){
      client.commands.cooldowns.get(this.name).users.delete(message.author.id);
      return message.channel.send(`\\❌ | ${message.author}, Veuillez me fournir un mot pour obtenir la définition de.`);
    };

    const res = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURI(query)}`)
    .then(res => res.json())
    .catch(() => { return {}});

    if (res?.meta.status !== 200){
      return message.channel.send(`\\❌ | ${message.author}, Impossible de se connecter à JISHO.`);
    };

    if (!res.data.length){
      return message.channel.send(`\\❌ | ${message.author}, Aucun résultat n'a été trouvé pour **${query}**`);
    };

    const fields = res.data.filter(d => d.attribution.jmdict ).splice(0,3)
    .map(data => {
      return {
        name: '\u200b', inline: true,
        value: [
          `**${data.slug}** - ${data.is_common ? 'Common Word' : 'Uncommon Word'}`,
          `**Kanji**: ${data.japanese.map(m => `${m.word || ''} *"(${m.reading || ''})"*`).join(' • ')}`,
          `**Romanized**: ${data.japanese.map(m => toRomaji(m.reading)).join('  ')}`,
          `**Définition**: ${data.senses[0].english_definitions}`,
          `**Restrictions**: ${data.senses[0].restrictions.join('\n') || 'None'}\n`,
          `**Notes**: ${[...data.senses[0].tags, ...data.senses[0].info].join(' • ')}`,
        ].join('\n')
      }
    })

    return message.channel.send(
      new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .addFields(fields)
      .setAuthor(`🇯🇵 • Résultats de recherche pour ${query}!`)
      .setFooter(`Jisho @ Jisho.org | \©️${new Date().getFullYear()} HorizonGame`)
      .addField('\u200b',`[Lien](https://jisho.org/search/${query} '${query} dans Jisho')`)
    );
  }
};
