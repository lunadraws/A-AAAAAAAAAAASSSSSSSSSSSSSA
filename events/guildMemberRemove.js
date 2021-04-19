const { MessageEmbed } = require('discord.js');
const modifier = require(`${process.cwd()}/util/modifier`);

module.exports = async (client, member) => {

  const guildProfile = client.guildProfiles.get(member.guild.id);

  if (!guildProfile.greeter.leaving.isEnabled){
    return;
  } else if (!guildProfile.greeter.leaving.channel) {
    return;
  } else if (!member.guild.channels.cache.get(guildProfile.greeter.leaving.channel)){
    return;
  } else {
    // Do nothing..
  };

  const leaving = guildProfile.greeter.leaving;
  const type = leaving.type === 'msg' && !leaving.message ? 'default' : leaving.type;

  if (type === 'default'){
    return client.channels.cache.get(guildProfile.greeter.leaving.channel).send(
      new MessageEmbed()
      .setColor('#FF0000')
      .setTitle(`${member.user.tag} a quitté notre serveur!`)
      .setThumbnail(member.user.displayAvatarURL({format: 'png', dynamic: true}))
      .setDescription(`Byebye ${member}!! Triste de te voir partir!\n\nNous sommes de retour à **${member.guild.memberCount}** membres!`)
      .setFooter(`Annonceur membre sortant | ©️${new Date().getFullYear()} HorizonGame`)
    );
  };

  if (type === 'msg'){
    const message = await modifier.modify(guildProfile.greeter.leaving.message, member)
    return client.channels.cache.get(guildProfile.greeter.leaving.channel).send(message);
 };

 return client.channels.cache.get(guildProfile.greeter.leaving.channel).send(
   new MessageEmbed(
     JSON.parse(
       await modifier.modify(JSON.stringify(guildProfile.greeter.leaving.embed), member)))
 );
};
