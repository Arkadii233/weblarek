import { Card, ICardActions } from "./Card";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";

export type TCardCatalog = Pick<IProduct, 'category' | 'image'>;

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Card<TCardCatalog> {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
  }

  set category(strCategory: string) {
    this.categoryElement.textContent = strCategory;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === strCategory
      );
    }
  }

  set image(strImageLink: string) {
    this.setImage(this.imageElement, strImageLink, this.titleElement.textContent);
  }
}