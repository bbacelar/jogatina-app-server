require('dotenv').config();

const fastify = require('fastify')({ logger: true });
const autoload = require('fastify-autoload');
const path = require('path');
fastify.register(require('fastify-axios'));
fastify.register(
  require('fastify-knexjs'),
  {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  (err) => console.error(err)
);
fastify.register(require('fastify-cors'), { 
  origin: ['https://jogatina.netlify.app', 'http://localhost:8080'],
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  credentials: true
})
fastify.register(require('fastify-auth0-verify'), {
  domain: process.env.DOMAIN,
  audience: process.env.AUDIENCE,
});
fastify.register(autoload, { dir: path.join(__dirname, 'services') });
const PORT = process.env.PORT || 5000;

fastify.addHook('onRequest', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

const start = async () => {
  try {
    await fastify.listen(PORT, '0.0.0.0');
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
