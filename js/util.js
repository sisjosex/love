
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
        timeout: 10000,
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

function getJson(url, callback_success, callback_error, data) {

    if(data === undefined) {
        data = {};
    }

    modal.show();

    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType: 'JSONp',
        timeout: 10000,
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
        timeout: 10000,
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
