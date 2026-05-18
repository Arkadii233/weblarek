import { Form, IForm, IFormActions } from "./Form";
import { ensureElement } from "../../utils/utils";

export class FormContacts extends Form<IForm> {
  private contactEmail: HTMLInputElement;
  private contactPhone: HTMLInputElement;

  constructor(container: HTMLFormElement, actions?: IFormActions) {
    super(container, actions);

    this.contactEmail = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container,
    );
    this.contactPhone = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container,
    );
  }

  set email(value: string) {
    this.contactEmail.value = value;
  }

  set phone(value: string) {
    this.contactPhone.value = value;
  }
}
