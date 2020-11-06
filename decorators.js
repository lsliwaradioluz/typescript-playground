"use strict";
// # Decorators
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
// Class decorator
function Logger(constructor) {
    // console.log("Logging...");
    // console.log(constructor);
}
// Class decorator factory
function WithTemplate(template, hookID) {
    return (constructor) => {
        // console.log("With template");
        const hook = document.getElementById(hookID);
        const newPerson = new constructor();
        hook.innerHTML = template;
        const title = hook.querySelector("h1");
        title.textContent = newPerson.name;
    };
}
let Personna = class Personna {
    constructor() {
        this.name = "Max";
        // console.log("Creating person object...");
    }
};
Personna = __decorate([
    Logger,
    WithTemplate("<h1></h1>", "app")
], Personna);
const p1 = new Personna();
// Property, accessor, method and parameter decorators
function PropertyDecorator(target, propertyName) {
    console.log(propertyName);
    console.log(target);
}
function AccessorDecorator(target, name, descriptor) {
    console.log(name);
    console.log(target);
    console.log(descriptor);
}
function MethodDecorator(target, name, descriptor) {
    console.log(name);
    console.log(target);
    console.log(descriptor);
}
function ParameterDecorator(target, methodName, position) {
    console.log(methodName);
    console.log(target);
    console.log(position);
}
class Product {
    constructor(t, p) {
        this.title = t;
        this._price = p;
    }
    set price(value) {
        if (value > 0) {
            this._price = value;
        }
        else {
            throw new Error("Price must not be smaller than zero");
        }
    }
    getPriceAfterTax(tax) {
        return this._price * tax;
    }
}
__decorate([
    PropertyDecorator
], Product.prototype, "title", void 0);
__decorate([
    AccessorDecorator
], Product.prototype, "price", null);
__decorate([
    MethodDecorator,
    __param(0, ParameterDecorator)
], Product.prototype, "getPriceAfterTax", null);
// Returning and chaining new class inside class decorator
function AssignAgeAndSex(age, sex) {
    return function (originalClass) {
        return class extends originalClass {
            constructor(...args) {
                const [name] = args;
                super(name);
                this.age = age;
                this.sex = sex;
            }
        };
    };
}
let AnotherPersonna = class AnotherPersonna {
    constructor(n) {
        this.name = n;
    }
};
AnotherPersonna = __decorate([
    AssignAgeAndSex(30, "male")
], AnotherPersonna);
const anotherPersonna1 = new AnotherPersonna("Max");
console.log(anotherPersonna1);
// Returning new property descriptor
function Autobind(target, methodName, descriptor) {
    const originalMethod = descriptor.value;
    const updatedDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            return originalMethod.bind(this);
        },
    };
    return updatedDescriptor;
}
class Printer {
    constructor() {
        this.message = "This works!";
    }
    showMessage() {
        console.log(this.message);
    }
}
__decorate([
    Autobind
], Printer.prototype, "showMessage", null);
const printer = new Printer();
const messageButton = document.getElementById("message-button");
messageButton === null || messageButton === void 0 ? void 0 : messageButton.addEventListener("click", printer.showMessage);
const registeredValidations = {};
function Required(target, propName) {
    registeredValidations[target.constructor.name] = Object.assign(Object.assign({}, registeredValidations[target.constructor.name]), { [propName]: ["required"] });
}
function PositiveNumber(target, propName) {
    registeredValidations[target.constructor.name] = Object.assign(Object.assign({}, registeredValidations[target.constructor.name]), { [propName]: ["positive"] });
}
function validate(course) {
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
                    break;
                case "positive":
                    valid = valid && course[propName] > 0;
                    break;
            }
        }
    }
    return valid;
}
class Course {
    constructor(t, p) {
        this.title = t;
        this.price = p;
    }
}
__decorate([
    Required
], Course.prototype, "title", void 0);
__decorate([
    PositiveNumber
], Course.prototype, "price", void 0);
const courseButton = document.getElementById("course-button");
courseButton.addEventListener("click", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const price = +document.getElementById("price").value;
    const course = new Course(title, price);
    if (!validate(course)) {
        throw new Error("Proviced title and price are not valid!");
    }
    console.log(course);
});
