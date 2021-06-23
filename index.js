"use strict";
const discord = require("discord.js");
require("discord-reply");
const client = new discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const disbtn = require("discord.js-buttons")(client);
const fetch = require("node-fetch");
const Keyv = require("keyv");
//const prefixes = new Keyv("sqlite://db.sqlite", { table: "prefixes" });

const prefix = "!";

const http = require("http");
http.createServer(function (req, res) {
  res.write("OK");
  res.end();
});

client.once('ready', async () => {
  console.log("ready!(User=" + client.user.tag + ")");
  client.user.setPresence({ activity: { name: "Bot" }, status: "online" });
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix)) return;
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "run" || command === "eval") {
    if (message.author.id !== "744752301033521233"/*自分のIDにしてね*/) return message.channel.send("あなたはBotのオーナーではありません");
    try {
      const code = args.join(" ");
      let evaled = eval(code);
      if (typeof evaled != "string") evaled = require("util").inspect(evaled);
      message.channel.send(evaled, { code: "xl" });
    } catch (err) {
      message.channel.send(`エラー:\n\`\`\`xl\n${err}\n\`\`\``);
    }
  }
});

client.login(process.env.token)