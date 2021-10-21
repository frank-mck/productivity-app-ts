import React, { useState } from 'react'
import TaskDataService from '../services/task';
import { DeleteTask } from './DeleteTask';

export const Tasks: React.FC<any> = ({ setAddTasks, addTasks }) => {
  const [update, setUpdate] = useState<any>({});

  const editTask = async (task: object) => {
    const updated = await TaskDataService.updateTask(update.id, task);
    const getAll = await TaskDataService.getAll().then(res => setAddTasks(res.data))
    Promise.all([updated, getAll])
  }

  const formHandler = (e: any) => {
    e.preventDefault();
    setUpdate({});
    setAddTasks([...addTasks]);
  }

  const toggleEdit = (id: string, task: string) => {
    setUpdate({id: id, task: task});
  }

  return (
    <div>
      {addTasks.map((task: any, key: any) => {
        // returns an edit form if the user clicks on an edit button
        if (update.id === task._id) {
          return <form key={key} onSubmit={formHandler}>
          <input 
            type='text' 
            placeholder={task.task}
            onChange={(e) => setUpdate({id: task._id, task: e.target.value}) }>
          </input>
          <button 
            type='submit'
            onClickCapture={() => editTask({task: update.task})}>
            Update
          </button>
        </form>
        } else {
          return <div key={key} id={task._id} className='task' style={{display: 'flex'}}>
          <p>{task.task}</p> 
          <DeleteTask addTasks={addTasks} setAddTasks={setAddTasks} taskId={task._id}  />
          <button onClick={() => toggleEdit(task._id, task.task)}>Edit</button>
        </div>
        }
      })}
    </div>
  )
}
