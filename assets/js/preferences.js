'use strict';

function handlePrefFormChange(name, value) {
  localStorage.setItem(name, value);
  document.body.setAttribute('data-' + name, value);
}

function handlePrefTypefaceFormChange(typeface) {
  var sheet = false;
  switch (typeface) {
    case 'opendyslexic':
      sheet = 'assets/font/opendyslexic/opendyslexic' + min + '.css';
      break;

    case 'opensans':
      sheet = '//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,700,800,600,300';
      break;

    case 'raleway':
      sheet = '//fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600,800,900';
      break;

    case 'ubuntu':
      sheet = '//fonts.googleapis.com/css?family=Ubuntu:300,400,500,700,300italic,400italic,500italic,700italic';
      break;

    case 'fira':
      sheet = '/assets/font/fira/fira.css';
      break;

    case 'anonpro':
      sheet = '//fonts.googleapis.com/css?family=Anonymous+Pro:400,400italic,700,700italic';
      break;

    /*case 'system':
    default:
    break;*/
  }

  try {
    document.getElementById('user-font').remove();
  } catch (e) {}

  if (sheet) {
    document.querySelector('head').innerHTML += '<link href="' + sheet + '" rel="stylesheet" type="text/css" id="user-font">';
  }
}
