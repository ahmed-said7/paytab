import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiModule } from './filter/api.module';
import { SchemaFactoryModule } from './schema.factory/schema.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_FILTER } from '@nestjs/core';
import { catchExceptionsFilter } from './errorHandler/base.filter';
import { PaytabModule } from './payment gateway/paytab.module';


@Module({
  imports: [
    EventEmitterModule.forRoot({global:true}),
    ConfigModule.forRoot({ isGlobal:true  }),
    MongooseModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>{
        return { uri : config.get<string>("mongo") }
      },
      imports:[ConfigModule]
    }),
    SchemaFactoryModule,
    ,
    ApiModule,PaytabModule
  ],
  controllers: [],
  providers: [{provide:APP_FILTER,useClass:catchExceptionsFilter}]
})
export class AppModule {}
