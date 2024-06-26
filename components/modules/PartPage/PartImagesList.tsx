/* eslint-disable @next/next/no-img-element */
import { useStore } from "effector-react"
import { useState } from "react"
import { $product } from "@/context/product"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import PartImagesItem from "./PartImagesItem"
import PartSlider from "./PartSlider"
import styles from '@/styles/part/index.module.scss'

const PartImagesList = () => {
    const product = useStore($product)
    const isMobile = useMediaQuery(850)
    const images = product.images
    ? (JSON.parse(product.images) as string[])
    : []
    const [currentImgSrc, setCurrentImgSrc] = useState('')

    return(
        <div className={styles.part__images}>
            {isMobile ? (
                <PartSlider images={images}/>
            ) : (
              <>
                <div className={styles.part__images__main}>
                    <img src={currentImgSrc || images[0]} alt={product.name} />
                </div>
                <ul className={styles.part__images__list}>
                    {images.map((item, i) => (
                    <PartImagesItem
                    key={i}
                    alt={`image-${i + 1}`}
                    callback={setCurrentImgSrc}
                    src={item}
                    />
                    ))}
                </ul>
              </>
            )}
        </div>
    )
}


export default PartImagesList