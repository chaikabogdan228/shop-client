import { useMediaQuery } from "@/hooks/useMediaQuery"
import CatalogFiltersDesktop from "./CatalogFiltersDesktop"
import { ICatalogFiltersProps } from "@/types/catalog"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useStore } from "effector-react"
import { useRouter } from "next/router"
import { $partsManufacturers, $productManufacturers, setPartsManufacturersFromQuery, setProductManufacturersFromQuery } from "@/context/products"
import { getQueryParamOnFirstRender } from "@/utils/common"
import CatalogFiltersMobile from "./CatalogFiltersMobile"
import { checkQueryParams, updateParamsAndFilters, updateParamsAndFiltersFromQuery } from "@/utils/catalog"

const CatalogFilters = ({
    priceRange,
    setPriceRange,
    setIsPriceRangeChanged,
    resetFilterBtnDisabled,
    resetFilters,
    isPriceRangeChanged,
    currentPage,
    setIsFilterInQuery,
    closePopup,
    filtersMobileOpen,
  }: ICatalogFiltersProps) => {
    const isMobile = useMediaQuery(820)
    const [spinner, setSpinner] = useState(false)
    const productManufacturers = useStore($productManufacturers)
    const partsManufacturers = useStore($partsManufacturers)
    const router = useRouter()

    useEffect(() => {
        applyFiltersFromQuery()
    }, [])

    const applyFiltersFromQuery = async () => {
        try {
            const {
            isValidProductsQuery,
            isValiPartsQuery,
            isValidPriceQuery,
            priceFromQueryValue,
            priceToQueryValue,
            productsQueryValue,
            partsQueryValue

            } = checkQueryParams(router)

            const productsQuery = `&products=${getQueryParamOnFirstRender('products', router)}`
            const partsQuery = `&parts=${getQueryParamOnFirstRender('parts', router)}`
            const priceQuery = `&priceFrom=${priceFromQueryValue}
            &priceTo=${priceToQueryValue}`

            if (
                isValidProductsQuery && 
                isValiPartsQuery && 
                isValidPriceQuery
            ) {
                updateParamsAndFiltersFromQuery(() => {
                    updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
                    setProductManufacturersFromQuery(productsQueryValue)
                    setPartsManufacturersFromQuery(partsQueryValue)
                }, `${currentPage}${priceQuery}${productsQuery}${partsQuery}`)
                return
            }
            if ( isValidPriceQuery ) {
                updateParamsAndFiltersFromQuery(() => {
                    updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
                }, `${currentPage}${priceQuery}`)
            }
            if ( isValidProductsQuery && isValiPartsQuery) {
                updateParamsAndFiltersFromQuery(() => {
                    setIsFilterInQuery(true)
                    setProductManufacturersFromQuery(productsQueryValue)
                    setPartsManufacturersFromQuery(partsQueryValue)
                }, `${currentPage}${productsQuery}${partsQuery}`)
                return
            }
            if ( isValidProductsQuery) {
                updateParamsAndFiltersFromQuery(() => {
                    setIsFilterInQuery(true)
                    setProductManufacturersFromQuery(productsQueryValue)
                }, `${currentPage}${productsQuery}`)
            }
            if ( isValiPartsQuery) {
                updateParamsAndFiltersFromQuery(() => {
                    setIsFilterInQuery(true)
                    setPartsManufacturersFromQuery(partsQueryValue)
                }, `${currentPage}${partsQuery}`)
            }
            if (isValiPartsQuery && isValidPriceQuery) {
                updateParamsAndFiltersFromQuery(() => {
                    updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
                    setPartsManufacturersFromQuery(partsQueryValue)
                }, `${currentPage}${priceQuery}${partsQuery}`)
            }
            if ( isValidProductsQuery && isValidPriceQuery) {
                updateParamsAndFiltersFromQuery(() => {
                    updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
                    setProductManufacturersFromQuery(productsQueryValue)
                }, `${currentPage}${priceQuery}${productsQuery}`)
            }
        } catch (error) {
            const err = error as Error

            if (err.message ==='URI malformed'){
                toast.warning('Неправильный url для фильтров')
                return
            }
            toast.error(err.message)
        }

    }

    const updatePriceFromQuery = (priceFrom: number, priceTo: number) => {
        setIsFilterInQuery(true)
        setPriceRange([+priceFrom, +priceTo])
        setIsPriceRangeChanged(true)
    }

    const applyFilters = async () =>{
        setIsFilterInQuery(true)
        try {
            setSpinner(true)
            const priceFrom = Math.ceil(priceRange[0])
            const priceTo = Math.ceil(priceRange[1])
            const priceQuery = isPriceRangeChanged
            ? `&priceFrom=${priceFrom}&priceTo=${priceTo}`
            : ''
            const products = productManufacturers
            .filter((item) => item.checked)
            .map((item) => item.title)
            const parts = partsManufacturers
            .filter((item) => item.checked)
            .map((item) => item.title)
            const encodedProductsQuery = encodeURIComponent(JSON.stringify(products))
            const encodedPartsQuery = encodeURIComponent(JSON.stringify(parts))
            const productQuery =  `&products=${encodedProductsQuery}`
            const partsQuery = `&parts=${encodedPartsQuery}`
            const initialPage = currentPage > 0 ? 0 : currentPage

            if(products.length && parts.length && isPriceRangeChanged){
                updateParamsAndFilters({
                    products: encodedProductsQuery,
                    parts: encodedPartsQuery,
                    priceFrom,
                    priceTo,
                    offset: initialPage + 1,
                }, 
                `${initialPage}${priceQuery}${productQuery}${partsQuery}`,
                router
                )
               return
            }
            if(isPriceRangeChanged) {
                updateParamsAndFilters({
                    priceFrom,
                    priceTo,
                    offset: initialPage + 1,
                }, 
                `${initialPage}${priceQuery}`,
                router 
            )
            }
            if(products.length && parts.length){
                updateParamsAndFilters({
                    products: encodedProductsQuery,
                    parts: encodedPartsQuery,
                    offset: initialPage + 1,
                }, 
                `${initialPage}${productQuery}${partsQuery}`,
                router
                )
               return
            }
            if(products.length){
                updateParamsAndFilters({
                    products: encodedProductsQuery,
                    offset: initialPage + 1,
                }, 
                `${initialPage}${productQuery}`,
                router
                )
            }
            if(parts.length){
                updateParamsAndFilters({
                    parts: encodedPartsQuery,
                    offset: initialPage + 1,
                }, 
                `${initialPage}${partsQuery}`,
                router 
                )
            }
            if(products.length && isPriceRangeChanged){
                updateParamsAndFilters({
                    products: encodedProductsQuery,
                    priceFrom,
                    priceTo,
                    offset: initialPage + 1,
                }, 
                `${initialPage}${productQuery}${priceQuery}`,
                router
                )
            }
            if(parts.length && isPriceRangeChanged){
                updateParamsAndFilters({
                    parts: encodedPartsQuery,
                    priceFrom,
                    priceTo,
                    offset: initialPage + 1,
                }, 
                `${initialPage}${partsQuery}${priceQuery}`,
                router 
                )
            }
        } catch (error) {
            toast.error((error as Error).message)
        }finally {
            setSpinner(false)
          }
    }

    return (
        <>
        {isMobile ? (
        <CatalogFiltersMobile
        closePopup={closePopup}
        spinner={spinner}
        applyFilters={applyFilters}
        priceRange={priceRange}
        setIsPriceRangeChanged={setIsPriceRangeChanged}
        setPriceRange={setPriceRange}
        resetFilterBtnDisabled={resetFilterBtnDisabled}
        resetFilters={resetFilters}
        filtersMobileOpen={filtersMobileOpen}
        />
        ) : ( 
        <CatalogFiltersDesktop
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        setIsPriceRangeChanged={setIsPriceRangeChanged}
        resetFilterBtnDisabled = {resetFilterBtnDisabled}
        spinner ={spinner}
        resetFilters ={resetFilters}
        applyFilters = {applyFilters}
        />
        )}
        </> 
    )
    
}

export default CatalogFilters
