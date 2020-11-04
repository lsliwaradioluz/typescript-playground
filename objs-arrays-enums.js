"use strict";
var Sexes;
(function (Sexes) {
    Sexes[Sexes["MALE"] = 0] = "MALE";
    Sexes[Sexes["FEMALE"] = 1] = "FEMALE";
    Sexes[Sexes["MIXED"] = 2] = "MIXED";
})(Sexes || (Sexes = {}));
const person = {
    name: "Łukasz",
    age: 25,
    sex: Sexes.MALE,
    hobbies: ["Cooking", "Football"],
    role: [2, "author"],
};
console.log(person.name);
for (const hobby of person.hobbies) {
    console.log(hobby);
}
;
// OK, return value of 'getValue' is not checked
const str = getValue("myString");
console.log(str);
