const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'reddit',
  aliases: [ 'rdt', 'subreddit', 'redd.it', 'fetchreddit' ],
  cooldown: {
    time: 10000,
    message: 'Accessing Reddit has been rate limited to 1 use per user per 10 seconds'
  },
  group: '**__utile__**',
  description: 'Fetch a random image from the supplied subreddit',
  parameters: [ 'subreddit' ],
  examples: [
    'reddit churchofmai',
    'rdt seishunbutayarou'
  ],
  run: async (client, message, [subreddit = 'oneTrueMai']) => {

    const embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setThumbnail('https://cdn.discordapp.com/avatars/688407554904162365/b91454b73477486d08be0830e383dc12.png?size=2048')
    .setDescription(`\u200B\n Récupérer des informations à partir de **[r/${subreddit}](https://reddit.com/r/${subreddit})**. S'il vous plaît, attendez.`)
    .setFooter(`Reddit Image | \©️${new Date().getFullYear()} HorizonGame`);

    const prompt = await message.channel.send(embed);
    let res = await fetch(`https://reddit.com/r/${subreddit}.json`)
    .then(res => res.json())
    .catch(() => null);

    embed.setColor(message.guild.me.displayHexColor)
    .setThumbnail(null)
    .setAuthor('Sous-reddit invalide','https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
    .setDescription(`Il s’agit d’un sous-répertoire non valide / inexistant.`);

    if (!res || !res.data?.children || !res.data.children.length){
      return await prompt.edit(embed).catch(() => null) || message.channel.send(embed);
    };

    res = res.data.children.filter(m => m.data.post_hint === 'image');

    embed.setAuthor('Aucune image trouvée', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
    .setDescription('Ce sous-reddit ne contient aucun message d’image.');

    if (!res.length){
      return await prompt.edit(embed).catch(() => null) || message.channel.send(embed);
    };

    if (!message.channel.nsfw){
      res = res.filter(m => !m.data.over_18)
    };

    embed.setAuthor('Sous-reddit NSFW', 'https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
    .setDescription(' On dirait que vous avez entré un sous-répertoire nsfw dans un canal sfw. Veuillez passer au canal nsfw tout en utilisant ce sous-reddit.');

    if (!res.length){
      return await prompt.edit(embed).catch(() => null) || message.channel.send(embed);
    };

    const post = res[Math.floor(Math.random() * res.length)].data;

    embed.setColor(message.guild.me.displayHexColor)
    .setDescription('')
    .setImage(post.url)
    .setTimestamp(post.created_utc * 1000)
    .setTitle(post.title)
    .setURL(`https://www.reddit.com${post.permalink}`)
    .setAuthor('', null);

    return await prompt.edit(embed).catch(() => null) || message.channel.send(embed);
  }
};
