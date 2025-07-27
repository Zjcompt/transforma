import { Fastify } from './controllers/fastify.js';
import './api/v1/map/post.js';
import './api/v1/map/[id]/execute/post.js';
import './api/v1/map/[id]/get.js';
import './api/v1/map/get.js';
import './api/v1/map/runs/get.js';

(async () => {
  let port = Number(process.env.PORT);
  const address = process.env.ADDRESS || '';

  if (!port || isNaN(port) || port < 1 || port > 65535) {
    Fastify.log.warn('Invalid or no port enviornment variable found. Using default.')
    port = 3000;
  }

  Fastify.get('/', {
    config: {
      authCheck: false
    },
    async handler(request, reply) {
      reply.status(200);
      reply.send({ message: 'Healthcheck' });
    }
  });

  try {
    await Fastify.listen({ host: address, port: port });
  } catch (e) {
    Fastify.log.error(`Error starting server: ${e}`);
  }

})()