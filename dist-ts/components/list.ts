import { Component } from "./component.js";
import { ProjectItem } from "./item.js";
import { DragTarget } from "../models/drag-drop.js";
import { Project, ProjectStatus } from "../models/project.js";
import { BindThis } from "../decorators/bind-this.js";
import { state } from "../state/project-state.js";

export class ProjectList
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
