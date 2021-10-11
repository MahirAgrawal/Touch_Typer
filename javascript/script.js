function dummy(){
  console.log(document.getElementById("input-area").parentElement);
  console.log(document.getElementById("input-area").clientWidth);
}

function printdummy(e){
  console.log(e);
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
type.p = 0;
type.start_t = -1;
type.end_t = -1;
type.error = 0;
type.is_user_correct = [];

//custom caret made for user
// var caret  = {};
// caret.caretBlinkInterval = 400;
// caret.color = "purple";

function showInit(){

}

//initialize the text area with quote and add event listeners to top-text for activating text-area on click
//awaits for quote to load through another async function getQuote and hence the other async returns implicit promise when fullfilled 
async function init(){
  document.getElementsByTagName("body")[0].style.filter = "blur(10px)";
  await showInit();
  document.getElementsByTagName("body")[0].style.filter = "none";
  await nextQuote();
  document.getElementById("top-text").innerHTML = "Start Typing";
  document.getElementById("top-text").addEventListener("click",onfocusin);
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
  // caret.caret = setInterval(blink,caret.caretBlinkInterval);
  console.log(type.is_user_correct);
}


//called when text is clicked
//adds the mutiple events and removes the click event from top-text 
//also adds the focus-out and focus-in event to differentiate between typing and not typing 
function onfocusin(e){
  console.log("i am in focus" + type.start_t);

  if(type.start_t == -1){
    type.start_t = performance.now();
  }

  //attributes
  document.getElementById("input-area-container").style.borderColor = "black";
  document.getElementById("top-text").innerHTML = "";
  document.getElementById("input-area").style.filter = "none";
  
  //events
  document.getElementById("input-area").focus();
  document.getElementById("top-text").removeEventListener("click",onfocusin);  
  document.getElementById("input-area").addEventListener("focusout",onfocusout);
  document.getElementById("input-area").addEventListener("focusin",onfocusin);
  document.getElementById("input-area").addEventListener("keydown",getKeyValue);
}

//function to change attributes and events when text-area is out of focus
//removes the events attached to text-area
//adds the event attached to top-text
function onfocusout(){
  console.log("i am out of focus");

  //attributes
  document.getElementById("input-area-container").style.borderColor = "white";
  document.getElementById("input-area").style.filter = "blur(2px)";
  document.getElementById("top-text").innerHTML = "Start Typing";

  //events
  document.getElementById("input-area").removeEventListener("focusout",onfocusout);
  document.getElementById("input-area").removeEventListener("focusin",onfocusin);
  document.getElementById("input-area").removeEventListener("keydown",getKeyValue);
  // clearInterval(caret.caret);
  init();
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
    console.log("completed");
    //mentions options to user when completed
    type.end_t = performance.now();
    var result = "";
    result += ((type.end_t-type.start_t)/1000);
    for(var i = 0;i < type.str.length;i++)//counting errors
      if(!type.is_user_correct[i])
        type.error++;
    result += "<br>";
    result += ("Errors: " + type.error);
    result += "<br>";
    result += "Gross WPM: " + Math.trunc(((type.str.length+type.error)/5)/((type.end_t-type.start_t)/60000));
    result += "<br>";
    result += "Net WPM: " + Math.trunc(((type.str.length+type.error)/5)/((type.end_t-type.start_t)/60000) - type.error*60000/(type.end_t-type.start_t));
    document.getElementById("result").innerHTML = result;
    // clearInterval(caret.caret);
    await nextQuote();
    type.start_t = performance.now();
    console.log("next: " + type.start_t);
  }
}

let url = "https://type.fit/api/quotes";
//get the quotes array from api provided by type.fit url
async function getQuote(display){
  var obj = await fetch(url)
  .then(response => response.json())
  .catch(e => console.log(e.message));
  console.log(obj.length);
  
  //parsing the string to display
  var str = obj[Math.floor(Math.random() * (obj.length + 1))].text + " " + obj[Math.floor(Math.random() * (obj.length + 1))].text;
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
  console.log(new_str);
  display.innerHTML = new_str;
  type.str = str;
}


// function blink(){
//   document.getElementById("blink").style.backgroundColor = (document.getElementById("blink").style.backgroundColor == "transparent")?caret.color:"transparent";
// }