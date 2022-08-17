import { Children } from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
// import createEmotionServer from '@emotion/server/create-instance';
// import { createEmotionCache } from '../utils/create-emotion-cache';

class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto+Slab|Roboto:300,400,500,700&display=optional"
          />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
            <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            href="/favicon.ico"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon.ico"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon.ico"
          />
          <meta
            name="theme-color"
            content="#111827"
          />
          <meta name="title" content="Goblin Sax" />
          <meta name="description" content="Goblin Sax is an NFT financialization collective and we currently make NFT-collateralized loans to NFT holders." />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Goblin Sax" />
          <meta property="og:description" content="Goblin Sax is an NFT financialization collective and we currently make NFT-collateralized loans to NFT holders." />
          {/* <meta property="og:image" content="/static/images/GS.png" /> */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:title" content="Goblin Sax" />
          <meta property="twitter:description" content="Goblin Sax is an NFT financialization collective and we currently make NFT-collateralized loans to NFT holders." />
          {/* <meta property="twitter:image" content="/static/images/GS.png" /> */}
        </Head>
        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    );
  }
}

// CustomDocument.getInitialProps = async (ctx) => {
//     const originalRenderPage = ctx.renderPage;
//     const cache = createEmotionCache();
//     const { extractCriticalToChunks } = createEmotionServer(cache);
  
//     ctx.renderPage = () => originalRenderPage({
//       enhanceApp: (App) => (props) => (
//         <App
//           emotionCache={cache}
//           {...props}
//         />
//       )
//     });
  
//     const initialProps = await Document.getInitialProps(ctx);
//     const emotionStyles = extractCriticalToChunks(initialProps.html);
//     const emotionStyleTags = emotionStyles.styles.map((style) => (
//       <style
//         data-emotion={`${style.key} ${style.ids.join(' ')}`}
//         key={style.key}
//         // eslint-disable-next-line react/no-danger
//         dangerouslySetInnerHTML={{ __html: style.css }}
//       />
//     ));
  
//     return {
//       ...initialProps,
//       styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags]
//     };
//   };

export default CustomDocument;
