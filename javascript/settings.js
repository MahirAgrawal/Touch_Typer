function activate(){
  if(sessionStorage.getItem("demosize") === null){
    sessionStorage.setItem("demosize",20);
    sessionStorage.setItem("demofont","Lucida Sans Unicode");
    sessionStorage.setItem("demobold","false");
  }
  window.location.href = "index.html";
}

function startlistening(){
  document.getElementById("demotext").style.fontSize = sessionStorage.getItem("demosize") + "px";
  document.getElementById("demosize").value = sessionStorage.getItem("demosize");

  document.getElementById("demotext").style.fontFamily = sessionStorage.getItem("demofont");
  document.getElementById("dropdownMenuButton").innerHTML = sessionStorage.getItem("demofont");
  
  document.getElementById("demotext").style.fontWeight = sessionStorage.getItem("demobold") == "true"?"bold":"";
  document.getElementById("demobold").checked = sessionStorage.getItem("demobold") == "true"?true:false;

  document.getElementById("demosize").addEventListener("input",changeSize);
  var arr = document.getElementsByClassName("dropdown-item");
  for(var i = 0;i < arr.length;i++){
    arr[i].addEventListener("click",getFont);
  }
  document.getElementById("demobold").addEventListener("click",isBold);
}


function changeSize(){
  document.getElementById("demotext").style.fontSize = document.getElementById("demosize").value + "px";
  sessionStorage.setItem("demosize",document.getElementById("demosize").value);
}

function getFont(e){
  e.preventDefault();
  document.getElementById("demotext").style.fontFamily = e.target.innerHTML;
  document.getElementById("dropdownMenuButton").innerHTML = e.target.innerHTML;
  sessionStorage.setItem("demofont",e.target.innerHTML);
}

function isBold(){
  if(sessionStorage.getItem("demobold") == "true"){
    sessionStorage.setItem("demobold","false");
  }
  else{
    sessionStorage.setItem("demobold","true");
  }  
  document.getElementById("demotext").style.fontWeight = (sessionStorage.getItem("demobold") == "true"?"bold":"");
}

function apply(){
  // console.log(sessionStorage.getItem("demosize"));
  // console.log(sessionStorage.getItem("demofont"));
  // console.log(sessionStorage.getItem("demobold"));
  document.getElementById("demosize").removeEventListener("input",changeSize);
  var arr = document.getElementsByClassName("dropdown-item");
  for(var i = 0;i < arr.length;i++){
    arr[i].removeEventListener("click",getFont);
  }
  document.getElementById("demobold").removeEventListener("click",isBold);
  window.location.href = "index.html";
}