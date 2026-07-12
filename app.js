// ===================================
// ABYSS NOTES
// v1.0
// ===================================

const workspace = document.getElementById("workspace");
const nodesLayer = document.getElementById("nodes");
const svg = document.getElementById("lines");

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

const newBtn = document.getElementById("newBtn");
const deleteBtn = document.getElementById("deleteBtn");
const saveBtn = document.getElementById("saveBtn");

const light = document.getElementById("light");

let nodes =
JSON.parse(
localStorage.getItem("abyssNodes")
) || [];

let current = null;

let nodeId = 0;

document.addEventListener("pointermove",(e)=>{

light.style.left=e.clientX+"px";
light.style.top=e.clientY+"px";

});

function save(){

localStorage.setItem(

"abyssNodes",

JSON.stringify(nodes)

);

}

function newNode(){

const note={

id:Date.now(),

title:"New Note",

content:"",

x:150+Math.random()*500,

y:120+Math.random()*350,

links:[]

};

nodes.push(note);

createNode(note);

save();

}

function createNode(note){

const div=document.createElement("div");

div.className="node";

div.dataset.id=note.id;

div.style.left=note.x+"px";
div.style.top=note.y+"px";

div.innerHTML=

"<span>"+note.title+"</span>";

nodesLayer.appendChild(div);

enableDrag(div,note);

div.onclick=(e)=>{

e.stopPropagation();

select(note,div);

};

}

function select(note,element){

current=note;

titleInput.value=note.title;

contentInput.value=note.content;

document

.querySelectorAll(".node")

.forEach(n=>{

n.classList.remove("selected");

});

element.classList.add("selected");

}

titleInput.oninput=()=>{

if(!current)return;

current.title=titleInput.value;

document

.querySelector(

"[data-id='"+current.id+"'] span"

).textContent=current.title;

save();

};

contentInput.oninput=()=>{

if(!current)return;

current.content=contentInput.value;

save();

};

function enableDrag(div,note){

let drag=false;

let dx=0;

let dy=0;

div.onpointerdown=(e)=>{

drag=true;

dx=e.offsetX;

dy=e.offsetY;

div.setPointerCapture(e.pointerId);

};

div.onpointermove=(e)=>{

if(!drag)return;

note.x=e.clientX-dx;

note.y=e.clientY-dy;

div.style.left=note.x+"px";

div.style.top=note.y+"px";

drawLines();

};

div.onpointerup=()=>{

drag=false;

save();

};

}

deleteBtn.onclick=()=>{

if(!current)return;

nodes=

nodes.filter(

n=>n.id!==current.id

);

document

.querySelector(

"[data-id='"+current.id+"']"

)

.remove();

current=null;

titleInput.value="";

contentInput.value="";

drawLines();

save();

};

newBtn.onclick=()=>{

newNode();

};

nodes.forEach(createNode);

workspace.onclick=()=>{

current=null;

document

.querySelectorAll(".node")

.forEach(n=>{

n.classList.remove("selected");

});

};

function drawLines(){

svg.innerHTML="";

nodes.forEach(node=>{

node.links.forEach(id=>{

const target=

nodes.find(n=>n.id===id);

if(!target)return;

const line=

document.createElementNS(

"http://www.w3.org/2000/svg",

"line"

);

line.setAttribute(

"x1",

node.x+60

);

line.setAttribute(

"y1",

node.y+60

);

line.setAttribute(

"x2",

target.x+60

);

line.setAttribute(

"y2",

target.y+60

);

line.setAttribute(

"stroke",

"#16dfff"

);

line.setAttribute(

"stroke-width",

"2"

);

svg.appendChild(line);

});

});

}

saveBtn.onclick=save;