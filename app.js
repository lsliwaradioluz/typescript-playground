"use strict";
// const add = (num1: number, num2: number) => num1 + num2;
class Person {
    constructor(n, a) {
        this.name = n;
        this.age = a;
    }
    get currentAgeTwice() {
        return this.age * 2;
    }
    set newAge(value) {
        this.age = value;
    }
    greet(phrase) {
        console.log(phrase + this.name);
    }
}
const p1 = new Person("Łukasz", 25);
p1.greet("Hi there, I am ");
console.log(p1.currentAgeTwice);
p1.newAge = 40;
console.log(p1.currentAgeTwice);
