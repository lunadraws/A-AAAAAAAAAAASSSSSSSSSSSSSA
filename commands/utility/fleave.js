const { MessageEmbed, TextChannel } = require('discord.js');

module.exports = {
  name: 'fleave',
  aliases: [ 'forceleave', 'leaveguild', 'removeguild', 'leaveserver' ],
  ownerOnly: true,
  group: 'core',
  description: 'Force Mai to leave a server',
  parameters: [ 'server ID', 'Reason' ],
  examples: [
    'fleave'
  ],
  run: async (client, message, [id = '', ...reason]) => {

    if (!id.match(/\d{17,19}/)){
      return message.channel.send(`\\❌| ${message.author}, Please provide the ID of the server you want me to leave from.`);
    };

    const guild = client.guilds.cache.get(id);

    if (!guild){
      return message.channel.send(`\\❌ | ${message.author}, guild **${id}** does not exist on your cache`)
    };

   

