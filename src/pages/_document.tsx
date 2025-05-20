import Document, { Html, Head, Main, NextScript } from "next/document";
import Layout from "../components/Layout";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <Layout>
          <Main />
          <NextScript />
        </Layout>
      </Html>
    );
  }
}

export default MyDocument;
