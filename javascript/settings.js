function activate(){
  if(sessionStorage.getItem("demosize") === null){
    sessionStorage.setItem("demosize",20);
    sessionStorage.setItem("demofont","Lucida Sans Unicode");
    sessionStorage.setItem("demobold",true);
  }

  document.getElementById("demosize").value = sessionStorage.getItem("demosize");
  // document.getElementById("demosize").value = sessionStorage.getItem("demosize");
  // document.getElementById("").value = sessionStorage.getItem("demosize");

  document.getElementById("demotext").style.fontSize = sessionStorage.getItem("demosize") + "px";
  document.getElementById("demotext").style.fontFamily =  sessionStorage.getItem("demofont");
  document.getElementById("demotext").style.fontWeight =  sessionStorage.getItem("demobold")?"bold":"normal";
  
  document.getElementById("demosize").addEventListener("input",changesize);
  // document.getElementById("demosize").addEventListener("input",changesize);
}

function changesize(){
  document.getElementById("demotext").style.fontSize = document.getElementById("demosize").value + "px";
  sessionStorage.setItem("demosize",document.getElementById("demosize").value);
}

function load(){
  console.log(sessionStorage.getItem("demosize"));
  document.getElementById("demosize").removeEventListener("input",changesize);
  window.location.href = "practice.html"
}