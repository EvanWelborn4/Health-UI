const APIURL = "https://fedskillstest.coalitiontechnologies.workers.dev";
const AUTH = "Basic " + btoa("coalition:skills-test");

//Fetch Patients Info
async function fetchPatient() {
    try {
        const response = await fetch(APIURL, {
            headers: {Authorization: AUTH},
        });

        const data = await response.json();
        const patients = data;

        //Check To See if Patients were not found
        if(!patients || patients.length === 0) {
            console.error("Patients Not Found");
            return;
        }

        const patientListContainer = document.getElementById("patient-list");

        //Go through all patients to add them to patient list
        patients.forEach(patient => {
            const patientContainer = document.createElement("div");
            patientContainer.classList.add("patient-container");

            //Highlight the active Jessica Taylor
            if(patient.name === "Jessica Taylor") {
                patientContainer.classList.add("patient-container-active");
            }

            patientContainer.innerHTML = `
                <div class="patient-entry">
                    <img src="${patient.profile_picture}" alt="Patient Pic">
                    <div class="patient-text">
                        <p class="boldName">${patient.name}</p>
                        <p>${patient.gender}, ${patient.age}</p>
                    </div>
                </div>
                <img src="images/more_horiz_FILL0_wght300_GRAD0_opsz24.png" alt="icon"> `;

                patientListContainer.appendChild(patientContainer);
        });

        //Find Jessica Taylor
        const jessica = patients.find(patient => patient.name === "Jessica Taylor");

        //Check To See if Patients were not found
        if(!jessica) {
            console.error("Jessica Not Found");
            return;
        }

        //Lab Results
        const labResultsListContainer = document.getElementById("lab-results-list-id");

        const labResults = jessica.lab_results;

        if(labResults.length > 0) {
            labResults.forEach(result => {
                const labResultItem = document.createElement("div");
                labResultItem.classList.add("lab-results-list-item");

                if(result === "CT Scans") {
                    labResultItem.classList.add("lab-results-list-item-active");
                }
                
                labResultItem.innerHTML = `
                    <p>${result}</p>
                    <img src="${result.icon || 'images/download_FILL0_wght300_GRAD0_opsz24 (1).png'}" alt="icon">
                `;

                labResultsListContainer.appendChild(labResultItem);
            });   
            
        } else {
            console.log("No Lab Results For Jessica Taylor");
        } 

        //Diagnosis List
        const diagnosticListContainer = document.getElementById("diagnosis-list-id");

            if(jessica.diagnostic_list.length > 0) {
                jessica.diagnostic_list.forEach((diagnosis) => {
                    const diagnosisItem = document.createElement("div");
                    diagnosisItem.classList.add("diagnosis-list-item");

                    diagnosisItem.innerHTML =`
                    <p>${diagnosis.name}</p>
                    <p>${diagnosis.description}</p>
                    <p>${diagnosis.status}</p>
                    `;

                    diagnosticListContainer.appendChild(diagnosisItem);
                });
            } else {
                console.log("No Diagnosis Data");
            }

            //Patient Info
            const patientInfoContainer = document.getElementById("patient-info-id");
            const patientHeader = document.getElementById("patient-header-id");
            const profilePic = document.createElement("div");
            profilePic.classList.add("pfp-item");

            profilePic.innerHTML =`
            <img src="${jessica.profile_picture}" alt="Jessica PFP">
             
            `;
            //Add PFP to Profile Info Section
            patientHeader.appendChild(profilePic);


            const profileName = document.createElement("div");
            profileName.classList.add("profile-name");
            profileName.innerHTML = `
            <p>${jessica.name}</p>
            `;

            patientHeader.appendChild(profileName);
            
            const patientInfoListContainer = document.getElementById("patient-info-list-id");
            
            const profileDOB = document.createElement("div");
            profileDOB.classList.add("profile-list-element");

            profileDOB.innerHTML =`
            <img src="images/BirthIcon.png" alt="Jessica PFP">
            <div class="profile-list-element-text">
            <p>Date Of Birth</p>
            <p class="bold-text-profile">${jessica.date_of_birth}</p>
            </div>
            `;

            const profileGender = document.createElement("div");
            profileGender.classList.add("profile-list-element");

            profileGender.innerHTML =`
            <img src="images/FemaleIcon.png" alt="Jessica PFP">
            <div class="profile-list-element-text">
            <p>Gender</p>
            <p class="bold-text-profile">${jessica.gender}</p>
            </div>
            `;

            const profileContact = document.createElement("div");
            profileContact.classList.add("profile-list-element");

            profileContact.innerHTML =`
            <img src="images/PhoneIcon.png" alt="Jessica PFP">
            <div class="profile-list-element-text">
            <p>Contact Info.</p>
            <p class="bold-text-profile">${jessica.phone_number}</p>
            </div>
            `;

            const profileEmergency = document.createElement("div");
            profileEmergency.classList.add("profile-list-element");

            profileEmergency.innerHTML =`
            <img src="images/PhoneIcon.png" alt="Jessica PFP">
            <div class="profile-list-element-text">
            <p>Emergency Contacts.</p>
            <p class="bold-text-profile">${jessica.emergency_contact}</p>
            </div>
            `;

            const profileInsurance = document.createElement("div");
            profileInsurance.classList.add("profile-list-element");

            profileInsurance.innerHTML =`
            <img src="images/InsuranceIcon.png" alt="Jessica PFP">
            <div class="profile-list-element-text">
            <p>Insurance Provider.</p>
            <p class="bold-text-profile">${jessica.insurance_type}</p>
            </div>
            `;

            patientInfoListContainer.appendChild(profileDOB);
            patientInfoListContainer.appendChild(profileGender);
            patientInfoListContainer.appendChild(profileContact);
            patientInfoListContainer.appendChild(profileEmergency);
            patientInfoListContainer.appendChild(profileInsurance);

            //Blood Pressure Chart
            const bloodPressure = document.getElementById("blood-pressure-chart").getContext("2d");

            //Get Specific 6 Months
            const sixMonths = [
                { month: "October", year: 2023 },
                { month: "November", year: 2023 },
                { month: "December", year: 2023 },
                { month: "January", year: 2024 },
                { month: "February", year: 2024 },
                { month: "March", year: 2024 },
            ];

            //Get Last 6 months of history for chart
            sixMonthHistory = jessica.diagnosis_history.filter(entry => 
                sixMonths.some(month => month.month === entry.month && month.year === entry.year)
            )
            .sort((a, b) => {
                const getIndex = (entry) => sixMonths.findIndex(month => month.month === entry.month && month.year === entry.year);
                return getIndex(a) - getIndex(b);
            });

            //Graph Data
            const graphLabels = sixMonthHistory.map(entry => `${entry.month} ${entry.year}`);
            const systolicValues = sixMonthHistory.map(entry => entry.blood_pressure.systolic.value);
            const diastolicValues = sixMonthHistory.map(entry => entry.blood_pressure.diastolic.value);

            const  bloodPressureChart = new Chart(bloodPressure, {
                type: "line",
                data: {
                    labels: graphLabels,
                    datasets: [
                        {
                            label: "Systolic",
                            data: systolicValues,
                            borderColor: "#C26EB4",
                            fill: false,
                            pointRadius: 6,
                            tension: 0.4,
                            pointBackgroundColor: "#C26EB4",
                        },
                        {
                            label: "Diastolic",
                            data: diastolicValues,
                            borderColor: "#7E6CAB",
                            fill: false,
                            pointRadius: 6,
                            tension: 0.4,
                            pointBackgroundColor: "#7E6CAB",
                        },
                    
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: false,
                        },
                    },
                    scales: {
                        x: {
                            grid:{
                                display: false,
                            },
                        },
                        y: {
                            min: 60,
                            max: 180,
                            title: {
                                display: true,
                                text: "Blood Pressure (mmHg)",
                            },
                            ticks: {
                                stepSize: 20,
                            },

                        },
                    },
                },
            });

            //Get the most recent value
            const recentSystolic = systolicValues[systolicValues.length - 1];
            const recentDiastolic = diastolicValues[diastolicValues.length - 1];

            const averageSystolic = 120;
            const averageDiastolic = 80;

            document.getElementById("systolic-value").innerText = recentSystolic;
            document.getElementById("diastolic-value").innerText = recentDiastolic;

            document.getElementById("systolic-average").innerText = recentSystolic > averageSystolic ? "▲ Higher than Average" : "▼ Lower than Average";
            document.getElementById("diastolic-average").innerText = recentDiastolic > averageDiastolic ? "▲ Higher than Average" : "▼ Lower than Average";

            const recentDiagnosis = jessica.diagnosis_history.find(entry => {
                return entry.month === "March" && entry.year === 2024
            });
            
            
            //Respiratory Rate Info Chart
            const respiratoryRateValue = recentDiagnosis.respiratory_rate.value;
            const respiratoryRateLevel = recentDiagnosis.respiratory_rate.levels;
            document.getElementById("respiratory-rate-value").innerText = respiratoryRateValue + " bpm";
            document.getElementById("respiratory-rate-average").innerText = respiratoryRateLevel;

            //Temperature Info Chart
            const temperatureValue = recentDiagnosis.temperature.value;
            const temperatureLevel = recentDiagnosis.temperature.levels;
            document.getElementById("temperature-value").innerText = temperatureValue + " °F";
            document.getElementById("temperature-average").innerText = temperatureLevel;

            //Heart Rate Info Chart
            const heartRateValue = recentDiagnosis.heart_rate.value;
            const heartRateLevel = recentDiagnosis.heart_rate.levels;
            document.getElementById("heart-rate-value").innerText = heartRateValue + " bpm";
            document.getElementById("heart-rate-average").innerText = "▼ " + heartRateLevel;
            


    } catch (error) {
        console.error("Problem fetching data", error);
    }
}

//Call Function When Page is Loaded
window.onload = fetchPatient;