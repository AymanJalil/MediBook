import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
    imports: [
        NestConfigModule.forRoot({
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid('development', 'production', 'test', 'provision')
                    .default('development'),
                PORT: Joi.number().default(3000),
                MONGODB_URI: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRATION_TIME: Joi.string().default('60s'),
                REDIS_HOST: Joi.string().default('localhost'),
                REDIS_PORT: Joi.number().default(6379),
                REDIS_TTL: Joi.number().default(60),
                RATE_LIMIT_TTL: Joi.number().default(60),
                RATE_LIMIT_POINTS: Joi.number().default(100),
            }),
        }),
    ],
})
export class ConfigModule {}
