var tasksList = [];

 function clearList(){
    var currentList = document.getElementById("tasks");
    while(currentList.firstChild){
      currentList.removeChild(currentList.firstChild);
    }
 }


function createElement(htmlElement, attributes, text){
    if(typeof(htmlElement) === "undefined"){
      return false;
    }

    if(typeof(text) == "undefined"){
      text = "";
    }

    var element = document.createElement(htmlElement);
    if(typeof(attributes) === 'object'){
      for(var key in attributes){
        element.setAttribute(key, attributes[key]);
      }
    }

    if(!Array.isArray(text)){
      text = [text];
    }

    for(var i = 0; i < text.length; i++){      
      if(text[i].tagName){
        element.appendChild(text[i]);
      }else{
        element.appendChild(document.createTextNode(text[i]));
      }
    }

    return element;
}


function createListItem(i){  
  
  if(tasksList[i].checked){
    var checkbox = createElement("input", {"type": "checkbox", "checked": "checked" , "onclick":"cross("+i+")"});  
    var span = createElement("span", {"class":"crossed"}, tasksList[i].name);
  }else{
    var checkbox = createElement("input", {"type": "checkbox", "onclick":"cross("+i+")"});
    var span = createElement("span", {}, tasksList[i].name);
  }
  

  
  var button = createElement("button", {"type": "button", "class": "btn-delete" ,"onclick": "remove("+i+")"}, "X");
  var elements = [checkbox, span, button];
  return createElement("li", {"id": i}, elements)
}

function fillList(){  		  		
  if(localStorage.getItem("tasksList") && localStorage.getItem("tasksList").length){
    clearList();    
    tasksList = JSON.parse(localStorage.getItem("tasksList"));
    var tasks = document.getElementById("tasks");
    for(var i = 0; i< tasksList.length; i++){            
      tasks.appendChild(createListItem(i));    
    }  
  }
	
}

function add(){
  var element = document.getElementById("task");
  if(element.value){
    var listItem = {
      "name": element.value,
      "checked": false
    }
    tasksList.push(listItem);
    localStorage.setItem("tasksList", JSON.stringify(tasksList));
    element.value ="";    
     var tasks = document.getElementById("tasks");
    tasks.appendChild(createListItem(tasksList.length-1));
  }else{
    alert("Nothing to do here");
  }

  element.focus();
}


function cross(item){
  var text = document.getElementById(item).querySelector("span");
  var check  = document.getElementById(item).querySelector("input[type=checkbox]");  
  check.checked? text.setAttribute("class", text.getAttribute("class") + " crossed") : text.setAttribute('class', text.getAttribute('class').replace(/crossed/, '').trim());	
  var taskList =  JSON.parse(localStorage.getItem("tasksList"));
  tasksList[item].checked = check.checked;
  localStorage.setItem("tasksList", JSON.stringify(tasksList));
}


function remove(item){
	tasksList.splice(item,1);
	localStorage.setItem("tasksList", JSON.stringify(tasksList));
	fillList();
}


function createControls(){
  var label = createElement("label",{"for": "task"}, "Task: ");
  var inputTask = createElement("input", {"type": "text", "class": "text-control", "id": "task"});
  var addButton = createElement("button", {"type": "button", "class": "btn-add", "onclick":"add()"}, "+ Add");
  var hr = createElement("hr");
  var controls = createElement("div",{},[label, inputTask, addButton, hr]);

  var row = document.getElementById("row");
  row.appendChild(controls);
  
}

function createList(){  
  var listTitle = createElement("h3", {}, "Todo:");
  var list = createElement("ul", {"id": "tasks", "class": "list"});
  var div = createElement("div",{}, [listTitle, list]);    
  var row = document.getElementById("row").appendChild(div);
}


function createForm(){
  createControls();
  createList();
}
window.onload = function(){
  createForm();
  fillList();
  document.getElementById("task").focus();
}
