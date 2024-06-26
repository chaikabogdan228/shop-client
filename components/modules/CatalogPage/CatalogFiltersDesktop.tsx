import { useStore } from "effector-react"
import { $mode } from "@/context/mode"
import FilterManufacturerAccordion from "./FilterManufacturerAccordion"
import Accordion from "@/components/elements/Accordion/Accordion"
import PriceRange from "./PriceRange"
import { ICatalogFilterDesktopProps } from "@/types/catalog"
import { $partsManufacturers, $productManufacturers, setPartsManufacturers, setProductManufacturers, updatePartsManufacturers, updateProductManufacturers } from "@/context/products"
import spinnerStyles from '@/styles/spinner/index.module.scss'
import styles from '@/styles/catalog/index.module.scss'

const CatalogFiltersDesktop = ({
    priceRange,
    setPriceRange,
    setIsPriceRangeChanged,
    resetFilterBtnDisabled,
    spinner,
    resetFilters,
    applyFilters,
  }: ICatalogFilterDesktopProps) =>{
    const mode = useStore($mode)
    const productManufacturers = useStore($productManufacturers)
    const partsManufacturers = useStore($partsManufacturers)
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
    return(
        <div className={`${styles.catalog__bottom__filters} ${darkModeClass}`}>
            <h3 className={`${styles.catalog__bottom__filters__title} ${darkModeClass}`}
            >
            Фильтры 
            </h3>
            <div className={styles.filters__boiler_manufacturers}>
                <FilterManufacturerAccordion
                manufacturersList = {productManufacturers}
                title="Производитель удочек"
                updateManufacturer={updateProductManufacturers}
                setManufacturer= {setProductManufacturers}
                />
            </div>
            <div className={styles.filters__price}>
            <Accordion
          title="Цена"
          titleClass={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
          arrowOpenClass={styles.open}  
        >
          <div className={styles.filters__manufacturer__inner}>
            <PriceRange
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              setIsPriceRangeChanged={setIsPriceRangeChanged}
            />
            <div style={{ height: 24 }} />
          </div>
        </Accordion>
            </div>
            <div className={styles.filters__boiler_manufacturers}>
                <FilterManufacturerAccordion
                manufacturersList = {partsManufacturers}
                title="Производитель снастей"  
                updateManufacturer={updatePartsManufacturers}
                setManufacturer= {setPartsManufacturers}
                />
            </div>
            <div className={styles.filters__actions}>
            <button
          className={styles.filters__actions__show}
          disabled={spinner || resetFilterBtnDisabled}
          onClick={applyFilters}
        >
          {spinner ? (
            <span
              className={spinnerStyles.spinner}
              style={{ top: 6, left: '47%' }}
            />
          ) : (
            'Показать'
          )}
        </button>
        <button
          className={styles.filters__actions__reset}
          disabled={resetFilterBtnDisabled}
          onClick={resetFilters}
        >
          Сбросить
        </button>
            </div>
        </div>
    )
}

export default CatalogFiltersDesktop
