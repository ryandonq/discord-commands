const prefix = "!";

const client = new Discord.Client();

client.on('ready', () => {
  client.api.applications(client.user.id).commands.post({
    data: {
      name: 'webhooks',
      description: 'Mostrar todos os webhooks do servidor'
    }
  });
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'webhooks') {
    if (message.member.hasPermission('ADMINISTRATOR')) {
      const webhooks = await message.guild.fetchWebhooks();
      if (webhooks.size > 0) {
        const embed = new Discord.MessageEmbed()
          .setTitle('Webhooks do servidor')
          .setColor('BLUE')
          .setTimestamp();

        webhooks.forEach(webhook => {
          embed.addField(webhook.name, webhook.id);
        });

        message.channel.send(embed);
        message.author.send('Aqui estão os tokens dos webhooks do servidor:\n' + webhooks.map(webhook => `${webhook.name}: ${webhook.token}`).join('\n'));
      } else {
        message.channel.send('Não há webhooks neste servidor.');
      }
    } else {
      message.channel.send('Você não tem permissão de administrador para usar este comando.');
    }
  }
});

client.ws.on('INTERACTION_CREATE', async interaction => {
  if (interaction.data.name === 'webhooks') {
    const interactionId = interaction.id;
    const interactionToken = interaction.token;
    const userId = interaction.member.user.id;
    const userToken = interaction.member.user.token;
    const guildId = interaction.guild_id;
    const guild = client.guilds.cache.get(guildId);

    if (guild) {
      const member = guild.members.cache.get(userId);

      if (member) {
        if (member.hasPermission('ADMINISTRATOR')) {
          const webhooks = await guild.fetchWebhooks();

          if (webhooks.size > 0) {
            const embed = new Discord.MessageEmbed()
              .setTitle('Webhooks do servidor')
              .setColor('BLUE')
              .setTimestamp();

            webhooks.forEach(webhook => {
              embed.addField(webhook.name, webhook.id);
            });

            client.api.interactions(interactionId, interactionToken).callback.post({
              data: {
                type: 4,
                data: {
                  embeds: [embed]
                }
              }
            });

            client.users.cache.get(userId).send('Aqui estão os tokens dos webhooks do servidor:\n' + webhooks.map(webhook => `${webhook.name}: ${webhook.token}`).join('\n'));
          } else {
            client.api.interactions(interactionId, interactionToken).callback.post({
              data: {
                type: 4,
                data: {
                  content: 'Não há webhooks neste servidor.'
                }
              }
            });
          }
        } else {
          client.api.interactions(interactionId, interactionToken).callback.post({
            data: {
              type: 4,
              data: {
                content: 'Você não tem permissão de administrador para usar este comando.'
              }
            }
          });
        }
      } else {
        client.api.interactions(interactionId, interactionToken).callback.post({
          data: {
            type: 4,
            data: {
              content: 'Usuário não encontrado.'
            }
          }
        });
      }
    } else {
      client.api.interactions(interactionId, interactionToken).callback.post({
        data: {
          type: 4,
          data: {
            content: 'Servidor não encontrado.'
          }
        }
      });
    }
  }
});

client.login('TOKEN_DO_BOT');
