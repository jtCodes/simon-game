const values = {
  red: 200,
  green: 230,
  blue: 260,
  yellow: 290,
  err: 170,
  key: function(n) {
    return this[Object.keys(this)[n]];
  }
};

const colors = ["red", "green", "blue", "yellow"];
var genSeq = [];
var user = [];
var off = false;
var player = false;
var check = false;
const context = new (window.AudioContext || window.webkitAudioContext)();

/* VCO */
var vco = context.createOscillator();
vco.type = vco.SQUARE;
vco.start(0);
/* VCA */
var vca = context.createGain();
vca.gain.value = 0;
/* Connections */
vco.connect(vca);
vca.connect(context.destination);

$(document).ready(function() {

});

// color buttons event handlers setup
// $(".red").mousedown(down)= on red button down, call down()
$(".red").mousedown(down);
$(".red").mouseup(up);
$(".green").mousedown(down);
$(".green").mouseup(up);
$(".yellow").mousedown(down);
$(".yellow").mouseup(up);
$(".blue").mousedown(down);
$(".blue").mouseup(up);

function down() {
  if (check === false) {
    console.log(".btn-floating.btn-large#" + this.id);
    $("#elem").attr("style", "width: 100px !important");
    $(".btn-floating.btn-large#" + this.id).attr(
      "style",
      " box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.6)"
    );
    vco.frequency.value = values[this.id];
    vca.gain.value = 1;
  }
  return false;
}
function up() {
  if (check === false) {
    $(".btn-floating.btn-large#" + this.id).attr("style", " box-shadow: no");
    vco.frequency.value = "";
    vca.gain.value = 0;
    if (player) {
      user.push(this.id);
      console.log(user);
      check = true;
      disable();
      compare();
    }
  }
  return false;
}

// on/off switch event handler
$("#switch").click(function() {
  if ($("#switch").prop("checked")) {
    $("#indeterminate-checkbox").prop('disabled', true);
     console.log( $('#indeterminate-checkbox').is(':checked'));
     $('#display').val(1);
    vca.connect(context.destination);
    off = false;
    reset();
  } else {
     $("#indeterminate-checkbox").prop('disabled', false);
    console.log( $('#indeterminate-checkbox').is(':checked'));
     $('#display').val("OFF");
    off = true;
  }
});

function reset() {
  $('#display').val(1);
  genSeq = [];
  user = [];
  disable();
  gen();
  off = false;
  player = false;
  check = false;
  play();
}

//disable buttons
function disable() {
  document.getElementById("red").classList.add("disabled");
  document.getElementById("green").classList.add("disabled");
  document.getElementById("yellow").classList.add("disabled");
  document.getElementById("blue").classList.add("disabled");
}

// enable buttons
function enable() {
  document.getElementById("red").classList.remove("disabled");
  document.getElementById("green").classList.remove("disabled");
  document.getElementById("yellow").classList.remove("disabled");
  document.getElementById("blue").classList.remove("disabled");
}

function gen() {
  const rand = Math.round(Math.random() * 3);
  genSeq.push(colors[rand]);
  console.log(colors[rand]);
  console.log(genSeq);
}

function play() {
  (function loop(i) {
    // all done
    if (i >= genSeq.length) {
      player = true;
      enable();
      return;
    }
    //cancel play
    if (off === true) {
      $("." + genSeq[i]).trigger("mouseup");
      vca.disconnect(context.destination);
      clearTimeout(time);
      return;
    }
    var time = setTimeout(function() {
      $("." + genSeq[i]).trigger("mousedown");
      console.log(genSeq[i]);
      setTimeout(function() {
        $("." + genSeq[i]).trigger("mouseup");
      }, 800);
    }, 1000);
    setTimeout(loop.bind(null, i + 1), 2000);
  })(0);
}

function playErr() {
  setTimeout(function() {
    vco.frequency.value = values.err;
    vca.gain.value = 1;
    console.log("called", vca.gain.value, vco.frequency.value);
    setTimeout(function() {
      if ($('#indeterminate-checkbox').is(':checked')) {
        vco.frequency.value = "";
      vca.gain.value = 0;
        reset();
      }
      else {
      check = false;
      player = false;
      user = [];
      play();
      vco.frequency.value = "";
      vca.gain.value = 0;
      }
    }, 1200);
  }, 800);
}

function offColor() {
  $(".btn-floating.btn-large#red").attr(
    "style",
    " box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, .9)"
  );
}
function compare() {
  for (var i = 0; i < user.length; i++) {
    console.log(user[i], genSeq[i]);
    if (user[i] != genSeq[i]) {
      console.log(vca.gain.value);
      playErr();
      return;
    }
  }
  //win
  if (user.length === genSeq.length && user.length === 20) {
    reset();
    return;
  }
  //passes 1 step
  if (user.length === genSeq.length && user.length != 0) {
    let step = parseInt($('#display').val());
    console.log(typeof(step));
    $('#display').val(step+1);
    console.log($('#display').val());
    gen();
    user = [];
    check = false;
    player = false;
    disable();
    play();
    return;
  }
  //player continue on with current step
  check = false;
  player = true;
  enable();
}
