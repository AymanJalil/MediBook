// database-initializer.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseInitializerService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitializerService.name);

  constructor(
    @InjectConnection() private connection: Connection,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing database collections...');
    await this.createCollections();
    this.logger.log('Database collections initialized');
  }

  private async createCollections() {
    try {
      // Check if connection.db exists
      if (!this.connection.db) {
        this.logger.error('Database connection not established');
        throw new Error('Database connection not established');
      }
      
      // Now TypeScript knows db is defined
      const collections = await this.connection.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      
      // List of collections to ensure exist
      const requiredCollections = ['auths', 'doctors', 'patients', 'appointments'];
      
      for (const collection of requiredCollections) {
        if (!collectionNames.includes(collection)) {
          this.logger.log(`Creating collection: ${collection}`);
          await this.connection.createCollection(collection);
        } else {
          this.logger.log(`Collection already exists: ${collection}`);
        }
      }
      
      // You can add indexes here if needed
      // Example: await this.connection.db.collection('auths').createIndex({ email: 1 }, { unique: true });
      
    } catch (error) {
      this.logger.error(`Error initializing collections: ${error.message}`);
      throw error;
    }
  }
}