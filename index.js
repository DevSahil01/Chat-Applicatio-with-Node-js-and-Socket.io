const express=require('express')
const app=express()
const port=3000
const http=require('http')
const server=http.createServer(app)
const { Server }=require('socket.io')
const io=new Server(server)
const path=require('path')
//this two functions are used for serving the static files so that map properly
app.use(express.static(__dirname));
app.use(express.static('static pages'))

app.get('/',(req,res)=>{
   res.sendFile(path.join(__dirname , './static pages/home.html'))
})
const users=[]
io.on('connection', (socket) =>{
      socket.on('user-connected',(name)=>{
        users.push({name:name,
                    id:socket.id,
                    status:"online"})
        users.forEach(user=> {
           if(user.id==socket.id){
            io.emit('new-user joined',user.name,user.id) 
           }
         
        });
      })
      socket.on('send_msg',(msg,name)=>{
         socket.broadcast.emit('recieve msg',msg,name.from)
      })
      socket.on('disconnect',()=>{
         users.forEach((user,index) => {
            if(user.id==socket.id){
               users.splice(index,1,{name:user.name,
                                         id:user.id,
                                         status:"offline"})
               console.log("offline output",users)
              socket.broadcast.emit('user_disconnect',user.name,user.id)
            }
         });
      })
   });


server.listen(port,()=>{
    console.log(`the app listen to port ${port}`)
})