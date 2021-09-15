const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
  name: 'help',
  group: 'core',
  description: 'Sends a list of all commands from each specific command groups',
  clientPermissions: [ 'EMBED_LINKS' ],
  parameters: [],
  examples: [
    'commands',
    'cmd',
    'command'
  ],
  run: (client, message) => {

    return message.channel.send(
      new MessageEmbed()
      .setColor('#3A871F')
      .setAuthor('HorizonGame!')
      .setImage('https://media.discordapp.net/attachments/885198288234622996/886339731254829056/standard_1.gif')
      .setTimestamp()
      
      .setFooter(`help | \©️${new Date().getFullYear()} HorizonGame`)
         
      .addField(
         '<:emoji_19:885087722828611625>』**__Informations__**',
         "> `help-mod`, `help-eco`, `help-anime`, `help-antiraid`, `help-invite`, `help-level`, `help-music`, `help-fun`, `help-utile`, `help-config`"
       )
      .addField(
         '<:level:885078162613108746>』**__Liens__**',
         "[Invite moi](https://discordapp.com/oauth2/authorize?client_id=884131896919994458&scope=bot&permissions=2146958847) | [Support](https://discord.gg/eCDp4jRvWu) | [Top.gg](https://top.gg/bot/688407554904162365/vote) | [Z-bdfd](https://zbdfd.ml/dc) | [Youtube](https://youtube.com/c/NettleYTBBDFD)"
       )
      .addField(
        '<:search:885115865417261066>』__**animé**__',
        "> `alprofile`, `anime`, `animeme`, `aniquote`, `anirandom`, `character`, `discover`, `hanime`, `malprofile`, `manga`, `mangarandom`, `nextairdate`, `schedule`, `seiyuu`, `upcoming`, `waifu`"
       )

     .addField(
         '<:error:885075491416047616>』**__antiRaid__**',
         "> `anti-dc`, `anti-pub`, `anti-caps`, `anti-mass-mentions`, `anti-spam`, `antiraid-logs`, `check-users`, `ignoreds`, `protect`, `verification`, `backup`"
       )

     .addField(
        '<:config:885078094426279977>』__**configuration**__',
        "> `auto-music`, `autoping`, `auto-publish`, `auto-reactions`, `auto-responders`, `autonick`, `autorole`, `boost-message`, `botautonick`, `botautorole`, `chatbot`, `count-channel`, `glogs`, `language`, `counter`, `rolereact`, `set-sugg`, `set-logs`, `setprefix`, `tempvoc`, `ticket-system`, `youtube-alerts`, `disableanisched`, `setanischedch`, `unwatch`, `watch`"
       )

     .addField(
        '<:fun:885078041175400468>』__**amusant**__',
        "> `quiz`, `numberfacts`, `create-quiz`, `8ball`, `advice`, `baka`, `birdfacts`, `blush`, `catfacts`, `comment`, `cry`, `dance`, `disgust`, `dogfacts`, `feed`, `fortune`, `happy`, `holdhands`, `horoscope`, `hug`, `invert`, `joke`, `kill`, `kiss`, `lick`, `meme`, `midfing`, `pandafacts`, `pat`, `poke`, `pokemon`, `rate`, `respect`, `reverse`, `roll`, `slap`, `sleep`, `smile`, `smug`, `suicide`, `tickle`, `triggered`, `wave`, `wink`"
       )

    .addField(
        '<:role:885078141209567272>』__**invite-managers**__',
        "> `addbonus`, `removebonus`, `removeinvites`, `restoreinvites`, `sync-invites`, `config`, `configdmjoin`, `configjoin`, `configleave`, `setdmjoin`, `setjoin`, `setleave`, `testdmjoin`, `testjoin`, `testleave`, `invite`, `joinstats`, `topinvite`"
       )

    .addField(
         '<:level:885078162613108746>』**__système de niveau__**',
         "> `addlevel`, `addxp`, `leaderboard`, `rank`, `remove-rank`, `reset-levels`, `add-rank`, `ranks`"
         )
    
    .addField(
         '<:hammers:885093621026680862>』__**modération**__',
         "> `ban-id`, `ban`, `banlist`, `case`, `cases-list`, `clear-warns`, `clear`, `delete-case`, `gend`, `greroll`, `gstart`, `infractions`, `kick`, `lock`, `massban`, `mod-logs`, `mute`, `nuke`, `massrole`, `roles`, `slowmode`, `softban`, `sugg-accept`, `sugg-delete`, `sugg-refuse`, `ticket-add`, `ticket-close`, `unban`, `unbanall`, `unlock`, `unmute`, `warn`"
       )

    .addField(
        '<:music:885078247954595870>』__**musique**__',
        "> `back`, `clearqueue`, `dj-system`, `loop`, `lyrics`, `np`, `pause`, `play`, `queue`, `remove`, `resume`, `seek`, `shuffle`, `skip`, `stop`, `volume`"
       )

    .addField(
        '<:emoji_18:885087400534089728>』__**utile**__',
        "> `birthdays-list`, `calculation`, `holidays`, `addemoji`, `admins-list`, `avatar`, `botinfo`, `color`, `deleteemoji`, `discrim`, `help`, `permissions`, `ping`, `premium`, `remind`, `restrictemoji`, `roleinfo`, `serverinfo`, `snipe`, `suggest`, `tiktok`, `translate`, `uptime`, `userinfo`"
       )

    .addField(
        '<:money:885078204476456980>』__**économie**__',
        "> `addcredits`, `bal`, `bank`, `beg`, `bet`, `creditslb`, `daily`, `deposit`, `find`, `game`, `register`, `pay`, `withdraw`"
       )
         
       
       
    );
  }
};
