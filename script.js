const quizForm = document.querySelector("#quiz-form");
const result = document.querySelector("#result");

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const answer1 = document.querySelector("#question-1").value.trim();
  const answer2 = document.querySelector("#question-2").value.trim();
  const answer3 = document.querySelector("#question-3").value.trim();

  console.log("Question 1:", answer1);
  console.log("Question 2:", answer2);
  console.log("Question 3:", answer3);

  result.textContent = "Your answers have been recorded... for now. 🎃";
});