(function() {
  var names = ["Yaakov", "John", "Jen", "Jason", "Paul", "Frank", "Larry", "Paula", "Laura", "Jim"];

  // Step 2: Create the HelloSpeaker and ByeSpeaker objects
  var helloSpeaker = {
    speak: function(name) {
      console.log("Hello " + name);
    }
  };

  var byeSpeaker = {
    speak: function(name) {
      console.log("Goodbye " + name);
    }
  };

  // Step 3: Loop over the names array
  for (var i = 0; i < names.length; i++) {
    var firstLetter = names[i].charAt(0).toLowerCase();

    // Step 4: Print Hello or Goodbye based on the first letter of the name
    if (firstLetter === 'j') {
      byeSpeaker.speak(names[i]);
    } else {
      helloSpeaker.speak(names[i]);
    }
  }
})();
