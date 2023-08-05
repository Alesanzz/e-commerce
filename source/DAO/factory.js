import config from '../../config/config.js';
import mongoose from 'mongoose';

export let Contacts;

switch (config.persistence) {
  case 'MONGO':
    console.log('Mongo connect');
    mongoose.connect('mongodb+srv://alejandrosanz:qAa1NHpEo37n4eUA@coder-cluster.qqkqtjc.mongodb.net/?retryWrites=true&w=majority');

    const { default: ContactsMongo } = await import('./mongo/contacts.mongo.js');
    Contacts = ContactsMongo;

    break;
  case 'MEMORY':
    console.log('Persistence with Memory');
    const { default: ContactsMemory } = await import('./memory/contacts.memory.js');
    Contacts = ContactsMemory;

    break;
  default:
    break;
}
