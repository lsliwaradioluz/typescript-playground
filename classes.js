"use strict";
// public, private, protected, readonly, abstract, static
// #Na bazie klasy opatrzonej frazą "abstract" nie można tworzyć instancji. Taka klasa istnieje tylko po to, by można ją rozszerzać (extend)
class Department {
    // #Mogę zainicjować propertisy w parametrach konstruktora, dodając public, private lub readonly
    constructor(id, name) {
        this.id = id;
        this.name = name;
        // private readonly id: string
        // private name: string
        // #Daj protected zamiast private jeśli chcesz, aby własność była niedostępna z zewnątrz, ale dostępna w dziedziczących klasach (np. AccountingDepartment)
        this.employees = [];
        // this.id = id
        // this.name = name;
    }
    setFiscalYear(year) {
        // #W non-static methods zmiana static properties jest możliwa tylko tak
        // this.fiscalYear nie zadziała, chyba, że setFiscalYear też będzie static
        Department.fiscalYear = year;
    }
    addEmployee(employee) {
        // #validation etc
        this.employees.push(employee);
    }
    printEmployeeInformation() {
        console.log(this.employees.length);
        console.log(this.employees);
    }
    // # Static method
    static createEmployee(name) {
        return { name };
    }
}
Department.fiscalYear = 2021;
// #ITDepartment to tak zwany singletone, czyli klasa która może być zainstancjowana tylko raz. 
// Nie można jej zainstancjować z użyciem keyworda "new", tylko własnoręcznie stworzonej funkcji getInstance()
class ITDepartment extends Department {
    constructor(id, admins) {
        // #w super koniecznie przekaż parametry konstruktora
        super(id, "IT");
        this.admins = admins;
    }
    static getInstance() {
        if (ITDepartment.instance) {
            return this.instance;
        }
        else {
            this.instance = new ITDepartment("d2", []);
            return this.instance;
        }
    }
    describe() {
        console.log(`IT Department (${this.id}): ${this.name}`);
    }
}
const it = ITDepartment.getInstance();
class AccountingDepartment extends Department {
    constructor(id, reports) {
        super(id, "Accounting");
        this.reports = reports;
        this.lastReport = reports[0];
    }
    // # use getter to encapsulate and get private property
    get mostRecentReport() {
        if (this.lastReport) {
            return this.lastReport;
        }
        else {
            throw new Error("No report found");
        }
    }
    // # use setter to encapsulate and set a private property
    set mostRecentReport(value) {
        if (!value) {
            throw new Error("Please pass a valid value");
        }
        this.addReport(value);
    }
    addEmployee(employee) {
        if (employee === "Max") {
            return;
        }
        this.employees.push(employee);
    }
    addReport(text) {
        this.reports.push(text);
        this.lastReport = text;
    }
    printReports() {
        console.log(this.reports);
    }
    describe() {
        console.log(`Accounting Department (${this.id}): ${this.name}`);
    }
}
const employee1 = Department.createEmployee("Max");
console.log(employee1);
console.log(Department.fiscalYear);
const accounting = new AccountingDepartment("d2", []);
accounting.addReport("Something went wrong...");
console.log(accounting.mostRecentReport);
accounting.mostRecentReport = "Dupa zbita";
console.log(accounting.mostRecentReport);
