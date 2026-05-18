import { Card, ICard, ICardActions } from "./Card";
import { ensureElement } from "../../utils/utils";


export class CardBasket extends Card<ICard> {
  private indexElement: HTMLElement;
  private buttonDelete: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
    this.buttonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    if (actions?.onClick) {
      this.buttonDelete.addEventListener('click', actions.onClick);
    }
  }

  set index(valueIndex: number) {
    this.indexElement.textContent = valueIndex.toString();
  }
}