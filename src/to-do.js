//makes to-do list objects
import { projList, addToProject } from "./project.js";

let prioList = ["high", "moderate", "meh", "low"];

const toDoItem = (ti, desc, due, prio, proj) => {
  let title = ti;
  let description = desc;
  let dueDate = due;
  let priority = prio;
  let project = proj ? proj : undefined;

  return {
    title,
    description,
    dueDate,
    priority,
    project,
  };
};

let taskList = [];

taskList[0] = toDoItem(
  "My first task",
  "I will do this task as tasks are meant to be done",
  "2020-12-31",
  prioList[2],
  projList[0].title
);

//sets task list equal to what is in localStorage if it exists

if (localStorage.getItem("tasks")) {
  taskList = JSON.parse(localStorage.getItem("tasks") || "[]");
}

//sets localStorage to what is currently in task list initially

localStorage.setItem("tasks", JSON.stringify(taskList));

//edit to-do item

function saveToDo(item) {
  let newData = [];
  let inputs = document.getElementsByClassName("input");
  for (let input of inputs) {
    if (input.type !== "radio") newData.push(input.value);
    else if (input.checked) newData.push(input.value);
  }

  console.log(newData);

  let newTask = toDoItem(
    newData[0],
    newData[1],
    newData[2],
    newData[3],
    newData[4]
  );

  let taskFound = false;

  for (let task in taskList) {
    if (item === taskList[task]) {
      taskList[task] = newTask;
      taskFound = true;
    }
  }

  if (!taskFound) taskList.push(newTask);

  addToProject(item, newTask);
}

function deleteTask(item) {
  taskList.splice(taskList.indexOf(item), 1);
}

export { prioList, saveToDo, taskList, deleteTask };
