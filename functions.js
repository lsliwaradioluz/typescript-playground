"use strict";
// Union type
var _a;
const combine = (input1, input2, resultConversion) => {
    let result;
    if (typeof input1 === "number" && typeof input2 === "number") {
        result = input1 + input2;
    }
    else {
        result = input1.toString() + input2.toString();
    }
    if (resultConversion === "as-number") {
        return +result;
    }
    else {
        return result.toString();
    }
};
const combinedNumbers = combine(10, 20, "as-number");
console.log(combinedNumbers);
const combinedStrings = combine("Łukasz", "Świnia", "as-string");
console.log(combinedStrings);
// Function type
let newFunction;
newFunction = combine;
function combineTwoValues(a, b) {
    if (typeof a === "string" || typeof b === "string") {
        return a.toString() + b.toString();
    }
    return a + b;
}
const twoValuesCombined = combineTwoValues("Max ", "Schwarz");
twoValuesCombined.split("");
// # Optional chaining
// Useful in cases where you don't know if certain object has a certain property
// Add ? after the property that you are not sure about 
const fetchedUserData = {
    id: "u1",
    name: "Max",
    job: { title: "CEO", description: "His dream job " },
};
console.log((_a = fetchedUserData === null || fetchedUserData === void 0 ? void 0 : fetchedUserData.job) === null || _a === void 0 ? void 0 : _a.title);
// # Nullish coalescing
const userInput = undefined;
// If userInput equals null or undefined, use the provided fallback value 
const storedData = userInput !== null && userInput !== void 0 ? userInput : 'DEFAULT';
// ?? is similar to || in vanilla JS, but it only enforces use of fallback value in case of null or undefined 
// operator || would also enforce using fallback value while dealing with an empty string ''
