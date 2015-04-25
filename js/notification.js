var TOKEN_PUSH_NOTIFICATION = 0;

try {
    TOKEN_PUSH_NOTIFICATION = (localStorage.getItem("push_token") !== null || localStorage.getItem("push_token") !== undefined) ? JSON.parse(localStorage.getItem("push_token")) : 0;;
} catch(error) {
    TOKEN_PUSH_NOTIFICATION = 0;
}

if( TOKEN_PUSH_NOTIFICATION == '' || TOKEN_PUSH_NOTIFICATION == undefined || TOKEN_PUSH_NOTIFICATION == 'undefined' ){
    TOKEN_PUSH_NOTIFICATION = 0;
}

var DEVICE_UUID = (localStorage.getItem("uuid") !== null || localStorage.getItem("uuid") !== undefined) ? JSON.parse(localStorage.getItem("uuid")) : 0;
var HAVE_NOTIFICATION = false;
var TYPE_NOTIFICATION = '';
var EVENT;


function registerNotifications() {

    console.log('registerNotifications');

    if(window.plugins && window.plugins.pushNotification) {

        var pushNotification = window.plugins.pushNotification;

        if (device.platform === 'android' || device.platform === 'Android') {

            pushNotification.register(successHandler, this.errorHandler, {
                "senderID": "51393321226",
                "ecb": "onNotificationGCM"
            });

        } else {

            pushNotification.register(tokenHandler, this.errorHandler, {
                "badge": "true",
                "sound": "true",
                "alert": "true",
                "ecb": "onNotificationAPN"
            });
        }
    }

    //loadOfflineData();
}

function successHandler() {}

// android
function tokenHandler(result) {
    storeToken(device.uuid, result, 'iphone');
}

function onNotificationGCM(e) {
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                //if(TOKEN_PUSH_NOTIFICATION === 0){
                storeToken(device.uuid, e.regid, 'android');
                //}
            }
            break;

        case 'message':
            // this is the actual push notification. its format depends on the data model from the push server
            //alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            if(TOKEN_PUSH_NOTIFICATION !== 0){
                showNotification(e,'android');
            }else{
                HAVE_NOTIFICATION = true;
                TYPE_NOTIFICATION = 'android';
                EVENT = e;
            }
            break;

        case 'error':
            alert('GCM error = '+e.msg);
            break;

        default:
            alert('An unknown GCM event has occurred');
            break;
    }
}

function onNotificationAPN(event) {
    if (event.alert) {
        if(TOKEN_PUSH_NOTIFICATION !== 0){
            showNotification(event,'ios');
        }else{
            HAVE_NOTIFICATION = true;
            TYPE_NOTIFICATION = 'ios';
            EVENT = event;
        }
    }
}

function showNotification(event, type){
    var message     = type === "android" ? event.message : event.alert;
    var seccion     = type === "android" ? event.payload.seccion : event.seccion;
    var seccion_id  = type === "android" ? event.payload.seccion_id : event.seccion_id;
    var date        = type === "android" ? event.payload.date : event.date;

    currentDate = date;

    try {
        navigator.notification.alert(
            message,
            function () {
                redirectToPage(seccion, seccion_id);
            },
            getLabel("alert"),
            getLabel("accept")
        );
    } catch(error) {
        redirectToPage(seccion, seccion_id);
    }
}

function errorHandler() {}


function storeToken(uuid, token, device) {

    TOKEN_PUSH_NOTIFICATION = token;
    DEVICE_UUID = uuid;

    localStorage.setItem("push_token", TOKEN_PUSH_NOTIFICATION);
    localStorage.setItem("uuid", DEVICE_UUID);


    getJsonPBackground(API_URL + 'updateUUID/', function(){}, function(){}, {
        token: TOKEN_PUSH_NOTIFICATION,
        uuid: uuid,
        device: device
    });

}

function verifyNotification() {
    //si tiene una notificacion pendiente la mostramos
    if(HAVE_NOTIFICATION){
        setTimeout(function(){
            showNotification(EVENT, TYPE_NOTIFICATION);
        },800);
        HAVE_NOTIFICATION = false;
    }
}