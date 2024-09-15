(function () {
  'use strict';

  var questions = [];
  var currentQuestionIndex = 0;

  // This function is called when the page loads
  window.onload = function () {
    fetchChecklists();  // Call to fetch checklists
  };

  // Fetch checklists from checklists.json (or an API)
  function fetchChecklists() {
    fetch('checklists.json')
      .then(response => response.json())
      .then(data => populateChecklists(data))
      .catch(error => console.error('Error loading checklists:', error));
  }

  // Populate the dropdown list with checklists
  function populateChecklists(checklists) {
    var checklistDropdown = document.getElementById('checklist');
    checklistDropdown.innerHTML = '<option value="">Select a checklist</option>';
    
    checklists.forEach(function (checklist) {
      var option = document.createElement('option');
      option.text = checklist.name;
      option.value = checklist.name;
      checklistDropdown.add(option);
    });

    checklistDropdown.addEventListener('change', function () {
      fetchQuestions(this.value, checklists);  // Fetch questions when a checklist is selected
    });
  }

  // Fetch the questions for the selected checklist
  function fetchQuestions(selectedChecklist, checklists) {
    questions = checklists.find(checklist => checklist.name === selectedChecklist)?.questions || [];
    currentQuestionIndex = 0;
    showQuestion(currentQuestionIndex);
    updateProgressBar();
  }

  // Show a single question (card view)
  function showQuestion(index) {
    var questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = '';  // Clear any existing content

    if (questions.length === 0 || index >= questions.length) {
      return;  // No questions to show
    }

    var questionData = questions[index];

    // Create the card element
    var card = document.createElement('div');
    card.className = 'card';

    // Create and append the section header
    var sectionHeader = document.createElement('h4');
    sectionHeader.textContent = 'Section: ' + questionData.section;
    card.appendChild(sectionHeader);

    // Create and append the question text
    var questionPara = document.createElement('p');
    questionPara.innerHTML = '<strong>Question:</strong> ' + questionData.question;
    card.appendChild(questionPara);

    // Add buttons, label, and navigation as needed...

    questionsContainer.appendChild(card);  // Append the card to the container
  }

  // Update the progress bar
  function updateProgressBar() {
    var progress = document.getElementById('progress');
    var percentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progress.style.width = percentage + '%';
  }
})();