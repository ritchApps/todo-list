function createElement(htmlElement, attributes, innertHtml){
    if(typeof(htmlElement) === "undefined"){
      return false;
    }

    if(typeof(innertHtml) == "undefined"){
      innertHtml = "";
    }

    var element = document.createElement(htmlElement);
    if(typeof(attributes) === 'object'){
      for(var key in attributes){
        element.setAttribute(key, attributes[key]);
      }
    }

    if(!Array.isArray(innertHtml)){
      innertHtml = [innertHtml];
    }

    for(var i = 0; i < innertHtml.length; i++){      
      if(innertHtml[i].tagName){
        element.appendChild(innertHtml[i]);
      }else{
        element.appendChild(document.createTextNode(innertHtml[i]));
      }
    }

    return element;
}


function createListItem(i){ 
    
  var node = getTasks()[i];   
  var checkbox = createElement("input", {"type": "checkbox", "onclick":"cross("+i+")"});
  var span = createElement("span", {}, node.name);
  var button = createElement("button", {"type": "button", "class": "btn-delete" ,"onclick": "remove("+i+")"}, "X");

  if(node.checked){
    checkbox.setAttribute("checked", "true");
    span.setAttribute("class", "crossed");
  }
 
  var elements = [checkbox, span, button];
  return createElement("li", {"id": i}, elements)
}

function createControls(){
  var label = createElement("label",{"for": "task"}, "Task: ");
  var inputTask = createElement("input", {"type": "text", "class": "text-control", "id": "task"});
  var addButton = createElement("button", {"type": "button", "class": "btn-add", "onclick":"add()"}, "+ Add");
  var hr = createElement("hr");
  var controls = createElement("div",{},[label, inputTask, addButton, hr]);
  var container = getContainer();
  container.appendChild(controls);
  
}

function createList(){  
  var listTitle = createElement("h3", {}, "Todo:");
  var list = createElement("ul", {"id": "tasks", "class": "list"});
  var div = createElement("div",{"id": "list-container"}, [listTitle, list]);    
  var container = getContainer();
  container.appendChild(div);
}

function hideList(){
  document.getElementById("list-container").setAttribute("class", "hiden");
}

function showList(){
  var listContainer = document.getElementById("list-container");
  listContainer.setAttribute("class", listContainer.getAttribute("class").replace(/hiden/, ""));
}


function cross(item){
  var text = document.getElementById(item).querySelector("span");
  var check  = document.getElementById(item).querySelector("input[type=checkbox]");  
  check.checked? text.setAttribute("class", text.getAttribute("class") + " crossed") : text.setAttribute('class', text.getAttribute('class').replace(/crossed/, '').trim());  
  var taskList =  JSON.parse(localStorage.getItem("tasksList"));
  taskList[item].checked = check.checked;
  localStorage.setItem("tasksList", JSON.stringify(taskList));
}

function fillList(){ 
  if(localStorage.getItem("tasksList") && localStorage.getItem("tasksList").length){    
    tasksList = JSON.parse(localStorage.getItem("tasksList"));
    var tasks = document.getElementById("tasks");
    for(var i = 0; i< tasksList.length; i++){            
      tasks.appendChild(createListItem(i));    
    }  
  }else {
    hideList();
  }	
}

function clearList(){
  var currentList = getTasksElement();
  while(currentList.firstChild){
    currentList.removeChild(currentList.firstChild);
  }
}

function getContainer(){
  var container = document.getElementById("container"); 
  if(!container){
    container = createElement("div", {"id":"container"});
    var body = document.querySelector("body");
    body.appendChild(container);
  }

  return container;
}


function getTasksElement(){
  var el = document.getElementById("tasks");
  if(!el){
    createList();
    el =  document.getElementById("tasks");   
  }

  return el;
}

function isListContainerHidden(){
  var listContainer = document.getElementById("list-container");
  return listContainer && listContainer.getAttribute("class") && listContainer.getAttribute("class").indexOf("hiden") > -1;
}

function add(){  
  var element = document.getElementById("task");
  if(element.value){
    var listItem = {
      "name": element.value,
      "checked": false
    }
    var tasksList = getTasks();
    tasksList.push(listItem);
    localStorage.setItem("tasksList", JSON.stringify(tasksList));
    element.value ="";
         
    var tasks = getTasksElement();
    var listItem = createListItem(tasksList.length - 1);    
    tasks.appendChild(listItem); 
    
    
    if(isListContainerHidden()){
      showList();
    }
  }else{
    alert("Please type a Task");
  }

  element.focus();
}

function remove(item){
  var tasksList = getTasks();
	tasksList.splice(item,1);
	localStorage.setItem("tasksList", JSON.stringify(tasksList));  
  clearList();  
  fillList();
  if(!tasksList.length){
    hideList();
    localStorage.removeItem("tasksList");
  }
}

function getTasks(){
  if(localStorage.getItem("tasksList") && localStorage.getItem("tasksList").length){
    return JSON.parse(localStorage.getItem("tasksList"));
  }

  return [];
}

function createForm(){
  createControls();  
  if(getTasks().length){
    createList();
    fillList();
  }
  
}

window.onload = function(){
  createForm();
  document.getElementById("task").focus();
}
