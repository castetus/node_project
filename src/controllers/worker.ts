import { Queue, Worker } from 'bullmq';
import { IBook } from '../types/IBook';
import Database from './database';

class BookQueue {
  private queue: Queue;

  constructor() {
    this.queue = new Queue('book');
    const worker = new Worker('book', async (job) => {
      const { title, author } = job.data;
      const db = new Database();
      await db.insertNewBook({ title, author });
    });
    worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed`);
    });
    worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed with error: ${err}`);
    });
  }

  async addBook(book: IBook): Promise<void> {
    await this.queue.add('addBook', book);
  }
}

export default BookQueue;