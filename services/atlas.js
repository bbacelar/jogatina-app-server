async function routes(fastify, options) {
  fastify.get('/atlas/:param', async (req, reply) => {
    try {
      const response = await fastify.axios.get(
        `${process.env.ATLAS_API}search?name=${req.params.param}&client_id=${process.env.ATLAS_CLIENT_ID}&limit=30`
      );
      return response.data.games;
    } catch (error) {
      return [];
    }
  });
}
module.exports = routes;
