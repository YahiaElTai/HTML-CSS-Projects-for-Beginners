// Geolocation
if (navigator.geolocation) {
  var timeoutVal = 10 * 1000 * 1000;
  navigator.geolocation.getCurrentPosition(
    displayPosition,
    displayError,
    { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
  );
}
else {
  alert("Geolocation is not supported by this browser");
}
function displayPosition(position) {
  var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var options = {
    zoom: 10,
    center: pos,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map"), options);
  var marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: "Here you are!"
  });
  var contentString = "<b>Date & Time :</b> " + parseTimestamp(position.timestamp) +
  "<br/><b>Your location:</b> lat " + position.coords.latitude + ", long " +
  position.coords.longitude;
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
}
function displayError(error) {
  var errors = {
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert("Error: " + errors[error.code]);
}
function parseTimestamp(timestamp) {
  var d = new Date(timestamp);
  var day = d.getDate();
  var month = d.getMonth() + 1;
  var year = d.getFullYear();
  var hour = d.getHours();
  var mins = d.getMinutes();

  return day + "." + month + "." + year + " " + hour + ":" + mins;
}
// Local Storage
function initStorage() {
  function saveName() {
    var name = document.querySelector('#name');
    localStorage.setItem('name',name.value);
  }
  function saveEmail() {
    var email = document.querySelector('#email');
    localStorage.setItem('email' ,email.value);
  }
  saveName();
  saveEmail();


}
function displayName() {
  if (localStorage.getItem('name') != null) {
      document.write("Welcome back, " + localStorage.getItem('name'));
  }
}

function showText() {
  if (localStorage.getItem('email') != null) {
    document.write("<p><strong>Subscribed as:</strong> " + localStorage.getItem('email') + "</p>");
  } else {
    document.write("Please enter your E-mail adress");
  }

}

function clearAll() {
  localStorage.clear();
  window.location.reload();
}
