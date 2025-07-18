const loginform = document.getElementById("loginForm");
const regform = document.getElementById("registrationForm");

const registerUser = async (e) => {
  e.preventDefault();
  console.log(e);
  
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const fname = document.getElementById("firstname").value;
  const lname = document.getElementById("lastname").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const raw = JSON.stringify({
    first_name: fname,
    last_name: lname,
    email: email,
    password: password,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch("/auth/register", requestOptions);
    if (response.ok) {
      const result = await response.json();
      console.log(result);
      alert(result.message);
      window.location.reload();
      // Handle success (e.g., show success message, redirect)
    } else {
      const errorResult = await response.json();
      alert(errorResult.message);
      console.error(errorResult);

      // Handle validation errors or other errors
    }
  } catch (error) {
    console.error(error);
  }
};

// Placeholder for loginUser function
const loginUser = async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    email: username,
    password: password,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch("/auth/login", requestOptions);
    const result = await response.json();

    if (result.status == "success") {
      alert(result.message);

      window.location.href = "home.html";
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};
regform.onsubmit = registerUser;
loginform.onsubmit = loginUser;

// Function to toggle between registration and login forms
function toggleForms() {
  const registrationContainer = document.querySelector(
    ".registration-container"
  );
  const loginContainer = document.querySelector(".login-container");

  if (registrationContainer) {
    registrationContainer.style.display =
      registrationContainer.style.display === "none" ? "block" : "none";
  }

  if (loginContainer) {
    loginContainer.style.display =
      loginContainer.style.display === "none" ? "block" : "none";
  }
}

// function addHealthRecord() {
//   const date = document.getElementById("date").value;
//   const symptoms = document.getElementById("symptoms").value;
//   const diagnosis = document.getElementById("diagnosis").value;
//   const treatment = document.getElementById("treatment").value;

//   const healthRecord = {
//     date: date,
//     symptoms: symptoms,
//     diagnosis: diagnosis,
//     treatment: treatment,
//   };

//   // Send health record to backend (dummy function for now)
//   fetch("/add_health_record", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(healthRecord),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       displayHealthRecord(data.healthRecord);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       alert(
//         "An error occurred while adding health record. Please try again later."
//       );
//     });
// }

async function addHealthRecord(event) {
  event.preventDefault();

  const date = document.querySelector('input[name="date"]').value;
  const symptoms = document.querySelector('textarea[name="symptoms"]').value;
  const diagnosis = document.querySelector('textarea[name="diagnosis"]').value;
  const treatment = document.querySelector('textarea[name="treatment"]').value;

  try {
    const response = await fetch('/auth/healthrecord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date, symptoms, diagnosis, treatment }),
      credentials: 'include' // This ensures cookies are sent with the request
    });

    if (!response.ok) {
      throw new Error('Failed to add health record');
    }

    const data = await response.json();
    if(data.status == "success"){
      alert(data.message);
      window.location.reload();

    }else{
      alert("Something went wrong.")
    }

  } catch (error) {
    console.error('Error adding health record:', error.message);
    // Optionally, handle error here (e.g., show an error message to the user)
  }
}

function displayHealthRecord(healthRecord) {
  const healthRecordsDiv = document.getElementById("healthRecords");
  const recordDiv = document.createElement("div");
  recordDiv.classList.add("health-record");
  recordDiv.innerHTML = `
        <h3>${healthRecord.date}</h3>
        <p><strong>Symptoms:</strong> ${healthRecord.symptoms}</p>
        <p><strong>Diagnosis:</strong> ${healthRecord.diagnosis}</p>
        <p><strong>Treatment:</strong> ${healthRecord.treatment}</p>
    `;
  healthRecordsDiv.appendChild(recordDiv);
}
