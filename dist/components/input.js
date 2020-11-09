var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "./component.js";
import { validateInputs } from "../util/validation.js";
import { BindThis } from "../decorators/bind-this.js";
import { state } from "../state/project-state.js";
export class ProjectInput extends Component {
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
