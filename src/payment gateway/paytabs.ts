import { HttpException, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import * as paytabs from "paytabs_pt2";
import { mongodbId } from "src/chat/chat.service";
import { UserDoc } from "src/schema.factory/user.schema";
import axios  from "axios";
import { EventEmitter2 } from "@nestjs/event-emitter";
interface metadata {
    phone: string;
    street: string;
    city: string;
    state?: string;
    country?: string;
    zip?:string;
    ip?:string;
    requestId:mongodbId;
    price: number;
};


@Injectable()
export class Paytab {
    constructor(private events:EventEmitter2){};
    async getPaymentUrl(res:Response,user:UserDoc,meta:metadata){
        let profileID = process.env.profileId;
        let serverKey = process.env.serverkey;
        let region = process.env.region;
        paytabs.setConfig( profileID, serverKey, region);
        let paymentMethods = ["all"];
        let transaction_details = [
            "sale", // transaction type
            "ecom" // transaction class
        ];
        let cart_details = [
            meta.requestId,//cart.id
            process.env.currency, //cart.currency,
            meta.price,//cart.amount,
            "buy mechanical parts",//cart.description
        ];
        let customer_details = [
            user?.name,//customer.name,
            user?.email,// customer.email,
            //meta?.phone,// customer.phone,
            //meta?.street,// customer.street,
            //meta?.city,// customer.city,
            //meta?.state,//customer.state,
            //meta?.country || "saudi arabia",// customer.country,
            //meta?.zip,// "000000"// customer.zip,
            //meta?.ip// "127.0.0.1",// customer.IP
        ];
        let shipping_address = customer_details;
        let response_URLs = [
            process.env.response,
            process.env.callback
            
        ];
        let lang = "ar";
        let paymentPageCreated = function (results) {
            res.status(200).json({ url:results.redirect_url });
        };
        let frameMode = true;
        paytabs.createPaymentPage(
            paymentMethods,
            transaction_details,
            cart_details,
            customer_details,
            shipping_address,
            response_URLs,
            lang,
            paymentPageCreated,
            frameMode 
        );
    };
    async ValidatePayment(req:Request){
        if(req.body.tranRef){
            const data = {
                profile_id: process.env.profileId,
                tran_ref: req.body.tranRef
            };
            const config = {
                method: 'post',
                url: 'https://secure-egypt.paytabs.com/payment/query',
                headers: {
                    Authorization: `S9J99ZWKLN-JJ6J66WLTL-ZZRHJTG2GL`,
                    'Content-Type': 'application/json',
                }, data
            };
            try{
                const res=await axios(config);
                const data=res.data;
                if( data?.payment_result?.response_status && data?.payment_result?.response_status == "A" ){
                    this.events.emit("payment.created",data);
                };
            }catch(err){
                console.log("paymentFailed");
                // throw new HttpException("paymentFailed", 400);
            };
        };
    }
};

// {
//     tran_ref: 'TST2413801870813',
//     tran_type: 'Sale',
//     cart_id: '664684c89b48b586d34dbe8b',
//     cart_description: 'buy mechanical parts',
//     cart_currency: 'EGP',
//     cart_amount: '66.00',
//     tran_currency: 'EGP',
//     tran_total: '66.00',
//     customer_details: {
//       name: 'users gsgsg',
//       email: 'adhmedfssdcfd@gmail.com',
//       phone: '01066145656',
//       street1: 'ffuufu',
//       city: 'ddddddddd',
//       state: 'BV',
//       country: 'BV',
//       ip: '156.203.172.191'
//     },
//     shipping_details: {
//       name: 'user dd',
//       email: 'adhmedfssdcfd@gmail.com',
//       phone: '01066145656',
//       street1: 'ffuufu',
//       city: 'ddddddddd',
//       state: 'RI',
//       country: 'BS'
//     },
//     payment_result: {
//       response_status: 'A',
//       response_code: 'G13698',
//       response_message: 'Authorised',
//       transaction_time: '2024-05-17T02:41:38Z'
//     },
//     payment_info: {
//       payment_method: 'Visa',
//       card_type: 'Credit',
//       card_scheme: 'Visa',
//       payment_description: '4000 00## #### 0002',
//       expiryMonth: 9,
//       expiryYear: 2024
//     },
//     serviceId: 2,
//     profileId: 137405,
//     merchantId: 77732,
//     trace: 'PMNT0402.6646C3E4.00029736'
//   }