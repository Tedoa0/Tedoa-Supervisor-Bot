const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const ms = require("ms");
const config = require('../config.json')
const emoji = require('../emoji.js')
const moment = require("moment");
const { MessageEmbed } = require("discord.js");

exports.run = async(client, message, args) => {
     

var log = client.channels.cache.get(config.jail.jaillog)

let embed = new MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true })).setColor('RANDOM').setFooter(config.bots.footer).setTimestamp()
if(!config.jail.jailhammer.some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
return message.channel.send(embed.setDescription(`${message.author} Bu komutu kullanabilmek için yeterli yetkin yok!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))


let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) return message.channel.send(embed.setDescription(`${message.author} Lütfen bir kullanıcı belirtin @Tedoa/İD gibi.`)).then(tedoa => tedoa.delete({timeout : 8000})).then(message.react(emoji.redemoj))
if (member.user.bot) return message.channel.send(embed.setDescription(`${message.author} Botları jail'a atamasın!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if(member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.author} Kendine jail'a atamasın!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu Kullanıcı Senden Üst/Aynı Pozisyonda.`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))
if(member.id === message.guild.OwnerID) return message.channel.send(new MessageEmbed().setDescription(`${message.author}, Sunucu sahibini sunucudan cezalıya atılamaz.`).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor('0x800d0d').setTimestamp()).then(x => x.delete({timeout: 5000}));
let time = args[1]
if(!time) return message.channel.send(embed.setDescription(`${message.author} Lütfen bir süre belirtin \`[ 1s/1m/1h/1d]\` gibi.`)).then(tedoa => tedoa.delete({timeout : 10000})).then(message.react(emoji.redemoj))
let reason = args.splice(2).join(" ") || "Sebep Belirtilmedi."
if (member.roles.cache.has(config.jail.jailrol)) return message.channel.send(embed.setDescription(`${message.author} Bu kullanıcı zaten jail'da`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
member.roles.cache.has(config.user.booster) ? member.roles.set([config.user.booster, config.jail.jailrol]) : member.roles.set([config.jail.jailrol]);

 

let yaziSure = time.replace("d", " Gün").replace("h", " Saat").replace("m", " Dakika").replace("s", " Saniye");
//if (ms(args[1]) < ms("5m")) return message.channel.send(embed.setDescription(`${message.author} \`5 dakikadan\` jail atamasın !`)).then(teoda => tedoa.delete({ timeout : 10000 })).then(message.react(emoji.redemoj))
let jailBitiş = `${moment(Date.now()+ms(time)).format("LLL")}` 
let jailAtılma = `${moment(Date.now()).format("LLL")}`



pdb.add(`jail.${message.author.id}.${message.guild.id}`, +1);
cdb.push(`sicil.${member.id}.${message.guild.id}`, {
    mod: message.author.id, 
    sebep: reason,
    zaman: Date.now(), 
    komut: "JAIL"
     });

message.channel.send(`${emoji.cezalı} ${member} kişisi **${reason}** nedeni ile **${yaziSure}** süresince cezalandırıldı.`)
message.react(emoji.onayemoji)

member.roles.add(config.jail.jailrol);
member.roles.cache.forEach(r => {
 member.roles.remove(r.id)
qdb.set(`${message.guild.id}.jail.${member.id}.roles.${r.id}`, r.id )})
if (member.voice.channel) member.voice.kick();  
log.send(new MessageEmbed()
.setColor('RANDOM')
.setFooter(config.bots.footer)
.setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true }))
.setDescription(`${member} (\`${member.user.tag}\` - \`${member.id}\`) kişisi ${yaziSure} boyunca jail'a atıldı
• Jail'a atılma sebebi: \`${reason}\`
• Jail'a atılma tarihi: \`${jailAtılma}\`
• Jail' bitiş tarihi: \`${jailBitiş}\``))
message.react(emoji.onayemoji)


               

            setTimeout(async () =>{
member.roles.remove(config.jail.jailrol)
message.guild.roles.cache.forEach(async r => {
const roller = await qdb.fetch(`${message.guild.id}.jail.${member.id}.roles.${r.id}` )
if(roller != r.id)  return ;

if(roller){member.roles.add(roller)}
qdb.delete(`${message.guild.id}.jail.${member.id}.roles.${r.id}`)
})
              }, ms(time));






}
exports.conf = {
    enabled : true,
    guildOnly : false,
    aliases : [], 
    permLevel : 0
}

exports.help = {
    name : 'jail',
    açıklama:"Belirlenen üyeyi belirtilen süre boyunca cezalıya atar.",
    komut: "[JAİL]",
    help: "jail [tedoa/ID] [süre] [sebep]",
    cooldown: 0
}