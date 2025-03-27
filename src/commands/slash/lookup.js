const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const embedui = require('../../../config/embed_ui.json');
const botui = require('../../../config/bot_ui.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lookup')
        .setDescription("Obtenir les informations d'un joueur")
        .addStringOption(option =>
            option.setName('joueur')
                .setDescription("Nom du joueur")
                .setRequired(true)),
    run: async (client, interaction) => {
        const joueur = interaction.options.getString('joueur');

        try {
            await interaction.deferReply();

            const response = await axios.get(`http://localhost:3000/lookup?playerName=${joueur}`);
            const playerData = response.data;

            if (!playerData || Object.keys(playerData).length === 0) {
                await interaction.editReply({ content: "Le joueur spécifié est introuvable ou invalide." });
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(embedui.color)
                .setTitle(playerData.name)
                .setDescription(playerData.status)
                .addFields(
                    { name: 'Temps de Jeu:', value: playerData.playtime, inline: true },
                    { name: 'Première Connexion:', value: playerData.first_connection, inline: true },
                    { name: 'Dernière Connexion:', value: playerData.last_connection, inline: true },
                    { name: 'Clan:', value: playerData.clan, inline: true },
                )
                .setFooter({ text: botui.name, iconURL: botui.icon });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(`Erreur dans la commande /lookup :`, error.message);
            await interaction.editReply({ content: "Impossible de récupérer les informations du joueur." });
        }
    },
};
