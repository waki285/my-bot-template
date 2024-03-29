"use strict";
const discord = require("discord.js");
require("discord-reply");
const client = new discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const disbtn = require("discord.js-buttons")(client);
const fetch = require("node-fetch");
const Keyv = require("keyv");
//const prefixes = new Keyv("sqlite://db.sqlite", { table: "prefixes" });
const { Signale } = require("signale");
const prefix = "!";
const logger = new Signale({ scope: "Discord" });
const fs = require("fs");

const http = require("http");
http.createServer(function (req, res) {
  res.write("OK");
  res.end();
}).listen(8080);

client.once('ready', async () => {
  logger.success("ready!(User=" + client.user.tag + ")");
  client.user.setPresence({ activity: { name: "Bot" }, status: "online" });
});

client.on('message', async message => {
  if (message.author.bot || message.system) return;
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

if (!process.env.token) {
  logger.fatal("TOKENがないで");
  throw new Error("INVALID_TOKEN")
}

client.login(process.env.token)
.then(() => {})
.catch(() => {
  logger.fatal("TOKENがないで");
  throw new Error("INVALID_TOKEN")
})
