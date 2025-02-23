document.getElementById('log_out_btn').style.visibility='hidden';
const user = localStorage.getItem('user');
        if (user) {
            document.getElementById('sign_in_btn').style.fontSize='12px';
            document.getElementById('sign_in_btn').innerText = `Logged in as: ${JSON.parse(user).email}`;
            document.getElementById('log_out_btn').style.visibility='visible';
            
            document.getElementById('sign_in_btn').addEventListener('click', () => {
                window.location.href = '\\insurance-website\\signup.html'; // Redirect to login page
            });
        }

        // Logout functionality
        document.getElementById('log_out_btn').addEventListener('click', () => {
            localStorage.removeItem('user'); // Clear user data
            window.location.href = 'signup.html'; // Redirect to login page
        });


let car_data;
let idv_val;
let flag=false;
let license_flag=false;
let data_registered=false;
var modelSelect = document.getElementById('model');
var makeSelect = document.getElementById('make');
var variantSelect = document.getElementById('variant');
var fuelSelect = document.getElementById('fuel');
const vehicleSelect=document.getElementById('vehicleType');
const planSelect=document.getElementById('planType');
document.getElementById('purchaseDate').max = new Date().toISOString().split("T")[0];
var purchaseDate=document.getElementById('purchaseDate');

let current_date=new Date();
let yr=current_date.getFullYear()-18;
let currentDate = `${yr}-${current_date.getMonth()}-${current_date.getDate()}`
let maxDate=new Date(currentDate).toISOString().split("T")[0];
console.log(new Date().toISOString().split("T")[0])
console.log(maxDate);
document.getElementById('dob').max = maxDate;


async function fetchCarData() {
    try {
        const response = await fetch('http://localhost:5000/cars');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        car_data=data;
        const makes= new Set();
        data.forEach(car => {
            makes.add(car.make);
        });
        
        
        //add car makes to options.
        
        makes.forEach(maker => {
            const option = document.createElement('option');
            option.value = maker;
            option.textContent = maker;
            makeSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching car data:', error);
    }
} 
document.getElementById('make').addEventListener('click',fetchCarData());
document.getElementById('make').addEventListener('change',(e)=>{
    
    modelSelect.innerHTML='<option value="none">Select the car model.</option>';
    modelSelect.ariaSelected="false";
        car_data.forEach(car => {
            const option = document.createElement('option');
            option.value = car.model;
            option.textContent = car.model;
            if(car.make==makeSelect.value)
                modelSelect.appendChild(option);
        });
});
document.getElementById('model').addEventListener('change',(e)=>{
    
    variantSelect.innerHTML='<option value="none">Select the car variant.</option>';
        car_data.forEach(car => {
            const option = document.createElement('option');
            option.value = car.variant;
            option.textContent = car.variant;
            if(car.model==modelSelect.value)
                variantSelect.appendChild(option);
        });
});



document.getElementById('variant').addEventListener('change',(e)=>{
    
    fuelSelect.innerHTML='<option value="none">Select the car fuel type.</option>';

    for (const car of car_data) {
        // Check if make, model, and variant match
        if (car.make === makeSelect.value && car.model === modelSelect.value && car.variant === variantSelect.value) {
            document.getElementById('bodyType').value=car.body_style;
            document.getElementById('bodyType').innerText=car.body_style;
            document.getElementById('bodyType').readOnly=true;
            document.getElementById('seat').value=car.seats;
            document.getElementById('seat').innerText=car.seats;
            document.getElementById('seat').readOnly=true;
            document.getElementById('manufactureYear').value=car.year_of_manufacture;
            document.getElementById('manufactureYear').innerText=car.year_of_manufacture;
            document.getElementById('manufactureYear').readOnly=true;
            let fuels=car.fuel.split(',');
            for (const fueltype of fuels) {
                const option = document.createElement('option');
                option.value = fueltype;
                option.textContent=fueltype;
                fuelSelect.appendChild(option);
            }
        }
    }
        car_data.forEach(car => {
            const option = document.createElement('option');
            option.value = car.variant;
            option.textContent = car.variant;
            if(car.model==modelSelect.value)
                variantSelect.appendChild(option);
        });
        
});

function idv_calculator(cars, make, model, variant, date_of_purchase,planType,vehicleType){
    let price,capacity;
    let today= new Date();
    let purchased=new Date(date_of_purchase);
    let yeardiff=today.getFullYear()-purchased.getFullYear();
    //let monthdiff=today.getMonth()-date_of_purchase.getMonth();
    for (const car of cars) {
        // Check if make, model, and variant match
        if (car.make === make && car.model === model && car.variant === variant) {
            price= car.ex_showroom_price;
            capacity=car.capacity; // Return the capacity if found
        }
    }console.log(planType);
    if(planType==="comprehensive"){
    if(yeardiff==0){
        return price-0.05*price;
    }
    else if(yeardiff==1){
        return price-0.1*price;
    }
    else if(yeardiff==2){
        return price-0.15*price;
    }
    else if(yeardiff==3){
        return price-0.25*price;
    }
    else if(yeardiff==4){
        return price-0.35*price;
    }
    else if(yeardiff==5){
        return price-0.40*price;
    }
    else{
        return price/2;
    }}else{
            const slider = document.getElementById('myrange');
            const mappedValueSpan = document.getElementById('expected');
            mappedValueSpan.style.display='none';
            slider.style.display='none'
            console.log(capacity);
            console.log(vehicleType);
        if(capacity>1500 && vehicleType==='Already_Registered')
            return 7890;
        else if(capacity>1000 && vehicleType==='Already_Registered')
            return 3221;
        else if(capacity<=1000 && vehicleType==='Already_Registered')
            return 2072;
        else if(capacity>1500 && vehicleType==='New')
            return 24305;
        else if(capacity>1000 && vehicleType==='New')
            return 9534;
        else
        return 5286;
    }
}



const calcIdv=document.getElementById('calcIdv');
document.getElementById('fuel').addEventListener('change',()=>{
    
    console.log(purchaseDate.value);
    let idv=idv_calculator(car_data,makeSelect.value,modelSelect.value,variantSelect.value,purchaseDate.value,planSelect.value,vehicleSelect.value);
    if(calcIdv.readOnly){
        calcIdv.readOnly=false;
        calcIdv.value=idv.toString();
    calcIdv.innerText=idv.toString();
    calcIdv.readOnly=true;
    }else{
        calcIdv.value=idv.toString();
    calcIdv.innerText=idv.toString();
    calcIdv.readOnly=true;
    }
    
    let rangemax=idv*1.15;
    let rangemin=idv*0.85;
    const slider = document.getElementById('myrange');
const mappedValueSpan = document.getElementById('expected');

function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
 }
 // Function to update the mapped value
 function updateMappedValue() {
    const value = parseInt(slider.value);
    const mappedValue = mapRange(value, 0, 100, rangemin,rangemax);
    mappedValueSpan.innerText = `${mappedValue}`;
    mappedValueSpan.value=`${mappedValue}`;
    idv_val=parseInt(mappedValue);
    console.log(idv_val);
 }
slider.addEventListener('change', updateMappedValue);
})



async function findCarCapacity(cars, make, model, variant) {
    // Iterate through the array of car objects
    for (const car of cars) {
        // Check if make, model, and variant match
        if (car.make === make && car.model === model && car.variant === variant) {
            return car.capacity; // Return the capacity if found
        }
    }
    return null; // Return null if no match is found
}


// async function validation_pan(){

//     console.log("PAN verified");
//     console.log(typeof(document.getElementById('dob').value));
//     try {
//         const response = await fetch('http://localhost:5000/pan');
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const panData = await response.json();

//         panData.forEach(pan=>{
//             if(pan.panId===document.getElementById('pan').value && pan.mobile==parseInt(document.getElementById('mobile').value) && pan.dob==document.getElementById('dob').value && pan.email==document.getElementById('emailId').value){
                
//                 alert("PAN verified");
//                 flag=true;
//                 document.getElementById('validatePan').style.display="none";
//                 return;
//             }
//         });if(!flag){
//             alert("PAN not verified");
//         }
// }catch (error) {
//     console.error('Error fetching pan data:', error);
// }
// }


// async function sendOtp() {
//     const panId = document.getElementById('pan').value;
//     const name = document.getElementById('name').value;
//     const mobile = document.getElementById('mobile').value;
//     const dob = document.getElementById('dob').value;
//     console.log(JSON.stringify(panId,dob));
    
//     const response = await fetch('http://localhost:5000/send-otp', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: panId
        
//     });
//     const data = await response.json();
//     alert(data.message);

//     if (response.ok) {
//         // document.getElementById('otpForm').style.display = 'none';
//         document.getElementById('otp').style.display = 'block';
//     }
// }

// async function verifyOtp() {
//     const panId = document.getElementById('pan').value;
//     const otp = document.getElementById('otp').value;
//     console.log(panId);
//     JSON.stringify({ panId,otp })
//     const response = await fetch('http://localhost:5000/verify-otp', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ panId:panId, otp:otp })
//     });

//     const data = await response.json();
//     alert(data.message);
//     if(response.ok){
//         flag=true;
//         document.getElementById('validatePan').style.display="none";
//         document.getElementById('otp').style.display="none";
//         document.getElementById('pan').readOnly=true;
//         document.getElementById('name').readOnly=true;
//         document.getElementById('dob').readOnly=true;
//         document.getElementById('emailId').readOnly=true;
//         document.getElementById('mobile').readOnly=true;
//     }

// }
const panSelect=document.getElementById('pan');

document.getElementById('validatePan').addEventListener('click',async ()=>{
    const panId1 = panSelect.value;
    console.log(panId1);
    console.log(JSON.stringify({ panId:panId1, otp:otp }));
    const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ panId1 })
        
    });
    const data = await response.json();
    alert(data.message);

    if (response.ok) {
        document.getElementById('pan').readOnly = true;
        document.getElementById('otp').style.display = 'block';
    }
});
document.getElementById('otp').addEventListener('change',async ()=>{
    const panId = panSelect.value;
    const otp = document.getElementById('otp').value;
    console.log(panId);
    const response = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ panId,otp })
    });

    const data = await response.json();
    alert(data.message);
    if(response.ok){
        flag=true;
        document.getElementById('validatePan').style.display="none";
        document.getElementById('otp').style.display="none";
        document.getElementById('pan').readOnly=true;
        document.getElementById('name').readOnly=true;
        document.getElementById('dob').readOnly=true;
        document.getElementById('emailId').readOnly=true;
        document.getElementById('mobile').readOnly=true;
    }
});


function formattedDate(d) {
    return [d.getDate(), d.getMonth()+1, d.getFullYear()]
        .map(n => n < 10 ? `0${n}` : `${n}`).join('-');
  }

document.getElementById('validateLicense').addEventListener('click',async(e)=>{
    const license=document.getElementById('License').value;
        const response = await fetch('http://localhost:5000/license', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ license })
            
        });
        const data = await response.json();
        alert(data.message);
    
        if (response.ok) {
            license_flag=true;
            document.getElementById('validateLicense').style.display="none";
        document.getElementById('license').readOnly=true;
        }
    
})


document.getElementById('registration-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('myrange').value=idv_val;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    for(const [key,value] of formData){
        console.log(key,value);
    }
    if(!flag || !license_flag){
        throw new Error("Documents not verified");
    }
    const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.message);
    if (response.ok) {
        data_registered=true;
        e.target.reset();
    }
});

document.getElementById('buyPolicy').addEventListener('click',()=>{
    if(data_registered){
        window.location.href='view_policies.html'
    }
    else{
        alert("Register user to continue");
    }
})

