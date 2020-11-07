"use strict";
// TYPE INFERENCE: Dlaczego zoo ma typ [ELEPHANT | RHINO | ZEBRA], a nie Animal[]? Dlaczego zoo ma typ Animal[] ?
class Animal {
}
class Elephant extends Animal {
}
class Rhino extends Animal {
}
class Zebra extends Animal {
}
const zoo = [new Elephant(), new Rhino(), new Zebra()];
const zoo2 = [new Elephant(), new Rhino(), new Zebra(), new Animal()];
const obj = {
    myNumberProp: 10,
    myStringProp: "str",
    myBooleanProp: true,
};
for (const key in obj) {
    // const value = obj[key]; // error, ale dlaczego?? Jak go naprawić?
}
const extension = {
    numberFunction: (param) => {
        console.log(param);
    },
    stringFunction: (param) => {
        console.log(param);
    },
};
