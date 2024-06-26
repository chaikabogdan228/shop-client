/* eslint-disable @next/next/no-img-element */
import { useStore } from 'effector-react'
import { $mode } from '@/context/mode'
import styles from '@/styles/about/index.module.scss'

const AboutPage = () => {
  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  return (
    <section className={styles.about}>
      <div className="container">
        <h2 className={`${styles.about__title} ${darkModeClass}`}>
          О компании
        </h2>
        <div className={styles.about__inner}>
          <div className={`${styles.about__info} ${darkModeClass}`}>
            <p>
              Компания &quot;Злой Карась&quot; рада предложить вам широкий выбор рыболовных товаров
              для всех любителей этого увлекательного хобби.
              Мы предлагаем качественные удилища, крючки, наживки, снасти
              и аксессуары для рыбалки по доступным ценам. Наш ассортимент включает товары от ведущих мировых производителей.
            </p>
            <p>
              Ассортимент интернет-магазина &quot;Злой Карась&quot; включает в себя запасные части для рыболовных снастей от таких известных брендов как 'Drennan', 'Shimano', 'Preston Innovations', 'Spro', 'Daiwa', 'St Croix', 'Stinger', 'Mikado', 'WaveFish', 'Black Hole','Trabucco', 'Balzer', 'Middy', 'Fenwick', 'GRFISH', 'Maximus', 'Graphiteleader', 'Lucky John', 'G Loomis', 'Mifine'. Качественные товары для вашего увлекательного хобби ждут вас у нас!
            </p>
          </div>
          <div className={`${styles.about__img} ${styles.about__img__top}`}>
            <img src="/img/about-img.png" alt="image-1" />
          </div>
          <div className={`${styles.about__img} ${styles.about__img__bottom}`}>
            <img src="/img/about-img-2.png" alt="image-2" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPage