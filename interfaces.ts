// interface, implements, readonly, ? optional properties

// #interface can only be used for objects, although custom types could be used as well
// #custom types can't be implemented by class
interface Named {
  // #I can add readonly in the interface, public and private are not allowed.
  // #I could also do it inside the type declaration.
  readonly name: string;
  // #I can use "?" to mark property as optional. This will also be reflected inside class which implements that interface
  outputname?: string;
}

// #We can use interfaces to type functions as well
interface greetFnInterface {
  (phrase: string): void;
}
// #These two ^⌄ can be used interchangeably, although the bottom solution is more common
type greetFnType = (phrase: string) => void;

// #One interface can extend another and it can extend more than one - not like classes!
interface Greetable extends Named {
  greet: greetFnInterface;
}

class Person implements Greetable {
  name: string;
  outputName?: string;
  age: number = 30;
  constructor(name: string, outputName?: string) {
    this.name = name;
    if (outputName) {
      this.outputName = outputName;
    }
  }
  greet(phrase: string) {
    console.log(phrase + " " + this.name);
  }
}

let user1: Greetable;
user1 = new Person("Max");

user1.greet("Hi, I am");
