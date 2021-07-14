const emoji = require("../emoji");
const config = require('../config.json')

module.exports = {
    name: 'message',
   async execute(message) {
    let selamlar = ["sa", "selam", "selamın aleyküm", "selamın aleykum", "sea", "sA", "selamın aleykm", "selamün aleyküm", "selamun aleykum"]

    if (message.author.bot) return;
    if (selamlar.some(s => message.content.toLowerCase() === s)) {
        message.channel.send(`${message.author}, Aleyküm selam hoş geldin.`)
        message.react(emoji.tedoa)
    }
  
    let taglar = ["tag",".tag","!tag","?tag",",tag","s?tag","s!tag","&tag","TAG","tAg"]

    if (message.author.bot) return;
    if (taglar.some(t => message.content.toLowerCase() === t)) {
        message.channel.send(`${config.diğer.tag} `)
        message.react(emoji.tedoa)
    }
  

   }
}