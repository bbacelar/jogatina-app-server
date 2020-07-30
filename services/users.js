async function routes(fastify, options) {
  fastify.get('/users/play/:playId', async (req, reply) => {
    try {
      const rows = await fastify
        .knex('usersplays')
        .join('users', 'usersplays.userid', 'users.id')
        .where('usersplays.playid', req.params.playId)
        .select('users.id', 'users.name', 'users.picture');

      return rows;
    } catch (error) {
      reply.code(500).send('Error ' + error);
    }
  });

  fastify.get('/users/group/:groupId', async (req, reply) => {
    try {
      const rows = await fastify
        .knex('usersgroups')
        .join('users', 'usersgroups.userid', 'users.id')
        .where('usersgroups.groupid', req.params.groupId)
        .select('users.id', 'users.name', 'users.picture');

      return rows;
    } catch (error) {
      reply.code(500).send('Error ' + error);
    }
  });

  fastify.put('/users', async (req, reply) => {
    try {
      await fastify.knex.raw(
        `INSERT INTO users (id, name, email, picture)
          VALUES(:id, :name, :email, :picture)
          ON CONFLICT (id) DO UPDATE SET name = :name, email = :email, picture = :picture`,
        {
          id: req.body.id,
          name: req.body.name,
          email: req.body.email,
          picture: req.body.picture,
        }
      );
      
      reply.code(200).send('User inserted/updated');
    } catch (error) {
      reply.code(500).send('Error ' + error);
    }
  });
}
module.exports = routes;
