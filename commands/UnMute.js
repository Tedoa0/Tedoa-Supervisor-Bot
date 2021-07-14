const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const moment = require("moment");
const config = require('../config.json')
const emoji = require('../emoji.js')
const ms = require('ms')
exports.run = async(client, message, args) => {
 
var log = client.channels.cache.get(config.cmute.mutelog)


let embed = new MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true })).setColor('RANDOM').setFooter(config.bots.footer).setTimestamp()
if (!config.cmute.mutehammer.some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
return message.channel.send(embed.setDescription(`${message.author} Bu komutu kullanabilmek için yeterli yetkin yok!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) return message.channel.send(embed.setDescription(`${message.author} Lütfen bir kullanıcı belirtin @Tedoa/İD gibi.`)).then(tedoa => tedoa.delete({timeout : 8000})).then(message.react(emoji.redemoj))
if (member.user.bot) return message.channel.send(embed.setDescription(`${message.author} Botlara mute atılamaz ve kaldırılamaz!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if(member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.author} Kendine muteni kaldıramasın!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu Kullanıcı Senden Üst/Aynı Pozisyonda.`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))
let reason = args.splice(2).join(" ") || "Sebep Belirtilmedi."

let muteAtılma = `${moment(Date.now()).format("LLL")}`


cdb.push(`sicil.${member.id}.${message.guild.id}`, {
     mod: message.author.id, 
    sebep: reason, 
    zaman: Date.now(), 
    komut: "UNMUTE"
 });



if (member.roles.cache.has(config.cmute.muterol)) {
if(member.manageable) member.setNickname(member.displayName.replace("[ Muted ]", "")).catch();
message.channel.send(`${emoji.susturmakaldırıldı} ${member} kişisinin yazı kanallarındaki susturulması kaldırıldı!`).then(tedoa => tedoa.delete({ timeout : 10000 })).then(message.react(emoji.onayemoji))
log.send(embed.setDescription(`
${member} (\`${member.user.tag}\` - \`${member.id}\`) adlı kullanıcının chat mutesi kaldırıldı
    
• Kaldıran yetkili: (\`${message.author.tag}\` - \`${message.author.id}\`)
• Kaldırılma sebebi: \`${reason}\`
• Kaldırılma tarihi: \`${muteAtılma}\`
`))
member.roles.remove(config.cmute.muterol).catch();

} else {
 
   message.channel.send(embed.setDescription(`${message.author} Bu kullannıcının aktif bir chat mutesi bulunamadı`)).then(tedoa => tedoa.delete({ timeout : 10000 })) .then(message.react(emoji.redemoj))

}



}
exports.conf = {
    enabled : true,
    guildOnly : false,
    aliases : [], 
    permLevel : 0
}

exports.help = {
    name : 'unmute',
    açıklama:"Belirlenen üyeyi metin kanallarında ki susturmalarını kaldırır.",
    komut: "[UNMUTE]",
    help: "unmute [tedoa/ID] [sebep]",
    cooldown: 0
}