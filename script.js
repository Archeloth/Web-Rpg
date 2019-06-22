//Classes
class Character{
    constructor(charName, charClass, str, agi, int){
        this.charName=charName;
        this.charClass=charClass;
        this.str=str;
        this.agi=agi;
        this.int=int;
    }
    //The character's health
    get MaxHp(){
        return Math.round(this.str*1.25);
    }

    //currHp = MaxHp();

    set Damaged(amount){
        this.currHp-=amount;
    }
}

//Variables
let player = null;

const charName = document.getElementById('name');
const charClass = document.getElementById('class');
const gameArea = document.getElementById('game');
const disabledOverlay = document.getElementById('disabled');
const disabledText = document.getElementById('disabled-text');
let modal = document.getElementById('modal');
let modalText = document.getElementById('modal-text');
const flipBtn = document.getElementById('flip-btn');
const charCreateBtn = document.getElementById('createBtn');
const characterPage = document.getElementsByClassName('character')[0];
const statPage = document.getElementsByClassName('stats')[0];
let statistics = document.getElementsByClassName('statistics')[0];

let points = parseInt("10");
const pPoints = document.getElementById('points');
pPoints.innerHTML=points;

let str = document.getElementById('strength');
let agi = document.getElementById('agility');
let int = document.getElementById('intelligence');

let strOld=parseInt("0");
let agiOld=parseInt("0");
let intOld=parseInt("0");

function ChangePoints(currValue, power){
    if(points == 0){
        resetSliders();
    }
    switch(power){
        case "strength":
            points-=(currValue-strOld);//Subtracts the differential of the slider's "before" and "after" states
            strOld=currValue;

            if(points<0){//If it would go below 0 it resets and adds back up the previous value to the total points
                points+=strOld*1;
                str.value=0;
                strOld=0;
            }
            break;
        case "agility":
            points-=(currValue-agiOld);
            agiOld=currValue;

            if(points<0){
                points+=agiOld*1;
                agi.value=0;
                agiOld=0;
            }  
            break;
        case "intelligence":
            points-=(currValue-intOld);
            intOld=currValue;

            if(points<0){
                points+=intOld*1;
                int.value=0;
                intOld=0;
            }
            break;
        default:
            break;
    }
    //console.log(typeof(points)+" "+typeof(strOld));
    //console.log(`Points: ${points}\nStr: ${str.value},${strOld}\nAgi: ${agi.value},${agiOld}\nInt: ${int.value},${intOld}`);
    pPoints.innerHTML=points;
}

function resetSliders(){
    str.value=0;
    agi.value=0;
    int.value=0;
}

function CheckCharacter(){
    let haveError = false;
    let errorMessage = "";
   if(charName.value === "" || charName.value === null){
       haveError=true;
       errorMessage+="No character name!\n";
   }
   if(points>0){
       haveError=true;
       errorMessage+="You have points to spend!";
   }
   if(haveError){
    alert(errorMessage);
   }else{
        //Make a character for the player with the stats
        player = new Character(charName.value, charClass.value, str.value, agi.value, int.value);
        console.log(player);
        resetSliders();
        LoadStats();
        charCreateBtn.disabled = true;
       //Hide the overlay
        disabledText.style.opacity="0";
        disabledOverlay.style.opacity="0";
        
        //Create the tiles
        //Looped
        for(let i = 0; i < 100; i++){
            let tile = document.createElement("div");
            tile.classList.add("tile");
            tile.id=i+1;
            tile.addEventListener('click', ()=> {
                //Clicking
                //console.log(tile.classList[1]);
                //Random event based on what is happening
                if(validateClick(tile)){
                    EventModal();//Send the last class
                    tile.classList.add("explored");
                }
            });
            gameArea.appendChild(tile);
            
        }
        GenerateMap(Array.from(document.getElementsByClassName('tile')));
        
        setTimeout(()=>disabledOverlay.style.zIndex="0",2500);
   }
}
function GenerateMap(tiles){
    //Coloring and the layout of the map

    //Get the walls!
    tiles.forEach(t => {
        if(t.id < 10 || t.id > 90 || t.id%10==0 || t.id%10==1){
            t.classList.add("wall");
        }else{
            //Random walls
            let rnd = Math.floor(Math.random()*10)//10% chance
            if(rnd==0){
                t.classList.add("wall");
            }else{
                t.classList.add("unexplored");
            }
        }
    });
}
function validateClick(tile){
    if(tile.classList.contains("wall") || tile.classList.contains("explored")){
        return false;
    }
    else
        return true;
}
function EventModal(){
    //Random event
    //45% chance to fight an enemy
    //20% trap
    //20% empty room
    //10% health potion
    //5% boss fight

    //Modal pop up
    let event = "";
    let chance = Math.floor(Math.random()*100);
    if(chance <5){
        //BOSSS
        event = "BOSS!!!";
    }
    if(chance >=5 && chance <15){
        //Hp potion
        event = "Hp Potion!";
    }
    if(chance >= 15 && chance <35){
        //Empty room
        event = "Empty room!";
    }
    if(chance >= 35 && chance <55){
        //Trap
        event = "Trap!!";
    }
    if(chance >= 55){
        //Fight
        event = "Fight!!!";
    }
    console.log(event);
    //And after its done, it becomes explored (cant go back to it)
    modal.classList.add("active");
    modalText.innerText = event;
}
function CloseModal(){
    modal.classList.remove("active");
    modalText.innerText = "";
}
function Flip(){
    if(!characterPage.classList.contains('char-up') && !statPage.classList.contains('inv-down')){
        characterPage.classList.add('char-up');
        statPage.classList.add('inv-down');
        flipBtn.innerText = "Stats";
    }else{
        characterPage.classList.remove('char-up');
        statPage.classList.remove('inv-down');
        flipBtn.innerText = "Inventory";
    }
}
function LoadStats(){
    //Name
    let name = document.createElement('p');
    name.innerText = "Character name: "+player.charName;
    statistics.appendChild(name);
    //Class
    let charClass = document.createElement('p');
    charClass.innerText = "Class: "+player.charClass;
    statistics.appendChild(charClass);
    //Strength
    let charStr = document.createElement('p');
    charStr.innerText = "Strength: "+player.str;
    statistics.appendChild(charStr);
    //Agility
    let charAgi = document.createElement('p');
    charAgi.innerText = "Agility: "+player.agi;
    statistics.appendChild(charAgi);
    //Intelligence
    let charInt = document.createElement('p');
    charInt.innerText = "Intelligence: "+player.int;
    statistics.appendChild(charInt);
}
function TakeDamage(){
    console.log("Took damage");
}