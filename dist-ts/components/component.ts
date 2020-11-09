export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateElementID: string,
    hostElementID: string,
    insertAtStart: boolean,
    newElementID: string
  ) {
    this.templateElement = document.getElementById(
      templateElementID
    )! as HTMLTemplateElement;

    this.hostElement = document.getElementById(hostElementID)! as T;

    const importedTemplateElement = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedTemplateElement.firstElementChild as U;
    this.element.id = newElementID;

    this.attach(insertAtStart ? "afterbegin" : "beforeend");
  }

  private attach(position: InsertPosition) {
    this.hostElement.insertAdjacentElement(position, this.element);
  }

  abstract configure(): void;
  abstract renderContent(): void;
}
