/*

1. Build a function constructor called Question to describe a question. A question should include:
    a. question itself
    b. the answers from which the player can choose the correct one (choose an adequate data structure here, array, object, etc.)
    c. coorect answer( I would use a number for this)
2. Create a couple of questions using the constructor
3. Store them all inside an array
4. Select one random question and log it on the console, together with the possible answers ( each question should have a number)
Hint: write a method for the question objects for this task
5. Use the 'prompt' function to ask the user for the correct answer. The user should input the number of the corect answer such as you displayed it on Task 4.
6 Check if the answer is correct and print to the console whether the answer is correct or not (Hint: write another method for this)
7. Suppose this code would be a plugin for other programmers to use in their code. So make sure that all your code is private and doesn't interfere with the other programmers code. (Hint : we learned a special technique to do exactly that)
*/

let setOfQuestions = [
    { question : 'What is 2 + 2?', options:[1,9,4], answer: 2},
    { question : 'What is my name?', options:['Piolo','Bryan','Goku'], answer: 1},
    { question : 'What is bisaya of fish?', options:['isda','langgam','buaya'], answer: 0},
    { question : 'Gwapo ko?', options:['Oo','Dili','Ambot'], answer: 0},
    { question : 'Practice makes you perfect, Is this correct?', options:['No','Yes','Maybe'], answer: 1}
];

let questions = function({question,options,answer}){
    this.q = question,
    this.o = options,
    this.a = answer;
}

questions.prototype.listOfOptions = function(){
    var str = '';
    for(var i=0; i<this.o.length; i++){
        str += i +' - '+this.o[i] +'\n';
    }
    return str;
}

questions.prototype.askQ = function(ans){
    if(ans !== 'exit'){
        if(this.a === parseInt(ans,10)){
            score++;
            console.log('Your answer is correct!');
            console.log('Your score is => ',score);
        } else {
            console.log('Your answer is wrong!');
        }
    }
}

let score = 0;

let question = setOfQuestions.map(x => new questions(x));

function newQuestion(){
    let getRandomQ = Math.floor(Math.random() * 5);

    console.log(question[getRandomQ].listOfOptions());
    let a = prompt(question[getRandomQ].q);
    
    question[getRandomQ].askQ(a);

    if(a !== 'exit'){
        let aa = parseInt(a,10);
        question[getRandomQ].askQ(aa);
        newQuestion();
    }
    
}

newQuestion();