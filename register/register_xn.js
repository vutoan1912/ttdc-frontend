function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function iOSversion() {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
        // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    }
}

function getAndroidVersion(ua) {
    ua = (ua || navigator.userAgent).toLowerCase();
    var match = ua.match(/android\s([0-9\.]*)/);
    return match ? match[1] : false;
};

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var code = getParameterByName('code');
var api_url = "";
if(code == null) {code = "DC"; api_url = "fakeMoWap";} else {api_url = "fakeMoAds";}

//console.log(document.referrer);

var href = "";
var response = JSON.parse(httpGet('http://mbox.mobifone.vn/doanchu/api.php').toLowerCase());
var data = response.data;

// if(data.msisdn != null)
//     alert('Xin chào ' + data.msisdn);
// else
//     alert('Xin chào!');

if(data.msisdn !== undefined && data.msisdn != null){
    if(iOSversion() !== undefined){
        var ios = iOSversion();
        if(ios[0]>=8){
            href = "sms:9637&body=XN";
			document.getElementById("sms_link").setAttribute('href', href);
        }else{
            href = "sms:9637;body=XN";
			document.getElementById("sms_link").setAttribute('href', href);
        }
    }else if(getAndroidVersion(data["user-agent"])){
        href = "sms:9637?body=XN";
		document.getElementById("sms_link").setAttribute('href', href);
    }else if(data["user-agent"].match(/Windows Phone/i)){

    }else{

    }
}

function a_onClick() {
    //Fake msisdn
    // var data = {
    //     msisdn : "0123456789"
    // };

    console.log(code);
    console.log(api_url);

    if(data.msisdn !== undefined && data.msisdn != null){

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://mbox.mobifone.vn/dcapi/api/payment/"+api_url, true);
        var params = "cp_code="+code+"&back_url="+document.referrer;

        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader("Content-length", params.length);
        xhttp.setRequestHeader("Connection", "close");

        xhttp.onreadystatechange = function() {
            console.log(this.responseText);
            //if(xhttp.readyState == 4 && xhttp.status == 200) {
            if(xhttp.status == 200 || xhttp.status == 0) {
                if(href.length > 0){
                    console.log(href);
					window.location.href = 'http://mbox.mobifone.vn/doanchu/#/';
				} else {
                    console.log('not detect mobile');
					window.location.href = 'http://mbox.mobifone.vn/doanchu/#/register-xn';	
				}
            }else{
                window.location.href = 'http://mbox.mobifone.vn/doanchu/#/register';
            }
        };
        xhttp.send(params);

    }else{
        window.location.href = 'http://mbox.mobifone.vn/doanchu/#/type-demo';
    }
}

// var http = new XMLHttpRequest();
// var url = "get_data.php";
// var params = "lorem=ipsum&name=binny";
// http.open("POST", url, true);
//
// //Send the proper header information along with the request
// http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// http.setRequestHeader("Content-length", params.length);
// http.setRequestHeader("Connection", "close");
//
// http.onreadystatechange = function() {//Call a function when the state changes.
//     if(http.readyState == 4 && http.status == 200) {
//         alert(http.responseText);
//     }
// }
// http.send(params);


// var url = "get_data.php";
// var params = "lorem=ipsum&name=binny";
// http.open("GET", url+"?"+params, true);
// http.onreadystatechange = function() {//Call a function when the state changes.
//     if(http.readyState == 4 && http.status == 200) {
//         alert(http.responseText);
//     }
// }
// http.send(null);