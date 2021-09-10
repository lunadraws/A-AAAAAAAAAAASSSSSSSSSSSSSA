const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'setprefix',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Set up custom prefix for this server.',
  requiresDatabase: true,
  parameters: [ 'prefix' ],
  examples: [
    'setprefix ?'
  ],
  

      doc.prefix = [prefix, null][Number(!!prefix.match(/clear|reset/i))];

      return doc.save()
      .then(() => {
        client.guildProfiles.get(message.guild.id).prefix = doc.prefix;
      
      }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    };
  })
};
