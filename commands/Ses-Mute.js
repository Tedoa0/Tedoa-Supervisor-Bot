const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar")
const ms = require("ms");
const config = require('../config.json')
const emoji = require('../emoji.js')
const moment = require("moment");
const { MessageEmbed } = require("discord.js");

exports.run = async(client, message, args) => {

var log = client.channels.cache.get(config.vmute.vmutelog)

let embed = new MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true })).setColor('RANDOM').setFooter(config.bots.footer).setTimestamp()
if(!config.vmute.vmutehammer.some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
return message.channel.send(embed.setDescription(`${message.author} Bu komutu kullanabilmek için yeterli yetkin yok!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) return message.channel.send(embed.setDescription(`${message.author} Lütfen bir kullanıcı belirtin @Tedoa/İD gibi.`)).then(tedoa => tedoa.delete({timeout : 8000})).then(message.react(emoji.redemoj))
if (member.user.bot) return message.channel.send(embed.setDescription(`${message.author} Botlara mute atamasın!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if(member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.author} Kendine mute atamasın!`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu Kullanıcı Senden Üst/Aynı Pozisyonda.`)).then(tedoa => tedoa.delete({timeout : 7000})).then(message.react(emoji.redemoj))
let time = args[1]
if(!time) return message.channel.send(embed.setDescription(`${message.author} Lütfen bir süre belirtin \`[ 1s/1m/1h/1d]\` gibi.`)).then(tedoa => tedoa.delete({timeout : 10000})).then(message.react(emoji.redemoj))
let reason = args.splice(2).join(" ") || "Sebep Belirtilmedi."
if (member.roles.cache.has(config.vmute.vmuterol)) return message.channel.send(embed.setDescription(`${message.author} Bu kullanıcı zaten chat kanallarında susturulmuş`)).then(tedoa => tedoa.delete({timeout : 5000})).then(message.react(emoji.redemoj))
if (ms(args[1]) < ms("5m")) return message.channel.send(embed.setDescription(`${message.author} \`5 dakikadan\` kısa ses mute atamasın !`)).then(teoda => tedoa.delete({ timeout : 10000 })).then(message.react(emoji.redemoj))
let voiceChannel = member.voice.channel
if(!voiceChannel) return message.channel.send(embed.setDescription(`${member} bir ses kanalına bağlı değil.`)).then(tedoa => tedoa.delete({ timeout: 7000 })).then(message.react(emoji.redemoj));

moment.locale('tr')
let yaziSure = time.replace("d", " Gün").replace("h", " Saat").replace("m", " Dakika").replace("s", " Saniye");
let muteBitiş = `${moment(Date.now()+ms(time)).format("LLL")}` 
let muteAtılma = `${moment(Date.now()).format("LLL")}`



member.voice.setMute(true);
member.roles.add(config.vmute.vmuterol).catch();
pdb.add(`vmute.${message.author.id}.${message.guild.id}`, +1);
cdb.push(`sicil.${member.id}.${message.guild.id}`, { 
    mod: message.author.id, 
    sebep: reason, 
    zaman: Date.now(), 
    komut: "VOICE-MUTE" 
});


message.channel.send(`${emoji.susturuldu} ${member} kişisi ${yaziSure} boyunca ses kanallarında susturuldu.`)


log.send(new MessageEmbed()
.setColor('RANDOM')
.setFooter(config.bots.footer)
.setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic : true }))
.setDescription(`${member} (\`${member.user.tag}\` - \`${member.id}\`) kişisi ${yaziSure} boyunca ses kanallarında susturuldu
• Susturulma sebebi: \`${reason}\`
• Ses Mute atılma tarihi:  \`${muteAtılma}\`
• Ses Mute bitiş tarihi:  \`${muteBitiş}\``))
message.react(emoji.onayemoji)


setTimeout(async function() {
    member.roles.remove(config.vmute.vmuterol).catch();
    member.voice.setMute(false);

    }, ms(time));


    
    }
    exports.conf = {
        enabled : true,
        guildOnly : false,
        aliases : ["sesmute","vmute","smute"], 
        permLevel : 0
    }
    exports.help = {
        name : 'ses-mute',
        açıklama:"Belirlenen üyeyi belirtilen süre boyunca ses kanallarında susturur.",
        komut: "[VMUTE]",
        help: "vmute [tedoa/ID] [süre] [sebep]",
        cooldown: 0
    }
    