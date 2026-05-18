import {Card, ICard, ICardActions} from "./Card";
import {ensureElement} from "../../utils/utils";
import { categoryMap } from "../../utils/constants";

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card<ICard> {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;
  private descriptionElement: HTMLElement;
  private buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

    if (actions?.onClick) {
      this.buttonElement.addEventListener('click', actions.onClick);
    }
  }

  set category(strCategory: string) {
    this.categoryElement.textContent = strCategory;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        strCategory === key
      );
    }
  }

   set image(strImageLink: string) {
    this.setImage(this.imageElement, strImageLink, this.titleElement.textContent);
   }

  set description(strDescription: string) {
    this.descriptionElement.textContent = strDescription;
  }

  set buttonText(strText: string) {
    this.buttonElement.textContent = strText;
  }

  set disabledButton(checkResult: boolean) {
    if (this.buttonElement) {
        this.buttonElement.disabled = checkResult;
    }
  }

}