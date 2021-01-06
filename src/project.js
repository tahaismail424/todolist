
const projItem = (ti, desc, tL) => {

    let title = ti;
    let description = desc;
    let taskList = tL;

    return {
        title,
        description,
        taskList,
    }
}


let projList = [];

projList[0] = projItem('My first project', 'This is my interesting project \
in which I will do interesting things', []);


//sets project list equal to what is in localStorage if it exists

if (localStorage.getItem('projects')) {
    projList = JSON.parse(localStorage.getItem('projects') || '[]');
}

//sets localStorage to what is currently in project list initially 
localStorage.setItem('projects', JSON.stringify(projList));

function saveProj(item) {

    let newData = [];
    let inputs = document.getElementsByClassName('input');
    for (let input of inputs) newData.push(input.value);

    console.log(newData);

    let newProj = (item) ? projItem(newData[0], newData[1], item.taskList) :
    projItem(newData[0], newData[1], []);
    
    let projFound = false;

    for (let proj in projList) {
        if (item === projList[proj]) {
            projList[proj] = newProj;
            projFound = true;
        }
    }

    if (!projFound) projList.push(newProj);

}

function deleteProj(item) {
    projList.splice(projList.indexOf(item), 1);
}

function addToProject(preTask, task) {

    for (let project of projList) {
        //remove from previous list
        for (let item of project.taskList) {
            if (item == preTask) project.taskList.splice(project.taskList.indexOf(preTask), 1);
        }
        //add to new one
        if (task.project == project.title) project.taskList.push(task);
    }
    
}

export {projList, saveProj, deleteProj, addToProject};