const { duration } = require('moment');

function CommandHandler(manager, message){

  if (message.guild){
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
      return { executed: false, reason: 'PERMISSION_SEND'};
    } else {
      // Do nothing..
    };
  };

  const serverprefix = message.client.guildProfiles.get(message.guild?.id)?.prefix || null;
  let prefix;

  if (message.content.startsWith('hori')){
    prefix = 'hori'
  } else if (message.content.startsWith(message.client.prefix)){
    prefix = message.client.prefix;
  } else if (serverprefix && message.content.startsWith(serverprefix)){
    prefix = serverprefix;
  };

  if (!prefix){
    return { executed: false, reason: 'PREFIX'};
  };

  const [ name, ...args ] = message.content.slice(prefix.length)
  .split(/ +/)
  .filter(Boolean);

  const command = manager.get(name);

  if (!command || !command.validate()){
    return { executed: false, reason: 'NOT_FOUND' };
  };

  const { accept: permission_granted, terminate, embed } = command.testPermissions(message);

  if (terminate){
    return { executed: false, reason: 'TERMINATED' };
  };

  if (!permission_granted){
    if (!!message.guild){
      message.channel.send(
        message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS')
        ? embed : embed.description
      );
    } else {
      message.channel.send(embed);
    };
    return { executed: false, reason: 'PERMISSION' };
  };

  



  return { executed: true };
};

module.exports = CommandHandler;
