const $ = require('jquery');
const sparkService = require('./sparkService');

const avatar = {
  display: (email, imageId) => {
    sparkService.getAvatarUrl(email).then((url) => {
      $(imageId).attr('src', url);
      // Allow continued loading if there is a problem or no avatar image found
    }).catch(() => {});
  }
};

module.exports = avatar;