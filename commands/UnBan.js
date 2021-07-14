const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const moment = require("moment");
const config = require('../config.json')
const emoji = require('../emoji.js')
const ms = require('ms')


exports.run = async(client, message, args) => { 

    
var log = client.channels.cache.get(config.ban.banlog)

let embed = new MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true })).setColor('RANDOM').setFooter(config.bots.footer).setTimestamp()
if (!config.ban.banhammer.some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
return message.channel.send(embed.setDescription(`${message.author} Bu komutu kullanabilmek için yeterli yetkin yok!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
    

    
    if (!args[0] || isNaN(args[0])) return message.channel.send(embed.setDescription("Geçerli bir kişi ID'si belirtmelisin!")).then(x => x.delete({timeout: 5000})).then(message.react(emoji.redemoj))
    let member = await client.users.fetch(args[0]);
    if(member) {
      let reason = args.splice(1).join(" ") || "Sebep Belirtilmedi.";
      message.guild.members.unban(member.id)
      message.react(emoji.onayemoji).catch();
      message.channel.send(`${emoji.tikemoji} <@${member.id}> adlı üyenin yasağı ${message.author} tarafından kaldırıldı `)
      message.react(emoji.onayemoji)
      log.send(`${emoji.onayemoji} **${member.tag}** adlı kullanıcın \`${reason}\` sebebiyle **${message.author.tag}** tarafından sunucu yasağı kaldırıldı.`)
      cdb.push(`sicil.${member.id}.${message.guild.id}`, { mod: message.author.id, sebep: reason, zaman: Date.now(), komut: "UNBAN" });
      
    } else {
      message.channel.send(embed.setDescription("Geçerli bir kişi ID'si belirtmelisin!")).then(x => x.delete({timeout: 5000})).then(message.react(emoji.redemoj))
    };

};

exports.conf = {
    enabled : true,
    guildOnly : false,
    aliases : [], 
    permLevel : 0
}

exports.help = {
    name : 'unban',
    help: "unban [tedoa/ID] [sebep] ",
    cooldown: 0
}