const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whitelist")
    .setDescription("Whitelist user (payment style embed)")
    .addUserOption(o =>
      o.setName("user").setDescription("Customer").setRequired(true)
    )
    .addRoleOption(o =>
      o.setName("role").setDescription("Role utama").setRequired(true)
    )
    .addStringOption(o =>
      o.setName("price").setDescription("Harga").setRequired(true)
    )
    .addStringOption(o =>
      o.setName("script").setDescription("Nama script").setRequired(true)
    )
    .addBooleanOption(o =>
      o.setName("monthly").setDescription("Monthly / Lifetime").setRequired(true)
    )
    .addRoleOption(o =>
      o.setName("role2").setDescription("Role tambahan (opsional)").setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");
    const role2 = interaction.options.getRole("role2");
    const price = interaction.options.getString("price");
    const script = interaction.options.getString("script");
    const monthly = interaction.options.getBoolean("monthly");

    const duration = monthly ? "Monthly (30 days)" : "Lifetime";

    const embed = new EmbedBuilder()
      .setColor(0x7b3fe4) // ungu Euphoria (ganti 0x2b2d31 kalau mau abu)
      .setTitle("🔒 | Whitelisted!")
      .setDescription(
        "Your payment has been **approved** and you have been **whitelisted**!"
      )
      .addFields(
        { name: "💰 Price", value: price, inline: true },
        { name: "⏳ Duration", value: duration, inline: true },
        { name: "👤 Customer Discord", value: `${user}`, inline: true },

        { name: "📜 Script", value: script, inline: true },
        { name: "🎭 Role", value: `${role}`, inline: true },
        {
          name: "🛠 Submitted By",
          value: interaction.user.tag,
          inline: true
        }
      )
      .setFooter({ text: "Whitelist System" })
      .setTimestamp();

    // auto add role
    const member = await interaction.guild.members.fetch(user.id);
    await member.roles.add(role);
    if (role2) await member.roles.add(role2);

    await interaction.reply({ embeds: [embed] });
  }
};
