function dummy(){
  console.log(document.getElementById("top-text").parentElement);
  console.log("clientwidth: " + document.getElementById("input-area").clientWidth);
  // var msg = new SpeechSynthesisUtterance("comma");
  // window.speechSynthesis.speak(msg);
}

function printdummy(e){
  console.log("top-text....");
  document.getElementById("input-area-container").style.borderColor = "white";
}

//global variables declare as keys of type object
//p : denotes points to current index that user has to type
//str : denotes the fetched string user has to type
//start_t : denotes the start time
//end_t : denotes the end time 
//error : counts the errors made
//is_user_correct : stores if user entered the right character in first time only
var type = {};
type.matches = 0;
type.p = 0;
type.start_t = -1;
type.end_t = -1;
type.error = 0;
type.is_user_correct = [];

var border_color = ["white","black"];

//to check if site is refreshed or focus is out
var firsttime = true;

//object to store last results
var last_stats = {};
last_stats.error = 1000000;
last_stats.GrossWPM = 0;
last_stats.NetWPM = 0;


async function check(){
  // console.log(border_color);
  if(window.navigator.onLine){
    if(firsttime){
      await init();
      firsttime = false;
    }
    else{
      await nextQuote();
    }
  }
  else{
    alert("Looks like you are offline. Try refreshing the page else program will show undefined behaviour...");
    document.getElementsByTagName("body")[0].style.filter = "blur(10px)";
  }
}

//initialize the text area with quote and add event listeners to top-text for activating text-area on click
//awaits for quote to load through another async function getQuote and hence the other async returns implicit promise when fullfilled 
async function init(){
  await nextQuote();
  document.getElementById("input-area").style.borderColor = border_color[0];
  document.getElementById("input-area").style.filter = "blur(5px)";
  document.getElementById("top-text").addEventListener("click",onfocusin);
  document.getElementById("top-text").innerHTML = "Click To Start...";
}

async function nextQuote(){
  type.p = 0;
  type.start_t = -1;
  type.end_t = -1;
  type.error = 0;
  type.is_user_correct.length = 0;
  await getQuote(document.getElementById("input-area"));//displays the fetched quote in passed in div element
  for(var i = 0;i < type.str.length;i++){
    type.is_user_correct[i] = -1;
  }
  // console.log(sessionStorage.getItem("demosize") + " " + sessionStorage.getItem("demofont"));
  // caret.caret = setInterval(blink,caret.caretBlinkInterval);
  // console.log(type.is_user_correct);
}


//called when text is clicked
//adds the mutiple events and removes the click event from top-text 
//also adds the focus-out and focus-in event to differentiate between typing and not typing 
async function onfocusin(e){
  // console.log("ha: " + e.currentTarget);
  if(type.start_t == -1){
    type.start_t = performance.now();
  }

  //attributes
  document.getElementById("input-area").style.filter = "none";
  document.getElementById("input-area").style.borderColor = border_color[1];
  
  //removing the top-text div itself
  top_ = $("#top-text").clone();
  $("#top-text").remove();
  
  document.getElementById("input-area").focus();
  document.getElementById("input-area").addEventListener("focusout",onfocusout);
  document.getElementById("input-area").addEventListener("keydown",getKeyValue);
}

//function to change attributes and events when text-area is out of focus
//removes the events attached to text-area
//adds the event attached to top-text
async function onfocusout(e){
  // console.log("i am out of focus" + e);

  //attributes
  document.getElementById("input-area").style.borderColor = border_color[0];
  top_.appendTo($("#input-area-container"));
  document.getElementById("input-area").style.filter = "blur(5px)";

  //events
  document.getElementById("input-area").removeEventListener("focusout",onfocusout);
  document.getElementById("input-area").removeEventListener("keydown",getKeyValue);
  // clearInterval(caret.caret);
  await check();
  document.getElementById("top-text").addEventListener("click",onfocusin);  
}


//called when text-area is active and key is pressed down
//also disables any default key binding actions of browsers
async function getKeyValue(e){
  // console.log(e);
  e.preventDefault();
  if(type.p < type.str.length){
    if((e.key != '_' && type.str[type.p] == e.key) || (type.str[type.p] == '_' && e.key == ' ')){
      if(type.is_user_correct[type.p] == -1){
        type.is_user_correct[type.p] = 1;
      }
      var new_str = "";
      for(var i = 0;i <= type.p;i++){
        if(type.is_user_correct[i]){
          new_str += "<span id=\"correct\">";
        }
        else{
          new_str += "<span id=\"incorrect\">";
        }
        new_str += type.str[i];
        if(type.str[i] == '_')
          new_str += "<wbr>";
        new_str += "</span>";
      }

      for(var i = type.p+1;i < type.str.length;i++){
        if(i == type.p+1){
          new_str += "<span id=\"blink\">";
          new_str += type.str[i];
          new_str += "</span>";  
        }
        else
          new_str += type.str[i];
        if(type.str[i] == '_')
          new_str += "<wbr>";
      }
      document.getElementById("input-area").innerHTML = new_str;
      type.p++;
      // console.log(document.getElementById("input-area").innerHTML);
      // console.log(e.key);
    }
    else if(!(e.keyCode == 16 || e.keyCode == 17 || e.keyCode == 18  || e.keyCode == 20 || e.keyCode == 8)){//don't count these keys as errors
      type.is_user_correct[type.p] = 0;
    }
  }
  if(type.p == type.str.length){
    // console.log("completed");
    // console.log(document.getElementById("input-area").style.fontSize);
    ++type.matches;

    //temporary suspend all events until next quote is loaded
    document.getElementById("input-area").removeEventListener("keydown",getKeyValue);
    document.getElementById("input-area").removeEventListener("focusout",onfocusout);
  
    type.end_t = performance.now();
    type.time_ = ((type.end_t-type.start_t)/60000);
    for(var i = 0;i < type.str.length;i++)//counting errors
      if(!type.is_user_correct[i])
        type.error++;
    // console.log(time_);
    // console.log(Math.trunc(((type.str.length+type.error)/5)/time_));
    // console.log(Math.trunc((((type.str.length+type.error)/5)-type.error)/time_));
    document.getElementById("Matches").innerHTML = "Total Matches: " + type.matches;
    
    if(last_stats.error < type.error){
      document.getElementById("Errors").innerHTML = "Current Errors: <span id = \"incorrect\">" + type.error + "</span>";
    }
    else{
      document.getElementById("Errors").innerHTML = "Current Errors: <span id = \"correct\">" + type.error + "</span>";
    }

    if(last_stats.GrossWPM < Math.trunc(((type.str.length+type.error)/5)/type.time_)){
      document.getElementById("GrossWPM").innerHTML = "Gross WPM: <span id = \"correct\">" + Math.trunc(((type.str.length+type.error)/5)/type.time_) + "</span>";
    }
    else{
      document.getElementById("GrossWPM").innerHTML = "Gross WPM: <span id = \"incorrect\">" + Math.trunc(((type.str.length+type.error)/5)/type.time_) + "</span>";
    }

    if(last_stats.NetWPM < Math.trunc((((type.str.length+type.error)/5)-type.error)/type.time_)){
      document.getElementById("NetWPM").innerHTML= "Net WPM: <span id = \"correct\">" + Math.trunc((((type.str.length+type.error)/5)-type.error)/type.time_) + "</span>";
    }
    else{
      document.getElementById("NetWPM").innerHTML= "Net WPM: <span id = \"incorrect\">" + Math.trunc((((type.str.length+type.error)/5)-type.error)/type.time_) + "</span>";
    }
    
    //collecting last typing statistics for comparison
    last_stats.error = type.error;
    last_stats.GrossWPM = Math.trunc(((type.str.length+type.error)/5)/type.time_);
    last_stats.NetWPM = Math.trunc((((type.str.length+type.error)/5)-type.error)/type.time_);

    //suspended keydown event gets started only after next quote is displayed
    await check();
    type.start_t = performance.now();
    // console.log("next: " + type.start_t);
    document.getElementById("input-area").addEventListener("focusout",onfocusout);
    document.getElementById("input-area").addEventListener("keydown",getKeyValue);  
  }
}

let url = "https://type.fit/api/quotes";
var quotes;
//get the quotes array from api provided by type.fit url
async function getQuote(display){
  
  if(firsttime){
    quotes = await fetch(url)
    .then(response => response.json())
    .catch(e => console.log(e.message));
  }
  
  //parsing the string to display
  var str = quotes[Math.floor(Math.random() * (quotes.length + 1))].text + " " + quotes[Math.floor(Math.random() * (quotes.length + 1))].text + " " + quotes[Math.floor(Math.random() * (quotes.length + 1))].text;
  str = str.replaceAll(' ','_');
  var new_str = "";
  for(var i = 0;i < str.length;i++){
    if(i == 0){
      new_str += "<span id=\"blink\">";
      new_str += str[i];
      new_str += "</span>";  
    }
    else
      new_str += str[i];
    if(str[i] == '_')
      new_str += "<wbr>";
  }
  // console.log(new_str);
  // console.log(sessionStorage.getItem("demosize"));
  // display.style.fontSize = sessionStorage.getItem("demosize")+"px";
  display.style.height = "max-content";
  display.innerHTML = new_str;
  document.getElementById("input-area").style.fontSize = sessionStorage.getItem("demosize")+"px";
  document.getElementById("input-area").style.fontFamily = sessionStorage.getItem("demofont");
  document.getElementById("input-area").style.fontWeight = sessionStorage.getItem("demobold") == "true"?"bold":"";

  //dynamically changing parent div and top-text height 
  document.getElementById("input-area-container").style.height = window.getComputedStyle(display).getPropertyValue("height");
  if(document.getElementById("top-text") != null)
    document.getElementById("top-text").style.height = window.getComputedStyle(display).getPropertyValue("height");
  type.str = str;
}


// function blink(){
//   document.getElementById("blink").style.backgroundColor = (document.getElementById("blink").style.backgroundColor == "transparent")?caret.color:"transparent";
// }