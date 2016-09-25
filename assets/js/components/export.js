'use strict';

document.getElementById('filename__text').addEventListener('input', function (e) {
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
