import { IProducts } from "./products";

export interface IDashboardSlider {
    items: IProducts[]
    spinner: boolean
    goToPartPage?: boolean
}

export interface ICartAlertProps {
    count: number
    closeAlert: VoidFunction
  }