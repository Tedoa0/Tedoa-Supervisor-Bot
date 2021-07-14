  
const db = require("quick.db");
const { MessageEmbed } = require('discord.js')
const cdb = new db.table("cezalar");
const config = require('../config.json')
const moment = require('moment')
const ms = require('ms');
const emoji = require('../emoji.js')
exports.run = async(client, message, args) => {

var log = client.channels.cache.get(config.jail.jaillog)

let embed = new MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true })).setColor('RANDOM').setFooter(config.bots.footer).setTimestamp()
if(!config.jail.jailhammer.some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
return message.channel.send(embed.setDescription(`${message.author} Bu komutu kullanabilmek için yeterli yetkin yok!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) return message.channel.send(embed.setDescription(`${message.author} Lütfen bir kullanıcı belirtin @Tedoa/İD gibi.`)).then(tedoa => tedoa.delete({timeout : 8000})).then(message.react(emoji.redemoj))
if (member.user.bot) return message.channel.send(embed.setDescription(`${message.author} Botların jail cezası olmaz!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if(member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.author} Kendi jail cezanı kaldıramazsın!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu Kullanıcı Senden Üst/Aynı Pozisyonda.`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))
if(member.id === message.guild.OwnerID) return message.channel.send(new MessageEmbed().setDescription(`${message.author}, Sunucu sahibi nasıl cezalıya atılmış olabilir ki?`).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor('0x800d0d').setTimestamp()).then(x => x.delete({timeout: 5000}));
let reason = args.splice(1).join(" ") || "Sebep Belirtilmedi."
member.roles.cache.has(config.user.booster) ? member.roles.set([config.user.booster, config.jail.jailrol]) : member.roles.set([config.jail.jailrol]);


cdb.push(`sicil.${member.id}.${message.guild.id}`, {
     mod: message.author.id,
     sebep: reason, 
     aman: Date.now(), 
     komut: "UN-JAIL" 
    });


let jailAtılma = `${moment(Date.now()).format("LLL")}`

if (member.roles.cache.has(config.jail.jailrol)) {
member.roles.remove(config.jail.jailrol).catch();

message.channel.send(`${emoji.tikemoji} ${member} kişisinin jail cezası kaldırıldı!`).then(tedoa => tedoa.delete({ timeout : 10000 })).then(message.react(emoji.onayemoji))
log.send(embed.setDescription(`
${member} (\`${member.user.tag}\` - \`${member.id}\`) adlı kullanıcının jail cezası kaldırıldı
    
• Kaldıran yetkili: (\`${message.author.tag}\` - \`${message.author.id}\`)
• Kaldırılma sebebi: \`${reason}\`
• Kaldırılma tarihi: \`${jailAtılma}\``))


message.guild.roles.cache.forEach(async r => {
    let roller = db.fetch(`${message.guild.id}.jail.${member.id}.roles.${r.id}` )
    if(roller != r.id)  return ;
    if(roller){member.roles.add(roller)}
     member.roles.remove(config.jail.jailrol)
    })


} else {
 
   message.channel.send(embed.setDescription(`${message.author} Bu kullannıcının aktif bir jail'ı bulunamadı`)).then(tedoa => tedoa.delete({ timeout : 10000 })) .then(message.react(emoji.redemoj))

}


    
}
exports.conf = {
    enabled : true,
    guildOnly : false,
    aliases : ["jail-kaldır","ceza-kaldır"], 
    permLevel : 0
}

exports.help = {
    name : 'unjail',
    açıklama:"Belirlenen üyeyi cezalıdan çıkartır",
    komut: "[UNJAİL]",
    help: "unjail [tedoa/ID] [sebep]",
    cooldown: 0
}