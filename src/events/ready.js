const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const botdata = fs.readFileSync('config/bot_ui.json');
const botui = JSON.parse(botdata);
const { ActivityType } = require('discord.js');
module.exports = {
    name: 'ready',
    once: true,
    async execute(client, ready, message, channel ) {
        
        const rest = new REST({ version: '9' }).setToken(client.token);
        console.log(client.token)
        let status = botui.status
        client.user.setActivity(status, {
            type: ActivityType.Watching,
        });

        console.log(`${client.user.username} en ligne ! (${client.user.id}) `)
        console.log(`Discord Invite : https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=8`)
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: client.slashdatas },
            );
        } catch (error) {
            console.error(error);
        }
    }
};
