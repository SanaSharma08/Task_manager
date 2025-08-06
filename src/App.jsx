import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import './App.css'
import Navbar from './components/Navbar.jsx'
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, setTodo] = useState(""); //input text
  const [Todos, setTodos] = useState([]); //Array containing all todos
  const [showfinished, setshowfinished] = useState(true);

useEffect(() => { //important concept
      if (Todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(Todos));
    }
  }, [Todos]);  //This effect runs whenever `todos` state changes, For anyone wondering when we write todos and reload the page last todo not getting added to the local storage , its happening because of asynchronous nature of setState ...

  useEffect(() => { // runs once at start & loads all todos from localstorage
    let todoString=localStorage.getItem("todos");
    if(todoString){ // runs when length of Todos i.e todoString is not null/0
      let todos=JSON.parse(todoString);
      setTodos(todos); 
    }
  },[]);
  

  const saveToLS=() => { //saving Todos array(in string format) to localstorage
    localStorage.setItem("todos",JSON.stringify(Todos)); 
  }
  const toggleFinished=(e) => {
    setshowfinished(!showfinished);
  }
  

  const handleEdit=(e,id)=>{ //this function takes valur to input box & deletes the todo from a list so you ean rewite it in box & the regular add function runs when u click save. So this function does not update an item in place- it just creates an illusion. in reality you are just deleting the old todo & writing a new one.
    console.log(`The id is ${id}`); 
    let item = Todos.filter(i=> i.id===id);
    setTodo(item[0].todo) // putting value of item in input box
    setTodos(Todos.filter(task=> task.id != id)); //deleting old component
    saveToLS();
  }
  const handleDelete=(e,id)=>{
    console.log(`The id is ${id}`); //returns id of item being deleted in console- for developer reference only - not required in software coding.
    setTodos(Todos.filter(task=> task.id != id));
    saveToLS();
  }
  const handleChange=(e)=>{ // function that lets us type input & accepts it as a value in Todos array.
    setTodo(e.target.value)
  }
  const handleAdd=()=>{
    //spread existing Todos in a new array & add new object.
    setTodos([...Todos,{todo, isCompleted:false,id:uuidv4()}]); //isCompleted is an object property that will help us in making a crossed over effect when a task is completed.
    setTodo(""); // This will clear the input box after adding
    console.log(Todos);
    saveToLS();
  }
  const handleCheckbox=(e)=>{
    let id= e.target.name; // we stored item id in name field of input.
    //we cannot directly alter value like e.target.value=!e.target.value- direct dom manipulation in input type text is not allowed. You must know the id of that item to make changes directly into the Todos array. Directly changing value will not copy changes in the main array.

    // Correct way to update state: Create a new array
    const updatedTodos = Todos.map(item => { //map always gives out an array/list of items it processes so an array of items is stored in updatedTodos.
      if (item.id === id) {
        // Create a new object for the updated item
        return { ...item, isCompleted: !item.isCompleted };
      }
      return item; // Return unchanged items as they are
    });

    setTodos(updatedTodos); // Set state with the new array
    saveToLS();
  }

  return (
    <div className="main bg-gradient-to-b from-leftt to-rightt min-h-[100vh] font-poppins">
      <Navbar/>
      <div className="md:container md:mx-auto my-5 rounded-xl p-10 bg-grad-mix/40 text-white min-h-[80vh] md:w-1/2">
      <h1 className="heading text-center text-xl font-bold text-rightt"> Manager.task : Manage All Your Tasks At One Place</h1>
      <div className="addTodo my-5">
        <h2 className="text-lg font-bold">Add a Task</h2>
        <input type="text" onChange={handleChange} value={todo} className='w-1/2 border rounded-md ' /> 
        <button onClick={handleAdd} disabled={todo.length<=2} className='bg-button hover:bg-violet-950 disabled:bg-violet-200 p-3 py-1 text-white text-sm font-bold rounded-md mx-6 cursor-pointer'>Save</button>
      </div>
        <input onChange={toggleFinished} type="checkbox" name="" id="" checked={showfinished} /> Show Finished Tasks
          <h1 className='text-xl font-bold text-rightt' >Your Tasks</h1>
          <div className="todos">
          {/* Short Cicuit Evaluation */}
          {Todos.length==0 && <div>No Todos to display</div>} 
            {Todos.map(item =>{
              return (showfinished || !item.isCompleted) && <div key={item.id} className="todo flex gap-4 justify-between items-start my-2">
              <div className="points flex gap-4 items-start">
              <input onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} name={item.id} id="" />
              <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
              </div>
              <div className="buttons flex h-full">
                  <button onClick={(e)=>{handleEdit(e,item.id)}} className='bg-button hover:bg-violet-950 p-3 py-1 text-white text-md font-bold rounded-md mx-2 cursor-pointer'><FaEdit /></button>
                  <button onClick={(e)=>{handleDelete(e, item.id)}} className='bg-button hover:bg-violet-950 p-3 py-1 text-white text-md font-bold rounded-md mx-2 cursor-pointer'><MdDeleteForever /></button>
              </div>
            </div>
            })}
          </div>
      </div>
    </div>
  )
}

export default App
