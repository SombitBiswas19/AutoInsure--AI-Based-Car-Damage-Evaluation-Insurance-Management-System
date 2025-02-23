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


document.addEventListener('readystatechange',async()=>{
    const user=localStorage.getItem('user');
    console.log(JSON.parse(user).email);
    const email=JSON.parse(user).email;
    document.getElementById('eId').value=email;
    document.getElementById('eId').readOnly=true;
    const response=await fetch('http://localhost:5000/signup2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email:email})
    });

    const result = await response.json();
    console.log(result);
    if(response.ok){
        document.getElementById('userName').innerText=result.signer.name;
        document.getElementById('userEmail').innerText=result.signer.email;
        document.getElementById('userMobile').innerText=result.signer.mobile;
        document.getElementById('profilePic').src=result.signer.profilePictureURL;
        console.log(result);
        const response2=await fetch('http://localhost:5000/signup3', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({eId:email})
        });
        
        const result2 = await response2.json();
        console.log(response2);
        if(response2.status==200){
            document.getElementById('companyName').innerText=result2.Company_Name;
            document.getElementById('policyType').innerText=result2.Policy_Type;
            document.getElementById('premiumPrice').innerText=result2.Premium_Price;
            document.getElementById('validity').innerText=result2.validTill;
            document.getElementById('starting').innerText=result2.startingDate;
            console.log(result2);
            // const response=await fetch('http://localhost:5000/claim_track', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({eId:eId})
            // });
        
            // const result = await response.json();
            // console.log(result);
            // if(response.status==201){
            //     document.getElementById('status').innerText=result.claimer.statuscode;
            //     document.getElementById('billAmount').innerText=result.claimer.billAmount;
            //     console.log(result);
                
            // }else{
            //     document.getElementById('box4').innerHTML=`No Policies to show. Buy policy...<a href="register.html">Buy policy...</a>`
            // }
        }
        else{
            document.getElementById('box3').innerHTML=`No Policies to show.<a href="register.html">Buy policy</a>`
        }
    }


    
})


document.getElementById('pic-form').addEventListener('submit',async(e)=>{
    e.preventDefault();
    const formData = new FormData();
            const email = document.getElementById('eId').value;
            const fileInput = document.getElementById('profilePicture').files[0];

            formData.append('email', email);
            formData.append('profilePicture', fileInput);
            fetch('http://localhost:5000/uploads', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('profilePic').src=data.url;
                
                 // Show success message
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
})


document.addEventListener('readystatechange',async()=>{
    console.log("hello");
    const user=localStorage.getItem('user');
    console.log(JSON.parse(user).email);
    const eId=JSON.parse(user).email;
    document.getElementById('eId').value=eId;
    document.getElementById('eId').readOnly=true;
    console.log(JSON.stringify({eId:eId}));
    const response=await fetch('http://localhost:5000/claim-track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({eId:eId})
    });

    const result3 = await response.json();
    console.log(result3);
    if(response.status==201){
        document.getElementById('statusCode').innerText=result3.statusCode;
        document.getElementById('billAmount').innerText=result3.billAmount;
        if(result3.amountPaid){
            document.getElementById('amountPaid').innerText=result3.amountPaid;
        }
        console.log(result3);
        
    }else{
        document.getElementById('box4').innerHTML=`No claim generated.`
    }


    
})