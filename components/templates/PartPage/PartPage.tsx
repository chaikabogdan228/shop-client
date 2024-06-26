import { toast } from "react-toastify"
import { useEffect } from "react"
import { useStore } from "effector-react"
import { $mode } from "@/context/mode"
import { $user } from "@/context/user"
import { $products, 
setProducts, 
setProductsByPopularity
} from "@/context/products"
import { $product } from "@/context/product"
import { formatPrice } from "@/utils/common"
import { $shoppingCart } from "@/context/shopping-cart"
import { removeFromCartFx } from "@/app/api/shopping-cart"
import CartHoverCheckedSvg from "@/components/elements/CartHoverCheckedSvg/CartHoverCheckedSvg"
import CartHoverSvg from "@/components/elements/CartHoverSvg/CartHoverSvg"
import { toggleCartItem } from "@/utils/shopping-cart"
import PartImagesList from "@/components/modules/PartPage/PartImagesList"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import PartTabs from "@/components/modules/PartPage/PartTabs"
import DashboardSlider from "@/components/modules/DashboardPage/DashboardSlider"
import { getProductFx, getProductsFx } from "@/app/api/products"
import styles from '@/styles/part/index.module.scss'
import spinnerStyles from '@/styles/spinner/index.module.scss'
import PartAccordion from "@/components/modules/PartPage/PartAccordion"

const PartPage = () => {
    const mode = useStore($mode)
    const user = useStore($user)
    const isMobile = useMediaQuery(850)
    const product = useStore($product)
    const products = useStore($products)
    const cartItems = useStore($shoppingCart)
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
    const isInCart = cartItems.some((item) => item.partId === product.id)
    const spinnerToggleCart = useStore(removeFromCartFx.pending)
    const spinnerSlider = useStore(getProductsFx.pending)
    
    useEffect(() => {
        loadProducts()
      }, [])

    const loadProducts = async () => {
        try {
          const data = await getProductFx('/Products?limit=20&offset=0')
    
          setProducts(data)
          setProductsByPopularity()
        } catch (error) {
          toast.error((error as Error).message)
        }
      }

      const toggleToCart = () => 
        toggleCartItem(user.username, product.id, isInCart)

    return(
        <section>
            <div className="container">
                <div className={`${styles.part__top} ${darkModeClass}`}>
                    <h2 className={`${styles.part__title} ${darkModeClass}`}>
                        {product.name}
                    </h2>
                    <div className={styles.part__inner}>
                        <PartImagesList />
                        <div className={styles.part__info}>
                            <span className={`${styles.part__info__price} ${darkModeClass}`}>
                                {formatPrice(product.price || 0)} P
                            </span>
                            <span className={styles.part__info__stock}>
                                    {product.in_stock > 0 ? (
                                <span className={styles.part__info__stock__success}>
                                    Есть на складе
                                </span>
                                ) : (
                                <span className={styles.part__info__stock__not}>
                                    Нет на складе
                                </span>
                                )}
                            </span>
                            <span className={styles.part__info__code}>
                                Артикул: {product.vendor_code}
                            </span>
                            <button
                                className={`${styles.part__info__btn} ${
                                isInCart ? styles.in_cart : ''
                                }`}
                                onClick={toggleToCart}
                            >
                                {spinnerToggleCart ? (
                                    <span
                                    className={spinnerStyles.spinner}
                                    style={{ top: 10, left: '45%' }}
                                />
                                ) : (
                                <>
                                <span className={styles.part__info__btn__icon}>
                                    {isInCart ? <CartHoverCheckedSvg /> : <CartHoverSvg />}
                                </span>
                                {isInCart ? (
                                    <span>Добавлено в карзину</span>
                                ) : (
                                    <span>Положить в корзину</span>
                                )}
                                </>
                                )}
                            </button>
                            {!isMobile && <PartTabs/>}
                        </div>
                    </div>
                </div>
                {isMobile && (
                <div className={styles.part__accordion}>
                    <div className={styles.part__accordion__inner}>
                        <PartAccordion title="Описание">
                            <div
                                className={`${styles.part__accordion__content} ${darkModeClass}`}
                            >
                                <h3
                                    className={`${styles.part__tabs__content__title} ${darkModeClass}`}
                                >
                                    {product.name}
                                </h3>
                                <p
                                    className={`${styles.part__tabs__content__text} ${darkModeClass}`}
                                >
                                    {product.description}
                                </p>
                            </div>
                        </PartAccordion>
                    </div>
                        <PartAccordion title="Совместимость">
                            <div
                                className={`${styles.part__accordion__content} ${darkModeClass}`}
                            >
                                <p
                                    className={`${styles.part__tabs__content__text} ${darkModeClass}`}
                                >
                                    {product.compatibility}
                                </p>
                            </div>
                        </PartAccordion>
                </div>
                 )}
                <div className={styles.part__bottom}>
                    <h2 className={`${styles.part__title} ${darkModeClass}`}>
                        Вам понравится
                    </h2>
                    <DashboardSlider
                    goToPartPage
                    spinner={spinnerSlider}
                    items={products.rows || []}
          />
                </div>
            </div>
        </section>
    )
}


export default PartPage