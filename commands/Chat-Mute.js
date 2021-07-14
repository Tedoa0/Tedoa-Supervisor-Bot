const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar")
const moment = require("moment");
const config = require('../config.json')
const emoji = require('../emoji.js')
const ms = require('ms')
moment.locale('tr')
exports.run = async(client, message, args) => {


var log = client.channels.cache.get(config.cmute.mutelog)

let embed = new MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true })).setColor('RANDOM').setFooter(config.bots.footer).setTimestamp()
if (!config.cmute.mutehammer.some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
return message.channel.send(embed.setDescription(`${message.author} Bu komutu kullanabilmek için yeterli yetkin yok!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) return message.channel.send(embed.setDescription(`${message.author} Lütfen bir kullanıcı belirtin @Tedoa/İD gibi.`)).then(tedoa => tedoa.delete({timeout : 8000})).then(message.react(emoji.redemoj))
if (member.user.bot) return message.channel.send(embed.setDescription(`${message.author} Botlara mute atamasın!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if(member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.author} Kendine mute atamasın!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu Kullanıcı Senden Üst/Aynı Pozisyonda.`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))
let time =  args[1]
if(!time) return message.channel.send(embed.setDescription(`${message.author} Lütfen bir süre belirtin \`[ 1s/1m/1h/1d]\` gibi.`)).then(tedoa => tedoa.delete({timeout : 10000})).then(message.react(emoji.redemoj))
if (ms(args[1]) < ms("5m")) return message.channel.send(embed.setDescription(`${message.author} \`5 dakikadan\` kısa mute atamasın !`)).then(tedoa => tedoa.delete({ timeout : 10000 })).then(message.react(emoji.redemoj))
let reason = args.splice(2).join(" ") || "Sebep Belirtilmedi."


if (member.roles.cache.has(config.cmute.muterol)) return message.channel.send(embed.setDescription(`${message.author} Bu kullanıcı zaten chat kanallarında susturulmuş`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
let yaziSure = time.replace("d", " Gün").replace("h", " Saat").replace("m", " Dakika").replace("s", " Saniye");




let muteBitiş = `${moment(Date.now()+ms(time)).format("LLL")}` 
let muteAtılma = `${moment(Date.now()).format("LLL")}`

member.roles.add(config.cmute.muterol).catch();

pdb.add(`cmute.${message.author.id}.${message.guild.id}`, +1);
cdb.push(`sicil.${member.id}.${message.guild.id}`, {
    mod : message.author.id,
    sebep : reason,
    zaman : Date.now(),
    komut : "TEMP-MUTE" 
 });





if (member.manageable) member.setNickname(`[ Muted ] ${member.displayName}`).catch(console.log);
message.channel.send(`${emoji.susturuldu} ${member} kişisi ${yaziSure} boyunca yazı kanallarında susturuldu.`)
log.send(new MessageEmbed()
.setColor('RANDOM')
.setFooter(config.bots.footer)
.setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true }))
.setDescription(`${member} (\`${member.user.tag}\` - \`${member.id}\`) kişisi ${yaziSure} boyunca metin kanallarında susturuldu
• Susturulma sebebi: \`${reason}\`
• Chat Mute atılma tarihi: \`${muteAtılma}\`
• Chat Mute bitiş tarihi: \`${muteBitiş}\``))
message.react(emoji.onayemoji)




setTimeout(async function() {
member.roles.remove(config.cmute.muterol).catch();
if(member.manageable) member.setNickname(member.displayName.replace("[ Muted ]", "")).catch();
}, ms(time));





    }
    exports.conf = {
        enabled : true,
        guildOnly : false,
        aliases : ['chatmute','chat-mute','mute'], 
        permLevel : 0
    }
    
    exports.help = {
        name : 'cmute',
        açıklama:"Belirlenen üyeyi belirtilen süre boyunca metin kanallarında susturur.",
        komut: "[CHAT MUTE]",
        help: "cmute [tedoa/ID] [süre] [sebep]",
        cooldown: 0
    }
    