async function routes(fastify, options) {
  fastify.get('/plays', async (req, reply) => {
    try {
      const data = await fastify
        .knex('plays')
        .join('usersplays', 'plays.id', 'usersplays.playid')
        .where('usersplays.userid', req.user.sub)
        .andWhere(fastify.knex.raw('play_date >= CURRENT_DATE'))
        .select(
          'id',
          'bg_atlas_id',
          'bg_name',
          'bg_image_url',
          'bg_thumb_url',
          'bg_min_players',
          'bg_max_players',
          'bg_playing_time',
          'user_owner_id',
          'play_location',
          'play_date'
        )
        .orderBy('play_date');

      return data;
    } catch (error) {
      reply.code(500).send('Error ' + error);
    }
  });

  fastify.delete('/plays/:playId', async (req, reply) => {
    try {
      await fastify
        .knex('plays')
        .where({
          id: req.params.playId,
          user_owner_id: req.user.sub,
        })
        .del();
      reply.code(200).send('Play deleted');
    } catch (error) {
      reply.code(500).send('Error on delete');
    }
  });

  fastify.get('/plays/:playId', async (req, reply) => {
    try {
      const data = await fastify
        .knex('plays')
        .where('id', req.params.playId)
        .select(
          'id',
          'bg_atlas_id',
          'bg_name',
          'bg_image_url',
          'bg_thumb_url',
          'bg_min_players',
          'bg_max_players',
          'bg_playing_time',
          'user_owner_id',
          'play_location',
          'play_date'
        )
        .first();

      return data;
    } catch (error) {
      reply.code(500).send('Error ' + error);
    }
  });

  fastify.get('/plays/group/:groupId', async (req, reply) => {
    try {
      const data = await fastify
        .knex('plays')
        .where('groupid', req.params.groupId)
        .andWhere(fastify.knex.raw('play_date >= CURRENT_DATE'))
        .select(
          'id',
          'bg_atlas_id',
          'bg_name',
          'bg_image_url',
          'bg_min_players',
          'bg_max_players',
          'bg_playing_time',
          'user_owner_id',
          'play_location',
          'play_date',
          'bg_thumb_url'
        )
        .orderBy('play_date');
      return data;
    } catch (error) {
      reply.code(500).send('Error ' + error);
    }
  });

  fastify.post('/plays', async (req, reply) => {
    try {
      await fastify.knex('plays').insert({
        bg_atlas_id: req.body.bg_atlas_id,
        bg_name: req.body.bg_name,
        bg_image_url: req.body.bg_image_url,
        bg_min_players: req.body.bg_min_players,
        bg_max_players: req.body.bg_max_players,
        bg_playing_time: req.body.bg_playing_time,
        user_owner_id: req.user.sub,
        play_location: req.body.play_location,
        play_date: req.body.play_date,
        groupid: req.body.groupid,
        bg_thumb_url: req.body.bg_thumb_url,
      });

      reply.code(201).send('New play added!');
    } catch (error) {
      reply.code(500).send('Error ' + error);
    }
  });
  fastify.post('/plays/:playId/user/:userId', async (req, reply) => {
    try {
      await fastify.knex('usersplays').insert({
        playid: req.params.playId,
        userid: req.params.userId,
      });

      reply.code(201).send('Player added');
    } catch (error) {
      reply.code(500).send('Error ' + error);
    }
  });
  fastify.delete('/plays/:playId/user/:userId', async (req, reply) => {
    try {
      await fastify
        .knex('usersplays')
        .where({
          playid: req.params.playId,
          userid: req.params.userId,
        })
        .del();

      reply.code(200).send('Player deleted');
    } catch (error) {
      reply.code(500).send('Error ' + error);
    }
  });

  fastify.put('/plays', async (req, reply) => {
    try {
      await fastify
        .knex('plays')
        .where({
          id: req.body.id,
          user_owner_id: req.user.sub,
        })
        .update({
          bg_max_players: req.body.bg_max_players,
          play_date: req.body.play_date,
          play_location: req.body.play_location,
        });

      reply.code(201).send('Play updated!');
    } catch (error) {
      reply.code(500).send('Error on update play: ' + error);
    }
  });
}
module.exports = routes;
