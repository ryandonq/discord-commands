const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

client.on('ready', () => {
  console.log('O bot está pronto!');
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (commandName === 'unmute') {
    const user = message.mentions.users.first();

    if (!user) {
      return message.reply('Você precisa mencionar um usuário para desmutar.');
    }

    const member = message.guild.members.resolve(user);

    if (!member) {
      return message.reply('O usuário mencionado não é um membro do servidor.');
    }

    const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

    if (muteRole) {
      await member.roles.remove(muteRole);

      const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('Usuário desmutado')
        .setDescription(`${user.tag} foi desmutado com sucesso.`);

      message.reply({ embeds: [embed] });
    } else {
      message.reply('O cargo de mute não foi encontrado no servidor.');
    }
  }
});

client.login('seu token aqui');
