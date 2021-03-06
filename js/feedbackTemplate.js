const $ = require('jquery');
let currentCall = null;

const feedbackTemplate = {
  displayFeedbackButton: (call) => {
    $('#feedback-button').removeClass('hidden');
    $('#feedback-button').off('click');
    $('#feedback-button').on('click', (event) => {
      event.preventDefault();
      displayFeedbackOverlay(call);
    });
    removeOverlay();
  }
};

function displayFeedbackOverlay(call) {
  currentCall = call;
  $('#main-content').append($('#feedback-template').html().trim());
  prepareEventListeners();
  $('#feedback-button').addClass('hidden');
}

function prepareEventListeners() {
  $('#submit-feedback').on('click', submitUserFeedback);
  $('#cancel').on('click', removeOverlay);
}

function submitUserFeedback() {
  if($('#feedback-comments').val() === '' && $('input[name=rating]:checked').length === 0) return;
  let feedback = {
    userRating: $('input[name=rating]:checked').val(),
    userComments: $('#feedback-comments').val(),
    includeLogs: $('input[name=include-logs]:checked').val() === 'true' ? true : false
  };

  currentCall.sendFeedback(feedback);
  removeOverlay();
}

function removeOverlay() {
  currentCall = null;
  $('#user-feedback-overlay').remove();
  $('#feedback-button').removeClass('hidden');
}

module.exports = feedbackTemplate;
