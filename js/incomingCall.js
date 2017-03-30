const $ = require('jquery');
const sparkService = require('./sparkService');
const mediaValidator = require('./mediaValidator');
const avatar = require('./avatar');
const activeCall = require('./activeCall');

let currentCall = null;

const incomingCall = {
  display: (call) => {
    if(currentCall && currentCall.status !== 'disconnected') {
      call.reject();
      return;
    } else if(currentCall) {
      clearIncomingCall();
    }

    currentCall = call;

    const email = currentCall.from.person.email;

    $('#main-content').append($('#incoming-call-template').html().trim());

    $('#caller-email').html(email);
    avatar.display(email, '#caller-image');
    mediaValidator.validateAudio().then(mediaValidator.validateVideo);

    currentCall.on('disconnected error', incomingCallFailure);

    $('#answer-audio-video').on('click', () => {
      answerCall();
    });

    $('#answer-audio-only').on('click', () => {
      answerCall({ video: false });
    });

    $('#reject').on('click', () => {
      if (currentCall.status !== 'disconnected') {
        currentCall.reject();
      }
      clearIncomingCall();
    });
  }
};

function answerCall(constraints) {
  sparkService.answerCall(currentCall, constraints).then(() => activeCall.display(currentCall));
  currentCall.off('disconnected error', incomingCallFailure);
  clearIncomingCall();
}

function clearIncomingCall() {
  $('#incoming-call-overlay').remove();
  currentCall = null;
}

function incomingCallFailure(error) {
  let message = error ? 'Call Failed' : 'Call Cancelled';
  $('#incoming-call-status').html(message).css('display', 'inline');
  $('#answer-audio-video').css('display', 'none');
  $('#answer-audio-only').css('display', 'none');
  $('#reject').removeClass('red').addClass('wide').text('Home');
  $('.avatar-image').addClass('failed');
  $('#incoming-call-overlay h1').css('display', 'none');
}

module.exports = incomingCall;
