const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const embedui = require('../../../config/embed_ui.json');
const botui = require('../../../config/bot_ui.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clan')
        .setDescription("Obtenir les informations d'un clan")
        .addStringOption(option =>
            option.setName('nom')
                .setDescription("Nom du clan")
                .setRequired(true)),
    run: async (client, interaction) => {
        const clanName = interaction.options.getString('nom');

        try {
            await interaction.deferReply();

            const response = await axios.get(`http://localhost:3000/clan?clanName=${clanName}`);
            const clanData = response.data;

            if (!clanData || Object.keys(clanData).length === 0) {
                await interaction.editReply({ content: "Le clan spécifié est introuvable ou invalide." });
                return;
            }

			const embed = new EmbedBuilder()
				.setColor(embedui.color)
				.setTitle(`${clanData.name || "Nom inconnu"} [${clanData.tag || "Tag inconnu"}]`)
				.setDescription(clanData.description || "Description non disponible")
				.addFields(
					{ name: 'Membres:', value: clanData.members_count || "Inconnu", inline: true },
					{ name: 'Niveau:', value: clanData.level || "Inconnu", inline: true },
					{ name: 'Date de Création:', value: clanData.creation_date || "Inconnu", inline: true },
				)
				.setFooter({ text: botui.name, iconURL: botui.icon });

            if (clanData.members && clanData.members.length > 0) {
                const half = Math.ceil(clanData.members.length / 2);
                const firstColumn = clanData.members
                    .slice(0, half)
                    .map(member => `**${member.name}**`) // Include only the username
                    .join('\n');
                const secondColumn = clanData.members
                    .slice(half)
                    .map(member => `**${member.name}**`) // Include only the username
                    .join('\n');

                embed.addFields(
                    { name: 'Membres', value: firstColumn || 'Aucun membre', inline: true },
                    { name: ':', value: secondColumn || 'Aucun membre', inline: true }
                );
            } else {
                embed.addFields({ name: 'Membres:', value: 'Aucun membre trouvé.' });
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(`Erreur dans la commande /clan :`, error.stack || error.message);
            await interaction.editReply({ content: "Une erreur est survenue lors de la récupération des informations du clan. Veuillez réessayer plus tard." });
        }
    },
};
