var makeanico = require('./makeanico');

document.addEventListener('DOMContentLoaded', function() {
    var cf = new makeanico.MakeAnIco();

    (function(html){
      html.classList.remove('no-js');
      html.classList.add('js');
    })(document.querySelector('html'));
});
