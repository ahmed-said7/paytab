import { Injectable } from "@nestjs/common";
import { Schema , Document } from "mongoose";
import { mongodbId } from "src/chat/chat.service";
import { Models } from "src/enums/models";

@Injectable()
export class OrderSchema {
    schema=new Schema({
        carmodel : {
            type:Schema.Types.ObjectId,
            ref:Models.CarModel
        },
        brand : {
                type:Schema.Types.ObjectId,
                ref:Models.Brand
        },
        year:Number,
        requestImage:String,
        offerImage:String,
        details:String,
        user : {
            type:Schema.Types.ObjectId,
            ref:Models.User
        },
        trader: {
            type:Schema.Types.ObjectId,
            ref:Models.User
        },
        price:Number,
        status: { type:String , enum:["new","used"] },
        paid:{ type:Boolean , default:false },
        delivered:{ type:Boolean , default:false },
        deliveredAt:Date,
        paidAt:Date,
        address:{
            postalCode:Number,
            details:String,
            city:String,
            street:String,
            mobile:String
        }
    },{
        timestamps:true
    });
    constructor(){
        this.schema.post("init",function(){
            if(this.requestImage){
                this.requestImage=`${process.env.url}/request/${this.requestImage}`;
            }
        });
        this.schema.post("save",function(){
            if(this.requestImage){
                this.requestImage=`${process.env.url}/request/${this.requestImage}`;
            }
        });
        this.schema.post("init",function(){
            if(this.offerImage){
                this.offerImage=`${process.env.url}/request/${this.offerImage}`;
            }
        });
        this.schema.post("save",function(){
            if(this.offerImage){
                this.offerImage=`${process.env.url}/request/${this.offerImage}`;
            }
        });
    };
};

export interface OrderDoc extends Document {
    carmodel:mongodbId;
    brand:mongodbId;
    user:mongodbId;
    trader:mongodbId;
    requestImage:string,
    offerImage:string,
    year:number;
    details:string;
    status:string;
    price:number;
    paid:boolean;
    delivered:boolean;
    deliveredAt:Date;
    paidAt:Date;
    address:{
        postalCode:number,
        details:string,
        city:string,
        street:string,
        mobile:string
    }
};