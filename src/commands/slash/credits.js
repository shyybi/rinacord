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
        .setName('credits')
        .setDescription("Dev's credits"),
    run: async (client, interaction) => {
        console.log("Salam")
        const websiteEmbed = new EmbedBuilder()
            .setColor(embedui.color)
            .setTitle('Credits')
            .addFields(
                { name: "Léa", value: "https://liltea.me/lelely" },
                )
                .setThumbnail(`${client.user.displayAvatarURL()}`)
                .setTimestamp()
                .setFooter({ text: `${botui.name}`, iconURL:`${botui.icon}` });

        try {
            await interaction.reply({ embeds: [websiteEmbed] });
        } catch (error) {
            console.error('Error replying to interaction:', error);
        }
    },
};
