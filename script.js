const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*\()_+{}|:"<>?-=[];,./';

let password = "";
let passwordLength = 10;
let checkCount = 0;
// set strength circle color to grey
setIndicator("#ccc");
handleSlider();
// set passwordLength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}
console.log("Starting the journey...");
function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
}
function getRandomInt(min , max){
    return Math.floor(Math.random()*(max-min)) + min;
}
function generateRandomNumber() {
    return getRandomInt(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRandomInt(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRandomInt(65,91));
}
function generateSymbol(){
    const randNum = getRandomInt(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength>=8){
        console.log("Green");
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNumber|| hasSymbol) && passwordLength>=6){
        setIndicator("#ff0");
        console.log("Yellow");

    }
    else{
        setIndicator("#f00");
        console.log("Red");

    }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    // to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}
inputSlider.addEventListener("input",(e)=>{
    passwordLength = e.target.value;
    handleSlider();
});
copyBtn.addEventListener("click",(e)=>{
    if(passwordDisplay.value) copyContent();
});
function shufflePassword(array) {
    // Fisher Yates Method
    for(let i=array.length-1 ;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el)=>{
        (str += el)
    })
    return str;
}
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked) checkCount++;
    })

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

generateBtn.addEventListener('click',()=>{
    console.log("Working");
    //none of the checkbox are selected
    if(checkCount == 0) return;
    // special case
    console.log("Working 2");

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    console.log("Working 3");

    // password generation

    //remove old password
    password = "";
    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
        console.log("upper done");
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
        console.log("lower done");
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
        console.log("number done");
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
        console.log("symbol done");

    }
    console.log("Working 4");
    
    // compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }
    console.log("Compulsory addition done");
    console.log(password);
    //remaing addtion
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex = getRandomInt(0,funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaning addition done")

    // suffle the password
    password = shufflePassword(Array.from(password));
    console.log("Suffling done")

    //show in UI
    passwordDisplay.value = password;
    console.log("Ui done")

    // calculate strength
    calcStrength();
    console.log("Strength calculated");
});