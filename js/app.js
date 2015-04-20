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
module.controller('SliderController', function($scope) {

    SlideController = $scope;

    $scope.status = '';

    ons.ready(function() {

        $scope.status = '';

        setTimeout(function(){

            mainSlider.on('postchange', function(event) {

                if(event.activeIndex > event.lastActiveIndex) {

                    totalPoints ++;

                    scrollDirection = 'right';

                } else {

                    scrollDirection = 'left';
                }

                SlideController.status = totalPoints;

                SlideController.$apply();

                console.log(scrollDirection + ' ' + totalPoints);

            });

            try { navigator.splashscreen.hide(); } catch(error){}

        }, 100);

    });
});

function next() {

    mainSlider.next();
}

function prev() {

    mainSlider.prev();
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

function sendContactEmail(to, subject, body) {

    window.plugin.email.open({
        to:      ['max.mustermann@appplant.de'],
        //cc:      [''],
        //bcc:     ['', ''],
        subject: subject,
        body: body
    });
}