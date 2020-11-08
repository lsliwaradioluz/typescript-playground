// Validation logic
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validateInputs(validatableObject: Validatable): boolean {
  let isValid = true;
  const value = validatableObject.value;
  if (validatableObject.required) {
    isValid = isValid && value !== null;
  }
  if (
    validatableObject.minLength != null &&
    typeof validatableObject.value === "string"
  ) {
    isValid = isValid && value.toString().length >= validatableObject.minLength;
  }
  if (
    validatableObject.maxLength != null &&
    typeof validatableObject.value === "string"
  ) {
    isValid = isValid && value.toString().length <= validatableObject.maxLength;
  }
  if (validatableObject.min != null && typeof value === "number") {
    isValid = isValid && value >= validatableObject.min;
  }
  if (validatableObject.max != null && typeof value === "number") {
    isValid = isValid && value <= validatableObject.max;
  }
  return isValid;
}

// BindThis decorator
function BindThis(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const updatedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      return originalMethod.bind(this);
    },
  };
  return updatedDescriptor;
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedTemplateElement = document.importNode(
      this.templateElement.content,
      true
    );
    this.formElement = importedTemplateElement.firstElementChild as HTMLFormElement;
    this.formElement.id = "user-input";

    this.titleInputElement = this.formElement.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.formElement.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configureForm();
    this.attach();
  }

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
      console.log(title, description, people);
      this.clearInputs();
    }
  }

  private configureForm() {
    this.formElement.addEventListener("submit", this.handleFormSubmit);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
  }
}

const projectInput = new ProjectInput();
