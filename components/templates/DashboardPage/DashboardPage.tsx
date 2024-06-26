import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styles from '@/styles/dashboard/index.module.scss'
import { getBestsellersOrNewPartsFx } from '@/app/api/products'
import { IProduct,  } from '@/types/products'
import BrandsSlider from '@/components/modules/DashboardPage/BrandsSlider'
import { useStore } from 'effector-react'
import { $mode } from '@/context/mode'
import DashboardSlider from '@/components/modules/DashboardPage/DashboardSlider'
import { $shoppingCart } from '@/context/shopping-cart'
import { AnimatePresence, motion } from 'framer-motion'
import CartAlert from '@/components/modules/DashboardPage/CartAlert'

const DashboardPage = () => {
    const [newParts, setNewParts] = useState<IProduct>({} as IProduct)
    const [bestsellers, setBestsellers] = useState<IProduct>(
      {} as IProduct
    )
    const [spinner, setSpinner] = useState(false) 
    const shoppingCart = useStore($shoppingCart)
    const [showAlert, setShowAlert] = useState(!!shoppingCart.length)
    const mode = useStore($mode)
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

    useEffect(() => {
        loadProducts()
    }, [] )

    useEffect(() => {
      if (shoppingCart.length) {
        setShowAlert(true)
        return
    }
    setShowAlert(false)

  }, [shoppingCart.length] )

    const loadProducts = async () =>{
        try{
            setSpinner(true)
            const bestsellers = await getBestsellersOrNewPartsFx(
                '/products/bestsellers'
            )
            const newParts  = await getBestsellersOrNewPartsFx('/products/new')
    
            setBestsellers(bestsellers)
            setNewParts(newParts)
        } catch (error) {
            toast.error((error as Error).message)
          } finally {
            setSpinner(false)
          }
        }

    const closeAlert = () => setShowAlert(false)

    return (
      <section className={styles.dashboard}>
        <div className={`container ${styles.dashboard__container}`}>
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${styles.dashboard__alert} ${darkModeClass}`}
            >
              <CartAlert
                count={shoppingCart.reduce(
                  (defaultCount, item) => defaultCount + item.count,
                  0
                )}
                closeAlert={closeAlert}
              />
            </motion.div>
          )}
        </AnimatePresence>
          <div className={styles.dashboard__brands}>
            <BrandsSlider />
          </div>
          <h2 className={`${styles.dashboard__title} ${darkModeClass}`}>
          Удочки и снасти
          </h2>
          <div className={styles.dashboard__parts}>
            <h3 className={`${styles.dashboard__parts__title} ${darkModeClass}`}>
              Хиты продаж
            </h3>
            <DashboardSlider items={bestsellers.rows || []} spinner={spinner} />
          </div>
          <div className={styles.dashboard__parts}>
            <h3 className={`${styles.dashboard__parts__title} ${darkModeClass}`}>
              Новинки
            </h3>
            <DashboardSlider items={newParts.rows || []} spinner={spinner} />
          </div>
          <div className={styles.dashboard__about}>
            <h3
              className={`${styles.dashboard__parts__title} ${styles.dashboard__about__title} ${darkModeClass}`}
            >
              О компании
            </h3>
            <p className={`${styles.dashboard__about__text} ${darkModeClass}`}>
            Добро пожаловать в мир рыбной ловли! Мы - ваш надежный партнер в приключениях на воде. В ассортименте нашего магазина вы найдете все необходимое для удачного рыболовного дня. Удочки, катушки, наживки, аксессуары - у нас есть все, чтобы сделать ваше рыболовное приключение незабываемым!
            Мы гордимся тем, что предлагаем качественное рыболовное оборудование по доступным ценам. Наша команда экспертов всегда готова помочь вам с выбором правильного снаряжения и дать советы по его использованию.
            Помните, что рыбалка - это не только хобби, но и способ расслабиться и насладиться природой. Доверьтесь нам и мы поможем вам создать уютную атмосферу для ваших рыболовных приключений! 
            </p>
          </div>
        </div>
      </section>
    )
  }
  
  export default DashboardPage