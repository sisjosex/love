var templates = {
    slide: '' +
    '<ons-carousel-item class="item-bg loading">' +
    '<div class="slide-content">' +
    '<div class="slide-border">' +
    '<div class="title"><img src="%logo%" /></div>' +
    '<div class="img-slide"><div class="auto animate"><img src="%imagen%" onload="onSliderIMGLoadSimple(this, 0);" /></div><ons-icon icon="fa-spinner" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon></div>' +
    '<div class="navigation">' +
    '<div class="button nobutton" onclick="prev()"><img src="img/app/cruz.png"></div>' +
    '<div class="button nobutton" onclick="next()"><img src="img/app/corazon.png"></div>' +
    '</div>' +
    '<div class="redes">' +
    '<div class="button nobutton" onclick="shareViaFacebook(\'%texto_facebook%\')"><img src="img/app/facebook.png"></div>' +
    '<div class="button nobutton" onclick="shareViaTwitter(\'%texto_twitter1%\')"><img src="img/app/twitter.png"></div>' +
    '<div class="button nobutton" onclick="shareViaTwitter(\'%texto_twitter2%\')"><img src="img/app/twitter.png"></div>' +
    '<div class="button nobutton" onclick="shareViaInstagram(\'%texto_instagram%\')"><img src="img/app/instagram.png"></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</ons-carousel-item>',

    ultimo_slide: '<ons-carousel-item class="item-bg loading">' +
    '<ons-icon icon="fa-spinner" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>' +
    '<div class="full-screen animate"><img id="ultimoFondo" onload="onSliderIMGLoad(this, 0);" src="" /></div>' +
    '<div class="slide-content">' +
    '<div class="slide-border">' +
    '<div class="title" style="height:50px;"></div>' +
    '<div class="" style="margin-top: 34%;">' +
    '<div id="ultimoContenido"></div>' +
    '<div class="email-section"><div class="button nobutton" id="ultimoEmail"><img src="img/app/email.png"></div></div>' +
    '</div>' +
    '<div class="redes animate-all">' +
    '<div class="button nobutton" id="ultimoFacebook"><img src="img/app/facebook.png"></div>' +
    '<div class="button nobutton" id="ultimoTwitter1"><img src="img/app/twitter.png"></div>' +
    '<div class="button nobutton" id="ultimoTwitter2"><img src="img/app/twitter.png"></div>' +
    '<div class="button nobutton" id="ultimoInstagram"><img src="img/app/instagram.png"></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</ons-carousel-item>'
};

function loadIntoTemplate(div, data, template, labels, height) {

    var container = $(div);
    var content = '', cal = '', str = '';

    for (var i in data) {

        cal = data[i];
        var str = templates[template].replaceAll('%index%', i);

        for (var j in cal) {

            if (j != 'items') {
                str = str.replaceAll('%' + j + '%', cal[j]);
            }
        }

        if (labels != undefined) {

            for (var j in labels) {

                str = str.replaceAll('{' + j + '}', labels[j]);
            }
        }

        if (data[i].images && data[i].images.length > 0) {

            if (height !== undefined) {

                str = str.replaceAll('%first_image%', thumb_url.replaceAll('%width%', $(window).width()).replaceAll('%height%', height) + data[i].images[0]);

            } else {

                str = str.replaceAll('%first_image%', data[i].images[0]);
            }
        }

        if (data[i].items && data[i].items.length > 0) {

            tmp = loadIntoTemplateReturn(data[i].items, 'list_single', labels);

            str = str.replaceAll('%items%', tmp);
        }

        content = content + " " + str;

        delete str;
    }

    if (content !== '') {

        content = $(content);

        container.html('');

        container.append(content);

        try {
            ons.compile(content[0]);

        } catch (error) {
        }
    }
}

function loadIntoTemplateReturn(data, template, labels) {

    var content = '', cal = '', str = '';

    for (var i in data) {

        cal = data[i];
        var str = templates[template].replaceAll('%index%', i);

        for (var j in cal) {

            str = str.replaceAll('%' + j + '%', cal[j]);
        }

        if (labels != undefined) {

            for (var j in labels) {

                str = str.replaceAll('{' + j + '}', labels[j]);
            }
        }

        if (data[i].images && data[i].images.length > 0) {

            if (height !== undefined) {

                str = str.replaceAll('%first_image%', thumb_url.replaceAll('%width%', $(window).width()).replaceAll('%height%', height) + data[i].images[0]);

            } else {

                str = str.replaceAll('%first_image%', data[i].images[0]);
            }
        }

        content = content + " " + str;

        delete str;
    }

    return content;
}

function loadIntoTemplateSingle(div, data, template, labels) {

    var container = $(div);
    var content = '', str = '';

    var str = templates[template];

    if (data != undefined) {
        for (var j in data) {

            str = str.replaceAll('%' + j + '%', data[j]);
        }
    }

    if (labels != undefined) {

        for (var j in labels) {

            str = str.replaceAll('{' + j + '}', labels[j]);
        }
    }

    content = content + " " + str;

    delete str;


    if (content !== '') {

        content = $(content);

        //container.html('');

        container.append(content);

        ons.compile(content[0]);
    }
}

String.prototype.replaceAll = function (t, r) {
    o = this;
    c = true;
    if (c == 1) {
        cs = "g"
    } else {
        cs = "gi"
    }
    var mp = new RegExp(t, cs);
    ns = o.replace(mp, r);
    return ns;
}
