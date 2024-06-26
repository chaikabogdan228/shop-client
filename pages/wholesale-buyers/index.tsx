import Layout from "@/components/layout/Layout";
import Breadcrumbs from "@/components/modules/Breadcrumbs/Breadcrumbs";
import ContactsPage from "@/components/templates/ContactsPage/ContactsPage";
import Head from "next/head";
import { useCallback } from "react";

function WholesaleBuyers () {
    const getDefaultTextGenerator = useCallback(() => 'Оптовым покупателям', [])
    const getTextGenerator = useCallback((param: string) => ({}[param]), [])
  return (
    <>
      <Head>
        <title>Золотой Карась | Оптовым покупателям</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/img/logo.svg" /> 
      </Head>
        <Layout>
          <main>
          <Breadcrumbs
            getDefaultTextGenerator={getDefaultTextGenerator}
            getTextGenerator={getTextGenerator}
          />
          <ContactsPage isWholesaleBuyersPage={true} />
            <div className="overlay" />
          </main>
        </Layout>
    </>
  )
}
export default WholesaleBuyers