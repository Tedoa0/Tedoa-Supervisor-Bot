const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar")
const moment = require("moment");
const config = require('../config.json')
const emoji = require('../emoji.js')
const ms = require('ms')

exports.run = async (client, message, args) => {

  
if (args[0] && (args[0].includes('bilgi') || args[0].includes('info') || args[0].includes('sex'))){
if(!args[1] || isNaN(args[1])) return message.channel.send(new MessageEmbed().setFooter(config.bots.footer).setDescription(`${message.author}, Geçerli bir ban yemiş kullanıcı ID'si belirtmelisin.`).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor('RANDOM').setTimestamp()).then(x => x.delete({timeout: 5000}));
return message.guild.fetchBan(args.slice(1).join(' ')).then(({ user, reason }) => message.channel.send(new MessageEmbed().setFooter(config.bots.footer).setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor('RANDOM').setTimestamp().setDescription(`**Banlanan Üye:** ${user.tag} (\`${user.id}\`)\n**Ban Sebebi:** ${reason ? reason : "Belirtilmemiş!"}`))).catch(err => message.channel.send(new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor('0x800d0d').setTimestamp().setDescription("Belirtilen ID numarasına sahip bir ban bulunamadı!")).then(x => x.delete({timeout: 5000})));
}


var log = client.channels.cache.get(config.ban.banlog)


let embed = new MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true })).setColor('RANDOM').setFooter(config.bots.footer).setTimestamp()
if (!config.ban.banhammer.some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
return message.channel.send(embed.setDescription(`${message.author} Bu komutu kullanabilmek için yeterli yetkin yok!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) return message.channel.send(embed.setDescription(`${message.author} Lütfen bir kullanıcı belirtin @Tedoa/İD gibi.`)).then(tedoa => tedoa.delete({timeout : 8000})).then(message.react(emoji.redemoj))
if (member.user.bot) return message.channel.send(embed.setDescription(`${message.author} Botlara ban atamasın!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if(member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.author} Kendine ban atamasın!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu Kullanıcı Senden Üst/Aynı Pozisyonda.`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))
let reason = args.splice(1).join(" ") || "Sebep Belirtilmedi."

pdb.add(`ban.${message.author.id}.${message.guild.id}`, +1);
cdb.push(`sicil.${member.id}.${message.guild.id}`, { 
   mod: message.author.id, 
    sebep: reason,
     zaman: Date.now(), 
     komut: "BAN"
     });


member.send(`${member} \`${config.diğer.sunucuName}\` adlı sunucuda ${message.author} tarafından \`${reason}\` sebebiyle banlandın !`)
.catch(() => { 
  console.log(`[Ban Komutu] ${member.user.tag} adlı  kullanıcıya dm kapalı olduğu için dm mesaj atamadım !`)
  })
message.channel.send(new MessageEmbed().setColor('RANDOM').setImage(config.ban.bangif).setFooter(config.bots.footer).setDescription(`**${member.user.tag}** kullanıcısı **${message.author.tag}** tarafından başarıyla sunucudan yasaklandı.`))
message.react(emoji.onayemoji)
log.send(`${emoji.onayemoji} **${member.user.tag}** adlı kullanıcı \`${reason}\` sebebiyle **${message.author.tag}** tarafından yasaklandı.`)
member.ban({reason: reason}).catch();



}

exports.conf = {
    aliases: ['infaz'],
    permLevel: 0
  };
  
  exports.help = {
    name: 'ban',
    açıklama:"Belirlenen üyeyi sunucudan yasaklayarak tekrar girmesini engeller.",
    komut: "[BAN]",
    help: "ban [tedoa/ID] [sebep]",
    cooldown: 0

  };