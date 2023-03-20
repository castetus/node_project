import Fastify from 'fastify';
import fastifyMongoDB, {  } from '@fastify/mongodb';
import fastifyRedis from '@fastify/redis';
import fastifyJwt from '@fastify/jwt';
import routes from './routes/routes';
import { config } from './config/config';
import { authenticate } from './middleware/authenticate';

const server = Fastify({ logger: true });

server.addHook('preHandler', authenticate);

server.register(fastifyMongoDB, {
  url: config.MONGO_URL,
});

server.register(fastifyRedis, {
  host: 'localhost'
});

server.register(fastifyJwt, {
  secret: config.JWT_SECRET!,
});

server.register(routes);

const options = { port: config.PORT };

const start = async () => {
  try {
    await server.listen(options);
    server.log.info(`Server listening on ${options.port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
