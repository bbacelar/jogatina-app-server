async function routes(fastify, options) {
  fastify.get('/groups/user', async (req, reply) => {
    try {
      const data = await fastify
        .knex('groups')
        .join('usersgroups', 'groups.id', 'usersgroups.groupid')
        .where('usersgroups.userid', req.user.sub)
        .select('id', 'name', 'user_owner_id');

      return data;
    } catch (error) {
      reply.code(500).send('Error ' + error);
    }
  });
  fastify.get('/groups', async (req, reply) => {
    try {
      const data = await fastify
        .knex('groups')
        .select('id', 'name', 'uf', 'city', 'user_owner_id');      
      return data;
    } catch (error) {
      reply.code(500).send('Error ' + error);
    }
  });

  fastify.delete('/groups/:groupId', async (req, reply) => {
    try {
      await fastify
        .knex('groups')
        .where({
          id: req.params.groupId,
          user_owner_id: req.user.sub,
        })
        .del();
      reply.code(200).send('Group deleted');
    } catch (error) {
      reply.code(500).send('Erro on delete group: ' + error);
    }
  });

  fastify.get('/groups/:groupId', async (req, reply) => {
    try {
      const data = fastify
        .knex('groups')
        .select('id', 'name', 'uf', 'city', 'user_owner_id')
        .where('id', req.params.groupId);

      return data;
    } catch (error) {
      reply.code(500).send('Error ' + error);
    }
  });

  fastify.post('/groups', async (req, reply) => {
    try {      
      await fastify.knex('groups').insert({
        name: req.body.name,
        user_owner_id: req.user.sub,
        uf: req.body.uf,
        city: req.body.city,
      });

      reply.code(201).send('New group added!');
    } catch (error) {
      console.log(error);
      if (error.code === '23505')
        reply.code(409).send('Group name already exists!');
      else reply.code(500).send('Error on save');
    }
  });

  fastify.post('/groups/:groupId/user', async (req, reply) => {
    try {
      await fastify.knex('usersgroups').insert({
        userid: req.user.sub,
        groupid: req.params.groupId,
      });

      reply.code(201).send('User added to group!');
    } catch (error) {
      reply.code(500).send('Error on save');
    }
  });

  fastify.delete('/groups/:groupId/user/:userId', async (req, reply) => {
    try {
      await fastify
        .knex('usersgroups')
        .where({
          userid: req.params.userId,
          groupid: req.params.groupId,
        })
        .del();
      reply.code(200).send('User removed from group!');
    } catch (error) {
      reply.code(500).send('Error on save');
    }
  });

  fastify.put('/groups', async (req, reply) => {
    try {
      await fastify
        .knex('groups')
        .where({
          id: req.body.id,
          user_owner_id: req.user.sub,
        })
        .update({
          name: req.body.name,
          uf: req.body.uf,
          city: req.body.city,
        });

      reply.code(201).send('Group updated!');
    } catch (error) {
      if (error.code === '23505')
        reply.code(409).send('Group name already exists!');
      else reply.code(500).send('Error on save');
    }
  });
}

module.exports = routes;
