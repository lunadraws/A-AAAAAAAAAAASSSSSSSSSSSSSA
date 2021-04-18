const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'clear',
  aliases: [ 'delete', 'slowprune', 'sd', 'slowdelete' ],
  guildOnly: true,
  permissions: [ 'MANAGE_MESSAGES' ],
  clientPermissions: [ 'MANAGE_MESSAGES', 'EMBED_LINKS' ],
  group: '__**modération**__',
  description: 'Delete messages from this channel. Will not delete messages older than two (2) weeks.',
  parameters: [ 'Quantity of Message' ],
  examples: [
    'clear 10',
    'delete 99',
    'slowprune 50'
  ],
  run: async (client, message, [quantity]) => {

    quantity = Math.round(quantity);

    if (!quantity || quantity < 2 || quantity > 100){
      return message.channel.send(`❌ | ${message.author}, Veuillez indiquer la quantité de messages à supprimer qui doit être supérieure à deux (2) et inférieure à cent (100)`);
    };

    return message.channel.bulkDelete(quantity, true)
    .then(async messages => {

      const count = messages.size;
      const _id = Math.random().toString(36).slice(-7);
      const uploadch = client.channels.cache.get(client.config.channels.uploads);

      messages = messages.filter(Boolean).map(message => {
        return [
          `[${moment(message.createdAt).format('dddd, do MMMM YYYY hh:mm:ss')}]`,
          `${message.author.tag} : ${message.content}\r\n\r\n`
        ].join(' ');
      });

      messages.push(`Messages effacés le ![](${message.guild.iconURL({size: 32})}) **${message.guild.name}** - **#${message.channel.name}** --\r\n\r\n`);
      messages = messages.reverse().join('');

      const res = uploadch ? await uploadch.send(
        `CLEAR HORIZONGAME - ${message.guild.id} ${message.channel.id}`,
        { files: [{ attachment: Buffer.from(messages), name: `clear-horizongame-${_id}.txt`}]}
      ).then(message => [message.attachments.first().url, message.attachments.first().id])
      .catch(() => ['', null]) : ['', null];

      const url = (res[0].match(/\d{17,19}/)||[])[0];
      const id = res[1];

      return message.channel.send(
        `Supprimé avec succès **${count}** messages de ce salon!`,
        new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setDescription([
          `[\📄 Vues\](${url ? `https://txt.discord.website/?txt=${url}/${id}/clear-horizongame-${_id}`:''})`,
          `[\📩 Download\](${res[0]})`
        ].join('\u2000\u2000•\u2000\u2000'))
      );
    });
  }
}
