const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

client.on('ready', () => {
  console.log(`Bot ${client.user.tag} está pronto!`);
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ban') {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      return message.reply('Você não tem permissão para usar este comando.');
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('Por favor, mencione um usuário válido.');
    }

    const member = message.guild.member(user);
    if (!member || !member.bannable) {
      return message.reply('Eu não posso banir este usuário. Ele pode ter um cargo maior que o meu, ou eu não tenho permissão para banir.');
    }

    const reason = args.slice(1).join(' ') || 'Nenhuma razão fornecida.';

    try {
      await member.ban({reason: reason});
      const embed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Banimento')
        .setDescription(`O usuário ${user.tag} foi banido por ${message.author.tag} pelo motivo: ${reason}`);
      message.channel.send({embeds: [embed]});
    } catch (error) {
      message.reply(`Desculpe, ${message.author}, eu não consegui banir o usuário devido ao: ${error}`);
    }
  }
});

client.login('seu_token_aqui');
