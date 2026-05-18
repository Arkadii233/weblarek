import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IGallery {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {

  private catalogElement: HTMLElement;

  constructor (container: HTMLElement) {
    super(container);
    //this.catalogElement = ensureElement<HTMLElement>('.gallery', container);
    this.catalogElement = container;
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }
}