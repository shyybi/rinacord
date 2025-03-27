const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const embeddata = fs.readFileSync('config/embed_ui.json');
const botdata = fs.readFileSync('config/bot_ui.json');
const embedui = JSON.parse(embeddata);
const botui = JSON.parse(botdata);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription("Initialise le serveur"),
    run: async (client, interaction) => {
        await interaction.reply("Le serveur a été initialisé avec succès !");
    },
};
