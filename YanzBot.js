console.log("=== BOT FILE YanzBot.js DIPAKAI ===");
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require("discord.js");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// load commands
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log(`Bot online sebagai ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    if (!interaction.replied) {
      await interaction.reply({ content: "❌ Error saat menjalankan command.", ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);


