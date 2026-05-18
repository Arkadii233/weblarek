import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IForm {
  valid: boolean;
  errors: string[];
  payment?: string;
  address?: string;
  email?: string;
  phone?: string;
}
export interface IFormActions {
    onInput: (field: string, value: string) => void;
    onSubmit: () => void;
}

export class Form<T extends IForm> extends Component<T> {
  
  buttonSubmit: HTMLButtonElement;
  errorsForm: HTMLElement;
  
  constructor(container: HTMLElement, actions?: IFormActions) {
    super(container);

    this.buttonSubmit = ensureElement<HTMLButtonElement>('button[type="submit"]',this.container);
    this.errorsForm = ensureElement<HTMLElement>('.form__errors',this.container);

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target;

      if (target instanceof HTMLInputElement) {
        const field = target.name;
        const value = target.value;

        if (actions?.onInput) {
          actions.onInput(field, value);
        }
      }
    });

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      if (actions?.onSubmit) {
        actions.onSubmit();
      }
    });


  }

  set valid (isValid: boolean) {
    this.buttonSubmit.disabled = !isValid;    
  }

  set errors (strError: string[]) {
    this.errorsForm.textContent = strError.join('; ');
  } 

}