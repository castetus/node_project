import { FastifyInstance } from 'fastify';
import DataBase from '../controllers/database';
import BookQueue from '../controllers/worker';
import { IBook } from '../types/IBook';
import { IUser } from '../types/IUser';
import { ICredentials } from '../types/ICredentials';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

const database = new DataBase();
const bookqueue = new BookQueue();

async function routes(fastify: FastifyInstance) {

  fastify.get('/', async (request, reply) => {
    const result = await database.getAllBooks();
    return { result };
  });

  fastify.post('/', async (request, reply) => {
    const { body } = request;

    await bookqueue.addBook(body as IBook);
    reply.status(201).send('book added');
  });

  fastify.get('/user', async (request, reply) => {
    const result = await database.getAllUsers();
    return { result };
  });

  fastify.post('/user', async (request, reply) => {
    const { body } = request;

    const result = await database.insertNewUser(body as IUser);

    const createdUser = {
      _id: result.insertedId,
      body,
    };

    reply.status(201).send('user added');
  });

  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body as ICredentials;

    const user = await database.loginUser({ username, password });

    if (!user) {
      reply.send(user);
      reply.status(401).send({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ sub: user.id }, config.JWT_SECRET!);
    reply.send({ token });
    // console.log(token);
  })
}

export default routes;