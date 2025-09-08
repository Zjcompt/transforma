import { Fastify } from './controllers/fastify.ts';
import './api/v1/map/post.ts';
import './api/v1/map/[id]/execute/post.ts';
import './api/v1/map/[id]/get.ts';
import './api/v1/map/get.ts';
import './api/v1/map/[id]/runs/get.ts';
import './api/v1/map/[id]/delete.ts';
import './api/v1/map/[id]/put.ts';
import './api/v1/runs/get.ts';
import './api/v1/errored-runs/get.ts';
import './api/v1/reports/index.ts';

(async () => {
  let port = Number(process.env.PORT);
  const address = process.env.ADDRESS || 'localhost';

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