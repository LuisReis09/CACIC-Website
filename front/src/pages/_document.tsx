import { Html, Head, Main, NextScript } from "next/document";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head>
        <link rel="shortcut icon" href="/assets/logo.svg" type="image/x-icon" />
        {/* <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"/> */}
        <title>CACIC - UFPB, Centro Acadêmico de CC</title>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
