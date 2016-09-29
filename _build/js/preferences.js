function handlePrefFormChange(name, value = undefined) {
  if(value) {
    localStorage.setItem(name, value);
    document.body.setAttribute(`data-${name}`, value);
  } else {
    localStorage.removeItem(name);
    document.body.removeAttribute(`data-${name}`);
  }

}

function handlePrefTypefaceFormChange(typeface) {
  let sheet = false;
  switch(typeface) {
    case 'opendyslexic':
    sheet = `/assets/font/opendyslexic/opendyslexic${min}.css`;
    break;

    case 'opensans':
    sheet = `//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,700,800,600,300`;
    break;

    case 'raleway':
    sheet = `//fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600,800,900`;
    break;

    case 'ubuntu':
    sheet = `//fonts.googleapis.com/css?family=Ubuntu:300,400,500,700,300italic,400italic,500italic,700italic`;
    break;

    case 'fira':
    sheet = `/assets/font/fira/fira.css`;
    break;

    case 'anonpro':
    sheet = `//fonts.googleapis.com/css?family=Anonymous+Pro:400,400italic,700,700italic`;
    break;

    /*case 'system':
    default:
    break;*/
  }



  if(sheet) {
    try {
      document.getElementById('user-font').remove();
    } catch(e) {}

    let link = (() => {
      let l = document.createElement('link');
      l.setAttribute('href',sheet);
      l.setAttribute('rel','stylesheet');
      l.setAttribute('type','text/css');
      l.setAttribute('id','user-font');
      return l;
    })();

    document.querySelector('head').appendChild(link);
  }
}
