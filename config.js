
const settings = {
  // pass in any client configuration you want for the bot.
  // more client options can be found at
  // https://discord.js.org/#/docs/main/stable/typedef/ClientOptions
  client: {
    presence: {
      activity: {
        name: 'https://zbdfd.ml/',
        type: 'COMPETING'
      }
    },
    // Disable Mentions except Users
    allowedMentions: {parse: ['users']},
    // Sweep messages every 12 hours
    messageCacheLifetime: 43200,
    messageSweepInterval: 43200
  },

  // Websites to monitor, accessible via client#pings
  // function must be instances of promise.
  monitorPings: {
    timeout: 600000,
    requests: [
      {
        name: 'jikan',
        url: 'https://api.jikan.moe/v3/character/1',
        registerAs: 'Jikan Latency',
        description: 'Jikan latency displays the average amount of time it takes to fetch data from MyAnimeList.net.'
      },{
        name: 'anilist',
        url: 'https://graphql.anilist.co',
        options: { method: 'POST', body: JSON.stringify({ query: `{Media{id}}`})},
        registerAs: 'AniList Latency',
        description: 'Anilist latency displays the average amount of time it takes to fetch data from Anilist.co.'
      },{
        name: 'reddit',
        url: 'https://reddit.com/r/animemes.json',
        registerAs: 'Reddit Latency',
        description: 'Reddit latency displays the time delay between sending requests and receiving data to and from reddit, respectively.'
      },{
        name: 'jisho',
        url: 'https://jisho.org/api/v1/search/words?keyword=konnichiwa' ,
        registerAs: 'Jisho Latency',
        description: 'Jisho latency displays the amout of time it takes to make a full round of sending-and-receiveing of data from them.'
      },
      {
        name: 'steam',
        url: 'https://store.steampowered.com/api/storesearch/?cc=us&l=en&term=DDLC',
        registerAs: 'Steam Latency',
        description: 'Steam latency displays the amount of time it takes to request and receive an information from the STEAM API'
      },{
        name: 'time',
        url: 'https://time.is/tokyo',
        registerAs: 'Time.is Latency',
        description: 'Time.is latency shows the time it takes to make a full request to the Time.is API'
      },{
        name: 'urban',
        function: require('relevant-urban')('start'),
        registerAs: 'Urban Latency',
        description: 'Urban latency shows the time it takes to make a full request to the Urban Dictionary API.'
      },
    ]
  },

  // set the default prefix, if non-string data-type is provided, will resolve
  // to the prefix 'm!'
  prefix: '*',

  // allowed features for the bot, you can add/remove features you want.
  allowedFeatures: [ 'ANISCHEDULE', 'CHATBOT', 'EXPERIENCE_POINTS'],

  // logging channels for the bot. To disable logging specific events - pass
  // a falsy value (undefined, null, 0). You may also remove the property
  // altogether, although this is not preferred.
  channels: { debug: '895301398294560796', votes: '895301398294560796', uploads: '895301398294560796', logs: '895301398294560796' },

  // enable/disable database system in the bot, this will automatically disable
  // all commands and features that requires database if disabled.
  database: {
    enable: true,
    uri: process.env.MONGO_URI,
    config: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoIndex: false,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4
    }
  },
  
  // Array of owners recognized by the bot. ID here will be given access to
  // owner based commands.
  owners: [ '681921952968998966' ],

  // websites affiliated with the bot, can be accessed through
  // Client#config#websites
  websites: {
    "website": "https://zbdfd.ml/",
    "invite": "https://discordapp.com/oauth2/authorize?client_id=688407554904162365&scope=bot&permissions=2146958847",
    "support": "https://discord.gg/5qbAGCykRd",
    "top.gg": "https://top.gg/bot/688407554904162365/vote",
    "DBL": "https://discordbotlist.com/bots/horizongame/upvote"
  }
};

module.exports = settings;
