// const add = (num1: number, num2: number) => num1 + num2;

// const number1 = 2;
// const number2 = 5.8;

// const result = add(number1, number2);

// type PersonType = { name: string; age: number; hobbies: string[] };

// const person: PersonType = {
//   name: "Łukasz",
//   age: 25,
//   hobbies: ["Football", "Music"],
// };

// type Answer = "Yes, please" | "No, thanks ";

// const logAnswer = (answer: Answer) => {
//   console.log(answer);
// };

// logAnswer("Yes, please");

// const addAndHandle = (
//   num1: number,
//   num2: number,
//   callback: (result: number) => void
// ): void => {
//   const result = num1 + num2;
//   callback(result);
// };

// const cb = (res: number) => {
//   console.log(res);
//   return res * 2;
// };

// addAndHandle(1, 10, cb);

interface Greetable {
  name: string;
  greet(phrase: string): void;
}

class Person implements Greetable {
  name: string;
  private age: number;

  get currentAgeTwice() {
    return this.age * 2;
  }

  set newAge(value: number) {
    this.age = value;
  }

  constructor(n: string, a: number) {
    this.name = n;
    this.age = a;
  }
  greet(phrase: string) {
    console.log(phrase + this.name);
  }
}

const p1 = new Person("Łukasz", 25);

p1.greet("Hi there, I am ");

console.log(p1.currentAgeTwice);

p1.newAge = 40;

console.log(p1.currentAgeTwice);
