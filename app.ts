const add = (num1: number, num2: number) => num1 + num2;

const number1 = 2;
const number2 = 5.8;

const result = add(number1, number2);

type PersonType = { name: string; age: number; hobbies: string[] };

const person: PersonType = {
  name: "Łukasz",
  age: 25,
  hobbies: ["Football", "Music"],
};

type Answer = "Yes, please" | "No, thanks ";

const logAnswer = (answer: Answer) => {
  console.log(answer);
};

logAnswer("Yes, please");

const addAndHandle = (
  num1: number,
  num2: number,
  callback: (result: number) => void
) : void => {
  const result = num1 + num2;
  callback(result);
};

const cb = (res) => {
  console.log(res);
  return res * 2
};

addAndHandle(1, 2, cb);
