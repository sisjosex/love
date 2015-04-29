var module = ons.bootstrap();

angular.module('MyApp', []);

module.controller('NavigatorController', function($scope) {

    ons.ready(function() {

        mainnavigator.pushPage('slider.html', {animation: 'none'});
    });
});

var totalPoints = 0;
var scrollDirection = '';
var SlideController;
var sliderData = [];
var isOnline = true;
var aspa_seleccionado = false;
var lastActiveIndex = 0;
module.controller('SliderController', function($scope) {

    SlideController = $scope;

    ons.ready(function() {

        $scope.status = '';

        setTimeout(function(){

            if(isOnline) {

                getJsonP(API_URL + 'obtenerPantallas/', renderPantallas, function () {

                    loadOffine();

                }, function() {

                    loadOffine();

                }, {});

            } else {

                loadOffline();
            }

            mainSlider.on('postchange', function(event) {

                verificarPuntos();

                paginar(mainSlider.getActiveCarouselItemIndex());

            });

        }, 100);

    });
});

var votos = {};
function verificarPuntos() {

    totalPoints = 0;
    for(var i in votos) {
        if(votos[i] === true ) {
            totalPoints ++;
        }
    }

    if( mainSlider.getActiveCarouselItemIndex() == (sliderData.pantallas.length + 1) ) {

        var porcentajeCoincidencias = totalPoints / sliderData.pantallas.length;
        var textoFinal;
        var imagenFinal;

        var img_number = 0;

        if (porcentajeCoincidencias <= 0.30) {

            textoFinal = sliderData.config.texto_final1;
            imagenFinal = sliderData.config.imagen_final1;
            img_number = 1;

        } else if (porcentajeCoincidencias <= 0.80) {

            textoFinal = sliderData.config.texto_final2;
            imagenFinal = sliderData.config.imagen_final2;
            img_number = 2;

        } else {

            textoFinal = sliderData.config.texto_final3;
            imagenFinal = sliderData.config.imagen_final3;
            img_number = 3;
        }

        //imagenFinal = imagenFinal + '?rand=' + Math.random()*1000;

        $('.ultima-pantalla').find('ons-icon').show();

        textoFinal = textoFinal.replaceAll('{{likes}}', totalPoints).replaceAll('%likes%', totalPoints);

        if (img_finales['imagen_final' + img_number] != false) {

            $('#ultimoFondo').parent().parent().find('.ons-icon').hide();

            $('#ultimoFondo').attr('src', imagenFinal);
            $('#ultimoFondo').parent().css('background-image', imagenFinal);
            $('#ultimoFondo').parent().addClass('opaque');

        } else {

            $('#ultimoFondo').parent().parent().find('.ons-icon').show();

            $('#ultimoFondo').attr('src', imagenFinal);
            $('#ultimoFondo').parent().css('background-image', 'none');
        }

        $('#ultimoContenido').html(textoFinal);


        $('#ultimoFacebook').unbind('click').on('click', function (event) {

            shareViaFacebook(sliderData.config.texto_facebook, true);

        });

        /*$('#ultimoTwitter1').unbind('click').on('click', function (event) {

            shareViaTwitter(sliderData.config.texto_twitter1, 1, true);

        });*/

        $('#ultimoTwitter2').unbind('click').on('click', function (event) {

            shareViaTwitter(sliderData.config.texto_twitter2, 2, true);

        });

        $('#ultimoInstagram').unbind('click').on('click', function (event) {

            shareViaInstagram(sliderData.config.texto_instagram, true);

        });

        $('#ultimoWhatsapp').unbind('click').on('click', function (event) {

            shareViaWhatsApp(sliderData.config.texto_whatsapp, true);

        });
    }

    lastActiveIndex = mainSlider.getActiveCarouselItemIndex();
}

function paginar(index) {

    if( index > 0 && index <= sliderData.pantallas.length ) {

        $('#paginator .paginator-item').removeClass('selected');
        $('#paginator .paginator-item:nth-child(' + index + ')').addClass('selected');

        $('#paginator').removeClass('transparent');

    } else {

        $('#paginator').addClass('transparent');
    }
}


function votoCorazon() {

    mainSlider.next();

    paginar( mainSlider.getActiveCarouselItemIndex() );

    votos[ mainSlider.getActiveCarouselItemIndex() ] = true;

    aspa_seleccionado = false;

    verificarPuntos();

    lastActiveIndex = mainSlider.getActiveCarouselItemIndex();
}

function votoAspa() {

    aspa_seleccionado = true;

    mainSlider.next();

    paginar( mainSlider.getActiveCarouselItemIndex() );

    votos[ mainSlider.getActiveCarouselItemIndex() ] = false;

    verificarPuntos();

    lastActiveIndex = mainSlider.getActiveCarouselItemIndex();
}

function loadOffine() {

    isOnline = false;
    
    renderPantallas(offlineData, true);

    //showAlert('Para poder compartir es necesario conectarse a internet', 'Mensaje', 'Aceptar');
}

var img_finales = {
    imagen_final1: false,
    imagen_final2: false,
    imagen_final3: false
};
function renderPantallas(data, is_offline) {

    try { StatusBar.hide(); }catch(error){}

    setTimeout(function(){


        sliderData = data;

        loadIntoTemplateSingle('#sliderContainer', sliderData.config, 'primer_slide');

        loadIntoTemplate('#sliderContainer', sliderData.pantallas, 'slide');

        loadIntoTemplateSingle('#sliderContainer', sliderData.config, 'ultimo_slide');


        loadIntoTemplateSingle('#sliderContainer', sliderData.config, 'paginator_container');

        loadIntoTemplate('#paginator', sliderData.pantallas, 'paginator_item');

        $('.img-restricted').each(function(){
            $(this).css('width', window.innerWidth + 'px');
            $(this).css('height', window.innerHeight + 'px');
        });

        $('.email-send').unbind('click').each(function() {

            $(this).on('click', function (event) {

                contactEmail(sliderData.config.contact_email, sliderData.config.contact_subject, sliderData.config.contact_body);

            });
        });

        ons.compile($('#sliderContainer')[0]);

        var initialPageIndex = 1;

        mainSlider.setActiveCarouselItemIndex(initialPageIndex);

        paginar(initialPageIndex);


        var img1 = new Image();
        img1.onload = function() {

            img_finales.imagen_final1 = this;
        };
        img1.src = sliderData.config.imagen_final1;


        var img2 = new Image();
        img2.onload = function() {

            img_finales.imagen_final2 = this;
        };
        img2.src = sliderData.config.imagen_final2;


        var img3 = new Image();
        img3.onload = function() {

            img_finales.imagen_final3 = this;
        };
        img3.src = sliderData.config.imagen_final3;


        setInterval(function(){

            paginar( mainSlider.getActiveCarouselItemIndex() );

        }, 300);

        if(is_offline == true) {
            //$('.redes').hide();
        }


        try { navigator.splashscreen.hide(); } catch(error){}


    }, 500);

    verifyNotification();
    registerNotifications();
}

function onSliderIMGLoadSimple(img, index) {

    var src = $(img).attr('src');
    var container = $(img).parent();

    var image = new Image();
    image.src = src;

    image.onload = function () {

        container.parent().find('ons-icon').hide();

        container.addClass('noopaque');

        container.addClass('opaque');
    }
}

function onSliderIMGLoad(image, index) {

    var src = $(image).attr('src');
    var container = $(image).parent();

    //var image = new Image();
    //image.src = src;

    //image.onload = function () {

        container.parent().find('ons-icon').hide();

        //container.html('');
        container.addClass('noopaque');
        container.removeClass('opaque');

        container.css('background-image', "url('" + src + "')");
        container.css('background-repeat', "no-repeat");
        container.css('background-position', "0 0");

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

        //container.css('background-size', parseInt(width) + "px" + " " + parseInt(height) + "px");
        container.css('background-size', "100% 100%");

        container.addClass('opaque');
    //}
}

function shareViaInstagram(txt, is_last) {

    if(!isOnline) {
        showAlert('Para compartir en redes sociales, es necesario conectarse a internet.', 'Error', 'Aceptar');
        return;
    }

    if(!is_last || is_last== undefined) {

        txt = sliderData.pantallas[txt].texto_instagram;
    }

    Instagram.isInstalled(function (err, installed) {

        if (installed) {

            navigator.screenshot.save(function(error,res) {
                if (error) {

                    showAlert('Para compartir en redes sociales, es necesario conectarse a internet.', 'Error', 'Aceptar');

                } else {

                    //For android
                    imageLink = res.filePath;

                    convertImgToBase64('file://'+imageLink, function(data64){

                        Instagram.share(data64, txt, function (err) {

                            if (err) {

                                //showAlert("No se Pudo Compartir", "Mensaje", "Aceptar");

                            } else {

                                //showAlert("Se compartió exitosamente", "Aviso", "Aceptar");
                            }
                        });

                    });
                }
            });

            /*convertImgToBase64(url, function(data64){

                Instagram.share(data64, txt, function (err) {

                    if (err) {

                        showAlert("No se Pudo Compartir", "Mensaje", "Aceptar");

                    } else {

                        showAlert("Se compartió exitosamente", "Aviso", "Aceptar");
                    }
                });

            });*/

        } else {

            showAlert("Instagram no esta instalado", 'Error', 'Aceptar');
        }
    });
}

function shareViaFacebook(txt, is_last) {

    if(!isOnline) {
        showAlert('Para compartir en redes sociales, es necesario conectarse a internet.', 'Error', 'Aceptar');
        return;
    }

    if(!is_last || is_last== undefined) {

        txt = sliderData.pantallas[txt].texto_facebook;
    }

    navigator.screenshot.save(function(error,res) {

        if (error) {

            showAlert('Para compartir en redes sociales, es necesario conectarse a internet.', 'Error', 'Aceptar');

        } else {

            //For android
            imageLink = res.filePath;

            window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(txt, 'file://'+imageLink, null /* url */, 'Mitica Love', function() {

            }, function(errormsg){

                //alert(errormsg);

            });
        }
    });
}

function shareViaTwitter(txt, number, is_last) {

    if(!isOnline) {
        showAlert('Para compartir en redes sociales, es necesario conectarse a internet.', 'Error', 'Aceptar');
        return;
    }

    if(is_last == false || is_last== undefined) {

        txt = sliderData.pantallas[txt]['texto_twitter' + number];
    }

    navigator.screenshot.save(function(error,res) {
        if (error) {

            showAlert('Para compartir en redes sociales, es necesario conectarse a internet.', 'Error', 'Aceptar');

        } else {

            //For android
            imageLink = res.filePath;

            window.plugins.socialsharing.shareViaTwitter(txt, 'file://'+imageLink /* img */);
        }
    });
}

function shareViaWhatsApp(txt, is_last) {

    if(!isOnline) {
        showAlert('Para compartir en redes sociales, es necesario conectarse a internet.', 'Error', 'Aceptar');
        return;
    }

    if(!is_last || is_last== undefined) {

        txt = sliderData.pantallas[txt].texto_whatsapp;
    }

    navigator.screenshot.save(function(error,res) {
        if (error) {

            showAlert('Para compartir en redes sociales, es necesario conectarse a internet.', 'Error', 'Aceptar');

        } else {

            //For android
            imageLink = res.filePath;

            window.plugins.socialsharing.shareViaWhatsApp(txt, 'file://'+imageLink /* img */);
        }
    });
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

    //$('.redes').show();
}

function onOffline() {

    isOnline = false;

    //$('.redes').hide();
}

function openWeb() {

    if(!isOnline) {
        showAlert('Para ir a la página web es necesario conectarse a internet.', 'Error', 'Aceptar');
        return;
    }

    window.open(sliderData.config.web_url, '_blank', 'location=yes,closebuttoncaption=Cerrar');
}