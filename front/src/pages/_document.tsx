import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head>
        <link rel="shortcut icon" href="/assets/logo.svg" type="image/x-icon" />
        <meta name="theme-color" content="#000814"></meta>
        <title>CACIC - UFPB, Centro Acadêmico de CC</title>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
