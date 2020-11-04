enum Sexes {
  MALE,
  FEMALE,
  MIXED,
}

const person: {
  name: string;
  age: number;
  sex: number;
  hobbies: string[]; // array
  role: [number, string]; // tuple
} = {
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

declare function getValue(key: string): string {
  return key
};
// OK, return value of 'getValue' is not checked
const str: string = getValue("myString");
console.log(str)
