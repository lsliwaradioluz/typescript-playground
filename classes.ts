// public, private, protected, readonly, abstract, static

// #Na bazie klasy opatrzonej frazą "abstract" nie można tworzyć instancji. Taka klasa istnieje tylko po to, by można ją rozszerzać (extend)
abstract class Department {
  // private readonly id: string
  // private name: string
  // #Daj protected zamiast private jeśli chcesz, aby własność była niedostępna z zewnątrz, ale dostępna w dziedziczących klasach (np. AccountingDepartment)
  protected employees: string[] = [];

  static fiscalYear: number = 2021;
  // #Mogę zainicjować propertisy w parametrach konstruktora, dodając public, private lub readonly
  constructor(protected readonly id: string, public name: string) {
    // this.id = id
    // this.name = name;
  }

  setFiscalYear(year: number) {
    // #W non-static methods zmiana static properties jest możliwa tylko tak
    // this.fiscalYear nie zadziała, chyba, że setFiscalYear też będzie static
    Department.fiscalYear = year;
  }

  // #Użyj słowa "abstract", by oznaczyć metody, których implementacja musi znaleźć się w klasach dziedziczących
  abstract describe(this: Department): void;

  addEmployee(employee: string) {
    // #validation etc
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }

  // # Static method

  static createEmployee(name: string) {
    return { name };
  }
}

// #ITDepartment to tak zwany singletone, czyli klasa która może być zainstancjowana tylko raz. 
// Nie można jej zainstancjować z użyciem keyworda "new", tylko własnoręcznie stworzonej funkcji getInstance()
class ITDepartment extends Department {
  admins: string[];
  private static instance: ITDepartment;
  private constructor(id: string, admins: string[]) {
    // #w super koniecznie przekaż parametry konstruktora
    super(id, "IT");
    this.admins = admins;
  }

  static getInstance() {
    if (ITDepartment.instance) {
      return this.instance;
    } else {
      this.instance = new ITDepartment("d2", []);
      return this.instance;
    }
  }

  describe() {
    console.log(`IT Department (${this.id}): ${this.name}`);
  }
}

const it = ITDepartment.getInstance()

class AccountingDepartment extends Department {
  private lastReport: string;

  // # use getter to encapsulate and get private property
  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    } else {
      throw new Error("No report found");
    }
  }

  // # use setter to encapsulate and set a private property

  set mostRecentReport(value: string) {
    if (!value) {
      throw new Error("Please pass a valid value");
    }
    this.addReport(value);
  }

  constructor(id: string, private reports: string[]) {
    super(id, "Accounting");
    this.lastReport = reports[0];
  }

  addEmployee(employee: string) {
    if (employee === "Max") {
      return;
    }
    this.employees.push(employee);
  }

  addReport(text: string) {
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
