addScript(`/assets/js/preferences${min}.js`, 'preferences').then(() => {
  return addStyle(`/assets/css/preferences${min}.css`, 'preferences')
}).then(() => {
  if(localStorage.getItem('contrast')) handlePrefFormChange('contrast', localStorage.getItem('contrast'));
  if(localStorage.getItem('fontsize')) handlePrefFormChange('fontsize', localStorage.getItem('fontsize'));
  if(localStorage.getItem('typeface')) {
    handlePrefFormChange('typeface', localStorage.getItem('typeface'));
    handlePrefTypefaceFormChange(localStorage.getItem('typeface'));
  }
  if(localStorage.getItem('focus')) handlePrefFormChange('focus', localStorage.getItem('focus'));
  if(localStorage.getItem('reducemotion')) handlePrefFormChange('reducemotion', localStorage.getItem('reducemotion'));
}).then(() => (
  new Promise((resolve, reject) => (
    (supportsLocalStorage() && localStorage.getItem('contrast') == 'auto') ? addScript(`/assets/js/preferences_contrastlisteners${min}.js`, 'preferences_contrastlisteners').then(() => (resolve())) : reject()
  ))
)).then(() => (
  addLuminosityListener()
),(e) => (e));
