import { Component } from "./component.js";
import { Validatable, validateInputs } from "../util/validation.js";
import { BindThis } from "../decorators/bind-this.js";
import { state } from "../state/project-state.js";

export class ProjectInput extends Component<HTMLDivElement, HTMLFontElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.handleFormSubmit);
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const description = this.descriptionInputElement.value;
    const people = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: title,
      required: true,
      minLength: 3,
    };
    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 10,
    };
    const peopleValidatable: Validatable = {
      value: +people,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validateInputs(titleValidatable) ||
      !validateInputs(descriptionValidatable) ||
      !validateInputs(peopleValidatable)
    ) {
      alert("Invalid inputs!");
      return;
    } else {
      return [title, description, +people];
    }
  }

  private clearInputs() {
    const inputNames = ["title", "description", "people"];
    for (const name of inputNames) {
      (this as any)[`${name}InputElement`].value = "";
    }
  }

  @BindThis
  private handleFormSubmit(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      state.addProject(title, description, people);
      this.clearInputs();
    }
  }
}
