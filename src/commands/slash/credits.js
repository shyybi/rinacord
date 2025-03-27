const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const embedui = require('../../../config/embed_ui.json');
const botui = require('../../../config/bot_ui.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('credits')
        .setDescription("Crédits des développeurs"),
    run: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setColor(embedui.color)
            .setTitle('Crédits')
            .addFields({ name: "Léa", value: "https://liltea.me/lelely" })
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: botui.name, iconURL: botui.icon });

        await interaction.reply({ embeds: [embed] });
    },
};
