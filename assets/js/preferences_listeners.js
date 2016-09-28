'use strict';

document.querySelectorAll('fieldset input[type="radio"]').forEach(function (element) {
  if (element.getAttribute('id') !== 'contrast__automatic') element.removeAttribute('disabled');
});

document.querySelectorAll('.widget form').forEach(function (form) {
  form.setAttribute('aria-labeledby', form.querySelector('legend').getAttribute('id'));

  form.addEventListener('change', function (event) {
    var el = event.target;
    handlePrefFormChange(el.getAttribute('name'), el.getAttribute('value'));
  });
});

document.querySelector('.typeface form').addEventListener('change', function (event) {
  handlePrefTypefaceFormChange(event.target.getAttribute('value'));
});

if (localStorage.getItem('contrast')) {
  var el = document.getElementById('contrast__' + localStorage.getItem('contrast'));
  el.checked = true;
  handlePrefFormChange(el.getAttribute('name'), el.getAttribute('value'));
  el.getAttribute('value') == 'auto' ? addLuminosityListener() : removeLuminosityListener();
}
if (localStorage.getItem('fontsize')) {
  var _el = document.getElementById('fontsize__' + localStorage.getItem('fontsize'));
  _el.checked = true;
  handlePrefFormChange(_el.getAttribute('name'), _el.getAttribute('value'));
}
if (localStorage.getItem('typeface')) {
  var _el2 = document.getElementById('typeface__' + localStorage.getItem('typeface'));
  _el2.checked = true;
  handlePrefFormChange(_el2.getAttribute('name'), _el2.getAttribute('value'));
  handlePrefTypefaceFormChange(_el2.getAttribute('value'));
}
if ('ondevicelight' in window) {
  document.getElementById('contrast__auto').removeAttribute('disabled');
}
