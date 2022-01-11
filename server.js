const express = require('express');
const next = require('next');

const port = process.env.PORT || 8080;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const isDev = process.env.NODE_ENV !== 'production';
const morgan = require('morgan');
var cors = require('cors');
require('dotenv').config();
const Web3 = require('web3');
const Moralis = require('moralis/node');

app.prepare().then(async () => {
	const server = express();

	server.use(cors());

	if (isDev) {
		// console.log(process.env.NODE_ENV);
		server.use(
			morgan('dev', {
				skip: function (req, res) {
					if (req.url.split('/static/')[0] == '/_next') {
						return true;
					} else {
						return false;
					}
				},
			})
		);
	}
	server.use(express.urlencoded({ extended: true, limit: '10mb' }));
	server.use(express.json({ limit: '10mb' }));

	server.post('/searchnft', async (req, res) => {
		console.log(req.body);
		var walletAddress = req.body.add;
		// if(isDev) walletAddress = '0x32Be343B94f860124dC4fEe278FDCBD38C102D88'
		try {
			const serverUrl = 'https://1ospyro22qey.usemoralis.com:2053/server';
			const appId = 'hDCpz4gubRnxZrmMvomXcpmklMRebliYieDBQq3K';
			await Moralis.start({ serverUrl, appId });
			const options = { chain: 'eth', address: walletAddress };
			console.log(options);
			const nfts = await Moralis.Web3API.account.getNFTs(options);
			// console.log(nfts);
			const erc721 = nfts.result.filter(
				(nft) => nft.contract_type === 'ERC721'
			);
			console.log(erc721.length);
			var send = [];
			for ([i, nft] of erc721.entries()) {
				var a = {};
				a['name'] = nft.name;
				a['token_id'] = nft.token_id;
				a['token_add'] = nft.token_address;
				a['block'] = nft.block_number;
				a['uri'] = nft.token_uri;
				send.push(a);
			}
			res.json({
				total: erc721.length,
				send,
			});
		} catch (e) {
			console.log(e);
		}
	});

	server.post('/getnft', async (req, res) => {
		const token = req.body.token;
		const walletAddress = req.body.add;
		const tokenadd = req.body.tokenadd;
		const block = req.body.block;
		try {
			console.log(walletAddress);
			console.log(tokenadd);
			const serverUrl = 'https://1ospyro22qey.usemoralis.com:2053/server';
			const appId = 'hDCpz4gubRnxZrmMvomXcpmklMRebliYieDBQq3K';
			await Moralis.start({ serverUrl, appId });
			const options = { chain: 'eth', addresses: token };
			console.log(options);
			// const tokenMetadata = await Moralis.Web3API.token.getTokenMetadata(
			// 	options
			// );
			// console.log(tokenMetadata);
			const transactions = await Moralis.Web3API.account.getTransactions({
				address: walletAddress,
			});
			var a = transactions.result.filter(
				(trans) => trans.to_address === token && trans.block_number === block
			);

			if (a.length < 1) {
				console.log(a.length);
				res.json({
					status: 400,
					error: 'Not Found',
				});
			} else {
				// console.log('bcccc');
				const hash = a[0].hash;
				const transaction = await Moralis.Web3API.native.getTransaction({
					chain: 'eth',
					transaction_hash: hash,
				});
				var b = {};
				b['block'] = transaction.block_number;
				b['time'] = transaction.block_timestamp;
				b['gas_price'] = transaction.gas_price;
				b['hash'] = transaction.hash;
				b['price'] = transaction.value;
				b['address'] = token;
				res.json({
					status: 200,
					data: b,
				});
				// console.log(transaction);
			}

			// console.log(a);
			// console.log(transactions);
		} catch (e) {
			console.log(e);
		}
	});

	server.all('*', (req, res) => {
		return handle(req, res);
	});

	server.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
});
