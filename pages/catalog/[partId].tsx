import { getProductFx } from "@/app/api/products";
import Layout from "@/components/layout/Layout";
import PartPage from "@/components/templates/PartPage/PartPage";
import { $product, setProduct } from "@/context/product";
import useRedirectByUserCheck from "@/hooks/useRedirectByUserCheck";
import { IQueryParams } from "@/types/catalog";
import { useStore } from "effector-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Custom404 from "../404";
import Breadcrumbs from "@/components/modules/Breadcrumbs/Breadcrumbs";

function CatalogPartPage ({ query }: { query: IQueryParams }) {
  const { shouldLoadContent } = useRedirectByUserCheck()
  const product = useStore($product)
  const [error, setError] = useState(false)
  const router = useRouter()
  const getDefaultTextGenerator = useCallback(
    (subpath: string) => subpath.replace('catalog', 'Каталог'),
    []
  )
  const getTextGenerator = useCallback((param: string) => ({}[param]), [])
  const lastCrumb = document.querySelector('.last-crumb') as HTMLElement


  useEffect(() => {
    loadproduct()
  }, [router.asPath])

  useEffect(() => {
    if (lastCrumb) {
      lastCrumb.textContent = product.name
    }
  }, [lastCrumb, product])

  const loadproduct = async () => {
   try {
    const data = await  getProductFx(`/Products/find/${query.partId}`)

    if (!data) {
      setError(true)
      return
    }

    setProduct(data)
   } catch (error) {
    toast.error((error as Error).message)
   }
  }

  return (
    <>
      <Head>
        <title>Злой Карась | {shouldLoadContent ? product.name: ''}</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/img/logo.svg" /> 
      </Head>
      {error ? (
        <Custom404 />
      ) : (
        shouldLoadContent && (
        <Layout>
          <main>
            <Breadcrumbs
              getDefaultTextGenerator={getDefaultTextGenerator}
              getTextGenerator={getTextGenerator}
            />
            <PartPage/>
            <div className="overlay" />
          </main>
        </Layout>
      )
    )}
  </>
)
}
export async function getServerSideProps(context: { query: IQueryParams }) {
  return {
    props: { query: { ...context.query } },
  }
}

export default CatalogPartPage