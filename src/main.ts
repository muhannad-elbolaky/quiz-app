const question = document.querySelector('#question') as HTMLHeadingElement;
const choices = document.querySelectorAll(
  '.choice-text'
) as NodeListOf<HTMLParagraphElement>;
const progressText = document.querySelector(
  '#progressText'
) as HTMLParagraphElement;
const progressBarFull = document.querySelector(
  '#progressBarFull'
) as HTMLDivElement;
const scoreText = document.querySelector('#score') as HTMLHeadingElement;

let currentQuestion: Question;
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
