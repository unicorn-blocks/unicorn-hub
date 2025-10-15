import '../styles/globals.css';
import Head from 'next/head';
import { LanguageProvider } from '../context/LanguageContext';

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}

export default MyApp; 