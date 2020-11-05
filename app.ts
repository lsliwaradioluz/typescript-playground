interface Person {
  name: string;
  age: number;
  greet(phrase: string): void 
}

let user1: Person;

user1 = {
  name: 'Max', 
}