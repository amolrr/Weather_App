const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userConatainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grand-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoConatainer = document.querySelector(".user-info-container");

// intitial variable needed.
let currentTab = userTab; 
const API_KEY="33e6f51e95ae5a8b54428252bf7d4935";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    
   
    if(clickedTab != currentTab){
        
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
       
        currentTab.classList.add("current-tab");
        
    
    
    if(!searchForm.classList.contains("active")){
        //kya search weather tab invisible hai , if yes?  then make it visible
        grantAccessContainer.classList.remove("active");
        userInfoConatainer.classList.remove("active");
        searchForm.classList.add("active");
    }

    else{
         //main pehle search weather tab pr tha aur ab your weather pe switch kardiya, so make it visible
         searchForm.classList.remove("active");
         userInfoConatainer.classList.remove("active");
         //ab mein your weather tab me hu, toh weather bhi diplay karna padega, so let's check local storage first
         //for coordinates , if we have saved them there
         getfromSessionStorage();

       } 
    }   
}

userTab.addEventListener('click', () => {
    //pass clicked Tab as input parameter
 
    switchTab(userTab);
  
   
});

searchTab.addEventListener('click', () => {
    //pass clicked tab as input parameter.
    switchTab(searchTab);
});


//checks if coordinats are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates nahi mile to grant access ko visible kardo
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates); //converted the  JSON string present in the variable localcoordinates into Javascript object with properties latitude and longitude
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates; // coordinates are stored

    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");

    //make the loader visible
    loadingScreen.classList.add("active");
    
    //API CALL
    try{
         const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
           const data = await response.json();
           loadingScreen.classList.remove("active"); 
           userInfoConatainer.classList.add("active");
           renederWeatherInfo(data);  
        }
        catch(error){
            //kya kuch missing hai?
            loadingScreen.classList.remove("active");
        console.log("Error fetching weather data",error);
        alert('Error fetching weather data:' + error.message);
        }

}

function renederWeatherInfo(weatherInfo){
    // first fetch the elements 

    const cityName= document.querySelector("[data-cityName]");
    const countryFlag = document.querySelector("[data-countryIcon]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from the weatherInfo object and put it in elements
    cityName.textContent=`${weatherInfo?.name}`;
    countryFlag.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.textContent=`${weatherInfo?.weather?.[0]?.description}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.textContent=`${weatherInfo?.main?.temp} °C`;
    windspeed.textContent = `${weatherInfo?.wind?.speed} m/s`;
    humidity.textContent = `${weatherInfo?.main?.humidity}%`;
    cloudiness.textContent = `${weatherInfo?.clouds?.all}%`;
}


function getLocation(){
    if(navigator.geolocation){
         navigator.geolocation.getCurrentPosition(showPosition);  
    }
    else{
       console.log(alert("Your Browser do not support geolocation"));
    }
}

function showPosition(position){
    const userCoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates) );
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener('click', getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener('submit',(e) => {
    e.preventDefault();

    let cityName= searchInput.value;

    if(cityName===""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoConatainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoConatainer.classList.add("active");
        renederWeatherInfo(data);
    }

    catch(err){
        loadingScreen.classList.remove("active");
        console.log("Error fetching weather data",err);
        alert('Error fetching weather data:' + err.message);
    }
}