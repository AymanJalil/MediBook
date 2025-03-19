import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from '../auth/entities/auth.entity';

@Injectable()
export class DatabaseInitializerService implements OnModuleInit {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,  // Inject the model here
  ) {}

  async onModuleInit() {
    await this.createCollections();
  }

  private async createCollections() {
    await this.authModel.createCollection();
    // Add other collection creation calls here if needed
  }
}
