import Fastify from 'fastify'

const fastify = await Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'debug',
    formatters: {
      bindings: (bindings) => {
        return {
          pid: bindings.pid,
          hostname: bindings.hostname,
          env: process.env.NODE_ENV || 'development',
        }
      }
    },
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          options: {
            destination: 1,
            levelFirst: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname,env'
          }
        }
      ]
    },
    serializers: {
      req (request) {
        return {
          method: request.method,
          url: request.url,
          path: request.routeOptions.url,
          parameters: request.params,
          body: request.body,
        };
      }
    }
  }
});

export const logger = fastify.log;
export { fastify as Fastify, logger as Logger }