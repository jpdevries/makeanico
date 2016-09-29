function handleDeviceLight(e) {
    var lux = e.value;

    if(lux < 50) document.body.dataset.luminosity = 'dim';
    if(lux >= 50 && lux <= 1000) document.body.dataset.luminosity = 'normal';
    if(lux > 1000)  document.body.dataset.luminosity = 'bright';
}

function addLuminosityListener() {
    window.addEventListener('devicelight', handleDeviceLight);
    window.addEventListener('lightlevel', handleDeviceLight);
}

function removeLuminosityListener() {
    window.removeEventListener('devicelight', handleDeviceLight);
    window.removeEventListener('lightlevel', handleDeviceLight);
    document.body.removeAttribute('data-luminosity');
}
