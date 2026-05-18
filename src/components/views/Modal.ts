import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {

  private buttonClose: HTMLButtonElement;
  private contentElement: HTMLElement;

  constructor (container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.buttonClose = ensureElement<HTMLButtonElement>('.modal__close', container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', container);

    this.buttonClose.addEventListener('click', () => {
      this.events.emit('modal:close');
    });

    this.container.addEventListener('click', (event) => {
      if (event.target === event.currentTarget) {
        this.events.emit('modal:close');
      }
    });
  }

  set content(content: HTMLElement) {
    this.contentElement.replaceChildren(content);
  }

  openModal() {
    this.container.classList.add('modal_active');
  }

  closeModal() {
    this.container.classList.remove('modal_active');
    this.contentElement.replaceChildren();
  }
}