import { getProductsFx } from '@/app/api/products'
import FilterSelect from '@/components/modules/CatalogPage/FilterSelect'
import ManufacturersBlock from '@/components/modules/CatalogPage/ManufacturersBlock'
import { $mode } from '@/context/mode'
import { $filteredproducts, 
$partsManufacturers,
$productManufacturers,
$products, 
setPartsManufacturers, 
setProductManufacturers, 
setProducts, 
updatePartsManufacturers, 
updateProductManufacturers 
} from '@/context/products'
import { useStore } from 'effector-react'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import skeletonStyles from '@/styles/skeleton/index.module.scss'
import CatalogItem from '@/components/modules/CatalogPage/CatalogItem'
import ReactPaginate from 'react-paginate'
import { IQueryParams } from '@/types/catalog'
import { useRouter } from 'next/router'
import { IProducts } from '@/types/products'
import CatalogFilters from '@/components/modules/CatalogPage/CatalogFilters'
import { usePopup } from '@/hooks/usePoup'
import { checkQueryParams } from '@/utils/catalog'
import FilterSvg from '@/components/elements/FilterSvg/FilterSvg'
import styles from '@/styles/catalog/index.module.scss'
const CatalogPage = ({ query }: { query: IQueryParams }) => {
    const mode = useStore($mode)
    const productManufacturers = useStore($productManufacturers)
    const partsManufacturers = useStore($partsManufacturers)
    const filteredproducts = useStore($filteredproducts)
    const products = useStore($products)
    const [spinner, setSpinner] = useState(false)
    const [priceRange, setPriceRange] = useState([1000, 30000])
    const [isFilterInQuery, setIsFilterInQuery] = useState(false)
    const [isPriceRangeChanged, setIsPriceRangeChanged] = useState(false)
    const pagesCount = Math.ceil(products.count / 20)
    const isValidOffset = query.offset && !isNaN(+query.offset) && +query.offset > 0
    const [currentPage, setCurrentPage] = useState(isValidOffset ? +query.offset -1 : 0) 
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
    const router = useRouter()
    const isAnyProductsManufacturerChecked = productManufacturers.some(
        (item) => item.checked
    )
    const isAnyPartsManufacturerChecked = partsManufacturers.some(
        (item) => item.checked
    )
    const resetFilterBtnDisabled = !(
        isPriceRangeChanged ||
        isAnyProductsManufacturerChecked ||
        isAnyPartsManufacturerChecked
    )

    const { toggleOpen, open, closePopup } = usePopup()

    useEffect(() =>{
        loadProducts()
    }, [filteredproducts, isFilterInQuery  ])

    

    const loadProducts = async () => {
        try {
            setSpinner(true)
            const data = await getProductsFx('/products?limit=20&offset=0')
            
            if (!isValidOffset) {
                router.replace({
                    query: {
                        offset: 1
                    },
                })

                resetPagination(data)
                return
            }

            if(isValidOffset) {
                if(+query.offset > Math.ceil(data.count / 20)) {
                    router.push({
                        query: {
                            ...query,
                            offset: 1
                        },
                    },
                    undefined,
                    {shallow: true}
                )
                setCurrentPage(0)
                setProducts(isFilterInQuery ? filteredproducts : data)
                return
                }
                const offset = +query.offset - 1 
                const result = await getProductsFx(`/products?limit=20&offset=${offset}`)
    
                setCurrentPage(offset)
                setProducts(isFilterInQuery ? filteredproducts : result)
                return
            }
            setCurrentPage(0)
            setProducts(isFilterInQuery ? filteredproducts : data)
        } catch (error) {
            toast.error((error as Error).message)
        } finally{
            setTimeout(() => setSpinner(false), 1000)
        }
    }

    const resetPagination = (data: IProducts) => {
        setCurrentPage(0)
        setProducts(data)
    }


    const handlePageChange = async ({ selected }: { selected: number }) => {
        try {
            setSpinner(true)
            const data = await getProductsFx('/products?limit=20&offset=0')

            if(selected > pagesCount) {
                resetPagination(isFilterInQuery ? filteredproducts : data)
                return
            }

            if(isValidOffset && +query.offset > Math.ceil(data.count / 2)) {
                resetPagination(isFilterInQuery ? filteredproducts : data)
                return
            }

            const {isValidProductsQuery,isValiPartsQuery,isValidPriceQuery} = 
                checkQueryParams(router)

            const result = await getProductsFx(
                `/products?limit=20&offset=${selected}${
                isFilterInQuery && isValidProductsQuery
                 ? `&products=${router.query.products}`
                 : ''
                }${
                  isFilterInQuery && isValiPartsQuery 
                 ? `&parts=${router.query.parts}`
                 : ''
                }${
                isFilterInQuery && isValidPriceQuery
                 ? `&priceFrom=${router.query.priceFrom}&priceFrom=${router.query.priceTo}`
                 : ''
                } `
            )

            router.push({
                query: {
                    ...router.query,
                    offset: selected + 1,
                },
            },
            undefined,
            {shallow: true}
        )

        setCurrentPage(selected)
        setProducts(result)
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setTimeout(() => setSpinner(false), 1000)
        }
    }

    const resetFilters = async () =>{
     try {
        const data = await getProductsFx('/products?limit=20&offset=0')
        const params = router.query 

        delete params.products
        delete params.parts
        delete params.priceFrom
        delete params.priceTo
        params.first = 'speap'

        router.push({query: { ...params }}, undefined, {shallow:true})
        setProductManufacturers(
            productManufacturers.map((item) =>({...item, checked: false}))
        )
        setPartsManufacturers(
            partsManufacturers.map((item) =>({...item, checked: false}))
        )

        setProducts(data)
        setIsPriceRangeChanged(false)
        setPriceRange([1000, 10000])
     } catch (error) {
        toast.error((error as Error).message)
     }
    }

    return (
        <section className={styles.catalog}>
             <div className={`container ${styles.catalog__container}`}>
             <h2 className={`${styles.catalog__title} ${darkModeClass}`}>
          Каталог товаров
            </h2>
            <div className={`${styles.catalog__top} ${darkModeClass}`}>
            <AnimatePresence>
            {isAnyProductsManufacturerChecked  && (
                <ManufacturersBlock
                event={updateProductManufacturers}
                title="Производитель удочек: "
                manufacturersList= {productManufacturers}
                />
            )}
            </AnimatePresence>
            <AnimatePresence>
            {isAnyPartsManufacturerChecked && (
                <ManufacturersBlock
                event={updatePartsManufacturers}
                title="Производитель снастей:"
                manufacturersList={partsManufacturers}
                />
            )}
            </AnimatePresence>
            <div className={styles.catalog__top__inner}>
            <button
              className={`${styles.catalog__top__reset} ${darkModeClass}`}
              disabled={resetFilterBtnDisabled}
              onClick={resetFilters}
            >
              Сбросить фильтр
            </button>
            <button
              className={styles.catalog__top__mobile_btn}
              onClick={toggleOpen}
            >
              <span className={styles.catalog__top__mobile_btn__svg}>
                <FilterSvg />
              </span>
              <span className={styles.catalog__top__mobile_btn__text}>
                Фильтр
              </span>
            </button>
            <FilterSelect setSpinner={setSpinner} />
             </div>
            </div>
            <div className={styles.catalog__bottom}>
          <div className={styles.catalog__bottom__inner}>
          <CatalogFilters
              priceRange={priceRange}
              setIsPriceRangeChanged={setIsPriceRangeChanged}
              setPriceRange={setPriceRange}
              resetFilterBtnDisabled={resetFilterBtnDisabled}
              resetFilters={resetFilters}
              isPriceRangeChanged={isPriceRangeChanged}
              currentPage={currentPage}
              setIsFilterInQuery={setIsFilterInQuery}
              closePopup={closePopup}
              filtersMobileOpen={open}
            />  
                {spinner ? (
                    <ul className={skeletonStyles.skeleton}>
                        {Array.from(new Array(20)).map((_,i) =>(
                            <li
                            key={i}
                    className={`${skeletonStyles.skeleton__item} ${
                      mode === 'dark' ? `${skeletonStyles.dark_mode}` : ''
                    }`}
                    >
                                <div className={skeletonStyles.skeleton__item__light}/>
                            </li>
                        ))}

                    </ul>
                ) : (
                    <ul className={styles.catalog__list}>
                    {products.rows?.length? (
                        products.rows.map((item) => (
                        <CatalogItem item={item} key={item.id} />
                    ))
                ) : (
                    <span>Список товаров пуст</span>
                )}
                </ul>   
                )}
            </div>
            <ReactPaginate
            containerClassName={styles.catalog__bottom__list}
            pageClassName={styles.catalog__bottom__list__item}
            pageLinkClassName={styles.catalog__bottom__list__item__link}
            previousClassName={styles.catalog__bottom__list__prev}
            nextClassName={styles.catalog__bottom__list__next}
            breakClassName={styles.catalog__bottom__list__break}
            breakLinkClassName={`${styles.catalog__bottom__list__break__link} ${darkModeClass}`}
            breakLabel="..."
            pageCount={pagesCount}
            forcePage={currentPage}
            onPageChange={handlePageChange} 
            />
            </div>
            </div>
        </section>
    )

}



export default CatalogPage
