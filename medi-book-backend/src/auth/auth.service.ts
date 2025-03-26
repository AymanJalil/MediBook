import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Auth, AuthDocument } from './entities/auth.entity';
import { CreateAuthInput } from './dto/create-auth.input';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './dto/login-response';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private jwtService: JwtService, // Add JwtService to constructor
  ) {}

  async createUser(createAuthInput: CreateAuthInput): Promise<Auth> {
    const { id, username, email, password, role } = createAuthInput;
    
    try {
      // Hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create a new user
      const newUser = new this.authModel({
        // Only set _id if it's a valid ObjectId
        ...(id && Types.ObjectId.isValid(id) ? { _id: new Types.ObjectId(id) } : {}),
        username,
        email,
        password: hashedPassword,
        role: role || 'admin', // Use the provided role or default to 'admin'
      });
      
      // Save the user to the database
      const savedUser = await newUser.save();
      
      // Return the complete user document
      return savedUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username or email already exists');
      }
      throw new InternalServerErrorException(`Failed to create user: ${error.message}`);
    }
  }
  
  async createAdminUser(createAuthInput: CreateAuthInput): Promise<Auth> {
    // Ensure the role is set to 'admin'
    createAuthInput.role = 'admin';
    return this.createUser(createAuthInput);
  }

  async login(loginInput: LoginInput): Promise<LoginResponse> {
    const { username, password } = loginInput;
    
    // Find user by username
    const user = await this.authModel.findOne({ username }).exec();
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Check if user is an admin if needed
    if (loginInput.requireAdmin && user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    
    // Generate JWT token
    const payload = { 
      sub: user._id, 
      username: user.username,
      email: user.email,
      role: user.role 
    };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        password: user.password, // Include password to satisfy TypeScript
      }
    };
  }
  
  async validateUser(payload: any): Promise<Auth> {
    const user = await this.authModel.findById(payload.sub).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}