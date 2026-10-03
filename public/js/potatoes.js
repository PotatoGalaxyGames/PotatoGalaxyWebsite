/*
 * Purpose: Click reaction for the falling potatoes on the home page.
 * A clicked potato pulls a surprised face, jumps, and throws a few sparkles
 * and a word. Decoration only: the page works the same without this file.
 *
 * The potatoes never receive the mouse themselves (pointer-events: none in
 * style.css), so they cannot get in the way of links and buttons. Instead
 * this script listens for clicks on the page and checks whether the click
 * landed on a potato.
 */
(function () {
  "use strict";

  var sky = document.querySelector(".potato-sky");
  if (!sky) return;

  var WORDS = ["Boing!", "Wheee!", "Oof!", "Hey!", "Yippee!", "Mash me!", "Spud-tacular!"];
  var POP_MS = 700; // must match the spud-pop animation length in style.css

  // Returns the front-most potato under the point, or null.
  function potatoAt(x, y) {
    var spuds = sky.querySelectorAll(".spud");
    for (var i = spuds.length - 1; i >= 0; i--) {
      var box = spuds[i].getBoundingClientRect();
      if (box.width === 0) continue; // hidden on small screens
      var dx = x - (box.left + box.width / 2);
      var dy = y - (box.top + box.height / 2);
      var radius = Math.max(box.width, box.height) / 2 + 6; // a little forgiving for fingers
      if (dx * dx + dy * dy <= radius * radius) return spuds[i];
    }
    return null;
  }

  // Adds a short-lived decoration at the click point; it removes itself when its animation ends.
  function burst(className, text, x, y, styles) {
    var el = document.createElement("span");
    el.className = className;
    el.textContent = text;
    el.style.left = x + "px";
    el.style.top = y + "px";
    for (var name in styles) el.style.setProperty(name, styles[name]);
    el.addEventListener("animationend", function () { el.remove(); });
    sky.appendChild(el);
    // Safety net where animations are switched off and animationend never fires
    setTimeout(function () { el.remove(); }, 1500);
  }

  function pop(spud, x, y) {
    if (spud.classList.contains("is-popped")) return;

    var face = spud.querySelector("use");
    face.setAttribute("href", "#potato-wow");
    spud.classList.add("is-popped");

    setTimeout(function () {
      face.setAttribute("href", "#potato");
      spud.classList.remove("is-popped");
    }, POP_MS);

    // Six sparkles flying outwards in a ring
    for (var i = 0; i < 6; i++) {
      var angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.6;
      var distance = 40 + Math.random() * 30;
      burst("spud-spark", "\u2726", x, y, {
        "--dx": Math.cos(angle) * distance + "px",
        "--dy": Math.sin(angle) * distance + "px"
      });
    }

    burst("spud-word", WORDS[Math.floor(Math.random() * WORDS.length)], x, y, {});
  }

  document.addEventListener("click", function (event) {
    // Links, buttons and form controls always win
    if (event.target.closest("a, button, input, select, textarea, label, summary")) return;

    var spud = potatoAt(event.clientX, event.clientY);
    if (spud) pop(spud, event.clientX, event.clientY);
  });
})();
