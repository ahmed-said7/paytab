import { Module } from "@nestjs/common";
import { UserSchema } from "./user.schema";
import { ConfigModule } from "@nestjs/config";
import { RequestSchema } from "./request.schema";
import { OfferSchema } from "./offer.schema";



@Module({
    imports:[
        ConfigModule.forRoot()
    ],
    providers:[
        OfferSchema,
        UserSchema
        ,
        RequestSchema
    ],
    exports:[
        UserSchema,RequestSchema,
        OfferSchema
    ]
})

export class SchemaFactoryModule {};