import '../styles/globals.css';
import { MoralisProvider } from 'react-moralis';
function MyApp({ Component, pageProps }) {
	return (
		<MoralisProvider
			appId="hDCpz4gubRnxZrmMvomXcpmklMRebliYieDBQq3K"
			serverUrl="https://1ospyro22qey.usemoralis.com:2053/server"
		>
			<Component {...pageProps} />
		</MoralisProvider>
	);
}

export default MyApp;
