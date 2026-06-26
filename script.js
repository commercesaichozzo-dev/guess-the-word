let words=[
"universita",
"computer",
"streaming",
"telefono",
"programmazione",
"javascript",
"github",
"overlay",
"internet",
"monitor",
"microfono"
];

let currentWord="";
let display=[];

function newWord(){

currentWord=words[Math.floor(Math.random()*words.length)];

display=currentWord.split("").map(()=>"_");

update();

}

function update(){

document.getElementById("word").innerHTML=display.join(" ");

}

window.revealLetter=function(letter){

for(let i=0;i<currentWord.length;i++){

if(currentWord[i]==letter){

display[i]=letter;

}

}

update();

if(display.join("")==currentWord){

document.getElementById("winner").innerHTML="Parola indovinata!";

setTimeout(()=>{

document.getElementById("winner").innerHTML="";

newWord();

},5000);

}

}

newWord();
