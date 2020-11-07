// # Decorators

// Class decorator
function Logger(constructor: Function) {
  // console.log("Logging...");
  // console.log(constructor);
}

// Class decorator factory
function WithTemplate(template: string, hookID: string) {
  return (constructor: any) => {
    // console.log("With template");
    const hook = document.getElementById(hookID)!;
    const newPerson = new constructor();
    hook.innerHTML = template;
    const title = hook.querySelector("h1")!;
    title.textContent = newPerson.name;
  };
}

@Logger
@WithTemplate("<h1></h1>", "app")
class Personna {
  name = "Max";
  constructor() {
    // console.log("Creating person object...");
  }
}

const p1 = new Personna();

// Property, accessor, method and parameter decorators

function PropertyDecorator(target: any, propertyName: string) {
  console.log(propertyName);
  console.log(target);
}

function AccessorDecorator(
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) {
  console.log(name);
  console.log(target);
  console.log(descriptor);
}

function MethodDecorator(
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) {
  console.log(name);
  console.log(target);
  console.log(descriptor);
}

function ParameterDecorator(target: any, methodName: string, position: number) {
  console.log(methodName);
  console.log(target);
  console.log(position);
}

class Product {
  @PropertyDecorator
  title: string;
  private _price: number;

  @AccessorDecorator
  set price(value: number) {
    if (value > 0) {
      this._price = value;
    } else {
      throw new Error("Price must not be smaller than zero");
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @MethodDecorator
  getPriceAfterTax(@ParameterDecorator tax: number) {
    return this._price * tax;
  }
}

// Returning and chaining new class inside class decorator

function AssignAgeAndSex(age: number, sex: string) {
  return function <T extends { new (...args: any[]): {} }>(originalClass: T) {
    return class extends originalClass {
      age: number;
      sex: string;
      constructor(...args: any[]) {
        const [name] = args
        super(name);
        this.age = age;
        this.sex = sex;
      }
    };
  };
}

@AssignAgeAndSex(30, "male")
class AnotherPersonna {
  name: string;
  constructor(n: string) {
    this.name = n;
  }
}

const anotherPersonna1 = new AnotherPersonna("Max");
console.log(anotherPersonna1);

// Returning new property descriptor

function Autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const updatedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      return originalMethod.bind(this);
    },
  };
  return updatedDescriptor;
}

class Printer {
  message: string = "This works!";

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const printer = new Printer();

const messageButton = document.getElementById("message-button");
messageButton?.addEventListener("click", printer.showMessage);

// Validation with decorators

interface ValidationConfig {
  [className: string]: {
    [member: string]: string[];
  };
}

const registeredValidations: ValidationConfig = {};

function Required(target: any, propName: string) {
  registeredValidations[target.constructor.name] = {
    ...registeredValidations[target.constructor.name],
    [propName]: ["required"],
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidations[target.constructor.name] = {
    ...registeredValidations[target.constructor.name],
    [propName]: ["positive"],
  };
}

function validate(course: any): boolean {
  const propsToValidate = registeredValidations[course.constructor.name];
  if (!propsToValidate) {
    return true;
  }
  let valid = true;
  for (const propName in propsToValidate) {
    for (const rule of propsToValidate[propName]) {
      switch (rule) {
        case "required":
          valid = valid && !!course[propName];
          break
        case "positive":
          valid = valid && course[propName] > 0;
          break
      }
    }
  }

  return valid;
}

class Course {
  @Required
  title: string;

  @PositiveNumber
  price: number;
  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseButton = document.getElementById("course-button")!;
courseButton.addEventListener("click", (event) => {
  event.preventDefault();
  const title = (document.getElementById("title") as HTMLInputElement).value;
  const price = +(document.getElementById("price") as HTMLInputElement).value;

  const course = new Course(title, price);

  if (!validate(course)) {
    throw new Error("Proviced title and price are not valid!");
  }

  console.log(course);
});
