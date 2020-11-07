// Intersections, type guards, discriminated unions, type casting, indexed types

// # Intersection types (closely related to interface inheritance)

type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

// # In case of objects intersection creates a new type combining ALL properties of given types
type AdminEmployee = Admin & Employee;

const admin: AdminEmployee = {
  name: "Max",
  privileges: ["server-management"],
  startDate: new Date(),
};

// # In case of union types, intersection creates a new type including only the types the combined unions have in common

type NumericString = number | string;
type NumericBoolean = number | boolean;

type Numeric = NumericString & NumericBoolean; // number

// # Type guards

// # With "typeof":
function addNumbersOrStrings(a: NumericString, b: NumericString) {
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  } else {
    return a + b;
  }
}

// # With "in" operator:

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(employee: UnknownEmployee) {
  console.log("Name: " + employee.name);
  if ("privileges" in employee) {
    console.log("Privileges: " + employee.privileges);
  }
  if ("startDate" in employee) {
    console.log("Start date: " + employee.startDate);
  }
}

printEmployeeInformation(admin);

// # With "instanceof":

class Car {
  drive() {
    console.log("Driving...");
  }
}

class Truck {
  drive() {
    console.log("Driving a truck...");
  }
  loadCargo(amount: number) {
    console.log("Loading cargo..." + amount);
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(20);
  }
}

// # Discriminated unions => we have one common property in every object that makes up our union which describes our object
// ## Similar to type guards!

// ## All three types Bird, Horse, Mouse have a commong member: kind

type Bird = {
  kind: "bird";
  flyingSpeed: number;
};

type Horse = {
  kind: "horse";
  runningSpeed: number;
};

type Mouse = {
  kind: "mouse";
  walkingSpeed: number;
};

type BirdOrHorse = Bird | Horse | Mouse;

// ## Union Exhaustiveness checking => Checks if all three subtypes of union type have been checked in switch case

function checkForNever(arg: never): never {
  throw new Error("Unexpected object: " + arg);
}

function moveAnimal(animal: BirdOrHorse) {
  let speed;
  switch (animal.kind) {
    case "bird":
      speed = animal.flyingSpeed;
      break;
    case "horse":
      speed = animal.runningSpeed;
      break;
    case "mouse":
      speed = animal.walkingSpeed;
      break;
    default:
      checkForNever(animal);
  }
  console.log("Moving at speed " + speed);
}

// # Type casting (Type assertion)

// ## Add ! at the end of expression to tell TS the variable is never going to be null
const typeCastingInput1 = document.querySelector("input")!;
typeCastingInput1.value = "Hello there!";

// ## Add as <Element> at the end of expression to tell TS what kind of element the variable will be representing
// ## If you don't do it, the line typeCastingInput2.value = "Hello there" will not work
// ## Adding as <Element> is enough to tell TS the variable will not be null
// ## Hhence you don't have to add !, but it will not hurt
const typeCastingInput2 = document.getElementById(
  "type-casting-input"
)! as HTMLInputElement;
typeCastingInput2.value = "Hello there!";

// # Index properties (Indexable types)?

interface ErrorContainer {
  // Pre-defined properties must be of the same type as index ones (id: number won't work)
  id: string;
  [prop: string]: string;
}

const errorBag: ErrorContainer = {
  id: "eb1",
  email: "Not a valid e-mail",
  username: "Not a valid username",
};
