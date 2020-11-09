import { Project, ProjectStatus } from "../models/project.js";

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

export const state = ProjectState.getInstance();
