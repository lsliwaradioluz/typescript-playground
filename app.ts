// Generics functions, Generic classes, Generic utility types

// Generic is a type connected with some other type
// Built in generics examples:
// Array

const names: Array<string> = ["Adam", "Eve"];

// Promise

const promise: Promise<string> = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("This is done");
  }, 2000);
});

promise.then((res) => {
  const firstWord = res.split(" ")[0];
  // console.log(firstWord);
});

// # Generic functions

type GenericFunction = <t1, t2>(obj1: t1, obj2: t2) => t1 & t2;

const merge: GenericFunction = (obj1, obj2) => Object.assign(obj1, obj2);
const mergedObjects = merge({ name: "Łukasz" }, { surname: "Śliwa" });

// # Generic functions with Constraints

type GenericFunctionWithConstraints = <t1 extends object, t2 extends object>(
  obj1: t1,
  obj2: t2
) => t1 & t2;
const merge2: GenericFunctionWithConstraints = merge;

// const mergedObjects2 = merge2({ name: "Łukasz"}, 30) <= this woudl yeild an error
const mergedObjects2 = merge2({ name: "Łukasz" }, { surname: "Śliwa" });

// # Another generic function with Constraints

type HasLength = {
  length: number;
};

const countAndDescribe = <T extends HasLength>(element: T): [T, string] => {
  let description = "Has 0 elements";
  if (element.length) {
    description = `Has ${element.length} element(s)`;
  }
  return [element, description];
};

console.log(countAndDescribe("Hello"));

// # Generic function using "keyof" as a Constraint

const getObjectProperty = <T extends object, U extends keyof T>(
  obj: T,
  key: U
) => {
  return `The value ${key} of given object is ${obj[key]}`;
};

// console.log(getObjectProperty({}, "name")); <= Error!
console.log(getObjectProperty({ name: "Łukasz" }, "name"));

// # Generic classes

class DataStorage<T extends string | number | boolean> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}

const stringStorage = new DataStorage<string>();
stringStorage.addItem("Me");
stringStorage.addItem("Myself");
stringStorage.addItem("I");
console.log(stringStorage.getItems());

// # Generic utility types:
interface CourseGoal {
  title: string;
  description: string;
  completeDate: Date;
}

// Partial

function createCourseGoal(title: string, description: string, date: Date) {
  const newCourseGoal: Partial<CourseGoal> = {};
  newCourseGoal.title = title;
  newCourseGoal.description = description;
  newCourseGoal.completeDate = date;

  return newCourseGoal as CourseGoal;
}

// Readonly

const employees: Readonly<string[]> = ["Max", "Anna"];
// employees.push("Manu"); <= err!

// Record

type Key = "home" | "about" | "contact";

interface Value {
  title: string;
  // date: Date <= comment this in to see what happens
}

type Nav = Record<Key, Value>;

const nav: Record<Key, Value> = {
  about: { title: "about" },
  contact: { title: "contact" },
  home: { title: "home" },
};

nav.about;

// Pick && Omit

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

const todo1: Pick<Todo, "title" | "completed"> = {
  title: "Clean room",
  completed: false,
};

const todo2: Omit<Todo, "description"> = {
  title: "Dirty room",
  completed: true,
};

// Exclude

type StringsOrNumbers = Exclude<
  string | number | boolean | undefined,
  boolean | undefined
>;

// Extract

type AorB = Extract<"A" | "B" | "C" | "D", "A" | "B" | "F">;

// NonNullable

type WithoutNull = NonNullable<string | number | null | undefined>;

// Parameters

type FnType = (a: string | number, b: boolean) => void;

type T0 = Parameters<() => string>;

type T1 = Parameters<(s: string) => void>;

type T2 = Parameters<<T>(arg: T) => T>;

type T3 = Parameters<FnType>;

type T4 = Parameters<(a: string, b: number) => void>;

type T5 = Parameters<any>;

type T6 = Parameters<never>;

// Constructor Parameters

type T00 = ConstructorParameters<ErrorConstructor>;
type T11 = ConstructorParameters<FunctionConstructor>;
type T22 = ConstructorParameters<RegExpConstructor>;
type T33 = ConstructorParameters<any>;

// ReturnType

type FnType2 = (a: string, b: string) => string;

type Return = ReturnType<FnType2>;

// InstanceType

class C {
  x = 0;
  y = 0;
}

type T000 = InstanceType<typeof C>;
type T111 = InstanceType<any>;
type T222 = InstanceType<never>;

// Required

interface Props {
  name?: string;
  age?: number;
}

interface RequiredProps extends Required<Props> {}

const obj1: Props = { name: "Max" };
const obj2: RequiredProps = { name: "Max", age: 21 };
