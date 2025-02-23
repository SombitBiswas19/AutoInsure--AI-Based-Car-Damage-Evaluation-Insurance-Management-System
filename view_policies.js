document.getElementById('log_out_btn').style.visibility='hidden';
let odr;
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


        // async function policyAdd(){
        //     console.log("here here");
        //     fetch('http://localhost:5000/policies', {
        //      method: 'GET',
        //      headers: {
        //          'Content-Type': 'application/json',
        //          'Accept': 'application/json',
        //      },
        //  })
        //  .then(res => res.json())
        //  .then(op => {
        //      console.log("Policies fetched successfully:", op);
        //      const policiesList = document.getElementById('policies-list');
        //      let count=0;
        //      if(odr){
        //         for(var r=0;r<odr.length;r++){
        //      op.forEach(policy => {
        //          const policyItem = document.createElement('div');
        //          policyItem.classList.add('col-md-4', 'policy-item');
        //          const IDV=policy.idv_factor*calcIdv;
        //          console.log(IDV);
        //          if((planType==='thirdParty'&& policy.policyType==='Third Party Liability')&&policy.policyTier===odr[r]){
        //          policyItem.innerHTML = `
        //              <div class="card">
        //                  <div class="card-body">
        //                  <h5 class="card-title" id="company${count+1}" value="${policy.companyName}">${policy.companyName}</h5>

        //                         <label for= "type${count+1}"><strong>Policy Type:</strong></label>
        //                         <input type="text" class="card-text" id="type${count+1}" value="${policy.policyType}"readOnly><br>

        //                         <label for= "tier${count+1}"><strong>Policy Tier:</strong></label>
        //                         <input type="text" class="card-text" id="tier${count+1}" value="${policy.policyTier}" readOnly><br>
                                
        //                         <label for= "age${count+1}"><strong>Max Vehicle Age:</strong></label>
        //                         <input type="text" class="card-text" id="age${count+1}" value="${policy.max_vehicle_age}" readOnly><br>

        //                         <label for= "years${count+1}"><strong>Years Covered:</strong></label>
        //                         <input type="text" class="card-text" id="years${count+1}" value="${policy.no_of_years_covered}" readOnly><br>

        //                         <label for= "deductible${count+1}"><strong>Deductible(if Comprehensive):</strong></label>
        //                         <input type="text" class="card-text" id="deductible${count+1}" value="${policy.deductible}" readOnly><br>
        //                         <label for= "idv${count+1}"><strong>IDV:</strong></label>
        //                         <input type="text" class="card-text" id="idv${count+1}" value="${0}" readOnly><br>
        //                         <label for= "premium${count+1}"><strong>Premium:</strong></label>
        //                         <input type="text" class="card-text" id="premium${count+1}" value="${calcIdv*policy.no_of_years_covered}" readOnly><br>

        //                         <a href="payment.html" class="btn btn-primary" id="button${count+1}" value=${count+1}>Buy Policy</a>
        //                  </div>
        //              </div>
        //          `;
        //          policiesList.appendChild(policyItem);
        //          count+=1;
        //         }
        //          else if((planType==='comprehensive'&& policy.policyType==='Comprehensive')&&policy.policyTier===odr[r]){
        //             policyItem.innerHTML = `
        //                 <div class="card">
        //                     <div class="card-body">
        //                         <h5 class="card-title" id="company${count+1}" value="${policy.companyName}">${policy.companyName}</h5>

        //                         <label for= "type${count+1}"><strong>Policy Type:</strong></label>
        //                         <input type="text" class="card-text" id="type${count+1}" value="${policy.policyType}"readOnly><br>

        //                         <label for= "tier${count+1}"><strong>Policy Tier:</strong></label>
        //                         <input type="text" class="card-text" id="tier${count+1}" value="${policy.policyTier}" readOnly><br>
                                
        //                         <label for= "age${count+1}"><strong>Max Vehicle Age:</strong></label>
        //                         <input type="text" class="card-text" id="age${count+1}" value="${policy.max_vehicle_age}" readOnly><br>

        //                         <label for= "years${count+1}"><strong>Years Covered:</strong></label>
        //                         <input type="text" class="card-text" id="years${count+1}" value="${policy.no_of_years_covered}" readOnly><br>

        //                         <label for= "deductible${count+1}"><strong>Deductible(if Comprehensive):</strong></label>
        //                         <input type="text" class="card-text" id="deductible${count+1}" value="${policy.deductible}" readOnly><br>
        //                         <label for= "idv${count+1}"><strong>IDV:</strong></label>
        //                         <input type="text" class="card-text" id="idv${count+1}" value="${0}" readOnly><br>
        //                         <label for= "premium${count+1}"><strong>Premium:</strong></label>
        //                         <input type="text" class="card-text" id="premium${count+1}" value="${IDV*policy.no_of_years_covered*policy.own_damage_factor}" readOnly><br>

        //                         <a href="payment.html" class="btn btn-primary" id="button${count+1}" value=${count+1}>Buy Policy</a>

        //                     </div>
        //                 </div>
                        
        //             `;
        //             policiesList.appendChild(policyItem);
        //             count+=1;
        //         }
                
        //      });
        //      const links=document.getElementsByClassName('btn');
        //      console.log(links);
             
        //      for (let i = 1; i <= links.length; i++){
        //         console.log(links[i-1].id);
        //         let btn=document.getElementById(links[i-1].id);
        //         btn.addEventListener('click',()=>{
        //             console.log(btn);
        //             let c=i;
        //             const company=document.getElementById('company'+c);
        //             console.log(company.innerText);
        //             const type=document.getElementById(`type${c}`);
        //             const tier=document.getElementById(`tier${c}`);
        //             const age=document.getElementById(`age${c}`);
        //             const years=document.getElementById(`years${c}`);
        //             const deductible=document.getElementById(`deductible${c}`);
        //             const idv=document.getElementById(`idv${c}`);
        //             const premium=document.getElementById(`premium${c}`);
        //             localStorage.removeItem('user');
        //             localStorage.setItem('user', JSON.stringify({ email: registered_user.emailId,Company:company.innerText,Type:type.value,Tier:tier.value,Age:age.value,Years:years.value, Deductible:deductible.value, Idv:idv.value,Premium:premium.value}));
        //             console.log(premium.innerText);
        //             const user = localStorage.getItem('user');
        //             console.log(premium);
        //             console.log(premium.value);
        //             console.log(JSON.parse(user).Premium);
        //             //window.location.href="payment.html";
                    


        //      }
        //     );
        //     }
        //         }}
        //         else{
        //             op.forEach(policy => {
        //                 const policyItem = document.createElement('div');
        //                 policyItem.classList.add('col-md-4', 'policy-item');
        //                 const IDV=policy.idv_factor*calcIdv;
        //                 console.log(IDV);
        //                 if((planType==='thirdParty'&& policy.policyType==='Third Party Liability')){
        //                 policyItem.innerHTML = `
        //                     <div class="card">
        //                         <div class="card-body">
        //                         <h5 class="card-title" id="company${count+1}" value="${policy.companyName}">${policy.companyName}</h5>
       
        //                                <label for= "type${count+1}"><strong>Policy Type:</strong></label>
        //                                <input type="text" class="card-text" id="type${count+1}" value="${policy.policyType}"readOnly><br>
       
        //                                <label for= "tier${count+1}"><strong>Policy Tier:</strong></label>
        //                                <input type="text" class="card-text" id="tier${count+1}" value="${policy.policyTier}" readOnly><br>
                                       
        //                                <label for= "age${count+1}"><strong>Max Vehicle Age:</strong></label>
        //                                <input type="text" class="card-text" id="age${count+1}" value="${policy.max_vehicle_age}" readOnly><br>
       
        //                                <label for= "years${count+1}"><strong>Years Covered:</strong></label>
        //                                <input type="text" class="card-text" id="years${count+1}" value="${policy.no_of_years_covered}" readOnly><br>
       
        //                                <label for= "deductible${count+1}"><strong>Deductible(if Comprehensive):</strong></label>
        //                                <input type="text" class="card-text" id="deductible${count+1}" value="${policy.deductible}" readOnly><br>
        //                                <label for= "idv${count+1}"><strong>IDV:</strong></label>
        //                                <input type="text" class="card-text" id="idv${count+1}" value="${0}" readOnly><br>
        //                                <label for= "premium${count+1}"><strong>Premium:</strong></label>
        //                                <input type="text" class="card-text" id="premium${count+1}" value="${calcIdv*policy.no_of_years_covered}" readOnly><br>
       
        //                                <a href="payment.html" class="btn btn-primary" id="button${count+1}" value=${count+1}>Buy Policy</a>
        //                         </div>
        //                     </div>
        //                 `;
        //                 policiesList.appendChild(policyItem);
        //                 count+=1;
        //                }
        //                 else if((planType==='comprehensive'&& policy.policyType==='Comprehensive')){
        //                    policyItem.innerHTML = `
        //                        <div class="card">
        //                            <div class="card-body">
        //                                <h5 class="card-title" id="company${count+1}" value="${policy.companyName}">${policy.companyName}</h5>
       
        //                                <label for= "type${count+1}"><strong>Policy Type:</strong></label>
        //                                <input type="text" class="card-text" id="type${count+1}" value="${policy.policyType}"readOnly><br>
       
        //                                <label for= "tier${count+1}"><strong>Policy Tier:</strong></label>
        //                                <input type="text" class="card-text" id="tier${count+1}" value="${policy.policyTier}" readOnly><br>
                                       
        //                                <label for= "age${count+1}"><strong>Max Vehicle Age:</strong></label>
        //                                <input type="text" class="card-text" id="age${count+1}" value="${policy.max_vehicle_age}" readOnly><br>
       
        //                                <label for= "years${count+1}"><strong>Years Covered:</strong></label>
        //                                <input type="text" class="card-text" id="years${count+1}" value="${policy.no_of_years_covered}" readOnly><br>
       
        //                                <label for= "deductible${count+1}"><strong>Deductible(if Comprehensive):</strong></label>
        //                                <input type="text" class="card-text" id="deductible${count+1}" value="${policy.deductible}" readOnly><br>
        //                                <label for= "idv${count+1}"><strong>IDV:</strong></label>
        //                                <input type="text" class="card-text" id="idv${count+1}" value="${0}" readOnly><br>
        //                                <label for= "premium${count+1}"><strong>Premium:</strong></label>
        //                                <input type="text" class="card-text" id="premium${count+1}" value="${IDV*policy.no_of_years_covered*policy.own_damage_factor}" readOnly><br>
       
        //                                <a href="payment.html" class="btn btn-primary" id="button${count+1}" value=${count+1}>Buy Policy</a>
       
        //                            </div>
        //                        </div>
                               
        //                    `;
        //                    policiesList.appendChild(policyItem);
        //                    count+=1;
        //                }
                       
        //             });
        //             const links=document.getElementsByClassName('btn');
        //             console.log(links);
                    
        //             for (let i = 1; i <= links.length; i++){
        //                console.log(links[i-1].id);
        //                let btn=document.getElementById(links[i-1].id);
        //                btn.addEventListener('click',()=>{
        //                    console.log(btn);
        //                    let c=i;
        //                    const company=document.getElementById('company'+c);
        //                    console.log(company.innerText);
        //                    const type=document.getElementById(`type${c}`);
        //                    const tier=document.getElementById(`tier${c}`);
        //                    const age=document.getElementById(`age${c}`);
        //                    const years=document.getElementById(`years${c}`);
        //                    const deductible=document.getElementById(`deductible${c}`);
        //                    const idv=document.getElementById(`idv${c}`);
        //                    const premium=document.getElementById(`premium${c}`);
        //                    localStorage.removeItem('user');
        //                    localStorage.setItem('user', JSON.stringify({ email: registered_user.emailId,Company:company.innerText,Type:type.value,Tier:tier.value,Age:age.value,Years:years.value, Deductible:deductible.value, Idv:idv.value,Premium:premium.value}));
        //                    console.log(premium.innerText);
        //                    const user = localStorage.getItem('user');
        //                    console.log(premium);
        //                    console.log(premium.value);
        //                    console.log(JSON.parse(user).Premium);
        //                    //window.location.href="payment.html";
                           
       
       
        //             });
        //            }
        //         }

        //     //  document.getElementsByTagName('button').addEventListener('click', () => {
        //     //     console.log("hhiii",document.getElementByTag('button').value);
        //     //     // localStorage.removeItem('user');
        //     //     // localStorage.setItem('user', JSON.stringify({ email: registered_user.emailId,premium:document.getElementById('button').value }))
        //     // });   
        //     // document.getElementById('button3').addEventListener('click', () => {
        //     //     console.log("hhiii",document.getElementById('button3').value);
        //     //     // localStorage.removeItem('user');
        //     //     // localStorage.setItem('user', JSON.stringify({ email: registered_user.emailId,premium:document.getElementById('button').value }))
        //     // });     

        //  })
        //  .catch(error => {
        //      console.error('Error fetching policies:', error);
        //  });
        // }



let order;
async function getRegister(email) {
    console.log("order:",odr);
    const response = await fetch('http://localhost:5000/find-registers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    console.log(data);
    if(response.ok){
        let registered_user;
        data.forEach(ele=>{
            if(ele.emailId===email){
                registered_user=ele;
            }
        })
        if(registered_user){
        const calcIdv=registered_user.calcIdv;
        const planType=registered_user.planType;
        console.log(calcIdv,planType);

        
        document.getElementById('viewPolicies').addEventListener("click", async () => {
            console.log("here here");
            fetch('http://localhost:5000/policies', {
             method: 'GET',
             headers: {
                 'Content-Type': 'application/json',
                 'Accept': 'application/json',
             },
         })
         .then(res => res.json())
         .then(op => {
             console.log("Policies fetched successfully:", op);
             const policiesList = document.getElementById('policies-list');
             
             if(odr){
                policiesList.innerHTML='';
                document.getElementById('head').innerText="Policies in order of Recommendation";
                let count=0;
                for(var r=0;r<odr.length;r++){
                    console.log(odr[r]);
             op.forEach(policy => {
                 const policyItem = document.createElement('div');
                 policyItem.classList.add('col-md-4', 'policy-item');
                 const IDV=policy.idv_factor*calcIdv;
                 console.log(IDV);
                 if((planType==='thirdParty'&& policy.policyType==='Third Party Liability')&&policy.policyTier===odr[r]){
                 policyItem.innerHTML = `
                     <div class="card">
                         <div class="card-body">
                         <h5 class="card-title" id="company${count+1}" value="${policy.companyName}">${policy.companyName}</h5>

                                <label for= "type${count+1}"><strong>Policy Type:</strong></label>
                                <input type="text" class="card-text" id="type${count+1}" value="${policy.policyType}"readOnly><br>

                                <label for= "tier${count+1}"><strong>Policy Tier:</strong></label>
                                <input type="text" class="card-text" id="tier${count+1}" value="${policy.policyTier}" readOnly><br>
                                
                                <label for= "age${count+1}"><strong>Max Vehicle Age:</strong></label>
                                <input type="text" class="card-text" id="age${count+1}" value="${policy.max_vehicle_age}" readOnly><br>

                                <label for= "years${count+1}"><strong>Years Covered:</strong></label>
                                <input type="text" class="card-text" id="years${count+1}" value="${policy.no_of_years_covered}" readOnly><br>

                                <label for= "deductible${count+1}"><strong>Deductible(if Comprehensive):</strong></label>
                                <input type="text" class="card-text" id="deductible${count+1}" value="${policy.deductible}" readOnly><br>
                                <label for= "idv${count+1}"><strong>IDV:</strong></label>
                                <input type="text" class="card-text" id="idv${count+1}" value="${0}" readOnly><br>
                                <label for= "premium${count+1}"><strong>Premium:</strong></label>
                                <input type="text" class="card-text" id="premium${count+1}" value="${calcIdv*policy.no_of_years_covered}" readOnly><br>

                                <a href="payment.html" class="btn btn-primary" id="button${count+1}" value=${count+1}>Buy Policy</a>
                         </div>
                     </div>
                 `;
                 policiesList.appendChild(policyItem);
                 count+=1;
                }
                 else if((planType==='comprehensive'&& policy.policyType==='Comprehensive')&&policy.policyTier===odr[r]){
                    policyItem.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title" id="company${count+1}" value="${policy.companyName}">${policy.companyName}</h5>

                                <label for= "type${count+1}"><strong>Policy Type:</strong></label>
                                <input type="text" class="card-text" id="type${count+1}" value="${policy.policyType}"readOnly><br>

                                <label for= "tier${count+1}"><strong>Policy Tier:</strong></label>
                                <input type="text" class="card-text" id="tier${count+1}" value="${policy.policyTier}" readOnly><br>
                                
                                <label for= "age${count+1}"><strong>Max Vehicle Age:</strong></label>
                                <input type="text" class="card-text" id="age${count+1}" value="${policy.max_vehicle_age}" readOnly><br>

                                <label for= "years${count+1}"><strong>Years Covered:</strong></label>
                                <input type="text" class="card-text" id="years${count+1}" value="${policy.no_of_years_covered}" readOnly><br>

                                <label for= "deductible${count+1}"><strong>Deductible(if Comprehensive):</strong></label>
                                <input type="text" class="card-text" id="deductible${count+1}" value="${policy.deductible}" readOnly><br>
                                <label for= "idv${count+1}"><strong>IDV:</strong></label>
                                <input type="text" class="card-text" id="idv${count+1}" value="${0}" readOnly><br>
                                <label for= "premium${count+1}"><strong>Premium:</strong></label>
                                <input type="text" class="card-text" id="premium${count+1}" value="${IDV*policy.no_of_years_covered*policy.own_damage_factor}" readOnly><br>

                                <a href="payment.html" class="btn btn-primary" id="button${count+1}" value=${count+1}>Buy Policy</a>

                            </div>
                        </div>
                        
                    `;
                    policiesList.appendChild(policyItem);
                    count+=1;
                }
                
             });
            //  const links=document.getElementsByClassName('btn');
            //  console.log(links);
             
            //  for (let i = 1; i <= links.length; i++){
            //     console.log(links[i-1].id);
            //     let btn=document.getElementById(links[i-1].id);
            //     btn.addEventListener('click',()=>{
            //         console.log(btn);
            //         let c=i;
            //         const company=document.getElementById('company'+c);
            //         console.log(company.innerText);
            //         const type=document.getElementById(`type${c}`);
            //         const tier=document.getElementById(`tier${c}`);
            //         const age=document.getElementById(`age${c}`);
            //         const years=document.getElementById(`years${c}`);
            //         const deductible=document.getElementById(`deductible${c}`);
            //         const idv=document.getElementById(`idv${c}`);
            //         const premium=document.getElementById(`premium${c}`);
            //         localStorage.removeItem('user');
            //         localStorage.setItem('user', JSON.stringify({ email: registered_user.emailId,Company:company.innerText,Type:type.value,Tier:tier.value,Age:age.value,Years:years.value, Deductible:deductible.value, Idv:idv.value,Premium:premium.value}));
            //         console.log(premium.innerText);
            //         const user = localStorage.getItem('user');
            //         console.log(premium);
            //         console.log(premium.value);
            //         console.log(JSON.parse(user).Premium);
            //         //window.location.href="payment.html";
                    


            //  });
            // }
                }
                const links=document.getElementsByClassName('btn');
             console.log(links);
             
             for (let i = 1; i <= links.length; i++){
                console.log(links[i-1].id);
                let btn=document.getElementById(links[i-1].id);
                btn.addEventListener('click',()=>{
                    console.log(btn);
                    let c=i;
                    const company=document.getElementById('company'+c);
                    console.log(company.innerText);
                    const type=document.getElementById(`type${c}`);
                    const tier=document.getElementById(`tier${c}`);
                    const age=document.getElementById(`age${c}`);
                    const years=document.getElementById(`years${c}`);
                    const deductible=document.getElementById(`deductible${c}`);
                    const idv=document.getElementById(`idv${c}`);
                    const premium=document.getElementById(`premium${c}`);
                    localStorage.removeItem('user');
                    localStorage.setItem('user', JSON.stringify({ email: registered_user.emailId,Company:company.innerText,Type:type.value,Tier:tier.value,Age:age.value,Years:years.value, Deductible:deductible.value, Idv:idv.value,Premium:premium.value}));
                    console.log(premium.innerText);
                    const user = localStorage.getItem('user');
                    console.log(premium);
                    console.log(premium.value);
                    console.log(JSON.parse(user).Premium);
                    //window.location.href="payment.html";
                    


             });
            }
            }
                else{
                    document.getElementById('head').innerText="View Policies";
                    let count=0;
                    op.forEach(policy => {
                        const policyItem = document.createElement('div');
                        policyItem.classList.add('col-md-4', 'policy-item');
                        const IDV=policy.idv_factor*calcIdv;
                        console.log(IDV);
                        if((planType==='thirdParty'&& policy.policyType==='Third Party Liability')){
                        policyItem.innerHTML = `
                            <div class="card">
                                <div class="card-body">
                                <h5 class="card-title" id="company${count+1}" value="${policy.companyName}">${policy.companyName}</h5>
       
                                       <label for= "type${count+1}"><strong>Policy Type:</strong></label>
                                       <input type="text" class="card-text" id="type${count+1}" value="${policy.policyType}"readOnly><br>
       
                                       <label for= "tier${count+1}"><strong>Policy Tier:</strong></label>
                                       <input type="text" class="card-text" id="tier${count+1}" value="${policy.policyTier}" readOnly><br>
                                       
                                       <label for= "age${count+1}"><strong>Max Vehicle Age:</strong></label>
                                       <input type="text" class="card-text" id="age${count+1}" value="${policy.max_vehicle_age}" readOnly><br>
       
                                       <label for= "years${count+1}"><strong>Years Covered:</strong></label>
                                       <input type="text" class="card-text" id="years${count+1}" value="${policy.no_of_years_covered}" readOnly><br>
       
                                       <label for= "deductible${count+1}"><strong>Deductible(if Comprehensive):</strong></label>
                                       <input type="text" class="card-text" id="deductible${count+1}" value="${policy.deductible}" readOnly><br>
                                       <label for= "idv${count+1}"><strong>IDV:</strong></label>
                                       <input type="text" class="card-text" id="idv${count+1}" value="${0}" readOnly><br>
                                       <label for= "premium${count+1}"><strong>Premium:</strong></label>
                                       <input type="text" class="card-text" id="premium${count+1}" value="${calcIdv*policy.no_of_years_covered}" readOnly><br>
       
                                       <a href="payment.html" class="btn btn-primary" id="button${count+1}" value=${count+1}>Buy Policy</a>
                                </div>
                            </div>
                        `;
                        policiesList.appendChild(policyItem);
                        count+=1;
                       }
                        else if((planType==='comprehensive'&& policy.policyType==='Comprehensive')){
                           policyItem.innerHTML = `
                               <div class="card">
                                   <div class="card-body">
                                       <h5 class="card-title" id="company${count+1}" value="${policy.companyName}">${policy.companyName}</h5>
       
                                       <label for= "type${count+1}"><strong>Policy Type:</strong></label>
                                       <input type="text" class="card-text" id="type${count+1}" value="${policy.policyType}"readOnly><br>
       
                                       <label for= "tier${count+1}"><strong>Policy Tier:</strong></label>
                                       <input type="text" class="card-text" id="tier${count+1}" value="${policy.policyTier}" readOnly><br>
                                       
                                       <label for= "age${count+1}"><strong>Max Vehicle Age:</strong></label>
                                       <input type="text" class="card-text" id="age${count+1}" value="${policy.max_vehicle_age}" readOnly><br>
       
                                       <label for= "years${count+1}"><strong>Years Covered:</strong></label>
                                       <input type="text" class="card-text" id="years${count+1}" value="${policy.no_of_years_covered}" readOnly><br>
       
                                       <label for= "deductible${count+1}"><strong>Deductible(if Comprehensive):</strong></label>
                                       <input type="text" class="card-text" id="deductible${count+1}" value="${policy.deductible}" readOnly><br>
                                       <label for= "idv${count+1}"><strong>IDV:</strong></label>
                                       <input type="text" class="card-text" id="idv${count+1}" value="${0}" readOnly><br>
                                       <label for= "premium${count+1}"><strong>Premium:</strong></label>
                                       <input type="text" class="card-text" id="premium${count+1}" value="${IDV*policy.no_of_years_covered*policy.own_damage_factor}" readOnly><br>
       
                                       <a href="payment.html" class="btn btn-primary" id="button${count+1}" value=${count+1}>Buy Policy</a>
       
                                   </div>
                               </div>
                               
                           `;
                           policiesList.appendChild(policyItem);
                           count+=1;
                       }
                       
                    });
                    const links=document.getElementsByClassName('btn');
                    console.log(links);
                    
                    for (let i = 1; i <= links.length; i++){
                       console.log(links[i-1].id);
                       let btn=document.getElementById(links[i-1].id);
                       btn.addEventListener('click',()=>{
                           console.log(btn);
                           let c=i;
                           const company=document.getElementById('company'+c);
                           console.log(company.innerText);
                           const type=document.getElementById(`type${c}`);
                           const tier=document.getElementById(`tier${c}`);
                           const age=document.getElementById(`age${c}`);
                           const years=document.getElementById(`years${c}`);
                           const deductible=document.getElementById(`deductible${c}`);
                           const idv=document.getElementById(`idv${c}`);
                           const premium=document.getElementById(`premium${c}`);
                           localStorage.removeItem('user');
                           localStorage.setItem('user', JSON.stringify({ email: registered_user.emailId,Company:company.innerText,Type:type.value,Tier:tier.value,Age:age.value,Years:years.value, Deductible:deductible.value, Idv:idv.value,Premium:premium.value}));
                           console.log(premium.innerText);
                           const user = localStorage.getItem('user');
                           console.log(premium);
                           console.log(premium.value);
                           console.log(JSON.parse(user).Premium);
                           //window.location.href="payment.html";
                           
       
       
                    });
                   }
                }

            //  document.getElementsByTagName('button').addEventListener('click', () => {
            //     console.log("hhiii",document.getElementByTag('button').value);
            //     // localStorage.removeItem('user');
            //     // localStorage.setItem('user', JSON.stringify({ email: registered_user.emailId,premium:document.getElementById('button').value }))
            // });   
            // document.getElementById('button3').addEventListener('click', () => {
            //     console.log("hhiii",document.getElementById('button3').value);
            //     // localStorage.removeItem('user');
            //     // localStorage.setItem('user', JSON.stringify({ email: registered_user.emailId,premium:document.getElementById('button').value }))
            // });     

         })
         .catch(error => {
             console.error('Error fetching policies:', error);
         });
        });}
        else{
            document.addEventListener("readystatechange", () => {
                    fetch('http://localhost:5000/policies', {
                     method: 'GET',
                     headers: {
                         'Content-Type': 'application/json',
                         'Accept': 'application/json',
                     },
                 })
                 .then(response => response.json())
                 .then(data => {
                     console.log("Policies fetched successfully:", data);
                     const policiesList = document.getElementById('policies-list');
                     data.forEach(policy => {
                         const policyItem = document.createElement('div');
                         policyItem.classList.add('col-md-4', 'policy-item');
                         policyItem.innerHTML = `
                             <div class="card">
                                 <div class="card-body" value=>
                                     <h5 class="card-title">${policy.policyType}</h5>
                                     <p class="card-text"><strong>Company:</strong> ${policy.companyName}</p>
                                     <p class="card-text"><strong>Max Coverage:</strong> ₹${policy.max_coverage_amount}</p>
                                     <p class="card-text"><strong>Vehicle Age Limit:</strong> ${policy.max_vehicle_age} years</p>
                                     <p class="card-text"><strong>Years Covered:</strong> ${policy.no_of_years_covered}</p>
                                     <a href="register.html" class="btn btn-primary">Buy Policy</a>
                                 </div>
                             </div>
                         `;
                         policiesList.appendChild(policyItem);
                     });
                 })
                 .catch(error => {
                     console.error('Error fetching policies:', error);
                 });
                });
        }

    }
}

if(user){
    const email=JSON.parse(user).email;
    getRegister(email);
}
else{
    alert("Please Sign in");
    window.location.href='signup.html';
}
document.getElementById('insuranceForm').addEventListener('submit', (e)=>{
    console.log("Bardhan");
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};


    formData.forEach((value, key) => {
        data[key] = value;
    });
    console.log(data);
    // Send the data to the Node.js server
    fetch('http://localhost:5000/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        console.log(response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(response);
        return response.json();
    })
    .then(data => {
        const d=JSON.stringify(data);
        const d1=JSON.parse(d);
        console.log(d1.data.order);
        odr=d1.data.order;
        console.log('Data:', JSON.stringify(data));
        const email=JSON.parse(user).email;
        getRegister(email);
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
})

