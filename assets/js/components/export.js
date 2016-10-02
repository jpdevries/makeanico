'use strict';

$('dlname').outerHTML = '<div class="flexible">\n  <label for="filename__text">Filename:</label>\n  <input type="text" id="filename__text" name="filename__text" placeholder="favicon" />\n</div>';

var search = location.search;
$('jsbts').outerHTML = '<nav class="flexible unaligned button-bar">\n  <div>\n    <a hidden data-base-url="/make/favicon.ico" download="favicon.ico" class="comforatbly heavy btn" aria-label="ICO Graphic (ICO)" data-format="ico" href="/make/favicon.ico?dl=1&' + search + '" >Download <span class="filename">favicon</span>.<span class="extension">ico</span></a>\n  </div>\n  <div>\n    <a hidden data-base-url="/make/favicon.svg" download="favicon.svg" class="comforatbly heavy btn" aria-label="Scalable Vector Graphic (SVG)" data-format="svg" href="/make/favicon.svg?dl=1&' + search + '">Download <span class="filename">favicon</span>.<span class="extension">svg</span></a>\n  </div>\n  <div>\n    <a hidden data-base-url="/make/favicon.png" download="favicon.png" class="comforatbly heavy btn" aria-label="Portable Network Graphic (PNG)" data-format="png" href="/make/favicon.png?dl=1&' + search + '">Download <span class="filename">favicon</span>.<span class="extension">png</span></a>\n  </div>\n</nav>';

document.querySelector('.export .exp').outerHTML = '.<span class="extension">ico</span>';
document.querySelector('.export button[type="submit"]').remove();
document.querySelector('.export [download="favicon.' + document.querySelector('.export input[type="radio"]:checked').value + '"]').removeAttribute('hidden');

$('filename__text').addEventListener('input', function (e) {
  document.querySelectorAll('.filename').forEach(function (filename) {
    return filename.innerHTML = e.target.value ? e.target.value : 'favicon';
  });

  document.querySelectorAll('nav.button-bar a').forEach(function (anchor) {
    return anchor.setAttribute('download', (e.target.value || 'favicon') + '.' + anchor.getAttribute('data-format'));
  });
});

document.querySelectorAll('input[name="download__as"]').forEach(function (downloadBtn) {
  downloadBtn.addEventListener('change', function (e) {
    var anchors = document.querySelectorAll('nav.button-bar a'),
        extensions = document.querySelectorAll('.extension');

    anchors.forEach(function (anchor) {
      return e.target.value == anchor.getAttribute('data-format') ? anchor.removeAttribute('hidden') : anchor.setAttribute('hidden', 'true');
    });

    extensions.forEach(function (extension) {
      return extension.innerHTML = e.target.value;
    });
  });
});
