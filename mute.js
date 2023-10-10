const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('O bot está pronto!');
});

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
    const commandName = interaction.commandName;

    if (commandName === 'mute') {
      const user = interaction.options.getUser('user');

      if (user) {
        const member = interaction.guild.members.resolve(user);

        if (member) {
          let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

          if (!muteRole) {
            muteRole = await interaction.guild.roles.create({
              name: 'Muted',
              permissions: ['VIEW_CHANNEL']
            });
          }

          await member.roles.add(muteRole);

          const embed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('Usuário mutado')
            .setDescription(`${user.tag} foi mutado com sucesso.`);

          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply('O usuário mencionado não é um membro do servidor.');
        }
      } else {
        await interaction.reply('Você precisa mencionar um usuário para mutar.');
      }
    }
  }
});

client.login('seu token aqui');
