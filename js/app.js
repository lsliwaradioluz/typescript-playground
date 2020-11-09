"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Project Type
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFunction) {
        this.listeners.push(listenerFunction);
    }
}
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ProjectState();
        }
        return this.instance;
    }
    addProject(title, description, people) {
        const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
const state = ProjectState.getInstance();
function validateInputs(validatableObject) {
    let isValid = true;
    const value = validatableObject.value;
    if (validatableObject.required) {
        isValid = isValid && value !== null;
    }
    if (validatableObject.minLength != null &&
        typeof validatableObject.value === "string") {
        isValid = isValid && value.toString().length >= validatableObject.minLength;
    }
    if (validatableObject.maxLength != null &&
        typeof validatableObject.value === "string") {
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
function BindThis(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const updatedDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            return originalMethod.bind(this);
        },
    };
    return updatedDescriptor;
}
// Component Base Class
class Component {
    constructor(templateElementID, hostElementID, insertAtStart, newElementID) {
        this.templateElement = document.getElementById(templateElementID);
        this.hostElement = document.getElementById(hostElementID);
        const importedTemplateElement = document.importNode(this.templateElement.content, true);
        this.element = importedTemplateElement.firstElementChild;
        this.element.id = newElementID;
        this.attach(insertAtStart ? "afterbegin" : "beforeend");
    }
    attach(position) {
        this.hostElement.insertAdjacentElement(position, this.element);
    }
}
// Project Item Class
class ProjectItem extends Component {
    constructor(hookID, project) {
        super("single-project", hookID, false, project.id);
        this.project = project;
        this.configure();
        this.renderContent();
    }
    get persons() {
        if (this.project.people === 1) {
            return "1 person";
        }
        else {
            return `${this.project.people} persons`;
        }
    }
    configure() { }
    renderContent() {
        this.element.querySelector("h2").textContent = this.project.title;
        this.element.querySelector("h3").textContent = this.persons + " assigned";
        this.element.querySelector("p").textContent = this.project.description;
    }
}
// Project List Class
class ProjectList extends Component {
    constructor(listID) {
        super("project-list", "app", false, `${listID}-projects`);
        this.listID = listID;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    configure() {
        state.addListener((projects) => {
            const filteredProjects = projects.filter((project) => {
                if (this.listID === "active") {
                    return project.status === ProjectStatus.Active;
                }
                else {
                    return project.status === ProjectStatus.Finished;
                }
            });
            this.assignedProjects = filteredProjects;
            this.renderProjects();
        });
    }
    renderContent() {
        const listID = `${this.listID}-projects-list`;
        this.element.querySelector("ul").id = listID;
        this.element.querySelector("h2").textContent = `${this.listID.toUpperCase()} PROJECTS`;
    }
    renderProjects() {
        const listElement = document.getElementById(`${this.listID}-projects-list`);
        listElement.innerHTML = "";
        for (const project of this.assignedProjects) {
            // below line can cause errors
            new ProjectItem(`${this.listID}-projects-list`, project);
        }
    }
}
// Project Input class
class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true, "user-input");
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
    }
    configure() {
        this.element.addEventListener("submit", this.handleFormSubmit);
    }
    renderContent() { }
    gatherUserInput() {
        const title = this.titleInputElement.value;
        const description = this.descriptionInputElement.value;
        const people = this.peopleInputElement.value;
        const titleValidatable = {
            value: title,
            required: true,
            minLength: 3,
        };
        const descriptionValidatable = {
            value: description,
            required: true,
            minLength: 10,
        };
        const peopleValidatable = {
            value: +people,
            required: true,
            min: 1,
            max: 5,
        };
        if (!validateInputs(titleValidatable) ||
            !validateInputs(descriptionValidatable) ||
            !validateInputs(peopleValidatable)) {
            alert("Invalid inputs!");
            return;
        }
        else {
            return [title, description, +people];
        }
    }
    clearInputs() {
        const inputNames = ["title", "description", "people"];
        for (const name of inputNames) {
            this[`${name}InputElement`].value = "";
        }
    }
    handleFormSubmit(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            state.addProject(title, description, people);
            this.clearInputs();
        }
    }
}
__decorate([
    BindThis
], ProjectInput.prototype, "handleFormSubmit", null);
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
