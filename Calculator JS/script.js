var display = document.querySelector("#display");
function sign(dig) {
  var dig = display.value;
  if (dig == "") {
    display.value = "";
  } else {
    if (dig > 0 ) {
      display.value = "-" + display.value;
    }else {
      display.value = Math.abs(display.value);
    }
  }
}
function cls(dig) {
  display.value = dig;
}
function show(dig) {
 display.value += dig;
}

function comma(dis) {
  var dis = display.value;
  if (dis == "") {
    display.value += "0.";
  } else {
    if (dis.indexOf('.') != -1) {
      document.getElementById('comma').setAttribute = "disabled";
    } else {
      display.value += ".";
    }
  }
}
function calcul(dig) {
  var dis = display.value ;
  if (dis== "") {
    document.getElementById('equal').setAttribute = "disabled";
  } else {
    dig = display.value ;
    try {
      display.value = eval(dig);
    } catch (e) {
      if (e instanceof SyntaxError) {
        display.value ="Syntax Error";
      }
    }
  }
}
