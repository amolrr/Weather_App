console.log('chalo bhai suru kare');
const api_key="33e6f51e95ae5a8b54428252bf7d4935";

function renederWeatherInfo(data){
    let newPara= document.createElement('p');
         
         newPara.textContent= `${data?.main?.temp.toFixed(2) } °C `;
         document.body.appendChild(newPara);
}

async function fetchWeatherwDetails(){
    try{
        const city ="mumbai";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`);
         const data = await response.json();
         
         console.log(data);
    
         renederWeatherInfo(data);
    }

    catch(err){
        console.log("Colud not able to fetch data");
    }
    
}

async function getRandomWeatherDetails(){
   try{
    const lat=18.5204303;
    const long=73.8567437;

    const content = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_key}&units=metric`);
    const data2= await content.json();
    console.log(data2);
    renederWeatherInfo(data2);
    
   }

   catch(e){
    console.log("Colud not able to fetch data");
   }
   
   
}

// getRandomWeatherDetails();
// fetchWeatherwDetails();

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("No geolocation support");
    }
}

function showPosition(position){
    let lat= position.coords.latitude; 
    let longi= position.coords.longitude;

    console.log(lat);
    console.log(longi);
}