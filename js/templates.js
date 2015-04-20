var templates = {
    slider: '<ons-carousel-item class="item-bg loading">'+
    '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
    '<div class="full-screen animate"><img onload="onSliderIMGLoad(this, %index%);" src="%image%" /></div>'+
    '<div class="title">%title%</div>'+
    '</ons-carousel-item>'
};

function loadIntoTemplate(div, data, template, labels, height) {

    var container = $(div);
    var content = '', cal = '', str = '';

    for(var i in data) {

        cal = data[i];
        var str = templates[template].replaceAll('%index%', i);

        for(var j in cal) {

            if(j != 'items') {
                str = str.replaceAll('%' + j + '%', cal[j]);
            }
        }

        if(labels != undefined) {

            for(var j in labels) {

                str = str.replaceAll('{' + j + '}', labels[j]);
            }
        }

        if(data[i].images && data[i].images.length > 0) {

            if(height !== undefined) {

                str = str.replaceAll('%first_image%', thumb_url.replaceAll('%width%', $(window).width()).replaceAll('%height%', height) + data[i].images[0]);

            } else {

                str = str.replaceAll('%first_image%', data[i].images[0]);
            }
        }

        if(data[i].items && data[i].items.length > 0) {

            tmp = loadIntoTemplateReturn(data[i].items, 'list_single', labels);

            str = str.replaceAll('%items%', tmp);
        }

        content = content + " " + str;

        delete str;
    }

    if(content !== '') {

        content = $(content);

        container.html('');

        container.append(content);

        try {
            ons.compile(content[0]);

        } catch (error){}
    }
}

function loadIntoTemplateReturn(data, template, labels) {

    var content = '', cal = '', str = '';

    for(var i in data) {

        cal = data[i];
        var str = templates[template].replaceAll('%index%', i);

        for(var j in cal) {

            str = str.replaceAll('%' + j + '%', cal[j]);
        }

        if(labels != undefined) {

            for(var j in labels) {

                str = str.replaceAll('{' + j + '}', labels[j]);
            }
        }

        if(data[i].images && data[i].images.length > 0) {

            if(height !== undefined) {

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
    var content = '', cal = '', str = '';


    cal = data[i];
    var str = templates[template].replaceAll('%index%', i);

    if(data != undefined) {
        for (var j in data) {

            str = str.replaceAll('%' + j + '%', data[j]);
        }
    }

    if(labels != undefined) {

        for(var j in labels) {

            str = str.replaceAll('{' + j + '}', labels[j]);
        }
    }

    content = content + " " + str;

    delete str;


    if(content !== '') {

        content = $(content);

        container.html('');

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

function convertImgToBase64(url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image;
    //img.crossOrigin = 'Anonymous';
    img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);

        var filename = url.split("/")[url.split("/").length - 1];

        var dataURL = canvas.toDataURL(outputFormat || 'image/' + filename.split('.')[filename.split('.').length - 1]);
        callback.call(this, dataURL, img, url);
        // Clean up
        canvas = null;
    };
    img.src = url;
}

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    //window.cookie = name+"="+value+expires+";path=/";

    localStorage.setItem(name, value);
    if(days == -1) {
        localStorage.removeItem(name);
    }
}

function readCookie(name) {
    return localStorage.getItem(name);
}

function reWriteCookie(name,attr,value) {

    //var cookie_name = readCookie(name);
    var cookie_name = localStorage.getItem(name);

    var parseData = $.parseJSON(cookie_name);
    parseData[attr] = value;
    var stringify = JSON.stringify(parseData)

    //window.cookie = name+"="+stringify;

    localStorage.setItem(name, stringify);
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

function showAlert(message, title, buttom, callback) {
    try {

        navigator.notification.alert(
            message,  // message
            callback,         // callback
            title,            // title
            buttom                  // buttonName
        );

    } catch(error) {

        alert(message, title, buttom, callback);
    }
}

function getJsonP(url, callback_success, callback_error, data) {

    if(data === undefined) {
        data = {};
    }

    modal.show();

    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType: 'JSONp',
        timeout: 30000,
        async:true,
        success: function(data) {

            modal.hide();

            callback_success(data);
        },
        error: function(data) {

            modal.hide();

            callback_error(data);
        }
    });
}


function getJsonPBackground(url, callback_success, callback_error, data) {

    if(data === undefined) {
        data = {};
    }

    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType: 'JSONp',
        timeout: 30000,
        async:true,
        success: function(data) {

            modal.hide();

            callback_success(data);
        },
        error: function(data) {

            modal.hide();

            callback_error(data);
        }
    });
}