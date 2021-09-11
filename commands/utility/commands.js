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
        '🔍┇__**invite-managers**__',
        "> `addbonus`, `removebonus`, `removeinvites`, `restoreinvites`, `sync-invites`, `config`, `configdmjoin`, `configjoin`, `configleave`, `setdmjoin`, `setjoin`, `setleave`, `testdmjoin`, `testjoin`, `testleave`, `invite`, `joinstats`, `topinvite`"
       )
       .addField(
         'Moserations',
         ">'ban-id', 'ban', 'banlist', 'case', 'cases-list', 'clear-warns', 'clear', 'delete-case', 'gend', 'greroll', 'gstart', 'infractions', 'kick', 'lock', 'massban', 'mod-logs', 'mute', 'nuke', 'massrole', 'roles', 'slowmode', 'softban', 'sugg-accept', 'sugg-delete', 'sugg-refuse', 'ticket-add', 'ticket-close', 'unban', 'unbanall', 'unlock', 'unmute', 'warn'"
       )
      .addField(
         'anti raid',
         ">anti-dc, anti-pub, anti-caps, anti-mass-mentions, anti-spam, antiraid-logs, check-users, ignoreds, protect, verification, backup'"
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
        "> auto-music, autoping, auto-publish, auto-reactions, auto-responders, autonick, autorole, boost-message, botautonick, botautorole, chatbot, count-channel, glogs, language, counter, rolereact, set-sugg, setcolor, set-logs, setprefix, tempvoc, ticket-system, youtube-alerts, `setlogchannel`, `disableanisched`, `goodbyetoggle`, `setanischedch`, `setgoodbyech`, `setgoodbyemsg`, `setmute`, `setsuggestch`, `setwelcomech`, `setwelcomemsg`, `togglevotenotif`, `unwatch`, `userxpreset`, `watch`, `welcometoggle`, `xpenable`, `xpexcempt`, `xpreset`, `xptoggle`"
       )
       .addField(
        '😆┇__**amusant**__',
        "> quiz, numberfacts, create-quiz, `8ball`, `advice`, `baka`, `birdfacts`, `blush`, `catfacts`, `comment`, `cry`, `dance`, `disgust`, `dogfacts`, `feed`, `fortune`, `happy`, `holdhands`, `horoscope`, `hug`, `invert`, `joke`, `kill`, `kiss`, `lick`, `meme`, `midfing`, `pandafacts`, `pat`, `poke`, `pokemon`, `rate`, `respect`, `reverse`, `roll`, `slap`, `sleep`, `smile`, `smug`, `suicide`, `tickle`, `triggered`, `wave`, `wink`"
       )
       .addField(
        '🔑┇__**utile**__',
        "> birthdays-list, calculation, holidays, addemoji, admins-list, avatar, botinfo, color, deleteemoji, discrim, help, permissions, ping, premium, remind, restrictemoji, roleinfo, serverinfo, snipe, suggest, tiktok, translate, uptime, userinfo"
       )
       .addField(
        '🎵┇__**musique**__',
        "> back, clearqueue, dj-system, loop, lyrics, np, pause, play, queue, remove, resume, seek, shuffle, skip, stop, volume"
       )
       .addField(
         'levels',
         "> addlevel, addxp, leaderboard, rank, remove-rank, reset-levels, add-rank, ranks"
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
