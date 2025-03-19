import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { Auth, AuthDocument } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
  ) {}

  async create(createAuthInput: CreateAuthInput): Promise<Auth> {
    const createdAuth = new this.authModel(createAuthInput);
    return createdAuth.save();
  }

  async findAll(): Promise<Auth[]> {
    return this.authModel.find().exec();
  }

  async findOne(id: string): Promise<Auth> {
    const auth = await this.authModel.findById(id).exec();
    if (!auth) {
      throw new NotFoundException(`Auth #${id} not found`);
    }
    return auth;
  }

  async update(id: string, updateAuthInput: UpdateAuthInput): Promise<Auth> {
    const auth = await this.authModel.findByIdAndUpdate(id, updateAuthInput, { new: true }).exec();
    if (!auth) {
      throw new NotFoundException(`Auth #${id} not found`);
    }
    return auth;
  }

  async remove(id: string): Promise<Auth> {
    const auth = await this.authModel.findByIdAndDelete(id).exec();
    if (!auth) {
      throw new NotFoundException(`Auth #${id} not found`);
    }
    return auth;
  }
}
