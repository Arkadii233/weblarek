import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface ISuccess {
  totalPrice: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {

  private buttonSuccess: HTMLButtonElement;
  private descriptionElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ISuccessActions) {
    super(container);

    this.buttonSuccess = ensureElement<HTMLButtonElement>('.order-success__close', container);
    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', container);

    if (actions?.onClick) {
      this.buttonSuccess.addEventListener('click', actions.onClick);
    }
  }

  set totalPrice(totalPrice: number) {
    this.descriptionElement.textContent = `Списано ${totalPrice} синапсов`;
  }
  
}