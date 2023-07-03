require("dotenv").config();
const { OPENAI_API_KEY } = process.env;
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Speak with chatgpt')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const messagetosend = interaction.options.getString('message');

        const configuration = new Configuration({
            apiKey: OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        console.log(messagetosend);

        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: messagetosend }],
        });

        const ai_response = chatCompletion.data.choices[0].message.content;
        console.log(`[AI RESPONSE] ` + ai_response);
        const embed = new EmbedBuilder()
        .setTitle('ChatGpts Response')
        .setDescription('ChatGpt is a model using the GPT-3 API to chat with you.')
        .setColor(client.embedColor)
        // .setImage(client.user.displayAvatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp(Date.now())
        .setAuthor({
            url: 'https://github.com/Summaw/chatgpt-discord-bot',
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.tag
        })
        .setFooter({
            iconUrL: client.user.displayAvatarURL(),
            text: client.user.tag
        })
        .setURL('https://github.com/Summaw/chatgpt-discord-bot')
        .addFields([
            {
                name: `GPT RESPONSE`,
                value: '```' + ai_response.toString() + '```',
                inline: false
            }
        ])

        await interaction.reply({
            embeds: [embed]
        })
    },
};
