"use strict";
// Intersections, type guards, discriminated unions, type casting, indexed types
const admin = {
    name: "Max",
    privileges: ["server-management"],
    startDate: new Date(),
};
// # Type guards
// # With "typeof":
function addNumbersOrStrings(a, b) {
    if (typeof a === "string" || typeof b === "string") {
        return a.toString() + b.toString();
    }
    else {
        return a + b;
    }
}
function printEmployeeInformation(employee) {
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
    loadCargo(amount) {
        console.log("Loading cargo..." + amount);
    }
}
const v1 = new Car();
const v2 = new Truck();
function useVehicle(vehicle) {
    vehicle.drive();
    if (vehicle instanceof Truck) {
        vehicle.loadCargo(20);
    }
}
// ## Union Exhaustiveness checking => Checks if all three subtypes of union type have been checked in switch case
function checkForNever(arg) {
    throw new Error("Unexpected object: " + arg);
}
function moveAnimal(animal) {
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
const typeCastingInput1 = document.querySelector("input");
typeCastingInput1.value = "Hello there!";
// ## Add as <Element> at the end of expression to tell TS what kind of element the variable will be representing
// ## If you don't do it, the line typeCastingInput2.value = "Hello there" will not work
// ## Adding as <Element> is enough to tell TS the variable will not be null
// ## Hhence you don't have to add !, but it will not hurt
const typeCastingInput2 = document.getElementById("type-casting-input");
typeCastingInput2.value = "Hello there!";
const errorBag = {
    id: "eb1",
    email: "Not a valid e-mail",
    username: "Not a valid username",
};
