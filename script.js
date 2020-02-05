/*
TODO:
-   add mozilla support to the sliders
-   mana/stamina system, so the player can't spam the same abilities
-   restart when the level ends, and give another goal to the player, give them + skillpoints to spend
-   add correct graphics and animations
*/
//Classes
class Character{
    constructor(charName, charClass, str, agi, int){
        this.charName=charName;
        this.charClass=charClass;
        this.str=str;
        this.agi=agi;
        this.int=int;

        //The character's health
        this.maxHp=Math.round(this.str*1.25+10);

        this.currHp=this.maxHp;

        //Check if the character is still alive
        this.isAlive = true;

        //Gold in the character's stash
        this.gold = 0;

        this.abilities = [];
    }
    SetGold(amount){
        this.gold+=amount;
    }

    get CurrHp(){
        return this.currHp;
    }

    get MaxHp(){
        return this.maxHp;
    }

    Damaged(amount){
        if(amount == "full"){
            this.currHp = this.maxHp;
        }
        if(this.currHp-amount<=this.maxHp){ //Dont get overhealed
            this.currHp-=amount;
        }
        if(this.currHp<=0){
            this.isAlive=false;
        }
    }
}
//Lists
const enemyTypes = [
    {
        name: "Pigmen",
        class: "fighter",
        str: 2,
        agi: 2,
        int: 0
    },
    {
        name: "Spider",
        class: "fighter",
        str: 1,
        agi: 5,
        int: 2
    },
    {
        name: "Evil Skeleton",
        class: "rogue",
        str: 4,
        agi: 4,
        int: 2
    },
    {
        name: "Conjurer",
        class: "mage",
        str: 2,
        agi: 2,
        int: 4
    },
    {
        name: "Necromancer",
        class: "mage",
        str: 3,
        agi: 3,
        int: 5
    },
    {
        name: "Baby Dragon",
        class: "fighter",
        str: 5,
        agi: 5,
        int: 2
    },
    {
        name: "Black Sheep",
        class: "fighter",
        str: 1,
        agi: 1,
        int: 1
    },
    {
        name: "Living Statue",
        class: "fighter",
        str: 2,
        agi: 2,
        int: 0
    },
    {
        name: "Robber",
        class: "rogue",
        str: 2,
        agi: 4,
        int: 3
    }
]

const allAbilities = [
    {
        name: 'Slash',
        baseDamage: 4,
        description: "Slashing enemies in front of you",
        modifier: "str",
        specificClass: "fighter",
        effect: "damage"
    },
    {
        name: 'Block',
        baseDamage: 1,
        description: "Blocking incoming attacks",
        modifier: "agi",
        specificClass: "fighter",
        effect: "block"
    },
    {
        name: 'Thrust',
        baseDamage: 6,
        description: "Thrusting your sword right at the enemy",
        modifier: "str",
        specificClass: "fighter",
        effect: "damage"
    },
    {
        name: 'Pray',
        baseDamage: 0,
        description: "Minor healing and empowering next attack",
        modifier: "int",
        specificClass: "fighter",
        effect: "channel"
    },
    {
        name: 'Fireball',
        baseDamage: 4,
        description: "Shoots a fireball",
        modifier: "int",
        specificClass: "mage",
        effect: "damage"
    },
    {
        name: 'Shock',
        baseDamage: 1,
        description: "Shoots lightning and stuns enemies",
        modifier: "agi",
        specificClass: "mage",
        effect: "damage"
    },
    {
        name: 'Curse',
        baseDamage: 6,
        description: "Highly debuffs enemies",
        modifier: "int",
        specificClass: "mage",
        effect: "debuff"
    },
    {
        name: 'Channel',
        baseDamage: 0,
        description: "Buffs next attack",
        modifier: "str",
        specificClass: "mage",
        effect: "channel"
    },
    {
        name: 'Stab',
        baseDamage: 4,
        description: "Stabs your dagger in the enemies back",
        modifier: "agi",
        specificClass: "rogue",
        effect: "damage"
    },
    {
        name: 'Dodge',
        baseDamage: 1,
        description: "Rolls to safety, away from incoming attacks",
        modifier: "agi",
        specificClass: "rogue",
        effect: "block"
    },
    {
        name: 'Plot',
        baseDamage: 6,
        description: "Debuffs enemies with their secrets used against them",
        modifier: "int",
        specificClass: "rogue",
        effect: "debuff"
    },
    {
        name: 'Disguise',
        baseDamage: 0,
        description: "Stunt enemies",
        modifier: "int",
        specificClass: "rogue",
        effect: "block"
    },
]

//Variables
let player = null;

const charName = document.getElementById('name');
const charClass = document.getElementById('class');
const gameArea = document.getElementById('game');
const disabledOverlay = document.getElementById('disabled');
const disabledText = document.getElementById('disabled-text');
let modal = document.getElementById('modal');
let modalHeader = document.getElementById('modal-header');
const modalContent = document.getElementById('modal-content');
const flipBtn = document.getElementById('flip-btn');
const charCreateBtn = document.getElementById('createBtn');
const characterPage = document.getElementsByClassName('character')[0];
const statPage = document.getElementsByClassName('stats')[0];
const statistics = document.getElementsByClassName('statistics')[0];
const healthBar = document.getElementById('current-health');
const healthNumber = document.getElementById('health-number');
const statName = document.getElementById('charName');
const statClass = document.getElementById('charClass');
const statStr = document.getElementById('charStr');
const statAgi = document.getElementById('charAgi');
const statInt = document.getElementById('charInt');
const statGold = document.getElementById('charGold');

let points = parseInt("10");
const pPoints = document.getElementById('points');
pPoints.innerHTML=points;

let str = document.getElementById('strength');
let agi = document.getElementById('agility');
let int = document.getElementById('intelligence');

let strOld=parseInt("0");
let agiOld=parseInt("0");
let intOld=parseInt("0");

flipBtn.style.display="none";

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
       /*STARTS THE GAME HERE */
       Flip();
       flipBtn.style.display="block";
        //Make a character for the player with the stats
        player = new Character(charName.value, charClass.value, str.value, agi.value, int.value);
        //Giving the player its class specific abilities
        allAbilities.forEach((ability) => {
            if(ability.specificClass == charClass.value){
                player.abilities.push(ability);
            }
        });
        console.log(player);
        resetSliders();
        UpdateStats();
        HealthUpdate(0);
        charCreateBtn.disabled = true;
       //Hide the overlay
        disabledText.style.opacity="0";
        disabledOverlay.style.opacity="0";
        //Map objective
        alert("OBJECTIVE: Collect 50 gold");

        //Custom cursor based on the player's class
        const body = document.getElementsByTagName('body')[0];
        switch(player.charClass){
            case "fighter":
                body.style.cursor = "url('assets/cursors/sword.cur'), auto";
                break;
            case "rogue":
                body.style.cursor = "url('assets/cursors/dagger.cur'), auto";
                break;
            case "mage":
                body.style.cursor = "url('assets/cursors/wand.cur'), auto";
                break;
        }

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
        BossFightEvent();
    }
    if(chance >=5 && chance <15){
        //Hp potion
        event = "Hp Potion!";
        HealthPotionEvent();
    }
    if(chance >= 15 && chance <35){
        //Empty room
        event = "Empty room!";
        EmptyRoomEvent();
    }
    if(chance >= 35 && chance <55){
        //Trap
        event = "Trap!!";
        TrapEvent();
    }
    if(chance >= 55){
        //Fight
        event = "Fight!!!";
        FightEvent();
    }
    console.log(event);
    //And after its done, it becomes explored (cant go back to it)
    modal.classList.add("active");
    modalHeader.innerText = event;
}
function CloseModal(){
    modal.classList.remove("active");
    modalHeader.innerText = "";
    //Destroys everything inside the modal's content part
    while(modalContent.firstChild){
        modalContent.removeChild(modalContent.firstChild);
    }
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
function UpdateStats(){
    statName.innerText = "Name: "+player.charName;
    statClass.innerText = "Class: "+player.charClass;
    statStr.innerText = "Str: "+player.str;
    statAgi.innerText = "Agi: "+player.agi;
    statInt.innerText = "Int: "+player.int;
    statGold.innerText = "Gold: "+player.gold;
    
}
function HealthUpdate(damage){
    //Damage is positive if takes damage, negative if heals

    player.Damaged(damage);
    GameOverCheck();
    //console.log(player.CurrHp +"/"+player.MaxHp+"/"+player.isAlive);

    healthNumber.innerText=player.CurrHp+"/"+player.MaxHp;
    //Takes the value of the current health and divide it with the max health, to get the current health % to show off in the health bar
    healthBar.style.width = `${(player.CurrHp/player.MaxHp)*100}%`;
}
function GameOverCheck(){
    //Player died
    if(player.isAlive===false){
        CloseModal();
        disabledText.innerText="GAME OVER!";
        disabledText.style.opacity="1";
        disabledOverlay.style.opacity="1";
        setTimeout(()=>disabledOverlay.style.zIndex="10",1000);
    }
    //Player won the game
    if(player.gold >= 50){
        CloseModal();
        disabledText.innerText="YOU WON! THANK YOU FOR PLAYING MY GAME :)";
        disabledText.style.opacity="1";
        disabledOverlay.style.opacity="1";
        setTimeout(()=>disabledOverlay.style.zIndex="10",1000);
    }
}
function TrapEvent(){
    //Text and damage
    let trapEventText = document.createElement('p');
    let trapDamage = Math.floor(Math.random() * 5);
    trapEventText.innerText = `You stepped uppon a spiky trap! You lost ${trapDamage} HP! `;
    if(trapDamage===0){
        trapEventText.innerText = "You almost stepped on a spiky trap, but were on your guard! You didn't take damage!";
    }else{
        HealthUpdate(trapDamage);
    }
    modalContent.appendChild(trapEventText);

    //Approval button
    let acceptBtn = document.createElement('button');
    acceptBtn.innerText = 'You patch yourself up and go forth';
    modalContent.appendChild(acceptBtn);
    acceptBtn.addEventListener('click', CloseModal);
}
function shuffle(a) { //Shuffle an array
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function HealthPotionEvent(){
    let healthPotionEventText = document.createElement('p');
    
    healthPotionEventText.innerText = "You stepped into an old and dusty room filled with glass jars and old books that you can't understand. It was clearly somebody's laboratory, but whose? One the desk you can see three potions:";
    modalContent.appendChild(healthPotionEventText);

    let buttonGroup = document.createElement('div');
    buttonGroup.style.display = "flex";
    modalContent.appendChild(buttonGroup);

    let rightChoise = Math.floor(Math.random() * 3); // 0,1,2
    console.log(rightChoise);
    let potionVariation = ['Yellow', 'Green', 'Red', 'Orange', 'Blue', 'Pink', 'Black'];
    
    shuffle(potionVariation);

    for(let i = 0; i < 3; i++){
        let potionButton = document.createElement('button');
        potionButton.innerText = potionVariation[i]+' potion';
        buttonGroup.appendChild(potionButton);
        if(i === rightChoise){
            potionButton.addEventListener('click', () => {
                healthPotionEventText.innerHTML += "<br>Right choise! You are healing back to full!";
                HealthUpdate("full");
                setTimeout(CloseModal, 1000);
            });
        }else{
            potionButton.addEventListener('click', () => {
                healthPotionEventText.innerHTML += "<br>Seems like it didnt work...";
                setTimeout(CloseModal, 1000);
            });
        }
    }
}
function FightEvent(){ //Maybe a difficulty setting here?
    //Now its only 1v1
    
    let type = enemyTypes[Math.floor(Math.random()*enemyTypes.length)];
    let enemy = new Character(type.name, type.class, type.str, type.agi, type.int);
    //Give random amount of gold to the enemy, to loot if won
    enemy.SetGold(Math.floor(Math.random()*10));

    allAbilities.forEach((ability) => {
        if(ability.specificClass == enemy.charClass){
            enemy.abilities.push(ability);
        }
    });

    console.log(enemy);

    //Images of the player on the left, enemy on the right
    let imageContainer = document.createElement('div');
    imageContainer.id = "imageContainer";
    modalContent.appendChild(imageContainer);

    let playerImg = document.createElement('img');
    playerImg.src = "assets/gemBlue.png";
    imageContainer.appendChild(playerImg);

    //Container for the enemy image and health bar
    let enemyContainer = document.createElement('div');
    imageContainer.appendChild(enemyContainer);

    let enemyImg = document.createElement('img');
    enemyImg.src = "assets/gemRed.png";
    enemyContainer.appendChild(enemyImg);
    
    let enemyHealthBar = document.createElement('div');
    enemyHealthBar.id="enemyHealth";
    enemyContainer.appendChild(enemyHealthBar);

    //Bottom part with the actions

    let ActionContainer = document.createElement('div');
    ActionContainer.id = "ActionContainer";
    modalContent.appendChild(ActionContainer);

    //2x2 grid for the action buttons, for the player on the bottom left
    let actionGroup = document.createElement('div');
    actionGroup.id = "actionGroup";
    ActionContainer.appendChild(actionGroup);

    //Abilities => buttons
    let i = 0;
    while(i<player.abilities.length){
        let btn = document.createElement('button');
        btn.innerText = player.abilities[i].name;
        btn.title = player.abilities[i].description+"\nDeals "+player.abilities[i].baseDamage+" + "+player.abilities[i].modifier+" *0.35";
        actionGroup.appendChild(btn);

        btn.addEventListener('click',() => {
            //Add a specific event based on which ability was used

            //Animation for fighting
            //Adding an extra class to the image containter
            imageContainer.classList.add("fighting");

            //Just damage the enemy for now
            let selectedAbility = player.abilities.find(function(a) {
                if(a.name == btn.innerText){
                    return a;
                }
            });
            
            if(selectedAbility.effect == "channel"){
                player.Damaged(-5);
            }
            let blockActive = false;
            if(selectedAbility.effect == "block"){
                blockActive = true;
            }

            //Basedamage * modifier
            let damageAmountFromPlayer = 0;
            switch(selectedAbility.modifier){
                case "str": damageAmountFromPlayer = Math.floor(selectedAbility.baseDamage + (player.str * 0.35));
                case "agi": damageAmountFromPlayer = Math.floor(selectedAbility.baseDamage + (player.agi * 0.35));
                case "int": damageAmountFromPlayer = Math.floor(selectedAbility.baseDamage + (player.int * 0.35));
            }
            enemy.Damaged(damageAmountFromPlayer);
            
            //Enemy counter attack, with random ability
            let counterAttack = enemy.abilities[Math.floor(Math.random()*enemy.abilities.length)];
            let damagedByEnemy = 0;
            let enemyDifficultyModifier = 0.5;
            switch(selectedAbility.modifier){//
                case "str": damagedByEnemy = Math.floor((counterAttack.baseDamage + (enemy.str * 0.35)) * enemyDifficultyModifier);
                case "agi": damagedByEnemy = Math.floor((counterAttack.baseDamage + (enemy.agi * 0.35)) * enemyDifficultyModifier);
                case "int": damagedByEnemy = Math.floor((counterAttack.baseDamage + (enemy.int * 0.35)) * enemyDifficultyModifier);
            }
            
            //Delay to wait for the animation to finish
            setTimeout(()=>{
                if(blockActive == true){
                    damagedByEnemy = 0;
                    blockActive = false;
                }
                if(enemy.isAlive == false){
                    alert(`You won and looted ${enemy.gold} gold from the enemy`);
                    player.SetGold(enemy.gold);
                    UpdateStats();
                    CloseModal();
                    //Updates the starts of the player (the GOLD)
                    UpdateStats();
                }
                imageContainer.classList.remove("fighting");
                enemyHealthBar.style.height = (enemy.currHp/enemy.maxHp)*100+"%";
                HealthUpdate(damagedByEnemy);
            },2000);
            

            //Gives the player another chance to escape, refreshing its escape chances
            escapeChance = Math.floor(Math.random()*2);//0-1
            
        });
        i++;
    }
    //Attempts to run away on the bottom right
    let escapeChance = Math.floor(Math.random()*2);//0-1
    

    //Add a chance to take damage from running away
    let escapeBtn = document.createElement('button');
    escapeBtn.innerText = "Attempt to run away";
    ActionContainer.appendChild(escapeBtn);

    escapeBtn.addEventListener('click', () =>{
        if(escapeChance == 0){
            CloseModal();
        }else{
            alert("You couldn't escape and took 2 damage!");
            HealthUpdate(2);
        }
    });


    //Info panel to the enemy
    let infoPanel = document.createElement('div');
    infoPanel.id = "infoPanel";
    ActionContainer.append(infoPanel);

        let eType = document.createElement('p');
        eType.innerText = enemy.charName;
        infoPanel.append(eType);

        let eHp = document.createElement('p');
        eHp.innerText = "Max HP: "+enemy.MaxHp;
        infoPanel.append(eHp);

        let eClass = document.createElement('p');
        eClass.innerText = enemy.charClass;
        infoPanel.append(eClass);

        let eStr = document.createElement('p');
        eStr.innerText = "Str: "+enemy.str;
        infoPanel.append(eStr);

        let eAgi = document.createElement('p');
        eAgi.innerText = "Agi: "+enemy.agi;
        infoPanel.append(eAgi);

        let eInt = document.createElement('p');
        eInt.innerText = "Int: "+enemy.int;
        infoPanel.append(eInt);
}

function EmptyRoomEvent(){
    let emptyEventText = document.createElement('p');
    emptyEventText.innerText = "You arrived into an empty room. There is nothing interesting here.";
    modalContent.appendChild(emptyEventText);

    let acceptBtn = document.createElement('button');
    acceptBtn.innerText = 'You move on to the next area';
    modalContent.appendChild(acceptBtn);
    acceptBtn.addEventListener('click', CloseModal);
}
function BossFightEvent(){

    let acceptBtn = document.createElement('button');
    acceptBtn.innerText = "Work in progress, don't judge me!";
    modalContent.appendChild(acceptBtn);
    acceptBtn.addEventListener('click', CloseModal);
}