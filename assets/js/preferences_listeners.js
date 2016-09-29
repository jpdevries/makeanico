'use strict';

document.querySelectorAll('.widget input').forEach(function (element) {
  if (element.getAttribute('id') !== 'contrast__automatic') element.removeAttribute('disabled');
});

[document.getElementById('fontsize__regular'), document.getElementById('typeface__system'), document.getElementById('contrast__normal')].forEach(function (element) {
  return element.addEventListener('change', function (event) {
    return localStorage.removeItem(element.getAttribute('name'));
  });
});

document.querySelectorAll('.widget form').forEach(function (form) {
  /*try {
    form.setAttribute('aria-labeledby', form.querySelector('legend').getAttribute('id'));
  } catch (e) { }*/

  form.addEventListener('change', function (event) {
    var el = event.target;
    handlePrefFormChange(el.getAttribute('name'), el.checked ? el.getAttribute('value') : undefined);
  });
});

document.querySelector('.typeface form').addEventListener('change', function (event) {
  handlePrefTypefaceFormChange(event.target.getAttribute('value'));
});

document.querySelector('.contrast form').addEventListener('change', function (event) {
  event.target.getAttribute('value') == 'auto' ? addLuminosityListener() : removeLuminosityListener();
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
if (localStorage.getItem('focus')) {
  var _el3 = document.getElementById('visibility__focus');
  _el3.checked = true;
  handlePrefFormChange(_el3.getAttribute('name'), _el3.getAttribute('value'));
}
if (localStorage.getItem('reducemotion')) {
  var _el4 = document.getElementById('reducemotion');
  _el4.checked = true;
  handlePrefFormChange(_el4.getAttribute('name'), _el4.getAttribute('value'));
}
if ('ondevicelight' in window) document.getElementById('contrast__auto').removeAttribute('disabled');
