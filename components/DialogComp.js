import { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DialogComp({ token, add, tokenadd, block, uri }) {
	const [load, setLoad] = useState(true);
	const [meta, setMeta] = useState({});
	const [data, setData] = useState({});
	const [status, setStatus] = useState(true);

	useEffect(async () => {
		try {
			setLoad(true);
			const res = await axios.post('/getnft', { token, add, tokenadd, block });
			const a = await axios.get(uri);
			setMeta(a.data);
			// console.log(a);
			if (res.data.status === 200) {
				setStatus(true);
				setData(res.data.data);
			} else {
				setStatus(false);
			}
			setLoad(false);
		} catch (e) {
			console.log(e);
		}
	}, [token]);
	return load ? (
		<div
			className="justify-center items-center  flex flex-row "
			style={{ height: '500px', width: '500px' }}
		>
			<CircularProgress />
		</div>
	) : (
		<div>
			{!status ? (
				<div>Some Error Occured</div>
			) : (
				<div
					className="flex flex-col items-center p-2"
					style={{ width: '50vw' }}
				>
					<div className="w-1/2">
						<video controls src={meta.image} />
					</div>
					<div className="flex flex-col w-3/4 p-4">
						<div className="flex flex-row justify-center ">
							<div className="font-semibold text-2xl ">{meta.name}</div>
						</div>
						<div className="flex flex-row justify-center">
							<div>{meta.description}</div>
						</div>
						<div className="flex flex-row justify-between bg-blue-200 p-2">
							<div>Block Number:</div>
							<div>{data.block}</div>
						</div>
						<div className="flex flex-row justify-between bg-blue-100 p-2">
							<div>Time:</div>
							<div>{data.time}</div>
						</div>
						<div className="flex flex-row justify-between bg-blue-200 p-2">
							<div>Price:</div>
							<div>{data.price}</div>
						</div>
						<div className="flex flex-row justify-between bg-blue-100 p-2">
							<div>Gas Price:</div>
							<div>{data.gas_price}</div>
						</div>
						<div className="flex flex-row justify-between flex-wrap bg-blue-200 p-2">
							<div>Transaction Id:</div>
							<div>{data.hash}</div>
						</div>
						<div className="flex flex-row justify-between flex-wrap bg-blue-100 p-2">
							<div>Contract Address:</div>
							<div>{data.address}</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
