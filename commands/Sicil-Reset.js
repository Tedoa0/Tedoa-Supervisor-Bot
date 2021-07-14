const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const kdb = new qdb.table("ceza");
const config = require("../config.json");
const emoji = require("../emoji");

exports.run = async(client, message, args) => {


    
  let embed = new MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true })).setColor('RANDOM').setFooter(config.bots.footer).setTimestamp()
  if(!config.diğer.sicilhammer.some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
  return message.channel.send(embed.setDescription(`${message.author} Bu komutu kullanabilmek için yeterli yetkin yok!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
  
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(embed.setDescription(`${message.author} Lütfen bir kullanıcı belirtin @Tedoa/İD gibi.`)).then(tedoa => tedoa.delete({timeout : 8000})).then(message.react(emoji.redemoj))
    if(!member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(`Bu Kullanıcı Sizle Üst/Aynı Pozisyondadır.`)
    if(member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.author} Kendi Sicilini Sıfırlayamasın !`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
    if (member.user.bot) return message.channel.send(embed.setDescription(`${message.author} Botların Sicili Olmaz !`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))

  message.channel.send(embed.setDescription(`${member} Adlı kullanıcının başarıyla sicili sıfırlandı` || "Bu Üyenin Ceza Bilgisi Bulunamadı.")).then(tedoa => tedoa.delete({ timeout:10000 }))
  cdb.delete(`sicil.${member.id}.${message.guild.id}`)
  message.react(emoji.onayemoji)



}
exports.conf = {
    enabled : true,
    guildOnly : false,
    aliases : [], 
    permLevel : 0
}

exports.help = {
    name : 'sicil-reset',
    açıklama:"Belirlenen üyenin ceza geçmişini temizler.",
    komut: "[SİCİL-RESET]",
    help: "sicil-reset [tedoa/ID]",
    cooldown: 0
}