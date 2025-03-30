

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Profile = () => {
//   const [user, setUser] = useState({});
//   const [profile, setProfile] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [height, setHeight] = useState("");
//   const [weight, setWeight] = useState("");
//   const [age, setAge] = useState("");
//   const [bmi, setBmi] = useState(null);
//   const [healthConditions, setHealthConditions] = useState("");
//   const [medications, setMedications] = useState("");
//   const [therapies, setTherapies] = useState("");
//   const [dailyActivity, setDailyActivity] = useState("");
//   const [badHabits, setBadHabits] = useState("");
//   const [recommendation, setRecommendation] = useState("");

//   const navigate = useNavigate();
//   const userId = localStorage.getItem("userID");

//   useEffect(() => {
//     if (!userId) return;

//     axios.get(`http://localhost:5000/api/auth/${userId}`)
//       .then((res) => setUser(res.data))
//       .catch(() => console.log("User not found"));

//     axios.get(`http://localhost:5000/api/profile/${userId}`)
//       .then((res) => {
//         setProfile(res.data);
//         setHeight(res.data.height || "");
//         setWeight(res.data.weight || "");
//         setAge(res.data.age || "");
//         setBmi(res.data.bmi || "");
//         setHealthConditions(res.data.healthConditions || []);
//         setMedications(res.data.medications || []);
//         setTherapies(res.data.therapies || []);
//         setDailyActivity(res.data.dailyActivity || "");
//         setBadHabits(res.data.badHabits || []);
//       })
//       .catch(() => setProfile(null));
//   }, [userId]);

//   const handleSaveProfile = async (e) => {
//     e.preventDefault();
//     const newProfile = { userId, height, weight, age, healthConditions, medications, therapies, dailyActivity, badHabits };

//     await axios.post(`http://localhost:5000/api/profilepost`, newProfile)
//       .then(() => {
//         alert(profile ? "Profile updated!" : "Profile added!");
//         window.location.reload();
//       })
//       .catch(() => alert("Error saving profile"));
//   };

//   const calculateBMI = (height, weight) => {
//     if (!height || !weight) return null;
//     const heightInMeters = height / 100;
//     return (weight / (heightInMeters * heightInMeters)).toFixed(2);
//   };

//   const handleGetRecommendation = async () => {
//     const bmi = calculateBMI(height, weight);

//     if (!bmi) {
//       alert("Height and weight are required to calculate BMI.");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:5000/api/gemini/get-recommendation", {
//         bmi: bmi, 
//         healthConditions,
//         medications,
//         therapies,
//         dailyActivity,
//         badHabits
//       });

//       setRecommendation(response.data); 
//     } catch (error) {
//       console.error("Error fetching AI recommendation:", error);
//     }
//   };

//   return (
//     <div>
//       <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#333", color: "#fff" }}>
//         <h2>Health Profile</h2>
//         <div>
//           <button onClick={() => navigate("/dashboard")} style={{ marginRight: "10px" }}>Dashboard</button>
//           <button onClick={() => { localStorage.removeItem("userID"); navigate("/login"); }}>Logout</button>
//         </div>
//       </nav>

//       <div style={{ padding: "20px" }}>
//         <h3>Welcome, {user.name}</h3>
//         {profile ? (
//           <div>
//             <p>Height: {profile.height} cm</p>
//             <p>Weight: {profile.weight} kg</p>
//             <p>BMI: {bmi || "Not calculated"}</p>
//             <p>Age: {profile.age}</p>
//             <p>Health Conditions: {profile.healthConditions?.join(", ") || "None"}</p>
//             <p>Medications: {profile.medications?.join(", ") || "None"}</p>
//             <p>Therapies: {profile.therapies?.join(", ") || "None"}</p>
//             <p>Exercise: {profile.dailyActivity?.exercise || "Not Provided"}</p>
//             <p>Sleep Hours: {profile.dailyActivity?.sleepHours || "Not Provided"}</p>
//             <p>Bad Habits: {profile.badHabits?.join(", ") || "None"}</p>

//             <button onClick={() => setShowForm(true)}>Update Profile</button>
//             <button onClick={handleGetRecommendation} style={{ marginLeft: "10px" }}>Get AI Recommendation</button>

//             {recommendation && (
//               <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
//                 <h4>AI Recommendation:</h4>
//                 <p>{recommendation}</p>
//               </div>
//             )}
//           </div>
//         ) : (
//           <button onClick={() => setShowForm(true)}>Add Profile</button>
//         )}
//       </div>

//       {showForm && (
//         <form onSubmit={handleSaveProfile} style={{ padding: "20px", border: "1px solid #ccc", margin: "20px", maxWidth: "400px" }}>
//           <h3>{profile ? "Update Profile" : "Add Profile"}</h3>
//           <label>Height (cm):</label>
//           <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} required />
//           <label>Weight (kg):</label>
//           <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
//           <label>Age:</label>
//           <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
//           <label>Health Conditions:</label>
//           <input type="text" value={healthConditions} onChange={(e) => setHealthConditions(e.target.value)} />
//           <label>Medications:</label>
//           <input type="text" value={medications} onChange={(e) => setMedications(e.target.value)} />
//           <label>Therapies:</label>
//           <input type="text" value={therapies} onChange={(e) => setTherapies(e.target.value)} />
//           <label>Daily Activity:</label>
//           <input type="text" value={dailyActivity} onChange={(e) => setDailyActivity(e.target.value)} />
//           <label>Bad Habits:</label>
//           <input type="text" value={badHabits} onChange={(e) => setBadHabits(e.target.value)} />
//           <button type="submit">{profile ? "Update" : "Add"} Profile</button>
//           <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Profile.css';  // Ensure to create and import the CSS for styling
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Profile = () => {
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [bmi, setBmi] = useState(null);
  const [healthConditions, setHealthConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [therapies, setTherapies] = useState("");
  const [dailyActivity, setDailyActivity] = useState("");
  const [badHabits, setBadHabits] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userID");

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:5000/api/auth/${userId}`);
        setUser(userResponse.data);

        const profileResponse = await axios.get(`http://localhost:5000/api/profile/${userId}`);
        setProfile(profileResponse.data);
        setHeight(profileResponse.data.height || "");
        setWeight(profileResponse.data.weight || "");
        setAge(profileResponse.data.age || "");
        setBmi(profileResponse.data.bmi || "");
        setHealthConditions(profileResponse.data.healthConditions || []);
        setMedications(profileResponse.data.medications || []);
        setTherapies(profileResponse.data.therapies || []);
        setDailyActivity(profileResponse.data.dailyActivity || "");
        setBadHabits(profileResponse.data.badHabits || []);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const newProfile = { userId, height, weight, age, healthConditions, medications, therapies, dailyActivity, badHabits };

    try {
      await axios.post(`http://localhost:5000/api/profilepost`, newProfile);
      alert(profile ? "Profile updated!" : "Profile added!");
      window.location.reload();
    } catch {
      alert("Error saving profile");
    }
  };

  const calculateBMI = () => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const handleGetRecommendation = async () => {
    const bmi = calculateBMI();

    if (!bmi) {
      alert("Height and weight are required to calculate BMI.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/gemini/recommend", {
        height,
        weight,
        age,
        healthConditions,
        medications,
        therapies,
        dailyActivity,
        badHabits
      });
    
      setRecommendation(response.data.recommendation); 
      setBmi(response.data.bmi);  
    } catch (error) {
      console.error("Error fetching AI recommendation:", error);
    }
     
    
  };

  return (
    <div className="profile-container">
      <nav className="navbar">
        <h2>Health Profile</h2>
        <div>
          <button className="nav-button" onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button className="nav-button" onClick={() => { localStorage.removeItem("userID"); navigate("/login"); }}>Logout</button>
        </div>
      </nav>
 
      <div className="profile-content">
        <h3>Welcome, {user.name}</h3>
        {profile ? (
          <div>
            <div className="top">
              <div className="left">
                <p>Height: {profile.height} cm</p>
                <p>Weight: {profile.weight} kg</p>
                <p>BMI: {calculateBMI() || "Not calculated"}</p>
                <p>Age: {profile.age}</p>
                <p>Health Conditions: {profile.healthConditions?.join(", ") || "None"}</p>
                <p>Medications: {profile.medications?.join(", ") || "None"}</p>
                <p>Therapies: {profile.therapies?.join(", ") || "None"}</p>
                <p>Daily Activity: {profile.dailyActivity?.exercise || "Not Provided"}</p>
                <p>Bad Habits: {profile.badHabits?.join(", ") || "None"}</p>
              </div>
              <div className="right">
              {profile?.bmiRecords?.length > 0 ? (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={profile.bmiRecords}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="bmi" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
) : (
  <p>No BMI records available</p>
)}
              </div>
            </div>

            <button className="action-button" onClick={() => setShowForm(true)}>Update Profile</button>
            <button className="action-button" onClick={handleGetRecommendation}>Get AI Recommendation</button>

          </div>
        ) : (
          <button className="action-button" onClick={() => setShowForm(true)}>Add Profile</button>
        )}
      </div>
      <div className="form-ai">
      {showForm && (
        <form onSubmit={handleSaveProfile} className="profile-form">
          <h3>{profile ? "Update Profile" : "Add Profile"}</h3>
          <label>Height (cm):</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} required />
          <label>Weight (kg):</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
          <label>Age:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          <label>Health Conditions:</label>
          <input type="text" value={healthConditions} onChange={(e) => setHealthConditions(e.target.value)} />
          <label>Medications:</label>
          <input type="text" value={medications} onChange={(e) => setMedications(e.target.value)} />
          <label>Therapies:</label>
          <input type="text" value={therapies} onChange={(e) => setTherapies(e.target.value)} />
          <label>Daily Activity:</label>
          <input type="text" value={dailyActivity} onChange={(e) => setDailyActivity(e.target.value)} />
          <label>Bad Habits:</label>
          <input type="text" value={badHabits} onChange={(e) => setBadHabits(e.target.value)} />
          <button type="submit" className="submit-button">{profile ? "Update" : "Add"} Profile</button>
          <button type="button" onClick={() => setShowForm(false)} className="cancel-button">Cancel</button>
        </form>
      )}
{/* {recommendation && (
  <div>
    <h3>BMI: {recommendation.bmi}</h3>
    <p>{recommendation.recommendation}</p>
  </div>
)} */}
<div>
  {bmi && <h3>BMI: {bmi}</h3>}
  {recommendation && <p>{recommendation}</p>}
</div>


      </div>
    </div>
  );
};

export default Profile;
