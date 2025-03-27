const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const rawdata = fs.readFileSync('config/config.json');
const config = JSON.parse(rawdata);

const embeddata = fs.readFileSync('config/embed_ui.json');
const botdata = fs.readFileSync('config/bot_ui.json');
const embedui = JSON.parse(embeddata);
const botui = JSON.parse(botdata);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription("initialise the server"),
    run: async (client, interaction) => {
        console.log("Salam")
    },
};
