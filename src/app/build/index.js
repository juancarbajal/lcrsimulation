"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
// import fetch from "node-fetch";
const dotenv_1 = __importDefault(require("dotenv"));
const { Tedis, TedisPool } = require("tedis");
const fetch = require("node-fetch");
dotenv_1.default.config();
//read info of Redis 
async function readRedis() {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = process.env.REDIS_PORT || 6379;
    const redisPassword = process.env.REDIS_PASSWORD || 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81';
    const queueName = 'game:queue:case';
    const config = {
        host: redisHost,
        port: redisPort,
        password: redisPassword
    };
    const tedis = new Tedis(config);
    const len = await tedis.llen(queueName);
    let list = [];
    for (let i = 1; i < len; i++) {
        let pop = await tedis.lpop(queueName);
        if ((pop === null) || (pop === false))
            break;
        list.push(pop);
    }
    return list;
}
//Call Algorithm
async function callLambda(data) {
    const lambdaHost = process.env.LAMBDA_HOST || 'localhost';
    const lambdaPort = process.env.LAMBDA_PORT || '9000';
    console.log(lambdaHost);
    try {
        const res = await fetch(`http://${lambdaHost}:${lambdaPort}/2015-03-31/functions/function/invocations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'data': [
                    '3 LRC**LRC**CRL*LRCR',
                    '3 LLLLLL.',
                    '4 LRC..LRC..CRL.LRCRLRC..LRC..CRL.LRCR',
                    '6 LRC..LRC..CRL.LRCRLRC..LRC..CRL.LRCRLRC..LRC..CRL.LRCRLRC..LRC..CRL.LRCR',
                    '3 CCCCCC...'
                ]
            })
        });
        return res.json();
    }
    catch (err) {
        console.log(err);
    }
}
async function sendToEventBridge(msg) {
    // const aws = require('aws-sdk');
    const eventBridgeName = process.env.EVENTBRIDGE_NAME || 'LCRbus';
    const awsAccessKey = process.env.AWS_ACCESS_KEY_ID || 'AKIAQQ4WWS2VYVF2B73T';
    const awsSecretKey = process.env.AWS_SECRET_KEY || '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';
    const awsRegion = process.env.AWS_REGION || 'us-east-1';
    const config = {
        credentials: {
            accessKeyId: awsAccessKey,
            secretAccessKey: awsSecretKey,
        },
        region: awsRegion,
    };
    const eventBridge = new client_eventbridge_1.EventBridgeClient(config);
    const params = {
        Entries: [{
                Detail: JSON.stringify({ "data": msg }),
                DetailType: 'appRequestSubmitted',
                EventBusName: eventBridgeName,
                Source: 'LCRApp'
            }]
    };
    const result = await eventBridge.send((new client_eventbridge_1.PutEventsCommand(params)));
    return result;
}
const app = (0, express_1.default)();
const port = process.env.APP_PORT || '5000';
// app.get('/', (req: Request, res: Response) => {
// 	res.send('Express + TypeScript Server');
// });
async function main() {
    const input = await readRedis();
    console.log(input);
    const returnLambda = await callLambda(input);
    console.log(JSON.parse(returnLambda.data));
    const returnEventBridge = await sendToEventBridge(returnLambda.data);
    console.log(returnEventBridge);
}
main();
// const input = readRedis().then((result) => {
// 	console.log( result );
// 	const output = callLambda(result);
// 	console.log( output);
// }, (err) => {console.log( err );});
// app.listen(port, () => {
// 	console.log(`[server]: Server is running at http://localhost:${port}`);
// });
