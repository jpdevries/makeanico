var makeanico = require('./makeanico');

document.addEventListener('DOMContentLoaded', function() {
    var cf = new makeanico.MakeAnIco();

    var lazy = document.createElement('script');
    lazy.setAttribute('src', `assets/js/lazy${(production) ? '.min' : ''}.js`);
    document.body.appendChild(lazy);

    (function(html){
      html.classList.remove('no-js');
      html.classList.add('js');
    })(document.querySelector('html'));
});
