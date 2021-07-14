const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const config = require('../config.json')
const moment = require('moment')
const emoji = require('../emoji.js')
moment.locale('tr')
exports.run = async(client, message, args) => {
 

  
let embed = new MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true })).setColor('RANDOM').setFooter(config.bots.footer).setTimestamp()
if(!config.diğer.sicilhammer.some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
return message.channel.send(embed.setDescription(`${message.author} Bu komutu kullanabilmek için yeterli yetkin yok!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))

let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
 if(!user) return message.channel.send(embed.setDescription(`${message.author} Lütfen bir kullanıcı belirtin @Tedoa/İD gibi`))
let data = cdb.get(`sicil.${user.id}.${message.guild.id}`) || [];
let yazıGetir = data.length > 0 ? data.map((value, index) => `\`${index+1}.\` [**${value.komut}**] ${client.users.cache.get(value.mod) || value.mod} tarafından **${value.sebep}** nedeniyle ${moment(value.zaman).format('LLL')} zamanında cezalandırılmış.`).join("\n") : "Bu Üyenin Ceza Bilgisi Bulunamadı."
message.channel.send(embed.setDescription(`${yazıGetir}`)).then(message.react(emoji.onayemoji))
 if(data.length >= 15) return message.channel.send(embed.setDescription(`kişisinin cezaları **Discord API** sınırını geçtiği için kişinin sicilini gösteremiyorum`)).then(tedoa => tedoa.delete({ timeout : 10000 })).then(message.react(emoji.redemoj))
}
exports.conf = {
    enabled : true,
    guildOnly : false,
    aliases : [], 
    permLevel : 0
}

exports.help = {
    name : 'sicil',
    açıklama:"Belirlenen üyenin ceza geçmişini gösterir.",
    komut: "[SİCİL]",
    help: "sicil [tedoa/ID]",
    cooldown: 0
}