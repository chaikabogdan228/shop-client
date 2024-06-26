/* eslint-disable indent */
import { useStore } from 'effector-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { $mode } from '@/context/mode'
import {
  controlStyles,
  menuStyles,
  selectStyles,
} from '@/styles/catalog/select'
import { IOption, SelectOptionType } from '@/types/common'
import { createSelectOption } from '@/utils/common'
import { categoriesOptions } from '@/utils/selectContents'
import { $products, setProductsByPopularity, setProductsCheapFirst, setProductsExpensiveFirst } from '@/context/products'
import { useRouter } from 'next/router'
import { optionStyles } from '@/styles/searchInput'
const FilterSelect = ({
  setSpinner,
  }: {
  setSpinner: (arg0: boolean) => void
  }) => {
    const mode = useStore($mode)
    const products = useStore($products)
    const [categoryOption, setCategoryOption] = useState<SelectOptionType>(null)
    const router = useRouter()

    useEffect(() => {
    if(products.rows) {
      switch (router.query.first) {
        case 'cheap':
          updateCategoryOption('Сначала дешевые')
          setProductsCheapFirst()
          break
          case 'expensive':
          updateCategoryOption('Сначала дорогие')
          setProductsExpensiveFirst()
          break
          case 'popular':
          updateCategoryOption('По популярности')
          setProductsByPopularity()
          break
          default:
          updateCategoryOption('Сначала дешевые')
          setProductsCheapFirst()
          break
      }
    }
    }, [products.rows, router.query.first ])

    const updateCategoryOption = (value: string) =>
       setCategoryOption({value, label: value})

    const updateRoteParam = (first: string) => router.push({
      query: {
        ...router.query,
        first 
      }
    }, undefined, {shallow: true})

    const handleSortOptionChange = (selectedOption: SelectOptionType) => {
      setSpinner(true)
        setCategoryOption(selectedOption)

        switch ((selectedOption as IOption).value) {
          case 'Сначала дешевые':
            setProductsCheapFirst()
            updateRoteParam('cheap')
            break
            case 'Сначала дорогие':
            setProductsExpensiveFirst()
            updateRoteParam('expensive')
            break
            case 'По популярности':
              setProductsByPopularity()
              updateRoteParam('popular')
            break
        }
        setTimeout(() => setSpinner(false), 1000)
    }

    return(
        <Select placeholder="Я ищу..."
         value={categoryOption || createSelectOption('Сначала дешевые')}
        onChange={handleSortOptionChange}
        styles= {{
            ...selectStyles,
            control: (defaultStyles) => ({
                ...controlStyles(defaultStyles, mode),
            }),
            input: (defaultStyles) => ({
                ...defaultStyles,
                color: mode === 'dark' ? '#f2f2f2' : '#222222',
              }),
              menu: (defaultStyles) => ({
                ...menuStyles(defaultStyles, mode),
                marginTop: '-1px',
              }),
              option: (defaultStyles, state) => ({
                ...optionStyles(defaultStyles, state, mode),
              }),
        }}
        isSearchable={false}
        options = {categoriesOptions}
        /> 
    )   
}


export default FilterSelect
