'use strict';

addScript('/assets/js/preferences' + min + '.js', 'preferences').then(function () {
  return addStyle('/assets/css/preferences' + min + '.css', 'preferences');
}).then(function () {
  if (localStorage.getItem('contrast')) handlePrefFormChange('contrast', localStorage.getItem('contrast'));
  if (localStorage.getItem('fontsize')) handlePrefFormChange('fontsize', localStorage.getItem('fontsize'));
  if (localStorage.getItem('typeface')) {
    handlePrefFormChange('typeface', localStorage.getItem('typeface'));
    handlePrefTypefaceFormChange(localStorage.getItem('typeface'));
  }
}).then(function () {
  return new Promise(function (resolve, reject) {
    return supportsLocalStorage() && localStorage.getItem('contrast') == 'auto' ? addScript('/assets/js/preferences_contrastlisteners' + min + '.js', 'preferences_contrastlisteners').then(function () {
      return resolve();
    }) : reject();
  });
}).then(function () {
  return addLuminosityListener();
}, function (e) {
  return e;
});
