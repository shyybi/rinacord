require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, ActivityType, Collection, Intents } = require("discord.js");
const Discord = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    //GatewayIntentBits.GuildVoiceStates,
    /**
    GatewayIntentBits.GuildMemberRemove,
    GatewayIntentBits.GuildBanAdd,
     */
  ],
  partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "GUILD_SCHEDULED_EVENT"],
});

client.slashcommands = new Collection();
client.slashdatas = [];
client.commands = new Collection();

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'src/commands/slash')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./src/commands/slash/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
  client.slashdatas.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
}

fs.readdirSync('./src/events').forEach(async file => {
  const event = require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

client.once('ready', async () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);

  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
  try {
    console.log('Enregistrement des commandes slash...');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
    console.log('Commandes slash enregistrées avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des commandes:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.slashcommands.get(interaction.commandName);
  if (!command) {
    console.error(`Commande non trouvée : ${interaction.commandName}`);
    return;
  }

  try {
    await command.run(client, interaction);
  } catch (error) {
    console.error(`Erreur lors de l'exécution de la commande ${interaction.commandName}:`, error);
    await interaction.reply({ content: 'Une erreur est survenue lors de l\'exécution de cette commande.', ephemeral: true });
  }
});

process.on("unhandledRejection", e => {
  console.log(e);
});
process.on("uncaughtException", e => {
  console.log(e);
});
process.on("uncaughtExceptionMonitor", e => {
  console.log(e);
});

client.login(process.env.DISCORD_TOKEN).then(() => {
  console.log("Connexion réussie au bot !");
}).catch((error) => {
  console.error("Erreur lors de la connexion au bot :", error);
});