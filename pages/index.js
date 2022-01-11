import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogComp from '../components/DialogComp';
import Dialog from '@material-ui/core/Dialog';
import { useMoralis } from 'react-moralis';
export default function Home() {
	// 0xf4bd21a6cfb4b2063a690d17fba5372785b25528;
	const [add, setAdd] = useState('');
	const [tokenadd, setTokenadd] = useState('');
	const [items, setItems] = useState([]);
	const [load, setLoad] = useState(false);
	const [open, setOpen] = useState(false);
	const [token, setToken] = useState('');
	const [block, setBlock] = useState('');
	const [uri, setUri] = useState('');
	const { authenticate, isAuthenticated, logout, user } = useMoralis();

	const searchNFT = async () => {
		try {
			setLoad(true);
			const res = await axios.post('/searchnft', { add });
			console.log(res);
			setItems(res.data.send);
			setLoad(false);
		} catch (e) {
			console.log(e);
			throw e;
		}
	};

	useEffect(async () => {
		try {
			setLoad(true);
			if (isAuthenticated) setAdd(user.get('ethAddress'));
			else {
				setAdd('');
			}
			setLoad(false);
		} catch (e) {
			console.log(e);
		}
	}, [isAuthenticated]);

	const handleClose = () => {
		setOpen(false);
	};

	return load ? (
		<div className="w-screen h-screen  justify-center items-center  flex flex-row ">
			<CircularProgress />
		</div>
	) : (
		<div>
			<Head>
				<title>Dashboard</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="flex flex-col width-screen">
				{isAuthenticated ? (
					<div className="mt-10 w-1/8 self-center ">
						Welcome {user.get('username')}
					</div>
				) : (
					<div></div>
				)}

				<div className="mt-10 w-1/8 self-center ">
					{isAuthenticated ? (
						<Button
							color="primary"
							variant="contained"
							type="submit"
							style={{}}
							className="w-full"
							onClick={logout}
						>
							Log Out
						</Button>
					) : (
						<Button
							color="primary"
							variant="contained"
							type="submit"
							style={{}}
							className="w-full"
							onClick={() => {
								authenticate({ provider: 'metamask' });
							}}
						>
							Log In With MetaMask
						</Button>
					)}
				</div>
				<div className="width-screen justify-center self-center  pt-5">
					<h1 className="text-4xl">Enter Wallet Address</h1>
				</div>
				<div className=" mt-10 w-1/2 self-center ">
					<TextField
						type="username"
						label="Wallet Address"
						name="username"
						variant="outlined"
						size="small"
						autoFocus
						value={add}
						className="w-full h-full bg-blue-100"
						onChange={(e) => {
							setAdd(e.target.value);
						}}
						InputProps={{}}
					/>
					<div className="text-red-500 text-sm">
						Displaying NFTS with ERC721 token only on ethereum
					</div>
				</div>
				<div className="mt-10 w-1/8 self-center ">
					<Button
						color="primary"
						variant="contained"
						type="submit"
						style={{}}
						className="w-full"
						onClick={searchNFT}
					>
						Search
					</Button>
				</div>
				<div className="flex flex-col w-3/4 self-center bg-red-100 my-8 ">
					<div className="self-center bg-blue-100  w-full">
						<div className="flex flex-row justify-between p-2 px-6">
							<div>Name</div>
							<div>Token ID</div>
							<div></div>
						</div>
						{items.map((item) => {
							return (
								<div
									className="flex flex-row justify-between p-2 px-6"
									key={item.token_id}
								>
									<div>{item.name}</div>
									<div>{item.token_id}</div>
									<div
										className="cursor-pointer"
										onClick={() => {
											setOpen(true);
											setToken(item.token_add);
											setTokenadd(item.token_id);
											setBlock(item.block);
											setUri(item.uri);
										}}
									>
										More Info
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				maxWidth="xl"
			>
				<DialogComp {...{ token, add, tokenadd, block, uri }} />
			</Dialog>
		</div>
	);
}
