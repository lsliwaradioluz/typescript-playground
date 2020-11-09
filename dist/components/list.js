var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "./component.js";
import { ProjectItem } from "./item.js";
import { ProjectStatus } from "../models/project.js";
import { BindThis } from "../decorators/bind-this.js";
import { state } from "../state/project-state.js";
export class ProjectList extends Component {
    constructor(listID) {
        super("project-list", "app", false, `${listID}-projects`);
        this.listID = listID;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault();
            const listElement = this.element.querySelector("ul");
            listElement.classList.add("droppable");
        }
    }
    dragLeaveHandler(_) {
        const listElement = this.element.querySelector("ul");
        listElement.classList.remove("droppable");
    }
    dropHandler(event) {
        const droppedProjectID = event.dataTransfer.getData("text/plain");
        state.moveProject(droppedProjectID, this.listID === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
    }
    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);
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
__decorate([
    BindThis
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    BindThis
], ProjectList.prototype, "dragLeaveHandler", null);
__decorate([
    BindThis
], ProjectList.prototype, "dropHandler", null);
