// Project State Management

class ProjectState {
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }
    return this.instance;
  }

  addListener(listenerFunction: Function) {
    this.listeners.push(listenerFunction);
  }

  addProject(title: string, description: string, people: number) {
    const newProject = {
      id: Math.random().toString(),
      title,
      description,
      people,
    };
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const state = ProjectState.getInstance();

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

// Project List class

class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  listElement: HTMLElement;
  assignedProjects: any[] = [];

  constructor(private listID: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedTemplateElement = document.importNode(
      this.templateElement.content,
      true
    );
    this.listElement = importedTemplateElement.firstElementChild as HTMLElement;
    this.listElement.id = `${this.listID}-projects`;

    state.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.configure();
    this.attach();
  }

  private renderProjects() {
    const listElement = document.getElementById(
      `${this.listID}-projects-list`
    ) as HTMLUListElement;
    listElement.innerHTML = "";
    for (const project of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = project.title;
      listElement.appendChild(listItem);
    }
  }

  private configure() {
    const listID = `${this.listID}-projects-list`;
    this.listElement.querySelector("ul")!.id = listID;
    this.listElement.querySelector(
      "h2"
    )!.textContent = `${this.listID.toUpperCase()} PROJECTS`;
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.listElement);
  }
}

// Project Input class

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
      state.addProject(title, description, people);
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
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
