import { Card, ICardActions } from "./Card";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";

export type TCardCatalog = Pick<IProduct, 'category' | 'image' | 'title' | 'price'>;

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Card<TCardCatalog> {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    
    if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
    }
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

  render(product: IProduct): HTMLElement {
    this.title = product.title;
    this.price = product.price;
    this.category = product.category;
    this.image = product.image;
    return this.container;
  }
}
