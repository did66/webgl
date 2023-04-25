import React from "react";
import TaskCard from "./TaskCard";
import "./TaskGrid.css";
import "./TaskCard.css";

export default function TaskGrid(props) {
  let taskList = props.taskList;
  if (taskList === undefined) {
    taskList = [];
  }
  // if (taskList.length > 8) {
  //     taskList = taskList.slice(0, 8)
  // }
  console.log(">>>>>>>>>>>>>>>>>>", taskList);

  return (
    <div className="taskGrid">
      {taskList.map((item, index) => {
        return (
          <div className="taskCard">
            <TaskCard
              className="taskCard"
              key={item.task_id}
              task={item}
            ></TaskCard>
          </div>
        );
      })}

      {/* <div className="taskGrid--row">
                
               
                <div className="taskGrid--col">
                    {
                        taskList.length >= 1 && <TaskCard task={taskList[0]}></TaskCard>
                    }
                </div>
                <div className="taskGrid--col">
                    {
                        taskList.length >= 2 && <TaskCard task={taskList[1]}></TaskCard>
                    }
                </div> 
            </div> */}

      {/* <div className="taskGrid--row">
                <div className="taskGrid--col">
                    {
                        taskList.length >= 3 && <TaskCard task={taskList[2]}></TaskCard>
                    }
                </div>
                <div className="taskGrid--col">
                    {
                        taskList.length >= 4 && <TaskCard task={taskList[3]}></TaskCard>
                    }
                </div>
            </div>
             */}
    </div>
  );
}
