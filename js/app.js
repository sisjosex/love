var module = ons.bootstrap();

angular.module('MyApp', []);

module.controller('NavigatorController', function($scope) {

    try {
        StatusBar.hide();
    }catch(error){}

    ons.ready(function() {
        mainnavigator.pushPage('slider.html', {animation: 'none'});
    });
});

var totalPoints = 0;
var scrollDirection = '';
var SlideController;
var sliderData = [];
var isOnline = true;
module.controller('SliderController', function($scope) {

    SlideController = $scope;

    $scope.status = '';

    ons.ready(function() {

        $scope.status = '';

        setTimeout(function(){

            if(isOnline) {

                getJsonP(API_URL + 'obtenerPantallas/', renderPantallas, function () {

                    try {
                        navigator.splashscreen.hide();
                    } catch (error) {
                    }

                }, function() {

                    loadOffine();

                }, {});

            } else {

                loadOffline();
            }

            mainSlider.on('postchange', function(event) {

                if(event.activeIndex != sliderData.pantallas.length) {

                    if (event.activeIndex > event.lastActiveIndex) {

                        totalPoints++;

                        scrollDirection = 'right';

                    } else {

                        scrollDirection = 'left';
                    }

                    SlideController.status = totalPoints;

                    SlideController.$apply();

                    console.log(scrollDirection + ' ' + totalPoints);

                } else {

                    var porcentajeCoincidencias = totalPoints/sliderData.pantallas.length;
                    var textoFinal;
                    var imagenFinal;

                    if(porcentajeCoincidencias <= 0.25) {

                        textoFinal = sliderData.config.texto_final1;
                        imagenFinal = sliderData.config.imagen_final1;

                    } else if(porcentajeCoincidencias <= 0.70){

                        textoFinal = sliderData.config.texto_final2;
                        imagenFinal = sliderData.config.imagen_final2;

                    } else {

                        textoFinal = sliderData.config.texto_final3;
                        imagenFinal = sliderData.config.imagen_final3;
                    }

                    $('#ultimoContenido').html(textoFinal);
                    $('#ultimoFondo').attr('src', imagenFinal);

                    $('#ultimoFacebook').unbind('click').on('click', function(event){

                        shareViaFacebook(sliderData.config.texto_facebook);

                    });

                    $('#ultimoFacebook').unbind('click').on('click', function(event){

                        shareViaTwitter(sliderData.config.texto_twitter1);

                    });

                    $('#ultimoFacebook').unbind('click').on('click', function(event){

                        shareViaTwitter(sliderData.config.texto_twitter2);

                    });

                    $('#ultimoFacebook').unbind('click').on('click', function(event){

                        shareViaInstagram(sliderData.config.texto_instagram);

                    });

                    $('#ultimoEmail').unbind('click').on('click', function(event){

                        contactEmail( sliderData.config.contact_email, sliderData.config.contact_subject, sliderData.config.contact_body );

                    });
                }

            });

        }, 100);

    });
});


function next() {

    mainSlider.next();
}

function prev() {

    mainSlider.prev();
}

function loadOffline() {

    getJson(window.location.href.replace('index.html', 'config.json'), renderPantallas, function () {

        try {
            navigator.splashscreen.hide();
        } catch (error) {
        }

    }, function() {


    }, {});
}

function renderPantallas(data) {

    sliderData = data;

    loadIntoTemplate('#sliderContainer', data.pantallas, 'slide');

    loadIntoTemplateSingle('#sliderContainer', data.config, 'ultimo_slide');

    ons.compile($('#sliderContainer')[0]);

    try { navigator.splashscreen.hide(); } catch(error){}
}

function onSliderIMGLoad(img, index) {

    var src = $(img).attr('src');
    var container = $(img).parent();

    var image = new Image();
    image.src = src;

    image.onload = function () {

        container.parent().find('ons-icon').remove();

        container.html('');
        container.addClass('noopaque');

        container.css('background-image', "url('" + src + "')");
        container.css('background-repeat', "no-repeat");
        container.css('background-position', "center center");

        var width = image.width;
        var height = image.height;
        var factor = 1;

        if (window.innerWidth > width) {
            factor = window.innerWidth / width;
            width = width * factor;
            height = height * factor;
        }

        if (window.innerHeight > height) {

            factor = (window.innerHeight) / height;
            width = width * factor;
            height = height * factor;
        }

        if (window.innerWidth < width) {

            factor = window.innerHeight / height;
            width = width * factor;
            height = window.innerHeight;

            if (window.innerWidth - width > 0) {
                factor = window.innerWidth / width;
                width = window.innerWidth;
                height = height * factor;
            }


        } else if (window.innerHeight < height) {

            factor = window.innerWidth / width;
            width = window.innerWidth;
            height = height * factor;

            if (window.innerHeight - height > 0) {
                factor = window.innerHeight / height;
                height = window.innerHeight;
                width = width * factor;
            }
        }

        container.css('background-size', parseInt(width) + "px" + " " + parseInt(height) + "px");

        container.addClass('opaque');
    }
}

function shareViaInstagram(txt, url) {

    Instagram.isInstalled(function (err, installed) {

        if (installed) {

            convertImgToBase64(url, function(data64){

                Instagram.share(data64, txt, function (err) {

                    if (err) {

                        showAlert("No se Pudo Compartir", "Mensaje", "Aceptar");

                    } else {

                        showAlert("Se compartió exitosamente", "Aviso", "Aceptar");
                    }
                });

            });

        } else {

            console.log("Instagram no esta instalado");
        }
    });
}

function shareViaFacebook(txt) {

    window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(txt, null /* img */, null /* url */, 'Paste it!', function() {

        console.log('share ok');

    }, function(errormsg){

        alert(errormsg);

    });
}

function shareViaTwitter(txt) {

    window.plugins.socialsharing.shareViaTwitter(txt, null /* img */);
}

function contactEmail(email, subject, body) {

    cordova.plugins.email.isAvailable(
        function (isAvailable) {

            cordova.plugins.email.open({
                to:      email,
                /*cc:      'erika@mustermann.de',
                bcc:     ['john@doe.com', 'jane@doe.com'],*/
                subject: subject,
                body:    body,
                isHtml:  true
            });
        }
    );
}

document.addEventListener("offline", onOffline, false);
document.addEventListener("online", onOnline, false);

function onOnline() {
    isOnline = true;
}

function onOffline() {
    isOnline = false;
}