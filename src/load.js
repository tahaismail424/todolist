import { prioList, saveToDo, taskList, deleteTask } from "./to-do.js";
import { projList, saveProj, deleteProj } from "./project.js";
import "./style.css";

const page = document.getElementById("content");

let taskObjects = [];
let projObjects = [];

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//for form

function makeNewInput(itemKey, inputType) {
  let inputDiv = document.createElement("div");
  inputDiv.classList.add("input-box");
  let label = document.createElement("label");
  label.textContent = capitalize(itemKey) + ":";
  label.setAttribute("for", itemKey);
  inputDiv.appendChild(label);
  inputDiv.appendChild(document.createElement("br"));

  let input = document.createElement("input");
  input.setAttribute("type", inputType);
  input.setAttribute("id", itemKey);
  input.setAttribute("name", itemKey);
  input.classList.add("input");
  input.required = true;
  inputDiv.appendChild(input);

  return inputDiv;
}

//for form

function makeNewRadio(degree, prio) {
  let priorityDiv = document.createElement("div");
  priorityDiv.classList.add("radio-box");

  let inputP = document.createElement("input");
  inputP.setAttribute("type", "radio");
  inputP.setAttribute("id", degree);
  inputP.setAttribute("value", degree);
  inputP.classList.add("input");
  inputP.required = true;
  prio
    ? inputP.setAttribute("name", "priority")
    : inputP.setAttribute("name", "project");
  priorityDiv.appendChild(inputP);

  let labelP = document.createElement("label");
  labelP.setAttribute("for", degree);
  labelP.textContent = capitalize(degree);
  priorityDiv.appendChild(labelP);

  return priorityDiv;
}

//base prompt, used for project and tasks

function promptBase() {
  if (document.querySelector("#formy")) {
    //do nothing if an edit prompt is already active
    return 1;
  }

  let newForm = document.createElement("form");
  newForm.setAttribute("id", "formy");
  //moved edit event listener

  let title = makeNewInput("title", "text");
  newForm.appendChild(title);
  //remove title value

  let description = makeNewInput("description", "text");
  newForm.appendChild(description);

  let submit = document.createElement("input");
  submit.setAttribute("type", "submit");
  submit.setAttribute("value", "Save");
  submit.classList.add("save");
  newForm.appendChild(submit);

  let reset = document.createElement("input");
  reset.setAttribute("type", "reset");
  reset.setAttribute("value", "Reset");
  reset.classList.add("reset");
  newForm.appendChild(reset);

  let cancel = document.createElement("input");
  cancel.setAttribute("type", "button");
  cancel.setAttribute("value", "Cancel");
  cancel.classList.add("cancel");
  cancel.addEventListener("click", (e) => {
    e.target.parentNode.remove();
    enableButtons();
  });
  newForm.appendChild(cancel);

  return newForm;
}

//for a NEW task

function toDoPrompt(task) {
  let newForm = promptBase();

  //cancel if form already present

  if (newForm === 1) {
    return 1;
  }

  let dueDate = makeNewInput("due-date", "date");

  newForm.insertBefore(dueDate, newForm.childNodes[2]);

  //populate priority radios

  let priorities = [];
  for (let i = 0, n = prioList.length; i < n; i++) {
    priorities[i] = makeNewRadio(prioList[i], true);
    newForm.insertBefore(priorities[i], newForm.children[3 + i]);
    newForm.insertBefore(document.createElement("br"), newForm.children[4 + i]);
  }

  //populate project radios

  let projects = [];
  for (let i = 0, n = projList.length; i < n; i++) {
    projects[i] = makeNewRadio(projList[i].title, false);
    newForm.insertBefore(projects[i], newForm.children[11 + i]);
    newForm.insertBefore(
      document.createElement("br"),
      newForm.children[12 + i]
    );
  }

  //for EDIT task
  if (task)
    newForm.addEventListener("submit", (e) => {
      saveToDo(task);
      enableButtons();
      e.target.remove();
      e.preventDefault();
      //refresh taskObjects array
      refreshDisplay();
      hideTasks();
    });
  //for NEW task
  else
    newForm.addEventListener("submit", (e) => {
      saveToDo();
      enableButtons();
      e.target.remove();
      e.preventDefault();
      //refresh taskObjects array
      refreshDisplay();
      hideTasks();
    });

  return newForm;
}

function toDoEditPrompt(item) {
  let newForm = toDoPrompt(item);

  if (newForm === 1) {
    return 1;
  }
  //populate form fields with what is already present on the current task
  for (let node of newForm.childNodes) {
    if (node.className === "input-box") {
      for (let field of node.childNodes) {
        if (field.id === "title") field.setAttribute("value", item.title);
        if (field.id === "description")
          field.setAttribute("value", item.description);
        if (field.id === "due-date") field.setAttribute("value", item.dueDate);
      }
    } else if (node.className === "radio-box") {
      for (let dot of node.childNodes) {
        if (dot.id === item.priority) dot.checked = true;
        if (dot.id === item.project) dot.checked = true;
      }
    }
  }

  return newForm;
}

function projPrompt(existingProj) {
  let newForm = promptBase();
  if (newForm === 1) {
    return 1;
  }

  if (existingProj)
    newForm.addEventListener("submit", (e) => {
      saveProj(existingProj);
      e.target.remove();
      enableButtons();
      e.preventDefault();
      //refresh taskObjects array
      refreshDisplay();
      hideTasks();
    });
  else
    newForm.addEventListener("submit", (e) => {
      saveProj();
      e.target.remove();
      enableButtons();
      e.preventDefault();
      //refresh taskObjects array
      refreshDisplay();
      hideTasks();
    });

  return newForm;
}

function editProj(item) {
  let newForm = projPrompt(item);

  if (newForm === 1) return 1;

  for (let node of newForm.childNodes) {
    if (node.id === "title") node.setAttribute("value", item.title);
  }

  for (let node of newForm.childNodes) {
    if (node.id === "description") node.setAttribute("value", item.description);
  }

  return newForm;
}

function timeDisplay(time) {
  "2017-06-01";
  let times = time.split("-");
  let display1 = `${times[1]}/${times[2]}/${times[0]}`;
  let month;
  switch (times[1]) {
    case "01":
      month = "January";
      break;
    case "02":
      month = "February";
      break;
    case "03":
      month = "March";
      break;
    case "04":
      month = "April";
      break;
    case "05":
      month = "May";
      break;
    case "06":
      month = "June";
      break;
    case "07":
      month = "July";
      break;
    case "08":
      month = "August";
      break;
    case "09":
      month = "September";
      break;
    case "10":
      month = "October";
      break;
    case "11":
      month = "November";
    case "12":
      month = "December";
  }
  if (times[2].charAt(0) == "0") times[2] = times[2].substring(1);
  let display2 = `${month} ${times[2]}, ${times[0]}`;
  return {
    display1,
    display2,
  };
}

function displayToDo(item) {
  let newDisplay = document.createElement("div");
  newDisplay.classList.add("task-view");

  let title = document.createElement("h2");
  title.classList.add("title-view");
  title.textContent = `${item.title}`;
  newDisplay.appendChild(title);

  let description = document.createElement("p");
  description.classList.add("description-view");
  description.textContent = `${item.description}`;
  newDisplay.appendChild(description);

  let dateView = timeDisplay(item.dueDate);
  let dueDate = document.createElement("h2");
  dueDate.classList.add("date-view");
  dueDate.textContent = `${dateView.display1}-${dateView.display2}`;
  newDisplay.appendChild(dueDate);

  let priority = document.createElement("div");
  priority.classList.add("prio-view");
  priority.textContent = `${item.priority}`;
  switch (item.priority) {
    case "meh":
      priority.style.backgroundColor = "yellow";
      priority.style.color = "#0B0C10";
      break;
    case "high":
      priority.style.backgroundColor = "red";
      break;
    case "low":
      priority.style.backgroundColor = "green";
      break;
    case "moderate":
      priority.style.backgroundColor = "orange";
      break;
  }
  newDisplay.appendChild(priority);

  let edit = document.createElement("button");
  edit.setAttribute("type", "button");
  edit.classList.add("edit-view");
  edit.textContent = "Edit?";
  edit.addEventListener("click", editAction);
  newDisplay.appendChild(edit);

  let complete = document.createElement("button");
  complete.setAttribute("type", "button");
  complete.classList.add("complete-view");
  complete.textContent = "Completed?";
  complete.addEventListener("click", completeTask);
  newDisplay.appendChild(complete);

  page.appendChild(newDisplay);

  //return object to link display to task object
  return {
    item,
    newDisplay,
  };
}

function displayProj(proj) {
  let newDisplay = document.createElement("div");
  newDisplay.classList.add("proj-view");

  let title = document.createElement("h2");
  title.classList.add("title-view");
  title.textContent = `${proj.title}`;
  newDisplay.appendChild(title);

  let description = document.createElement("p");
  description.classList.add("description-view");
  description.textContent = `${proj.description}`;
  newDisplay.appendChild(description);

  let edit = document.createElement("button");
  edit.setAttribute("type", "button");
  edit.classList.add("edit-view");
  edit.textContent = "Edit?";
  edit.addEventListener("click", editProjAction);
  newDisplay.appendChild(edit);

  let complete = document.createElement("button");
  complete.setAttribute("type", "button");
  complete.classList.add("complete-view");
  complete.textContent = "Completed?";
  complete.addEventListener("click", completeProj);
  newDisplay.appendChild(complete);

  let show = document.createElement("button");
  show.setAttribute("type", "button");
  show.classList.add("show-view");
  show.textContent = "Show tasks";
  show.addEventListener("click", showTasks);
  newDisplay.appendChild(show);

  let close = document.createElement("button");
  close.setAttribute("type", "button");
  close.classList.add("close-view");
  close.textContent = "Close task list";
  close.addEventListener("click", hideTasks);
  close.classList.add("hide");
  newDisplay.appendChild(close);

  page.appendChild(newDisplay);

  //link display to project object
  return {
    proj,
    newDisplay,
  };
}

//redoes task display based on current lists
function refreshDisplay() {
  taskObjects = [];
  projObjects = [];
  let tasks = document.querySelectorAll(".task-view");
  let projects = document.querySelectorAll(".proj-view");

  projects.forEach((project) => project.remove());

  tasks.forEach((task) => task.remove());

  for (let i = 0, n = projList.length; i < n; i++) {
    projObjects[i] = displayProj(projList[i]);
  }

  for (let i = 0, n = taskList.length; i < n; i++) {
    taskObjects[i] = displayToDo(taskList[i]);
  }

  //updates localStorage with current task/project lists
  if (localStorage.getItem("projects")) {
    localStorage["projects"] = JSON.stringify(projList);
  } else {
    localStorage.setItem("projects", JSON.stringify(projList));
  }

  if (localStorage.getItem("tasks")) {
    localStorage["tasks"] = JSON.stringify(taskList);
  } else {
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }
}

function hideTasks(e) {
  if (e) {
    e.target.previousSibling.classList.remove("hide");
    e.target.classList.add("hide");
  }
  for (let object of taskObjects) object.newDisplay.classList.add("hide");
}

function showTasks(e) {
  for (let object of taskObjects) object.newDisplay.classList.add("hide");

  let showButs = document.querySelectorAll(".show-view");
  showButs.forEach((but) => but.classList.remove("hide"));

  let closeButs = document.querySelectorAll(".close-view");
  closeButs.forEach((but) => but.classList.add("hide"));

  e.target.nextSibling.classList.remove("hide");

  //reveals all tasks in a given project
  e.target.classList.add("hide");
  for (let object of projObjects) {
    if (object.newDisplay == e.target.parentNode) {
      for (let task of object.proj.taskList) {
        for (let taskOb of taskObjects) {
          if (taskOb.item == task) taskOb.newDisplay.classList.remove("hide");
        }
      }
    }
  }
}

function editAction(e) {
  disableButtons();
  for (let object of taskObjects) {
    if (object.newDisplay == e.target.parentNode) {
      let form = toDoEditPrompt(object.item);
      object.newDisplay.appendChild(form);
    }
  }
}

function editProjAction(e) {
  disableButtons();
  for (let object of projObjects) {
    if (object.newDisplay == e.target.parentNode) {
      let form = editProj(object.proj);
      object.newDisplay.appendChild(form);
    }
  }
}

function completeProj(e) {
  for (let object of projObjects) {
    if (object.newDisplay == e.target.parentNode) {
      deleteProj(object.proj);
      refreshDisplay();
      hideTasks();
    }
  }
}

function completeTask(e) {
  for (let object of taskObjects) {
    if (object.newDisplay == e.target.parentNode) {
      deleteTask(object.item);
      refreshDisplay();
      hideTasks();
    }
  }
}

function makeNew() {
  let newDo = document.createElement("button");
  newDo.setAttribute("id", "new-button");
  newDo.addEventListener("click", () => {
    if (projList.length === 0) {
      alert("Please create a project first");
      return;
    }
    hideTasks();
    let form = toDoPrompt();
    disableButtons();
    page.appendChild(form);
  });
  newDo.textContent = "New task";
  page.appendChild(newDo);
}

function newProject() {
  let newDo = document.createElement("button");
  newDo.setAttribute("id", "proj-button");
  newDo.addEventListener("click", () => {
    hideTasks();
    let form = projPrompt();
    disableButtons();
    page.appendChild(form);
  });
  newDo.textContent = "New project";
  page.appendChild(newDo);
}

function disableButtons() {
  let buttons = document.getElementsByTagName("button");

  for (let button of buttons) button.disabled = true;
}

function enableButtons() {
  let buttons = document.getElementsByTagName("button");

  for (let button of buttons) button.disabled = false;
}

export {
  displayToDo,
  toDoEditPrompt,
  toDoPrompt,
  makeNew,
  newProject,
  displayProj,
  refreshDisplay,
  hideTasks,
};
