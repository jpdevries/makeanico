document.querySelectorAll('fieldset input[type="radio"]').forEach((element) => {
  if(element.getAttribute('id') !== 'contrast__automatic') element.removeAttribute('disabled');
});

document.querySelectorAll('.widget form').forEach((form) => {
  form.setAttribute('aria-labeledby', form.querySelector('legend').getAttribute('id'));

  form.addEventListener('change', function(event) {
    let el = event.target;
    handlePrefFormChange(el.getAttribute('name'), el.getAttribute('value'));
  });
});

document.querySelector('.typeface form').addEventListener('change', function(event) {
  handlePrefTypefaceFormChange(event.target.getAttribute('value'));
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
if('ondevicelight' in window) {
  document.getElementById('contrast__auto').removeAttribute('disabled');
}
