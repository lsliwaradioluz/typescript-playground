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