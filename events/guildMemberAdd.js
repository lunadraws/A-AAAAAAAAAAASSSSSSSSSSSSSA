const { MessageEmbed } = require('discord.js');
const modifier = require(`${process.cwd()}/util/modifier`);
const string = require(`${process.cwd()}/util/string`);

module.exports = async ( client, member ) => {

  const guildProfile = client.guildProfiles.get(member.guild.id);

  if (!guildProfile.greeter.welcome.isEnabled){
    return;
  } else if (!guildProfile.greeter.welcome.channel){
    return;
  } else if (!member.guild.channels.cache.get(guildProfile.greeter.welcome.channel)){
    return;
  } else {
    // Do nothing..
  };
  
  const welcome = guildProfile.greeter.welcome;
  const type = welcome.type === 'msg' && !welcome.message ? 'default' : welcome.type;

  if (type === 'default'){
    return client.channels.cache.get(guildProfile.greeter.welcome.channel).send(
      new MessageEmbed()
      .setColor(`#0400FF`)
      .setTitle(`${member.user.tag} a rejoint notre serveur!`)
      .setThumbnail(member.user.displayAvatarURL({format: 'png', dynamic: true}))
      .setDescription(`Bonjour ${member}, Bienvenue sur **${member.guild.name}**!\n\nTu es notre **${string.ordinalize(member.guild.memberCount)}** membre!`)
      .setFooter(`Accueil des membres | ©️${new Date().getFullYear()} HorizonGame`)
    );
  };

  //if message was text, send the text
   if (type === 'msg'){
    const message = await modifier.modify(guildProfile.greeter.welcome.message, member);
    return client.channels.cache.get(guildProfile.greeter.welcome.channel).send(message);
 };

  //if message was embed
  return client.channels.cache.get(guildProfile.greeter.welcome.channel).send(
    new MessageEmbed(
      JSON.parse(
        await modifier.modify(JSON.stringify(guildProfile.greeter.welcome.embed), member)))
  );
};
