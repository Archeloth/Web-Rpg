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
let player = {};

const charName = document.getElementById('name');
const charClass = document.getElementById('class');
const gameArea = document.getElementById('game');
const disabledText = document.getElementById('disabled');

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
       //Let the game start
        gameArea.classList.remove("disabled");
        disabledText.style.visibility="hidden";
   }
    
}