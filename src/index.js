import _ from 'lodash';
import './style.css';
import {taskList} from './to-do.js';
import {addToProject} from './project.js';
import {makeNew, newProject, refreshDisplay, hideTasks} from './load.js';

//make the creation buttons
newProject();

makeNew();

//boot up default/original tasks

for (let task of taskList) {
    addToProject(task, task);
}
refreshDisplay();

hideTasks();




