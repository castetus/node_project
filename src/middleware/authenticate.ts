import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const path = request.raw.url;
  if (path === '/user' || path === '/login') {
    return;
  }
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET!);
    request.user = decoded;
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
}