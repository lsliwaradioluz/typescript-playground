// Drag & Drop Interfaces
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// Project Type
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project State Management

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];
  addListener(listenerFunction: Listener<T>) {
    this.listeners.push(listenerFunction);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(id: string, newStatus: ProjectStatus) {
    const projectToMove = this.projects.find((project) => project.id === id);
    if (projectToMove && newStatus !== projectToMove.status) {
      projectToMove.status = newStatus;
      this.updateListeners();
    }
  }

  getProject(id: string) {
    return this.projects.find((project) => project.id === id);
  }

  updateListeners() {
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

// Component Base Class

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

// Project Item Class

class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  private project: Project;
  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }
  constructor(hookID: string, project: Project) {
    super("single-project", hookID, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @BindThis
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  @BindThis
  dragEndHandler(_: DragEvent) {
    // console.log("drag end");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

// Project List Class

class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget {
  assignedProjects: Project[] = [];
  declare removeProjectCb: Function;

  constructor(private listID: "active" | "finished") {
    super("project-list", "app", false, `${listID}-projects`);

    this.configure();
    this.renderContent();
  }

  @BindThis
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listElement = this.element.querySelector("ul")! as HTMLUListElement;
      listElement.classList.add("droppable");
    }
  }

  @BindThis
  dragLeaveHandler(_: DragEvent) {
    const listElement = this.element.querySelector("ul")! as HTMLUListElement;
    listElement.classList.remove("droppable");
  }

  @BindThis
  dropHandler(event: DragEvent) {
    const droppedProjectID = event.dataTransfer!.getData("text/plain");
    state.moveProject(
      droppedProjectID,
      this.listID === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    state.addListener((projects: Project[]) => {
      const filteredProjects = projects.filter((project) => {
        if (this.listID === "active") {
          return project.status === ProjectStatus.Active;
        } else {
          return project.status === ProjectStatus.Finished;
        }
      });

      this.assignedProjects = filteredProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listID = `${this.listID}-projects-list`;
    this.element.querySelector("ul")!.id = listID;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.listID.toUpperCase()} PROJECTS`;
  }

  private renderProjects() {
    const listElement = document.getElementById(`${this.listID}-projects-list`);
    listElement!.innerHTML = "";
    for (const project of this.assignedProjects) {
      // below line can cause errors
      new ProjectItem(`${this.listID}-projects-list`, project);
    }
  }
}

// Project Input class

class ProjectInput extends Component<HTMLDivElement, HTMLFontElement> {
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

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
