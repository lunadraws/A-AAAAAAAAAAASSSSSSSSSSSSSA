const { MessageEmbed, Collection } = require('discord.js');
const fetch = require('node-fetch');
const text = require('../../util/string');

module.exports = {
  name: 'animeme',
  aliases: [ 'ameme' , 'animememe' , 'animemes' , 'animememes' , 'amemes' ],
  guildOnly: true,
  group: '__**Anime**__',
  clientPermissions: [ 'EMBED_LINKS' ],
  description: 'Generate an anime meme fetched from selected <:reddit:767062345422864394> [Subreddits](https://reddit.com "Homepage"). Include `reload` parameter to reload meme cache. Memes generated are in order by default, add `r`, `random`, or `randomize` to randomize meme.',
  parameters: [ 'Reload tag', 'Randomization tag' ],
  examples: [
    'animeme',
    'ameme reload',
    'animeme random',
    'animemes reload',
    'amemes'
  ],
  run: async ( client, message, [parameter]) => {

    if (!client.collections.getFrom('memes', message.guild.id)) {
      client.collections.setTo('memes',message.guild.id, new Collection())
    }

    const memes = client.collections.getFrom('memes', message.guild.id)

    if (!memes.size) await reloadMeme(memes, message)

    if (parameter && parameter.toLowerCase() === 'reload'){
      await reloadMeme(memes, message);

      if (!memes.size){
        return message.channel.send('❌ | Impossible de récupérer les mèmes de <:reddit:767062345422864394> [Reddit](https://reddit.com/r/animemes)! Veuillez le signaler au propriétaire du bot. L\'API est peut-être en panne ou il peut y avoir des modifications sur l\'API elle-même.');
      };

      const data = memes.first()
      memes.delete(data.title)
      return message.channel.send(embedMeme(data))
    } else if (parameter && ['r','random','randomize'].includes(parameter.toLowerCase())){
      const data = memes.random();
      memes.delete(data.title);
      return message.channel.send(embedMeme(data));
    } else {
      const data = memes.first();
      memes.delete(data.title);
      if (!memes.size) {
        await reloadMeme(memes, message);
      };
      if (!memes.size) {
        return message.channel.send(
          new MessageEmbed() .setColor('#3A871F')
          .setAuthor('Erreur de récupération','https://cdn.discordapp.com/emojis/767790611381223454.gif?size=4096')
          .setThumbnail('https://i.imgur.com/qkBQB8V.png')
          .setFooter(`Animème | \©️${new Date().getFullYear()} HorizonGame`)
          .setDescription(
            `**${message.member.displayName}**, Je n'ai pas pu récupérer les mèmes de <:reddit:767062345422864394> [r/animemes](https://reddit.com/r/animemes)!\n\n`
              + 'Veuillez le signaler au propriétaire du bot. L\'API est peut-être en panne ou il peut y avoir des modifications sur l\'API elle-même.'
            )
          );
      };
      return message.channel.send(embedMeme(data));
    };
  }
};


async function reloadMeme(memes,message){

  if (memes.size){
    memes.clear();
  };

  const data = await fetch(`https://www.reddit.com/r/animemes.json`)
    .then(res => res.json())
    .catch(() => null);

  if (!data){
    return;
  };

  for ( const { data: { title, ups, downs, permalink, url, created_utc }} of data.data.children.filter( m => m.data.post_hint === 'image' && !m.data.pinned)){
    memes.set( title, {
      title, ups, downs,
      link: 'https://reddit.com/' + permalink,
      image: url,
      timestamp: created_utc * 1000
    });
  };

  return;
};

function embedMeme({ title, ups, downs, link, image, timestamp }){
  return new MessageEmbed()
  .setColor('#3A871F')
  .setTitle(title)
  .setURL(link)
  .setImage(image)
  .setTimestamp(timestamp)
  .setFooter(`Animème | \©️${new Date().getFullYear()} HorizonGame`);
};
