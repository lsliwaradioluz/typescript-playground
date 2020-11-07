"use strict";
// Generics functions, Generic classes, Generic utility types
// Generic is a type connected with some other type
// Built in generics examples:
// Array
const names = ["Adam", "Eve"];
// Promise
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("This is done");
    }, 2000);
});
promise.then((res) => {
    const firstWord = res.split(" ")[0];
    // console.log(firstWord);
});
const merge = (obj1, obj2) => Object.assign(obj1, obj2);
const mergedObjects = merge({ name: "Łukasz" }, { surname: "Śliwa" });
const merge2 = merge;
// const mergedObjects2 = merge2({ name: "Łukasz"}, 30) <= this woudl yeild an error
const mergedObjects2 = merge2({ name: "Łukasz" }, { surname: "Śliwa" });
const countAndDescribe = (element) => {
    let description = "Has 0 elements";
    if (element.length) {
        description = `Has ${element.length} element(s)`;
    }
    return [element, description];
};
console.log(countAndDescribe("Hello"));
// # Generic function using "keyof" as a Constraint
const getObjectProperty = (obj, key) => {
    return `The value ${key} of given object is ${obj[key]}`;
};
// console.log(getObjectProperty({}, "name")); <= Error!
console.log(getObjectProperty({ name: "Łukasz" }, "name"));
// # Generic classes
class DataStorage {
    constructor() {
        this.data = [];
    }
    addItem(item) {
        this.data.push(item);
    }
    removeItem(item) {
        this.data.splice(this.data.indexOf(item), 1);
    }
    getItems() {
        return [...this.data];
    }
}
const stringStorage = new DataStorage();
stringStorage.addItem("Me");
stringStorage.addItem("Myself");
stringStorage.addItem("I");
console.log(stringStorage.getItems());
// Partial
function createCourseGoal(title, description, date) {
    const newCourseGoal = {};
    newCourseGoal.title = title;
    newCourseGoal.description = description;
    newCourseGoal.completeDate = date;
    return newCourseGoal;
}
// Readonly
const employees = ["Max", "Anna"];
const nav = {
    about: { title: "about" },
    contact: { title: "contact" },
    home: { title: "home" },
};
nav.about;
const todo1 = {
    title: "Clean room",
    completed: false,
};
const todo2 = {
    title: "Dirty room",
    completed: true,
};
// InstanceType
class C {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}
const obj1 = { name: "Max" };
const obj2 = { name: "Max", age: 21 };
