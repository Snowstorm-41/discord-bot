const {Client, Attachment} = require("discord.js");
const Discord = require("discord.js");
const bot = new Client();

const ytdl = require("ytdl-core");

const token = "Njc4NTgzNjIyOTk0ODg2Njc5.Xkk6Yw.EHanut-RS4d6fR05Vk2k0o3KvhI";

const PREFIX = "!";

var version = "1.0.0";

var servers = {};

bot.on("ready", () => {
    console.log("Bot is online");
    bot.user.setActivity("визги диких животных", {type: "LISTENING"});
});

//bot.on("guildMemberAdd", member=> 
  //message.reply("Welcome!")
//)

bot.on("message", message => {
    
    if(!message.content.startsWith(PREFIX)) return;
    let arg = (message.content.toLowerCase().substring(PREFIX.length).split(" "));
    
    switch (arg[0]) {
        
        //Админские команды
        case "kick": 
          if (!message.member.roles.find(r => r.name === "Admin")) { return message.channel.send("You don't have a permission")} else
          if(!arg[1]) message.reply("You need to specify a person")
          
          const user = message.mentions.users.first();

          if(user){
              const member = message.guild.member(user);

              if(member){
                  member.kick("").then(() =>{
                      message.reply(`User ${user.tag} has been kicked `);
                  }).catch(error =>{
                      message.reply("Can't kick");
                      console.log(error);
                  });
                } else {
                    message.reply("Can't find a user")
                }
            }
        break;

        case "ban":
            if (!message.member.roles.find(r => r.name === "Admin")) { return message.channel.send("You don't have a permission")} else
            if(!arg[1]) message.reply("You need to specify a person")
            
            const userr = message.mentions.users.first();
  
            if(userr){
                const member = message.guild.member(userr);
  
                if(member){
                    member.ban({reason:"КРИСА"}).then(() =>{
                        message.reply(`User ${userr.tag} has been banned `);
                    }).catch(error =>{
                        message.reply("Can't ban");
                        console.log(error);
                        return;
                    });
                  } else {
                      message.reply("Can't find a user")
                  }
              }
            
        break;

        case "clear":
            if (!message.member.roles.find(r => r.name === "Admin")) { return message.channel.send("You don't have a permission")} else
            if (!arg[1]) return message.reply("Error please define second arg") 
            message.channel.bulkDelete(arg[1]);
        break;

        case "ping":
            message.reply("pong!");
        break;

        case "website":
            message.channel.sendMessage("youtube.com");
        break;

        case "info":
            const embed = new Discord.RichEmbed()
                .setTitle("Info")
                .addField("Author: ", "Snowstorm")
                .addField("Verion: ", " " + version)
                .setColor(906090)
            message.channel.sendEmbed(embed);
        break;
        
        case "send":
            const attachment = new Attachment("https://st2.depositphotos.com/2001755/5408/i/450/depositphotos_54081723-stock-photo-beautiful-nature-landscape.jpg");
            message.channel.send(message.author,attachment);
        break;

        //Музыка
        case "play":
                function play(connection, message) {
                var server = servers[message.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], {
                    filter: "audioonly"
                }));

                server.queue.shift();

                server.dispatcher.on("end", function () {
                    if (server.queue[0]) {
                        play(connection, message);
                    } else {
                        connection.disconnect();
                    }
                })
            }

            if (!arg[1]) {
                message.channel.send("You need a link");
                return;
            }
            if (!message.member.voiceChannel) {
                message.channel.send("You have to be in channel");
            }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(arg[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function (connection) {
                play(connection, message);
            })

        break;

        case "skip":
            var server = servers[message.guild.id];
            if (server.dispatcher) server.dispatcher.end();
            const skipembed = new Discord.RichEmbed()
                .setTitle("Skipping the track", " ")
                .setColor(906090)
            message.channel.sendEmbed(skipembed);
            break;

        case "stop":
            var server = servers[message.guild.id];
            if (message.guild.voiceConnection) {
                for (var i = server.queue.length - 1; i >= 0; i--) {
                    server.queue.splice(i, 1);
                }
                server.dispatcher.end();
                const queueembed = new Discord.RichEmbed()
                    .setTitle("Queue is end. Leaving the chanel", " ")
                    .setColor(906090)
                message.channel.sendEmbed(queueembed);
                console.log("Queue stop")
            }
            if (message.guild.connection) message.guild.voiceConnection.disconnect();
            break;

    }

})

bot.login(token); 