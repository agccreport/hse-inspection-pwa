document.addEventListener('DOMContentLoaded', function() {
  fetch('data/checklists.json')
    .then(response => response.json())
    .then(data => {
      populateChecklists(data);
    })
    .catch(error => console.error('Error loading checklists:', error));
});

function populateChecklists(checklists) {
  var checklistDropdown = document.getElementById('checklist');
  checklistDropdown.innerHTML = '<option value="">Select a checklist</option>';

  checklists.forEach(function(checklist) {
    var option = document.createElement('option');
    option.text = checklist.name;
    option.value = checklist.name;
    checklistDropdown.add(option);
  });

  // Add event listener to fetch and display questions
  checklistDropdown.addEventListener('change', function() {
    var selectedChecklist = checklists.find(c => c.name === checklistDropdown.value);
    if (selectedChecklist) {
      displayQuestions(selectedChecklist.questions);
    }
  });
}

function displayQuestions(questions) {
  var questionsContainer = document.getElementById('questions-container');
  questionsContainer.innerHTML = '';

  questions.forEach(function(question, index) {
    var card = createCard(question, index);
    questionsContainer.appendChild(card);
  });
}

function createCard(question, index) {
  var card = document.createElement('div');
  card.className = 'card';

  var sectionHeader = document.createElement('h4');
  sectionHeader.textContent = 'Section: ' + question.section;

  var questionPara = document.createElement('p');
  questionPara.innerHTML = '<strong>Question:</strong> ' + question.question;

  var labelElement = createLabel(question.label);

  var helpButton = createHelpButton(question.hse);

  var commentTextarea = document.createElement('textarea');
  commentTextarea.id = 'comment-' + index;
  commentTextarea.placeholder = 'Leave a comment';

  var btnGroup = createResponseButtons(index);

  var navButtons = createNavigationButtons(index);

  card.appendChild(sectionHeader);
  card.appendChild(questionPara);
  card.appendChild(helpButton);
  card.appendChild(labelElement);
  card.appendChild(commentTextarea);
  card.appendChild(btnGroup);
  card.appendChild(navButtons);

  return card;
}

function createLabel(labelText) {
  var labelElement = document.createElement('div');
  labelElement.className = 'label';
  labelElement.textContent = labelText || 'No Label'; // Fallback if no label
  return labelElement;
}

function createHelpButton(hseRequirement) {
  var helpButton = document.createElement('button');
  helpButton.className = 'help-button';
  helpButton.textContent = '?';

  var popup = createPopup(hseRequirement);

  helpButton.addEventListener('click', function(event) {
    event.stopPropagation();
    togglePopup(popup);
  });

  var container = document.createElement('div');
  container.style.position = 'relative';
  container.appendChild(helpButton);
  container.appendChild(popup);

  return container;
}

function createPopup(content) {
  var popup = document.createElement('div');
  popup.className = 'popup';

  var closeButton = document.createElement('button');
  closeButton.className = 'close-popup';
  closeButton.textContent = '×';
  closeButton.addEventListener('click', function() {
    popup.style.display = 'none';
  });

  var popupContent = document.createElement('div');
  popupContent.className = 'popup-content';
  popupContent.innerHTML = content;

  popup.appendChild(closeButton);
  popup.appendChild(popupContent);

  return popup;
}

function createResponseButtons(index) {
  var btnGroup = document.createElement('div');
  btnGroup.className = 'btn-group';

  var responses = ['Completed', 'Not Completed', 'Partially Completed'];

  responses.forEach(function(responseText) {
    var button = document.createElement('button');
    button.textContent = responseText;
    button.addEventListener('click', function() {
      selectResponse(button, index, responseText);
    });

    btnGroup.appendChild(button);
  });

  return btnGroup;
}

function selectResponse(selectedButton, index, status) {
  var buttons = selectedButton.parentNode.getElementsByTagName('button');
  Array.prototype.forEach.call(buttons, function(button) {
    button.classList.remove('selected');
  });

  selectedButton.classList.add('selected');
}

function createNavigationButtons(index) {
  var navButtons = document.createElement('div');
  navButtons.className = 'nav-buttons';

  var backButton = document.createElement('button');
  backButton.innerText = 'Back';
  backButton.disabled = (index === 0);
  backButton.addEventListener('click', function() {
    navigate(-1);
  });

  var nextButton = document.createElement('button');
  nextButton.innerText = 'Next';
  nextButton.disabled = (index === questions.length - 1);
  nextButton.addEventListener('click', function() {
    navigate(1);
  });

  navButtons.appendChild(backButton);
  navButtons.appendChild(nextButton);

  return navButtons;
}

function navigate(step) {
  currentQuestionIndex += step;
  showQuestion(currentQuestionIndex);
}

function togglePopup(popupElement) {
  popupElement.style.display = (popupElement.style.display === 'block') ? 'none' : 'block';
}
