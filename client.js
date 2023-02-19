const socket = io();
const accent_color=["#B1AFFF","#C8FFD4","#A8E890","#DD5353","#D58BDD","#FFA1CF","#937DC2"];
var formvalue= new URLSearchParams(window.location.search)
var user=formvalue.get('username')
const myContainer=document.getElementById('show_users')
//Sending Event To server when user is joined 
socket.emit("user-connected",user)
//Handle the Event of new user joined and acknowledge to another sockets
socket.on('new-user joined',(name,userid)=>{
      const color=Math.floor(Math.random()*7)
      myContainer.insertAdjacentHTML("afterbegin",`<p class="user_icon" style="background-color:${accent_color[color]};">${name.slice(0,1)}</p><h3 style="display:inline;">${name} </h3><h4 id="${userid}" style="display:inline;color:green;margin-left:20px;">Online</h4><hr>`)
      showMessage(`${name} join the chat`,"user_msg","") 
})
var form =document.getElementById('form')
var input=document.getElementById('input')
form.addEventListener('submit',function(e){
    e.preventDefault()
    if(input.value){
        socket.emit('send_msg',input.value,{from:user})
        showMessage(input.value,'msg',"")
        input.value=""
      }
     
  })
  //Handle client side Event when user recive msg from other socket
  socket.on('recieve msg',(msg,name)=>{
     showMessage(msg,'left_msg',name)
  })
  //Handle Client Side Event When user is disconnected
  socket.on('user_disconnect',(name,userid)=>{
      showMessage(`${name} left the chat`,'user_msg',"")
      document.getElementById(`${userid}`).innerText="offline"
      document.getElementById(`${userid}`).style.color="red";
  })

//function for showing msg at the client side with DOM
function showMessage(message,cls,name){
     const msg_container= document.getElementById('msg_container')
     const div=document.createElement('div')
     div.classList.add(cls)
     const date=new Date();
     div.innerHTML=`<p style="font-size:15px;">${name}</p><p style="display:inline;font-size:20px;">${message}</p>&nbsp&nbsp<p style="display:inline;font-size:12px;"> ${date.toLocaleTimeString()}</p>`
     console.log(msg_container.lastElementChild)
     msg_container.lastElementChild.append(div)
  //    msg_container.insertBefore(div,msg_container.lastElementChild)
}