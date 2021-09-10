const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
  name: 'help',
  aliases: [ 'cmd', 'command' ],
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
      .setAuthor('Liste complète des commandes de HorizonGame!')
      .setImage('https://cdn.discordapp.com/attachments/766973870350663730/814984024233345024/standard.gif')
      .setTimestamp()
      
      .setFooter(`help | \©️${new Date().getFullYear()} HorizonGame`)
        .addField(
        '🚫┇__**modération**__',
        "> `setnickname`, `slowmode`, `addemoji`, `addroles`, `ban`, `clear`, `hackban`, `kick`, `lockdown`, `mute`, `nuke`, `resetchannel`, `resetroles`, `reponse`, `softban`, `softlockdown`, `softmute`, `unban`, `unmute`"
       )
       .addField(
        '✏️┇__**anime**__',
        "> `alprofile`, `anime`, `animeme`, `aniquote`, `anirandom`, `character`, `discover`, `hanime`, `malprofile`, `manga`, `mangarandom`, `nextairdate`, `schedule`, `seiyuu`, `upcoming`, `waifu`"
       )
       .addField(
        '💰┇__**économie**__',
        "> `addcredits`, `bal`, `bank`, `beg`, `bet`, `creditslb`, `daily`, `deposit`, `find`, `game`, `leaderboard`, `nonxpchannels`, `profile`, `register`, `setbio`, `setbirthday`, `setcolor`, `tip`, `pay`, `withdraw`"
       )
       .addField(
        '⚙️┇__**configuration**__',
        "> `setlogchannel`, `disableanisched`, `goodbyetoggle`, `setanischedch`, `setgoodbyech`, `setgoodbyemsg`, `setmute`, `setsuggestch`, `setwelcomech`, `setwelcomemsg`, `togglevotenotif`, `unwatch`, `userxpreset`, `watch`, `welcometoggle`, `xpenable`, `xpexcempt`, `xpreset`, `xptoggle`"
       )
       .addField(
        '😆┇__**amusant**__',
        "> `youtube`, `yesno`, `trumptweet`, `trivia`, `translate`, `topics`, `thouart`, `solotrivia`, `shibe`, `say`, `rps`, `minesweeper`, `math`, `geometrydashsay`, `fox`, `emojify`, `duck`, `dog`, `corona`, `coinflip`, `cat`, `bird`, `8ball`, `advice`, `baka`, `birdfacts`, `blush`, `catfacts`, `comment`, `cry`, `dance`, `disgust`, `dogfacts`, `feed`, `fortune`, `happy`, `holdhands`, `horoscope`, `hug`, `invert`, `joke`, `kill`, `kiss`, `lick`, `meme`, `midfing`, `pandafacts`, `pat`, `poke`, `pokemon`, `rate`, `respect`, `reverse`, `roll`, `slap`, `sleep`, `smile`, `smug`, `suicide`, `tickle`, `triggered`, `wave`, `wink`"
       )
       .addField(
        '🔑┇__**utile**__',
        "> `userinfo`, `stats`, `serverinfo`, `servericon`, `roleinfo`, `permissions`, `members`, `findid`, `emojis`, `channelinfo`, `botinfo`, `embed`, `avis`, `avatar`, `reportbug`, `define`, `emoji`, `jisho`, `listrole`, `reddit`, `steam`, `suggest`, `watching`, `ping`"
       )
       .addField(
        '🎵┇__**musique**__',
        "> `bassboost`, `clearsong`, `disconnect`, `grab`, `loop`, `loopqueue`, `lyrics`, `nowplaying`, `pause`, `play`, `queue`, `remove`, `resume`, `search`, `seek`, `shuffle`, `skip`, `skipto`, `volume`, `joinytb`"
       )
       .addField(
        '🔍┇__**invite-managers**__',
        "> `addbonus`, `removebonus`, `removeinvites`, `restoreinvites`, `sync-invites`, `config`, `configdmjoin`, `configjoin`, `configleave`, `setdmjoin`, `setjoin`, `setleave`, `testdmjoin`, `testjoin`, `testleave`, `invite`, `joinstats`, `topinvite`"
       )
       .addField(
        '🖇️┇**__liens__**', 
        '> **[Invite moi](https://discordapp.com/oauth2/authorize?client_id=688407554904162365&scope=bot&permissions=2146958847) | ' +
        '[Support](https://discord.gg/5qbAGCykRd) | ' +
        '[Site web](https://zbdfd.ml/) | ' +
        '[Top.gg](https://top.gg/bot/688407554904162365/vote) | ' +
        '[Youtube](https://youtube.com/c/NettleYTBBDFD)**'
      )
       
    );
  }
};
