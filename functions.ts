// Union type

type Combinable = number | string;

type FunctionType = (
  a: Combinable,
  b: Combinable,
  c: "as-number" | "as-string"
) => number | string;

const combine: FunctionType = (input1, input2, resultConversion) => {
  let result;
  if (typeof input1 === "number" && typeof input2 === "number") {
    result = input1 + input2;
  } else {
    result = input1.toString() + input2.toString();
  }

  if (resultConversion === "as-number") {
    return +result;
  } else {
    return result.toString();
  }
};

const combinedNumbers = combine(10, 20, "as-number");
console.log(combinedNumbers);

const combinedStrings = combine("Łukasz", "Świnia", "as-string");
console.log(combinedStrings);

// Function type

let newFunction: FunctionType;
newFunction = combine;

// # Function Overloads
// ## Useful in cases where typescript can not pick the correct return type
// ## based on types of provided function parameters

function combineTwoValues(a: number, b: number): number;
function combineTwoValues(a: string, b: string): string; // <= Comment this line out to see what happens
function combineTwoValues(a: string, b: number): string;
function combineTwoValues(a: number, b: string): string;
function combineTwoValues(a: Combinable, b: Combinable) {
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

console.log(fetchedUserData?.job?.title);

// # Nullish coalescing

const userInput = undefined

// If userInput equals null or undefined, use the provided fallback value 
const storedData = userInput ?? 'DEFAULT'

// ?? is similar to || in vanilla JS, but it only enforces use of fallback value in case of null or undefined 
// operator || would also enforce using fallback value while dealing with an empty string ''

