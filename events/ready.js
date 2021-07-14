  
const config = require('../config.json')
module.exports = {
    name: 'ready',
    execute(client) {
    client.user.setPresence({ activity: {
       name: config.bots.status ,type: "PLAYING"}, status: "online"})
    client.channels.cache.get(config.bots.VoiceChannel).join(config.bots.voicechannel)
 }
     }