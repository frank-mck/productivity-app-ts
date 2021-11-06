import React, { useState, useEffect } from 'react'
import TaskDataService from '../../services/TaskService';
import Button from '@mui/material/Button';
import { DeleteTask } from '../../components/DeleteTask';
import { AddTask } from '../../components/AddTask/AddTask';
import { useHistory } from 'react-router-dom';
import './Tasks.css'
import '../../components/AddTask/AddTask.css'
import jwt from 'jsonwebtoken';

interface keyValuePair {
  _id: string, 
  task: string,
}

export const Tasks: React.FC<any> = ({ setAddTasks, addTasks }) => {
  const [update, setUpdate] = useState<keyValuePair>({_id: '', task: ''});

  const history = useHistory();

  const getVerification = (): string | object => {
    const token: any = localStorage.getItem('authToken');
    const secret: any = process.env.REACT_APP_JWT_SECRET;
    try {
      return jwt.verify(token, secret);
    } catch(error) {
      return 'Not verified!'
    }
  }

  useEffect(() => {
    if(getVerification() === 'Not verified!') {
      history.push('/')
    }
  });

  const editTask = async (task: {task: string}) => {
    const updated = await TaskDataService.updateTask(update._id, task);
    const getAll = await TaskDataService.getAll().then(res => setAddTasks(res.data));
    Promise.all([updated, getAll])
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
    <AddTask setAddTasks={setAddTasks} />
    <div className ='tasks-container'>
      {addTasks.map((task: keyValuePair, key: number) => {
        // returns an edit form if the user clicks on an edit button
        if (update._id === task._id) {
          return (
          <form className='edit-task-form' key={key} onSubmit={formHandler}>
            <input 
              className='edit-task-input'
              type='text' 
              placeholder={task.task}
              onChange={(e) => setUpdate({_id: task._id, task: e.target.value})}>
            </input>
            <Button 
              variant='contained'
              type='submit'
              style={{margin: '10px', backgroundColor: 'rgb(0, 252, 201)', color: 'black'}}
              onClickCapture={() => editTask({task: update.task})}>
              Update
            </Button>
          </form> )
        } else {
          return (
          <div key={key} id={task._id} className='task'>
            <p>{task.task}</p> 
            <div className='task-buttons'>
            <DeleteTask 
              addTasks={addTasks} 
              setAddTasks={setAddTasks} 
              taskId={task._id} 
            />
            <Button
            variant='contained'
             onClick={() => toggleUpdate(task._id, task.task)}
             style={{margin: '10px', backgroundColor: 'rgb(0, 252, 201)', color: 'black'}}
              >Edit</Button>
            </div>
          </div>)
        }
      })}
    </div>
    </>
  )
}
