const { token } = require("./config.json");
const { Client, Intents, MessageEmbed } = require("discord.js");
const getWebData = require("./getWebData.js");
const useWebData = require("./useWebData");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
    console.log("Ready");
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;
    if(interaction.commandName === "status" || interaction.commandName === "statuslist") {
        const rawinput = interaction.options.getString("input");
        await interaction.deferReply();
        let inputlist = [];
        if(interaction.commandName === "statuslist"){
            try{
                inputlist = rawinput.split(",");
            }catch (e){
                inputlist = ["0"];
            }
        }else{
            inputlist = [rawinput];
        }
        for (let input of inputlist) {
            let webData = await getWebData(input);
            let finalObj = await useWebData(webData.data);
            let embedMessage;

            if (finalObj === 1) {
                embedMessage = new MessageEmbed()
                    .setColor("#ff7300")
                    .setTitle("Kith Order Status Tracker")
                    .setDescription("Order number or email not found \n \n You inputted:")
                    .addFields(
                        {name: "Email", value: webData.email},
                        {name: "ID", value: webData.id},
                    )
                    .setTimestamp()
                    .setFooter("Jacob Sewell");

            } else if (finalObj && finalObj.cancelled) {
                embedMessage = new MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle("Kith Order Status Tracker")
                    .setImage(finalObj.img)
                    .addFields(
                        {name: "Product", value: finalObj.product},
                        {name: "Email", value: webData.email},
                        {name: "ID", value: webData.id},
                        {name: "Order Cancelled", value: "Unfortunately this order has been cancelled"}
                    )
                    .setTimestamp()
                    .setFooter("Jacob Sewell");

            } else if (finalObj) {
                embedMessage = new MessageEmbed()
                    .setColor(finalObj.status ? "#2fff00" : "ff7300")
                    .setTitle("Kith Order Status Tracker")
                    .setImage(finalObj.img)
                    .addFields(
                        {name: "Product", value: finalObj.product},
                        {name: "Email", value: webData.email},
                        {name: "Status", value: finalObj.status ? finalObj.status : "Currently Unknown"},
                        {name: "Tracking URL", value: finalObj.status ? `[Click Here](${finalObj.tracking})` : "Not currently avaliable"}
                    )
                    .setTimestamp()
                    .setFooter("Jacob Sewell");
            }
            else {
                embedMessage = new MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle("Kith Order Status Tracker")
                    .setDescription("Failed :(")
                    .setTimestamp()
                    .setFooter("Jacob Sewell");
            }
            await interaction.followUp({embeds: [embedMessage]})
        }
    }
});

client.login(token);


