$('filename__text').addEventListener('input', function(e) {
  document.querySelectorAll('.filename').forEach((filename) => (
    filename.innerHTML = e.target.value ? e.target.value : 'favicon'
  ));

  document.querySelectorAll('nav.button-bar a').forEach((anchor) => (
    anchor.setAttribute('download', `${e.target.value || 'favicon'}.${anchor.getAttribute('data-format')}`)
  ));
});

document.querySelectorAll('input[name="download__as"]').forEach((downloadBtn) => {
  downloadBtn.addEventListener('change', function(e) {
    const anchors = document.querySelectorAll('nav.button-bar a'),
    extensions = document.querySelectorAll('.extension');

    anchors.forEach((anchor) => (
      (e.target.value == anchor.getAttribute('data-format')) ? anchor.removeAttribute('hidden') : anchor.setAttribute('hidden', 'true')
    ));

    extensions.forEach((extension) => (
      extension.innerHTML = e.target.value
    ));
  });
});
