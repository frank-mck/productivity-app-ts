import React, { useState } from 'react'
import TaskDataService from '../../services/TaskService';
import Button from '@mui/material/Button';
import { DeleteTask, } from '../../components/DeleteTask';
import { AddTask } from '../../components/AddTask/AddTask';
import { useHistory } from 'react-router-dom';
import './Tasks.css'
import '../../components/AddTask/AddTask.css'

type keyValuePair = {
  _id: string, 
  task: string,
}

export const Tasks: React.FC<any> = ({ setAddTasks, addTasks, setAuthMesgs, setSignedinUser }) => {
  const [update, setUpdate] = useState<keyValuePair>({_id: '', task: ''});

  const history = useHistory();

  const editFormStyles: any = {
    visibility: update && 'visible'
  }

  const editTask = async (task: {task: string}) => {
    try {
      const updated = TaskDataService.updateTask(update._id, task);
      const getAll = TaskDataService.getAll().then(res => setAddTasks(res.data));
      await Promise.all([updated, getAll]);
    } catch(err: any) {
      setAuthMesgs(err.response.data.error);
      history.push('/');
    }
  }

  const formHandler = (e: any) => {
    e.preventDefault();
    setUpdate({_id: '', task: ''});
    setAddTasks([...addTasks]);
  }

  const toggleUpdate = (id: string, task: string) => {
    setUpdate({_id: id, task: task});
  }

  return (
    <>
    <AddTask setAddTasks={setAddTasks} setAuthMesgs={setAuthMesgs} setSignedinUser={setSignedinUser} />
    <div className ='tasks-container'>
      {addTasks.map((task: keyValuePair, key: number) => {
        // returns an edit form if the user clicks on an edit button
        if (update._id === task._id) {
          return (
          <form style={editFormStyles} className='edit-task-form' key={key} onSubmit={formHandler}>
            <input 
              className='edit-task-input'
              type='text' 
              placeholder={task.task}
              onChange={(e) => setUpdate({_id: task._id, task: e.target.value})}>
            </input>
            <Button 
              variant='contained'
              type='submit'
              size="small"
              style={{color: 'rgb(216, 216, 216)', backgroundColor: '#1d4774', marginRight: '.4rem'}}
              onClickCapture={() => editTask({task: update.task})}>
              Update
            </Button>
          </form> )
        } else {
          return (
          <div key={key} id={task._id} className='task' >
            <p>{task.task}</p> 
            <div className='task-buttons'>
            <Button
              size="small"
              variant='outlined'    
              onClick={() => toggleUpdate(task._id, task.task)}
              style={{borderRadius: '50px'}}
              >Edit</Button>
            <DeleteTask 
              setAuthMesgs={setAuthMesgs}
              addTasks={addTasks} 
              setAddTasks={setAddTasks} 
              taskId={task._id} 
            />
            </div>
          </div>)
        }
      })}
    </div>
    </>
  )
}
