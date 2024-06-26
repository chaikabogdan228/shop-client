import { $mode } from "@/context/mode"
import { useStore } from "effector-react"
import { ICatalogFilterMobileProps } from "@/types/catalog"
import FiltersPopupTop from "./FiltersPopupTop"
import FiltersPopup from "./FiltersPopup"
import { $partsManufacturers, $productManufacturers, setPartsManufacturers, setProductManufacturers, updatePartsManufacturers, updateProductManufacturers } from "@/context/products"
import { useState } from "react"
import spinnerStyles from '@/styles/spinner/index.module.scss'
import styles from '@/styles/catalog/index.module.scss'
import Accordion from "@/components/elements/Accordion/Accordion"
import PriceRange from "./PriceRange"
import { isModuleNamespaceObject } from "util/types"
import { useMediaQuery } from "@/hooks/useMediaQuery"

const CatalogFiltersMobile = ({
    spinner,
    resetFilterBtnDisabled,
    resetFilters,
    closePopup,
    applyFilters,
    filtersMobileOpen,
    setIsPriceRangeChanged,
    priceRange,
    setPriceRange,
} : ICatalogFilterMobileProps) => {
    const mode = useStore($mode)
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
    const productManufacturers = useStore($productManufacturers)
    const partsManufacturers = useStore($partsManufacturers)
    const [openProducts, setOpenProducts] = useState(false)
    const [openParts, setOpenParts] = useState(false)
    const handleOpenProducts = () => setOpenProducts(true)
    const handleCloseProducts = () => setOpenProducts(false)
    const handleOpenParts = () => setOpenParts(true)
    const handleCloseParts = () => setOpenParts(false)
    const isAnyProductsManufacturerChecked = productManufacturers.some(
        (item) => item.checked
    )
    const isAnyPartsManufacturerChecked = partsManufacturers.some(
        (item) => item.checked
    )
    const isMobile = useMediaQuery(820)

    const resetAllProductsManufacturers = () => 
        setProductManufacturers(
            productManufacturers.map((item) => ({ ...item, checked:false}))
        )
    const resetAllPartsManufacturers = () => 
        setPartsManufacturers(
            partsManufacturers.map((item) => ({ ...item, checked:false}))
        )


    const applyFiltersAndClosePopup = () => {
        applyFilters()
        closePopup()
      }

      return (
        <div className={`${styles.catalog__bottom__filters} ${darkModeClass} ${
            filtersMobileOpen ? styles.open : ''
        }`}>
            <div className={styles.catalog__bottom__filters__inner}>
                <FiltersPopupTop
                    resetBtnText="Сбросить все"
                    title="Фильтры"
                    resetFilters={resetFilters}
                    resetFilterBtnDisabled={resetFilterBtnDisabled}
                    closePopup={closePopup}
                />
                <div className={styles.filters__boiler_manufacturers}>
                    <button
                        className={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
                        onClick={handleOpenProducts}
                    >
                        Производитель удочек
                    </button>
                    <FiltersPopup
                        title="Производитель удочек"
                        resetFilterBtnDisabled={!isAnyProductsManufacturerChecked}
                        updateManufacturer={updateProductManufacturers}
                        setManufacturer={setProductManufacturers}
                        applyFilters={applyFiltersAndClosePopup}
                        manufacturersList={productManufacturers}
                        resetAllManufacturers={resetAllProductsManufacturers}
                        handleClosePopup={handleCloseProducts}
                        openPopup={openProducts}
                    />
                </div>
                <div className={styles.filters__boiler_manufacturers}>
                    <button
                        className={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
                        onClick={handleOpenParts}
                    >
                        Производитель снастей
                    </button>
                    <FiltersPopup
                        title="Производитель снастей"
                        resetFilterBtnDisabled={!isAnyPartsManufacturerChecked}
                        updateManufacturer={updatePartsManufacturers}
                        setManufacturer={setPartsManufacturers}
                        applyFilters={applyFiltersAndClosePopup}
                        manufacturersList={partsManufacturers}
                        resetAllManufacturers={resetAllPartsManufacturers}
                        handleClosePopup={handleCloseParts}
                        openPopup={openParts}
                    />
                </div>
            </div>
            <div className={styles.filters__price}>
                <Accordion
                    title="Цена"
                    titleClass={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
                    hideArrowClass={styles.hide_arrow}
                    isMobileForFilters={isMobile}
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
            <div className={styles.filters__actions}>
                <button
                    className={styles.filters__actions__show}
                    onClick={applyFiltersAndClosePopup}
                    disabled={resetFilterBtnDisabled}
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
            </div>
        </div>
    )
}

export default CatalogFiltersMobile
