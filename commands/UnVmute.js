const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const moment = require("moment");
const config = require('../config.json')
const emoji = require('../emoji.js')
const ms = require('ms')
const limit = new qdb.table("limitler");

exports.run = async(client, message, args) => {
 
var log = client.channels.cache.get(config.vmute.vmutelog)

let embed = new MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true })).setColor('RANDOM').setFooter(config.bots.footer).setTimestamp()
if (!config.vmute.vmutehammer.some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
return message.channel.send(embed.setDescription(`${message.author} Bu komutu kullanabilmek için yeterli yetkin yok!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) return message.channel.send(embed.setDescription(`${message.author} Lütfen bir kullanıcı belirtin @Tedoa/İD gibi.`)).then(tedoa => tedoa.delete({timeout : 8000})).then(message.react(emoji.redemoj))
if (member.user.bot) return message.channel.send(embed.setDescription(`${message.author} Botlara ses mute atılamaz ve kaldırılamaz!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if(member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.author} Kendine ses muteni kaldıramasın!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu Kullanıcı Senden Üst/Aynı Pozisyonda.`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))
let reason = args.splice(2).join(" ") || "Sebep Belirtilmedi."
    
let muteAtılma = `${moment(Date.now()).format("LLL")}`



cdb.push(`sicil.${member.id}.${message.guild.id}`, { 
    mod: message.author.id,
    sebep: reason,
    zaman: Date.now(), 
    komut: "UNVMUTE" 
});



if (member.roles.cache.has(config.vmute.vmuterol)) {
member.voice.setMute(false);
message.channel.send(`${emoji.susturmakaldırıldı} ${member} kişisinin ses kanallarındaki susturulması kaldırıldı!`).then(tedoa => tedoa.delete({ timeout : 10000 })).then(message.react(emoji.onayemoji))
log.send(embed.setDescription(`
${member} (\`${member.user.tag}\` - \`${member.id}\`) adlı kullanıcının ses mutesi kaldırıldı
    
• Kaldıran yetkili: (\`${message.author.tag}\` - \`${message.author.id}\`)
• Kaldırılma sebebi: \`${reason}\`
• Kaldırılma tarihi: \`${muteAtılma}\`
`))
member.roles.remove(config.vmute.vmuterol).catch();

} else {
 
   message.channel.send(embed.setDescription(`${message.author} Bu kullannıcının aktif bir ses mutesi bulunamadı`)).then(tedoa => tedoa.delete({ timeout : 10000 })) .then(message.react(emoji.redemoj))

}




}
exports.conf = {
    enabled : true,
    guildOnly : false,
    aliases : ["ses-mute-kaldır"], 
    permLevel : 0
}

exports.help = {
    name : 'unvmute',
    açıklama:"Belirlenen üyeyi ses kanallarında ki susturmalarını kaldırır.",
    komut: "[UNVMUTE]",
    help: "unvmute [tedoa/ID] [sebep]",
    cooldown: 0
}