export class Component {
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
