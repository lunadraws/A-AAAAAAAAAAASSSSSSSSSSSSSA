const settings = {
  // pass in any client configuration you want for the bot.
  // more client options can be found at
  // https://discord.js.org/#/docs/main/stable/typedef/ClientOptions
  client: {
    presence: {
      activity: {
        name: 'faite h.help pour voir mes commands',
        type: 'COMPETING'
      }
    },
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
  prefix: '>',

  // allowed features for the bot, you can add/remove features you want.
  allowedFeatures: [ 'ANISCHEDULE', 'CHATBOT', 'EXPERIENCE_POINTS'],

  // logging channels for the bot. To disable logging specific events - pass
  // a falsy value (undefined, null, 0). You may also remove the property
  // altogether, although this is not preferred.
  channels: { debug: '833599071322898457', votes: '833606082776662026', uploads: '833606082776662026', logs: '833606082776662026' },

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
  owners: [ '340164875193942016' ],

  // websites affiliated with the bot, can be accessed through
  // Client#config#websites
  websites: {
    "invite": "https://discord.com/oauth2/authorize?client_id=688407554904162365&scope=bot&permissions=2147483647",
    "support": "https://discord.gg/vkKwAKjn7G",
    "top.gg": "https://top.gg/bot/688407554904162365",
  }
};

module.exports = settings;
