var add = function (num1, num2) { return num1 + num2; };
var number1 = 2;
var number2 = 5.8;
var result = add(number1, number2);
var person = {
    name: "Łukasz",
    age: 25,
    hobbies: ["Football", "Music"]
};
var logAnswer = function (answer) {
    console.log(answer);
};
logAnswer("Yes, please");
var addAndHandle = function (num1, num2, callback) {
    var result = num1 + num2;
    callback(result);
};
var cb = function (res) {
    console.log(res);
};
addAndHandle(1, 2, cb);
