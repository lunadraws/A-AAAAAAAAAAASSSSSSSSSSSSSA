module.exports = {
  name: 'rate',
  aliases: [],
  group: '__**Amusant**__',
  description: 'Rates the provided argument',
  parameters: [ 'something to rate with' ],
  examples: [
    'rate Potato',
    'rate cheese',
    'rate Bringles'
  ],
  run: (client, message, args) => {

    if (!args.length){
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}! Donnez-moi quelque chose à noter!!`);
    };

    const raw = args.join(' ').replace(/[^\w\s]/gi,1202)
    let rate = parseInt(raw, 36) % 101;
    const emoji = (rate) => [
        '\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️'
    ][Math.floor(rate / 10)];

    if ([
      'flox', 'FloxYTB', 'horizongame', 'HorizonGame',
    ].includes(raw.toLowerCase())){
      rate = 100;
    };

    return message.channel.send(`${emoji(rate)} (**${rate}**) %`)
  }
};
