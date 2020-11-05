"use strict";
// interface, implements, readonly, ? optional properties
class Person {
    constructor(name, outputName) {
        this.age = 30;
        this.name = name;
        if (outputName) {
            this.outputName = outputName;
        }
    }
    greet(phrase) {
        console.log(phrase + " " + this.name);
    }
}
let user1;
user1 = new Person("Max");
user1.greet("Hi, I am");
