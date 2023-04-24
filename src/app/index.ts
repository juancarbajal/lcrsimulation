import express, { Express, Request, Response } from 'express';
import { PutEventsCommand, EventBridgeClient } from '@aws-sdk/client-eventbridge';

// import fetch from "node-fetch";
import dotenv from 'dotenv';
import { getParsedCommandLineOfConfigFile } from 'typescript';
const { Tedis, TedisPool } = require("tedis");
const fetch = require("node-fetch");
const fs = require('fs');

dotenv.config();

const queueName = 'game:queue:case';
async function connectRedis() {
	const redisHost = process.env.REDIS_HOST || 'localhost';
	const redisPort = process.env.REDIS_PORT || 6379;
	const redisPassword = process.env.REDIS_PASSWORD || 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81';

	const config = {
		host: redisHost,
		port: redisPort,
		password: redisPassword
	};
	const tedis = new Tedis(config);
	return tedis;
}
//populate Redis  
async function populateRedis() {
	const tedis = await connectRedis();
	const allFileContents = fs.readFileSync('./migration/migration.redis', 'utf8');

	allFileContents.split(/\r?\n/).forEach( (line:string) => {
		if (line.length>3) {tedis.lpush(queueName, line);}
	});
}

//read info of Redis 
async function readRedis() {
	// const redisHost = process.env.REDIS_HOST || 'localhost';
	// const redisPort = process.env.REDIS_PORT || 6379;
	// const redisPassword = process.env.REDIS_PASSWORD || 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81';
	// const queueName = 'game:queue:case';
	// const config = {
	// 	host: redisHost,
	// 	port: redisPort,
	// 	password: redisPassword
	// };
	// const tedis = new Tedis(config);
	const tedis  = await connectRedis();
	const len = await tedis.llen(queueName);
	let list = [];
	for (let i = 1; i < len; i++) {
		let pop = await tedis.lpop(queueName);
		if ((pop === null) || (pop === false)) break;
		list.push(pop);
	}
	return list;
}
//Call Algorithm
async function callLambda(data: Array<String>) {
	const lambdaHost = process.env.LAMBDA_HOST || 'localhost';
	const lambdaPort = process.env.LAMBDA_PORT || '9000';
	// console.log(lambdaHost);
	// console.log( data );
	try {
		const res = await fetch(`http://${lambdaHost}:${lambdaPort}/2015-03-31/functions/function/invocations`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'data': data
			})
		});
		return res.json();
	} catch (err) {
		console.log(err);
	}
}

async function sendToEventBridge(msg: string) {
	try {
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
		}

		const eventBridge = new EventBridgeClient(config);
		const params = {
			Entries: [{
				Detail: JSON.stringify({ "data": msg }),
				DetailType: 'appRequestSubmitted',
				EventBusName: eventBridgeName,
				Source: 'LCRApp'
			}]
		}
		const result = await eventBridge.send((new PutEventsCommand(params)));
		return result;

	} catch (err) {
		return null;
	}
}


const app: Express = express();
const port = process.env.APP_PORT || '5000';

// app.get('/', (req: Request, res: Response) => {
// 	res.send('Express + TypeScript Server');
// });

async function main() {
	const populate = await populateRedis();
	const input = await readRedis();
	// console.log(input);
	const returnLambda = await callLambda(input);
	console.log(JSON.parse(returnLambda.data));
	const returnEventBridge = await sendToEventBridge(returnLambda.data);
	// console.log(returnEventBridge);
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
