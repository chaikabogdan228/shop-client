import { IProducts } from '@/types/products'
import { createDomain } from 'effector-next'

const product = createDomain()

export const setProduct = product.createEvent<IProducts>()

export const $product = product
  .createStore<IProducts>({} as IProducts)
  .on(setProduct, (_, part) => part)