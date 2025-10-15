import { Html, Head, Main, NextScript } from 'next/document';
import Document from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
          <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
          
          {/* Favicon 链接 */}
          <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          
          {/* Google Analytics */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-C4JG7ZWZ5E"></script>
          <script dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-C4JG7ZWZ5E');
            `
          }} />
        </Head>
        
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 