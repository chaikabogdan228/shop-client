import { NextRouter } from "next/router";
import { getQueryParamOnFirstRender, idGenerator } from "./common";
import { setFilteredproducts } from "@/context/products";
import { getProductsFx } from "@/app/api/products";

const createManufacturerCheckboxObj = (title: string) => ({
    title,
    checked: false,
    id: idGenerator(),
})

export const productsManufacturers = [
    'Drennan',
    'Shimano',
    'Preston Innovations',
    'Spro',
    'Daiwa',
    'St Croix',
    'Stinger',
    'Mikado',
    'WaveFish',
    'Black Hole',
].map(createManufacturerCheckboxObj)
export const partsManufacturers = [
    'Trabucco',
    'Balzer',
    'Middy',
    'Fenwick',
    'GRFISH',
    'Maximus',
    'Graphiteleader',
    'Lucky John',
    'G Loomis',
    'Mifine',
].map(createManufacturerCheckboxObj)

const checkPriceFromQuery = (price: number) => price && !isNaN(price) && price >= 0 && price <= 30000

export const checkQueryParams = (router: NextRouter) => {
    const priceFromQueryValue = getQueryParamOnFirstRender(
        'priceFrom',
        router
    ) as string
    const priceToQueryValue = getQueryParamOnFirstRender(
        'priceTo',
        router
    ) as string
    const productsQueryValue = JSON.parse(
        decodeURIComponent(getQueryParamOnFirstRender('products', router) as string
    )
    )
    const partsQueryValue = JSON.parse(
        decodeURIComponent(getQueryParamOnFirstRender('parts', router) as string
    )
    )
    const isValidProductsQuery = Array.isArray(productsQueryValue) && !! productsQueryValue?.length
    const isValiPartsQuery = Array.isArray(partsQueryValue) && !! partsQueryValue?.length
    const isValidPriceQuery = checkPriceFromQuery(+priceFromQueryValue) && checkPriceFromQuery(+priceToQueryValue)

    return {
        isValidProductsQuery,
        isValiPartsQuery,
        isValidPriceQuery,
        priceFromQueryValue,
        priceToQueryValue,
        productsQueryValue,
        partsQueryValue
    }
    
}

export const updateParamsAndFiltersFromQuery = async (callback: VoidFunction, path: string) => {
    callback()

    const data = await getProductsFx(`/products?limit=20&offset=${path}`)

    setFilteredproducts(data)
}

export async function updateParamsAndFilters<T>(updateParams: T, path: string, router: NextRouter ) {
    const params = router.query 

    delete params.products
    delete params.parts
    delete params.priceFrom
    delete params.priceTo

    router.push({
        query:{
            ...params,
            ...updateParams,

        },
    }, undefined,
    {shallow:true}
   )
   const data = await getProductsFx(`/products?limit=20&offset=${path}`)

   setFilteredproducts(data)
}

