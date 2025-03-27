const { ActivityType } = require('discord.js');
const botui = require('../../config/bot_ui.json');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        client.user.setActivity(botui.status, { type: ActivityType.Watching });
        console.log(`${client.user.username} est en ligne ! (${client.user.id})`);
        console.log(`Lien d'invitation : https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=8`);
    },
};
