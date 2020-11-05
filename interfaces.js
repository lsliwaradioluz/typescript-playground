"use strict";
// interface, implements, readonly, ? (optional properties), ReadonlyArray
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
// #ReadonlyArray (why is this even here?!)
let a = [1, 2, 3, 4];
let ro = a;
// ro[0] = 12; => error!
// ro.push(5); => error!
// ro.length = 100; => error!
// a = ro; => error!
// #we can override it with type assertion though
let a2 = [1, 2, 3, 4];
let ro2 = a;
a2 = ro2;
