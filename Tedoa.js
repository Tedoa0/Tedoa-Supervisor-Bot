const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db");
const fs = require("fs");
const ms = require("ms");
const moment = require("moment");
const ayarlar = require("./ayarlar.json");
const chalk = require('chalk');
const config = require('./config.json')
const emoji = require('./emoji')
require("moment-duration-format");


var prefix = ayarlar.prefix;
client.cooldowns = new Discord.Collection();

const log = (message) => {
  console.log(chalk.blue`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  log(chalk.white`${files.length} komut yüklenecek.`);
  files.forEach((f) => {
    let props = require(`./commands/${f}`);
    log(chalk.red`Yüklenen komut | [${props.help.name}]`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach((alias) => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = (command) => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach((alias) => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = (command) => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./commands/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach((alias) => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = (command) => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  log(chalk.red`Yüklenen eventler | [${event.name}]`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}


client.elevation = (message) => {
  if (!message.guild) {
    let perm = 2;
    ayarlar.owner.forEach((a) => {
      if (a == message.author.id) perm = 5;
    });
    return perm;
  }
  let permlvl = 0;
  if (message.member.hasPermission("CREATE_INSTANT_INVITE")) permlvl = 2;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 3;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 4;
  if (message.author.id === ayarlar.owner) permlvl = 5;
  return permlvl;
};


client.login(ayarlar.token).then(x => console.log(`[Tedoa] - Bot  olarak giriş yaptı!`)).catch(err => console.error(`[Tedoa] - Bot giriş yapamadı | Hata: ${err}`))
