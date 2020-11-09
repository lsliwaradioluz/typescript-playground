import { Project, ProjectStatus } from "../models/project.js";
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
        this.updateListeners();
    }
    moveProject(id, newStatus) {
        const projectToMove = this.projects.find((project) => project.id === id);
        if (projectToMove && newStatus !== projectToMove.status) {
            projectToMove.status = newStatus;
            this.updateListeners();
        }
    }
    getProject(id) {
        return this.projects.find((project) => project.id === id);
    }
    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
export const state = ProjectState.getInstance();
