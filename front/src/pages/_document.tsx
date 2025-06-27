import { Html, Head, Main, NextScript } from "next/document";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head>
        <link rel="shortcut icon" href="/assets/logo.svg" type="image/x-icon" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" integrity="sha512-..." crossorigin="anonymous" referrerpolicy="no-referrer" />
        <title>CACIC - UFPB, Centro Acadêmico de CC</title>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
