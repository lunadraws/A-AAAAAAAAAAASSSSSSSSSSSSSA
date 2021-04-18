const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const text = require('../../util/string');

module.exports = {
  name: 'pokemon',
  aliases: [ 'pokedex', 'pokémon', 'pokédex' ],
  group: '__**Amusant**__',
  description: 'Find a specific pokemon using the pokédex, or pikachu if no query is provided.',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'pokemon',
    'pokedex pikachu',
    'pokémon clefairy',
    'pokédex jigglypuff'
  ],
  run: async (client, message, args) => {

    const query = args.join(' ') || 'Pikachu';
    const embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setFooter(`Pokédex - La société Pokémon\©️ | \©️${new Date().getFullYear()} HorizonGame`);

    const prompt = await message.channel.send(
      embed.setDescription(`Recherche pokédex pour **${query}**`)
      .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
    );

    const data = await fetch(`https://some-random-api.ml/pokedex?pokemon=${encodeURI(query)}`)
    .then(res => res.json())
    .catch(()=>null);

    embed.setColor(message.guild.me.displayHexColor)
    .setThumbnail(null)
    .setAuthor('Pokédex indisponible', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
    .setDescription('Le fournisseur Pokedex a répondu avec l\'erreur 5xx. Veuillez réessayer plus tard.')

    if (!data){
      return await prompt.edit(embed).catch(() => null) || message.channel.send(embed);
    };

    embed.setAuthor('L\'entrée Pokémon ne peut pas être trouvée', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
    .setDescription(`**${message.author.tag}**, Je n'arrive pas à trouver **${query}** du Pokédex!`)

    if (data.error){
      return await prompt.edit(embed).catch(() => null) || message.channel.send(embed);
    };

    data.sprites = data.sprites || {};
    data.stats = data.stats || {};
    data.family.evolutionLine = data.family.evolutionLine || [];

    embed.setColor(message.guild.me.displayHexColor)
    .setDescription('')
    .setThumbnail(data.sprites.animated || data.sprites.normal || null)
    .setAuthor(`Entrée Pokédex #${data.id} ${data.name.toUpperCase()}`,'https://i.imgur.com/uljbfGR.png', 'https://pokemon.com/us')
    .addFields([
      { name: 'Info', value: data.description || '???' },
      { name: 'Type', value: data.type.join('\n') || '???', inline: true },
      { name: 'Abilities', value: data.abilities.join('\n') || '???', inline: true },
      {
        name: 'Build', inline: true,
        value: [
          `Height: **${data.height || '???'}**`,
          `Weight: **${data.weight || '???'}**`,
          `Gender: **${text.joinArray(data.gender)}**`
        ].join('\n')
      },
      { name: 'Egg Groups', value: data.egg_groups.join('\n') || '???', inline: true },
      {
        name: 'Stats', inline: true,
        value: [
           `HP: **${data.stats.hp || '???'}**`,
           `ATK: **${data.stats.attack || '???'}**`,
           `DEF: **${data.stats.defense || '???'}**`
        ].join('\n')
      },
      {
        name: 'SP.Stats', inline: true,
        value: [
          `SP.ATK: **${data.stats.sp_atk || '???'}**`,
          `SP.DEF: **${data.stats.sp_def || '???'}**`,
          `SPEED: **${data.stats.speed || '???'}**`
        ].join('\n')
      },
      { name: 'Generation', value: data.generation || '???', inline: true },
      { name: 'Evolution Stage', value: text.ordinalize(data.family.evolutionStage || '???'), inline: true },
      { name: 'Evolution Line', value: data.family.evolutionLine.join(' \\👉 ') || '???', inline: true }
    ]);

    return await prompt.edit(embed).catch(() => null) || message.channel.send(embed);
  }
};
