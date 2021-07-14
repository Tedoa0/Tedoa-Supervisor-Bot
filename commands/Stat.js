const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const pdb = new qdb.table("puanlar")
const moment = require("moment");
const config = require('../config.json')
const emoji = require('../emoji.js')
const ms = require('ms')
moment.locale('tr')
exports.run = async(client, message, args) => {

let embed = new MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true})).setColor("RANDOM").setFooter(config.bots.footer).setTimestamp();
let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
let member = message.guild.member(user)

let jail = pdb.get(`jail.${message.author.id}.${message.guild.id}`);
let ban = pdb.get(`ban.${message.author.id}.${message.guild.id}`);
let cmute = pdb.get(`cmute.${message.author.id}.${message.guild.id}`);
let vmute = pdb.get(`vmute.${message.author.id}.${message.guild.id}`);
let name = `${member.user.username}`;

if (member.roles.cache.has(config.diğer.stathammer)){
message.channel.send(embed.setDescription(`
${member} adlı kullanıcının ${config.diğer.sunucuName} sunucusunda ki işlemleri-verileri getirildi.

❯ Kullanıcı Adı: \`${name}\`
❯ Kullanıcı IDsi: \`${member.id}\`
❯ Oluşturulma Tarihi: \`${moment(member.user.createdAt).format("LLL")}\`
────────────────────────────
❯ Genel Olarak \`${jail+ban+cmute+vmute || "0"}\` tane kişiye **Ceza Vermiş.**
❯ Toplam \`${ban || "0"}\` tane kişiyi **Sunucudan Yasaklamış.**
❯ Toplam \`${jail || "0"}\` tane kişiye <@&${config.jail.jailrol}> rolü vermiş.
❯ Toplam \`${cmute || "0"}\` tane kişiye <@&${config.cmute.muterol}> rolü vermiş.
❯ Toplam \`${vmute || "0"}\` tane kişiye <@&${config.vmute.vmuterol}> rolü vermiş.`))
} else {
message.channel.send(embed.setDescription(`${message.author} bu kullanıcı bir yetkili değil`)).then(tedoa => tedoa.delete({ timeout : 10000 })).then(message.react(emoji.redemoj))
}
 
    }
    exports.conf = {
        enabled : true,
        guildOnly : false,
        aliases : [], 
        permLevel : 0
    }
    
    exports.help = {
        name : 'stat',
        help: 'stat [tedoa/ID]',
        cooldown: 0
    }
    