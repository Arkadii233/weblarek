import { Form, IForm, IFormActions } from "./Form";
import { ensureElement } from "../../utils/utils";

export class FormOrder extends Form<IForm> {
  private buttonsPayment: HTMLButtonElement[];
  private addressDelivery: HTMLInputElement;

  constructor(container: HTMLElement, actions?: IFormActions) {
    super(container, actions);

    this.buttonsPayment = Array.from(container.querySelectorAll('.button_alt'));
    this.addressDelivery = ensureElement<HTMLInputElement>('input[name="address"]', container);

    this.buttonsPayment.forEach(button => {
      button.addEventListener('click', () => {
        if (actions?.onInput) {
          actions.onInput('payment', button.name);
        }
      });
    });
  }

  set payment (namePayment: string) {
    this.buttonsPayment.forEach(button => {
      if (button.name === namePayment) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }

  set address (strAdress: string) {
    this.addressDelivery.value = strAdress;
  }

}