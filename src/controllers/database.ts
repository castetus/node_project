import { MongoClient, Db, Collection } from 'mongodb';
import { config } from '../config/config';
import { IBook } from '../types/IBook';
import { IUser } from '../types/IUser';

class DataBase {
  client: MongoClient;
  db: Db;

  constructor() {
    this.client = new MongoClient(config.MONGO_URL);
    this.db = this.client.db();
  }

  async getAllBooks() {
    const result = await this.db.collection('books').find().toArray();
    return result;
  }

  async insertNewBook(body: IBook) {
    const result = await this.db.collection('books').insertOne(body);
    return result;
  }

  async getAllUsers() {
    const result = await this.db.collection('users').find().toArray();
    return result;
  }

  async insertNewUser(user: IUser) {
    const result = await this.db.collection('users').insertOne(user);
    return result;
  }

  async loginUser({ username, password }: {username: string, password: string}) {
    const result = await this.db.collection('users').findOne({ name: username, password });
    return result;
  }
}

export default DataBase;