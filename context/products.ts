import { createDomain } from "effector-next";
import { IFilterCheckboxItem } from "@/types/catalog";
import { IProduct, IProducts } from "@/types/products";
import { partsManufacturers, productsManufacturers } from "@/utils/catalog";


 const products = createDomain()
 export const setProducts = products.createEvent<IProducts>();
 export const setProductsCheapFirst = products.createEvent();
 export const setProductsExpensiveFirst = products.createEvent();
 export const setProductsByPopularity = products.createEvent();
 export const setFilteredproducts = products.createEvent<IProducts>();
 export const setProductManufacturers = 
  products.createEvent<IFilterCheckboxItem []>();
  export const updateProductManufacturers = 
  products.createEvent<IFilterCheckboxItem >();
 export const setPartsManufacturers  =
  products.createEvent<IFilterCheckboxItem []>();
  export const updatePartsManufacturers  =
  products.createEvent<IFilterCheckboxItem >();
  export const setProductManufacturersFromQuery  =
  products.createEvent<IFilterCheckboxItem >();
  export const setPartsManufacturersFromQuery  =
  products.createEvent<IFilterCheckboxItem >();

  const updateManufacturer = (
   manufacturers: IFilterCheckboxItem[],
   id: string,
   payload: Partial<IFilterCheckboxItem>
 ) =>
   manufacturers.map((item) => {
     if (item.id === id) {
       return {
         ...item,
         ...payload,
       }
     }
 
     return item
   })

   const updateManufacturerFromQuery = (
    manufacturers: IFilterCheckboxItem[],
    manufacturersFromQuery: string[]
  ) =>
    manufacturers.map((item) => {
      if (manufacturersFromQuery.find((title) => title === item.title)) {
        return {
          ...item,
          checked: true,
        }
      }
  
      return item
    })

 export const $products = products  
 .createStore<IProduct>({} as IProduct)
 .on(setProducts, (_, parts) => parts)
 .on(setProductsCheapFirst, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => a.price - b.price),
 })).on(setProductsExpensiveFirst, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => b.price - a.price),
 })).on(setProductsByPopularity, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => a.popularity - b.popularity),
 }))


 export const $productManufacturers = products
 .createStore<IFilterCheckboxItem[]>( 
   productsManufacturers as IFilterCheckboxItem []
  )
 .on(setProductManufacturers, (_, parts) => parts)
 .on(updateProductManufacturers, (state, payload) => [
   ...updateManufacturer(state, payload.id as string, {checked: payload.checked,}),
 ])
  .on(setProductManufacturersFromQuery, (state, manufacturersFromQuery) => [
    ...updateManufacturerFromQuery(state, manufacturersFromQuery),
  ])

 export const $partsManufacturers = products
 .createStore<IFilterCheckboxItem[]>(
   partsManufacturers as IFilterCheckboxItem []
  )
 .on(setPartsManufacturers, (_, parts) => parts)
 .on(updatePartsManufacturers, (state, payload) => [
   ...updateManufacturer(state, payload.id as string, {checked: payload.checked,}),
 ])
 .on(setPartsManufacturersFromQuery, (state, manufacturersFromQuery) => [
  ...updateManufacturerFromQuery(state, manufacturersFromQuery),
])

 export const $filteredproducts = products
 .createStore<IProducts>({} as IProducts)
 .on(setFilteredproducts, (_, parts) => parts)




