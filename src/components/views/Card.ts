import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard {
  title: string;
  price: number | null;
  category?: string;
  image?: string;
  description?: string;
  buttonText?: string;
  index?: number;
  disabledButton?: boolean;
}

export class Card<T> extends Component<T> {

  protected titleElement: HTMLElement;
  private priceElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);

    if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
    }
  }

  set title(strTitle: string) {
    this.titleElement.textContent = strTitle;
  }

  set price(valuePrice: number | null) {
    this.priceElement.textContent = valuePrice !== null ? `${valuePrice} синапсов` : 'Бесценно';
    
  }
}

