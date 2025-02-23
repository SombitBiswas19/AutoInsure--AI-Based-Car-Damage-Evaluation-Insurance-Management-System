// server.js
const express = require('express');
const http=require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Register = require('./models/Register');
const Buyer = require('./models/Buyer');
const Pan=require('./govt_database/Pan');
const License=require('./govt_database/License');
const FormData = require('form-data');
const Claim=require('./models/Claim');
const car_data=require('./car_data.json');
const Policy = require('./models/Policy');//samanka
const Car = require('./models/Car');//samanka
const path = require('path'); // for serving static files
const multer = require('multer');
const fs =require("fs");
require('dotenv').config();
const host="localhost";
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(bodyParser.json());
let reply;
app.use(express.static(path.join(__dirname, 'insurance-website')));//samanka

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Sign-up route
app.post('/signup', async (req, res) => {
    const { name, mobile, email, password, rePassword } = req.body;

    if (password !== rePassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = new User({ name, mobile, email, password: hashedPassword });
        await newUser .save();
        res.status(201).json({ message: "Sign Up successful!",user: { email:email } });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

// server.js (add this under the existing code)

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User  not found" });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            alert("password not matched");
            return res.status(400).json({ message: "Invalid password" });
            
        }

        // If successful, return a success message (you can also return a token or user data)
        
        res.status(200).json({ message: "Login successful!",user: { email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});


app.get('/car_data2', (req, res) => {
    res.json(car_data);
})
//gender,age,region,location,education,income,vehicleAge,damage,type,previous,  calcIdv  driverDob,
app.post('/register', async (req, res) => {
    const { name, dob, pan, mobile, emailId,otp,selfDriver, License,  vehicleType, planType, purchaseDate, registrationNumber, zone, make, model, variant, fuel, bodyType, manufactureYear, engine, chassis, seat, calcIdv,myrange, expected, usageType, duration, ncb, zerodep } = req.body;
    console.log(req.body);
    try {
        const newRegister  = new Register({  name, dob, pan, mobile, emailId,otp,selfDriver, License, vehicleType, planType, purchaseDate, registrationNumber, zone, make, model, variant, fuel, bodyType, manufactureYear, engine, chassis, seat,calcIdv, myrange, expected, usageType, duration, ncb, zerodep });
        await newRegister.save();
        res.status(201).json({ message: "User  registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

app.get('/pan', async(req, res) => {
    try {
        const pan_details = await Pan.find();
        res.json(pan_details);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})



app.post('/send-otp', async (req, res) => {
    var  panID = req.body;
    console.log(panID);
    let panholder;
    const panholders = await Pan.find();
    panholders.forEach(ele => {
        if(ele.panId===panID.panId1){
            panholder=ele;
        }
    });
    console.log(JSON.stringify(panholder));
    if (!panholder) {
        return res.status(404).json({ message: 'PAN ID not found' });
    }
    try{
        console.log(JSON.stringify(panholder));
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    panholder.otp = otp;
    panholder.otpExpires = Date.now() + 300000; // OTP valid for 5 minutes
    await panholder.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bhowalsourav19@gmail.com',
            pass: 'esyl alzk amvt oryq'
        }
    });

    await transporter.sendMail({
        from: 'bhowalsourav19@gmail.com',
        to: panholder.email,
        subject: 'OTP Verification',
        text: `Your OTP for verification is: ${otp}`
    });
    res.status(200).json({ message: "OTP sent successfully" });
}catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP" });
}
});



app.post('/verify-otp', async (req, res) => {
    var { panId, otp } = req.body;
    console.log("\n",req.body);
    console.log("verify",panId,otp);
        let panholder2=await Pan.findOne({panId:panId});
        console.log("1",panholder2);
        if (!panholder2 || panholder2.otp !== otp || panholder2.otpExpires < Date.now()) {
            console.log("2",panholder2.otp);
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    
        panholder2.otp = null; // Clear OTP after verification
        panholder2.otpExpires = null;
        await panholder2.save();

        res.status(200).json({ message: 'OTP verified successfully' });

});


//samanka
app.get('/policies', async (req, res) => {
    try {
        const policies = await Policy.find();
        console.log(policies);
        res.json(policies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching policies", error });
    }
});

app.post('/license',async (req, res) => {
    var { license} = req.body;
    console.log("\n",req.body);
    const dl=await License.findOne({license});
    if (!dl) {
        return res.status(400).json({ message: 'Not found' });
    }
    else{
        const date=new Date(dl.validTill).getFullYear();
        const tod=new Date();
        if(tod-date>=0){
            console.log(date);
            return res.status(200).json({ message: 'License verified successfully' });
        }
        else{
            return res.status(400).json({ message: 'Validity expired' });
        }
    }

});

// app.post('/license-no',async (req, res) => {
//     var { license, driverDob } = req.body;
//     console.log("\n",req.body);
//     const dl=await License.findOne({license,driverDob});
//     if (!dl) {
//         return res.status(400).json({ message: 'Not found' });
//     }
//     else{
//         const date=new Date(dl.validTill).getFullYear();
//         const tod=new Date();
//         if(tod-date>=0){
//             console.log(date);
//             return res.status(200).json({ message: 'License verified successfully' });
//         }
//         else{
//             return res.status(400).json({ message: 'Validity expired' });
//         }
//     }

// });


app.get('/find-registers', async (req, res) => {
    try {
        const policies = await Register.find();
        res.json(policies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching policies", error });
    }
});


app.post('/buyer', async (req, res) => {
    const { eId,Company_Name,Policy_Type,Policy_Tier,Max_Vehicle_Age,No_of_Years_Covered,Deductible,Idv_Factor,Premium_Price} = req.body;
    const d=new Date();
    const a=parseInt(No_of_Years_Covered);
    const startingDate=`${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
    const validTill=`${d.getDate()}-${d.getMonth()}-${d.getFullYear()+a}`;
    
    try {
        const newBuyer= new Buyer( {eId,Company_Name,Policy_Type,Policy_Tier,Max_Vehicle_Age,No_of_Years_Covered,Deductible,Idv_Factor,Premium_Price,startingDate,validTill} );
        console.log(newBuyer);
        await newBuyer.save()
        res.status(201).json({ message: "Sign Up successful!"});
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
});

const axios = require('axios');


// Route to submit form data and fetch recommendations
// app.post('/recommend', async (req, res) => {
//     try {
//         // Capture user input from form
//         const userInput = {
//             Gender: req.body.Gender,
//             Age: parseInt(req.body.Age),
//             Region_Code: req.body.Region_Code,
//             Location_Type: req.body.Location_Type,
//             Education: req.body.Education,
//             Annual_Income: parseFloat(req.body.Annual_Income),
//             Vehicle_Type: req.body.Vehicle_Type,
//             Previously_Insured: parseInt(req.body.Previously_Insured),
//             Vehicle_Age: req.body.Vehicle_Age,
//             Vehicle_Damage: parseInt(req.body.Vehicle_Damage)
//         };

//         // Send a request to the Flask server for recommendations
//         const response = await axios.post('http://localhost:3000/recommend', userInput);
        
//         // Get the recommended policies from the Flask server response
//         const recommendedPolicies = response.data.recommendations;
        
//         // Render recommendations on result page
//         res.render('result', { recommendations: recommendedPolicies });
//     } catch (error) {
//         console.error("Error fetching recommendations:", error);
//         res.status(500).send("Error retrieving recommendations.");
//     }
// });


app.post('/submit-form', async (req, res) => {
    try {
        const formData = req.body;  // Get data from the form submission
        const response = await axios.post('http://localhost:3000/process-data', formData);
        console.log(response);
        res.status(200).json(response.data);  // Send the response from Flask back to the client
    } catch (error) {
        res.status(500).send('Error sending data to Flask server');
    }
});


app.get('/home', async(req, res)=> {
    const response=await fetch('http://127.0.0.1:3000/recommend');
    const data= await response.json();
    console.log(data);
});


app.post('/signup2', async (req, res) => {
    const { email} = req.body;

    try {
        const signer= await User.findOne({email});
        res.status(201).json({signer});
    } catch (error) {
        res.status(500).json({ message: "No user found", error });
    }
});
app.post('/signup3', async (req, res) => {
    const { email} = req.body;

    try {
        let buy;
    const buys = await Buyer.find();
    
    buys.forEach(ele => {
        if(ele.eId===req.body.eId){
            buy=ele;
        }
    });
    if(typeof buy !=='undefined'){
        res.status(200).json(buy);
    }
    

    else
    res.status(500).json({ message: "Error finding user", error });
    
    
    } catch (error) {
        res.status(500).json({ message: "Error finding user", error });
    }
});

app.post('/claim-track', async (req, res) => {
    const { email} = req.body;
    console.log("arigato");
    console.log(req.body);

    try {
        const claimer= await Claim.findOne({eId:req.body.eId});
        console.log(claimer);
        if(claimer){
        res.status(201).json(claimer);}
    else{
    res.status(400).json({ message: "Error finding user", error });}
    } catch (error) {
        res.status(500).json({ message: "No user found", error });
    }
});




////////////////////////////////////////////////////////////////////////////
app.use(express.urlencoded({ extended: true }));
//////////
// app.use(express.static('public'));
/////////

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'profile.html')); // Serve the HTML file
// });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});
const upload = multer({ storage: storage });

app.post('/uploads', upload.single('profilePicture'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({message:'Upload Failure!'});
    }
    const url = req.protocol + '://' + req.get('host');
    const URL=url + '/uploads/' + req.file.filename
    console.log(URL);
    User.findOneAndUpdate(
        { email: req.body.email }, // Find by email
        { profilePictureURL: URL }, // Update the profilePictureURL
        { new: true } // Return the updated document
    )
    .then(updatedBuyer => {
        if (updatedBuyer) {
            res.status(200).json({message:'Profile picture updated successfully!',url:URL});
        } else {
            res.status(404).json({message:'Failure!'});
        }
    })
    .catch(err => res.status(404).json({message:'error'}));
});

const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});
const upload1 = multer({ storage: storage1 });

app.post('/upload', upload1.single('damagePic'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }
        const fileStream = fs.createReadStream(req.file.path);
        const form = new FormData();
        form.append('file', fileStream, req.file.originalname);
        const url = req.protocol + '://' + req.get('host');
        const URL=url + '/upload/' + req.file.filename
        console.log(URL);
        const new_claim= new Claim({eId:req.body.eId,Company_Name:req.body.Company_Name,Policy_Type:req.body.Policy_Type,Policy_Tier:req.body.Policy_Tier,billAmount:req.body.billAmount, damagePic:URL,statusCode:"Processing"});
        await new_claim.save()
        // Send request to Flask server
        const flaskResponse = await axios.post('http://localhost:3001/assessment', form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        // Send the Flask server's response back to the client
        console.log(flaskResponse.data)
        
        if(flaskResponse.data.gate2_result){
            console.log(flaskResponse.data.severity)
        Claim.findOneAndUpdate(
            { eId: req.body.eId },
            {damageSeverity:flaskResponse.data.severity}, // Update the profilePictureURL
            { new: true } // Return the updated document
        ).then(updatedBuyer => {
            if (updatedBuyer) {
                Claim.findOneAndUpdate(
                    { eId: req.body.eId },
                    {damageLocation:flaskResponse.data.location}, // Update the profilePictureURL
                    { new: true } // Return the updated document
                ).then(updatedBuyer2 => {
                    if (updatedBuyer2) {
                        console.log("done2");
                    } else {
                        console.log("failed");
                    }
                })
                .catch(err => res.status(404).json({message:'error'}));
                console.log("done");
            } else {
                console.log("failed");
            }
        })
        .catch(err => res.status(404).json({message:'error'}));
        
    }
        res.json(flaskResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the file' });
    }
});
app.get('/', (req, res) => {
    res.send('Node.js server is running and ready to handle file uploads!');
});



const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload2');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});
const upload2 = multer({ storage: storage2 });

app.post('/upload2', upload2.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }
        const fileStream = fs.createReadStream(req.file.path);
        const form = new FormData();
        form.append('file', fileStream, req.file.originalname);
        const url = req.protocol + '://' + req.get('host');
        const URL=url + '/upload2/' + req.file.filename
        console.log(URL);
        // Send request to Flask server
        const flaskResponse = await axios.post('http://localhost:3001/assessment', form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        // Send the Flask server's response back to the client
        console.log(flaskResponse.data)
        
        if(flaskResponse.data.gate1_result){
            console.log(req.body.registrationNumber);
            Register.findOneAndUpdate(
                {registrationNumber:req.body.registrationNumber}, 
                {carPic:URL},
                { new: true }
            )
            .then(updatedRegister => {
            if (updatedRegister && gate2_result) {
                console.log(updatedRegister)
                Register.findOneAndUpdate(
                    {registrationNumber:req.body.registrationNumber}, 
                    {damageSeverity:flaskResponse.data.severity},
                    { new: true } // Return the updated document
                ).then(updatedRegister2 => {
                    if (updatedRegister2) {
                        console.log("done2");
                    } else {
                        console.log("failed");
                    }
                })
                .catch(err => console.log("error"));
                console.log("done");
            } else {
                console.log("no damage");
            }
        })
        .catch(err => console.log(err));
        
    }
        else{
            console.log("Upload a clear image!");
        }
    
        res.json(flaskResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the file' });
    }
});


// Serve uploaded files
app.use('/upload2', express.static('upload2'))
app.use('/upload', express.static('upload'));////////////DONOT REMOVE
app.use('/uploads', express.static('uploads'));////////////DONOT REMOVE
////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////
app.post('/add-policy', async (req, res) => {
    const {
      policyType,
      policyTier,
      companyName,
      max_coverage_amount,
      max_vehicle_age,
      idv_factor,
      own_damage_factor,
      no_of_years_covered,
      deductible,
    } = req.body;
  
    try {
      const newPolicy = new Policy({
        policyType,
        policyTier,
        companyName,
        max_coverage_amount,
        max_vehicle_age,
        idv_factor,
        own_damage_factor,
        no_of_years_covered,
        deductible,
      });
      await newPolicy.save();
      res.status(201).json({ message: 'Policy added successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error adding policy', error });
    }
  });
  
  // Delete Policy Route
  app.delete('/delete-policy/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const policy = await Policy.findByIdAndDelete(id);
      if (!policy) {
        return res.status(404).json({ message: 'Policy not found' });
      }
      res.status(200).json({ message: 'Policy deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting policy', error });
    }
  });
  app.post('/add-car', async (req, res) => {
    const { make, model, variant, body_style, fuel, seats, capacity, year_of_manufacture, ex_showroom_price } = req.body;

   

    try {
        const newCar = new Car({
            make,
            model,
            variant,
            body_style,
            fuel,
            seats,
            capacity,
            year_of_manufacture,
            ex_showroom_price,
        });
        await newCar.save();
        res.status(201).json({ message: 'Car added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding car', error });
    }
});
app.delete('/delete-car/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const car = await Car.findByIdAndDelete(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Car', error });
  }
});
// Fetch all cars
app.get('/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cars", error });
    }
});

app.get('/claim2', async (req, res) => {
    

    try {
        // Find the claim by eId
        const claim = await Claim.find();
         

        // Return the claim details
        res.status(200).json(claim);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching claim details", error });
    }
});
app.get('/buyer2', async (req, res) => {
    

    try {
        // Find the claim by eId
        const buyer = await Buyer.find();
         

        // Return the claim details
        res.status(200).json(buyer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching buyer details", error });
    }
});
// Example backend route for updating a claim
app.put('/update-claim/:id', async (req, res) => {
    const { amountPaid, statusCode } = req.body;
    const claimId = req.params.id;
  
    try {
      const updatedClaim = await Claim.findByIdAndUpdate(claimId, {
        amountPaid,
        statusCode,
      }, { new: true });
  
      res.status(200).json(updatedClaim);
    } catch (error) {
      res.status(500).json({ message: 'Error updating claim', error });
    }
  });





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});