"use strict";
// Project State Management
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class ProjectState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ProjectState();
        }
        return this.instance;
    }
    addListener(listenerFunction) {
        this.listeners.push(listenerFunction);
    }
    addProject(title, description, people) {
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
// Project List class
class ProjectList {
    constructor(listID) {
        this.listID = listID;
        this.assignedProjects = [];
        this.templateElement = document.getElementById("project-list");
        this.hostElement = document.getElementById("app");
        const importedTemplateElement = document.importNode(this.templateElement.content, true);
        this.listElement = importedTemplateElement.firstElementChild;
        this.listElement.id = `${this.listID}-projects`;
        state.addListener((projects) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });
        this.configure();
        this.attach();
    }
    renderProjects() {
        const listElement = document.getElementById(`${this.listID}-projects-list`);
        listElement.innerHTML = "";
        for (const project of this.assignedProjects) {
            const listItem = document.createElement("li");
            listItem.textContent = project.title;
            listElement.appendChild(listItem);
        }
    }
    configure() {
        const listID = `${this.listID}-projects-list`;
        this.listElement.querySelector("ul").id = listID;
        this.listElement.querySelector("h2").textContent = `${this.listID.toUpperCase()} PROJECTS`;
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.listElement);
    }
}
// Project Input class
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        const importedTemplateElement = document.importNode(this.templateElement.content, true);
        this.formElement = importedTemplateElement.firstElementChild;
        this.formElement.id = "user-input";
        this.titleInputElement = this.formElement.querySelector("#title");
        this.descriptionInputElement = this.formElement.querySelector("#description");
        this.peopleInputElement = this.formElement.querySelector("#people");
        this.configureForm();
        this.attach();
    }
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
    configureForm() {
        this.formElement.addEventListener("submit", this.handleFormSubmit);
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
    }
}
__decorate([
    BindThis
], ProjectInput.prototype, "handleFormSubmit", null);
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
