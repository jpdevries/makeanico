document.querySelectorAll('.widget input').forEach((element) => {
  if(element.getAttribute('id') !== 'contrast__automatic') element.removeAttribute('disabled');
});

[document.getElementById('fontsize__regular'), document.getElementById('typeface__system'), document.getElementById('contrast__normal')].forEach((element) => (
  element.addEventListener('change',(event) => (
    localStorage.removeItem(element.getAttribute('name'))
  ))
))

document.querySelectorAll('.widget form').forEach((form) => {
  /*try {
    form.setAttribute('aria-labeledby', form.querySelector('legend').getAttribute('id'));
  } catch (e) { }*/

  form.addEventListener('change', function(event) {
    let el = event.target;
    handlePrefFormChange(el.getAttribute('name'), (el.checked) ?  el.getAttribute('value') : undefined);
  });
});

document.querySelector('.typeface form').addEventListener('change', function(event) {
  handlePrefTypefaceFormChange(event.target.getAttribute('value'));
});

document.querySelector('.contrast form').addEventListener('change', function(event) {
  (event.target.getAttribute('value') == 'auto') ? addLuminosityListener() : removeLuminosityListener();
});

if(localStorage.getItem('contrast')) {
  let el = document.getElementById(`contrast__${localStorage.getItem('contrast')}`);
  el.checked = true;
  handlePrefFormChange(el.getAttribute('name'), el.getAttribute('value'));
  (el.getAttribute('value') == 'auto') ? addLuminosityListener() : removeLuminosityListener();
}
if(localStorage.getItem('fontsize')) {
  let el = document.getElementById(`fontsize__${localStorage.getItem('fontsize')}`);
  el.checked = true;
  handlePrefFormChange(el.getAttribute('name'), el.getAttribute('value'));
}
if(localStorage.getItem('typeface')) {
  let el = document.getElementById(`typeface__${localStorage.getItem('typeface')}`);
  el.checked = true;
  handlePrefFormChange(el.getAttribute('name'), el.getAttribute('value'));
  handlePrefTypefaceFormChange(el.getAttribute('value'));
}
if(localStorage.getItem('focus')) {
  let el = document.getElementById('visibility__focus');
  el.checked = true;
  handlePrefFormChange(el.getAttribute('name'), el.getAttribute('value'));
}
if(localStorage.getItem('reducemotion')) {
  let el = document.getElementById('reducemotion');
  el.checked = true;
  handlePrefFormChange(el.getAttribute('name'), el.getAttribute('value'));
}
if('ondevicelight' in window) document.getElementById('contrast__auto').removeAttribute('disabled');
