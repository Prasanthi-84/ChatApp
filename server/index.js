//const ws=require('ws')
//import {createServer} from 'http'

import express from 'express'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'


const __filenname=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filenname)

const PORT=process.env.PORT || 3500
const ADMIN="Admin"

//const server=new ws.Server({port:'3000'})
//const httpServer=createServer()
const app=express()

app.use(express.static(path.join(__dirname,"public")))


const expressServer=app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})

//userstate inmemory user tracking
//to track users and rooms
const UsersState={
    users:[], //id,name,room
    setUsers:function (newUserArray) {
        this.users=newUserArray
    }
}

//attaching io socket
const io=new Server(expressServer,{
    //httpServer,{
    cors:{
        origin:process.env.NODE_ENV === "production" ?false :
        ["http://localhost:5501","http://127.0.0.1:5501"],
          methods: ["GET", "POST"],
          credentials: true
    }
})


io.on('connection',(socket)=>{
    console.log('🟢 Client connected ')
    console.log(`User ${socket.id} connected`)
    
    //connection -> only to user
    socket.emit('message',buildMsg(ADMIN,'Welcome to Chat App!'))

    //connection -> to all users
    // socket.broadcast.emit('message',`User ${socket.id.substring(0,5)} connected`)
  

    //when user joins a room
     socket.on('enterRoom',({name,room})=>{
      
        //leave previous room
        const prevRoom=getUser(socket.id)?.room

         if(prevRoom){
            socket.leave(prevRoom)
            io.to(prevRoom).emit('message',buildMsg(ADMIN,
                `${name} has left the room`
            ))
         }
         const user=activeUser(socket.id,name,room)
 
         //cannot update the previous user list  untill 
        //  after the state update in activate user
           if(prevRoom){
            io.to(prevRoom).emit("userList",{
                users:getUserInRoom(prevRoom)
            })
           }      

           //join room
           socket.join(user.room)

           //to user who joined
           socket.emit('message',buildMsg(ADMIN,`You have joined the ${user.room} Chat room `))

           //to everyone else
            socket.broadcast.to(user.room)
           .emit(`message`,buildMsg(ADMIN,`${user.name} has joined the room`))

            //update user list for room
            io.to(user.room).emit('userList',{
                users:getUserInRoom(user.room)
            })

            //update rooms list for everyone
            io.emit('roomlist',{
                rooms:getAllActiveRooms()
            })
     })

  //when user disconnected
    socket.on('disconnect', () => {
        const user=getUser(socket.id)
        userLeavesApp(socket.id)
       // socket.broadcast.emit('message',`User ${socket.id
         //   .substring(0,5)} disconnected`)
        console.log('🔴 Client disconnected');

        if(user){
            io.to(user.room).emit('message',buildMsg(ADMIN,
                `${user.name} has left the room`))

                io.to(user.room).emit('userList',{
                    users:getUserInRoom(user.room)
                })
                io.emit('roomList',{
                  rooms:getAllActiveRooms()
                })
        }
        console.log(`User ${socket.id} disconnected`)
  });


  //message broadcasting within room
    socket.on('message',({name,text})=>{
        const room=getUser(socket.id)?.room
        if(room){
            io.to(room).emit('message',buildMsg(name,text))
        }
        //const b=Buffer.from(message)
       // console.log(b.toString())
       //console.log(data)
      //  socket.send(` Server :${message}`)
      //io.emit('message',`${socket.id.substring(0,5)}:${data}`)
    })



   //listen for an activity
    socket.on('activity',(name)=>{
        const room=getUser(socket.id)?.room
        if(room){
            socket.broadcast.to(room).emit('activity',name)
        }
        //socket.broadcast.emit('activity',name)
    })
})

//httpServer.listen(3500,()=>console.log(`listening on port 3500`))

//[10:34:20] Prabha: Hello everyone!
function buildMsg(name,text){
    return{
        name,
        text,
        time:new Intl.DateTimeFormat('default',{
            hour:'numeric',
            minute:'numeric',
            second:'numeric'
        }).format(new Date())
    }
}


//user functions
function activeUser(id,name,room){
   const user={id,name,room}
   UsersState.setUsers([
    ...UsersState.users.filter(user=>user.id !== id),
    user
   ])
   return user
}

function userLeavesApp(id){
    UsersState.setUsers(
        UsersState.users.filter(user=>user.id !== id)
    )
}

function getUser(id){
    return UsersState.users.find(user=>user.id === id)
}

function getUserInRoom(room){
    return UsersState.users.filter(user=>user.room === room)
}

function getAllActiveRooms(){
    return Array.from(new Set(UsersState.users.map(user=>user.room)))
}