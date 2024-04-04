// Отримуємо форму опитування
var surveyForm = document.getElementById('surveyForm');

// Додаємо обробник подій для події відправлення форми
surveyForm.addEventListener('submit', function(event) {
    // Зупиняємо стандартну дію форми, щоб сторінка не перезавантажувалася
    event.preventDefault();
    
    // Отримуємо дані форми
    var formData = new FormData(surveyForm);
    
    // Перетворюємо дані форми в об'єкт для зручності
    var formObject = {};
    formData.forEach(function(value, key){
        formObject[key] = value;
    });

    // Отримуємо ідентифікатор унікального запису
    var entryId = 'entry_' + Date.now();
    
    // Зберігаємо дані форми в localStorage за допомогою унікального ідентифікатора
    localStorage.setItem(entryId, JSON.stringify(formObject));
    
    // Очищаємо дані форми
    surveyForm.reset();

    // Виводимо повідомлення про успішне збереження
    alert('Дані збережено успішно!');
});

// Функція для фільтрації за факультетом
function filterByFaculty() {
    var faculty = document.getElementById('facultyFilter').value;
    var surveyData = Object.values(localStorage).map(JSON.parse);
    var filteredData = surveyData.filter(function(entry) {
      return entry.faculty === faculty;
    });
    // Відображення відфільтрованих даних на сторінці
    displayData(filteredData);
  }
  
  // Функція для відображення даних на сторінці
  function displayData(data) {
    // Очистити попередні результати
    document.getElementById('results').innerHTML = '';
    // Вивести нові результати
    data.forEach(function(entry) {
      var resultElement = document.createElement('div');
      resultElement.textContent = JSON.stringify(entry);
      document.getElementById('results').appendChild(resultElement);
    });
  }
  
  // Додати обробник події для фільтрації при зміні вибраного факультету
  document.getElementById('facultyFilter').addEventListener('change', filterByFaculty);

  // Функція для фільтрації за датою і часом співбесіди
function filterByInterviewTime() {
    var interviewTime = document.getElementById('interviewTimeFilter').value;
    var surveyData = Object.values(localStorage).map(JSON.parse);
    var filteredData = surveyData.filter(function(entry) {
      return entry.interviewTime === interviewTime;
    });
    // Відображення відфільтрованих даних на сторінці
    displayData(filteredData);
  }
  
  // Додати обробник події для фільтрації при зміні введеної дати і часу співбесіди
  document.getElementById('interviewTimeFilter').addEventListener('change', filterByInterviewTime);

  // Функція для фільтрації за середнім балом
function filterByAverageGrade() {
    var minGrade = parseInt(document.getElementById('averageGradeMin').value);
    var maxGrade = parseInt(document.getElementById('averageGradeMax').value);
    var surveyData = Object.values(localStorage).map(JSON.parse);
    var filteredData = surveyData.filter(function(entry) {
      var averageGrade = parseInt(entry.averageGrade);
      return averageGrade >= minGrade && averageGrade <= maxGrade;
    });
    // Відображення відфільтрованих даних на сторінці
    displayData(filteredData);
  }

  // Отримання HTML-елементів
var questionContainer = document.getElementById('question-container');
var resultContainer = document.getElementById('result-container');

// Побудова тесту
function buildQuiz(questions) {
    questions.forEach(function(question, index) {
        var questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = '<p>' + (index + 1) + '. ' + question.question + '</p>';

        var answersUl = document.createElement('ul');
        answersUl.classList.add('answers');

        question.answers.forEach(function(answer, ansIndex) {
            var answerLi = document.createElement('li');
            var answerInput = document.createElement('input');
            answerInput.type = 'radio';
            answerInput.name = 'q' + index;
            answerInput.value = answer;
            answerInput.id = 'q' + index + 'a' + ansIndex;
            var answerLabel = document.createElement('label');
            answerLabel.htmlFor = 'q' + index + 'a' + ansIndex;
            answerLabel.textContent = answer;
            answerLi.appendChild(answerInput);
            answerLi.appendChild(answerLabel);
            answersUl.appendChild(answerLi);
        });

        questionDiv.appendChild(answersUl);
        questionContainer.appendChild(questionDiv);
    });
}

var quizResults = []; // Зберігання результатів тестування

// Перевірка результатів тесту
function checkAnswers(data) {
    var correctAnswers = 0;
    var radioInputs = document.querySelectorAll('input[type="radio"]:checked');
    var questionResults = []; // Зберігання результатів для кожного питання
    radioInputs.forEach(function(input, index) {
        var questionIndex = parseInt(input.name.slice(1));
        if (input.value === data[questionIndex].correct_answer) {
            correctAnswers++;
            questionResults.push({ question: data[questionIndex].question, result: 'Correct' });
        } else {
            questionResults.push({ question: data[questionIndex].question, result: 'Incorrect' });
        }
    });
    var resultPercentage = (correctAnswers / data.length) * 100;
    quizResults.push({ percentage: resultPercentage, questions: questionResults }); // Додавання результатів тестування до загальних результатів
    resultContainer.textContent = 'Your score: ' + resultPercentage.toFixed(2) + '%';
    displayOverallResult(); // Виведення загального результату
}

// Виведення загального результату тестування
function displayOverallResult() {
    var overallResultDiv = document.createElement('div');
    overallResultDiv.classList.add('overall-result');
    overallResultDiv.innerHTML = '<h2>Overall Results</h2>';
    quizResults.forEach(function(result, index) {
        var resultParagraph = document.createElement('p');
        resultParagraph.textContent = 'Test ' + (index + 1) + ': ' + result.percentage.toFixed(2) + '%';
        var questionsList = document.createElement('ul');
        result.questions.forEach(function(questionResult) {
            var questionListItem = document.createElement('li');
            questionListItem.textContent = questionResult.question + ': ' + questionResult.result;
            questionsList.appendChild(questionListItem);
        });
        overallResultDiv.appendChild(resultParagraph);
        overallResultDiv.appendChild(questionsList);
    });
    document.body.appendChild(overallResultDiv); // Виведення загального результату на сторінці
}

// Виклик функції для перевірки результатів
var submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', function() {
    checkAnswers(data); // Передача даних тесту в функцію перевірки
});
