import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
  private counterElement: HTMLElement;
  private buttonBasket: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.buttonBasket = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    this.buttonBasket.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter (value: number) {
    this.counterElement.textContent = value.toString();
  }
}