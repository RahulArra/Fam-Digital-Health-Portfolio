

// import { marked } from "marked";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import './Profile.css';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

//     const fetchData = async () => {
//       try {
//         const { data: userData } = await axios.get(`http://localhost:5000/api/auth/${userId}`);
//         setUser(userData);

//         const { data: profileData } = await axios.get(`http://localhost:5000/api/profile/${userId}`);
//         setProfile(profileData);
//         setHeight(profileData.height || "");
//         setWeight(profileData.weight || "");
//         setAge(profileData.age || "");
//         setBmi(profileData.bmi || "");
//         setHealthConditions(profileData.healthConditions || []);
//         setMedications(profileData.medications || []);
//         setTherapies(profileData.therapies || []);
//         setDailyActivity(profileData.dailyActivity || "");
//         setBadHabits(profileData.badHabits || []);
//       } catch (error) {
//         console.error("Error fetching data", error);
//       }
//     };

//     fetchData();
//   }, [userId]);

//   const handleSaveProfile = async (e) => {
//     e.preventDefault();
//     const newProfile = { userId, height, weight, age, healthConditions, medications, therapies, dailyActivity, badHabits };

//     try {
//       await axios.post(`http://localhost:5000/api/profilepost`, newProfile);
//       alert(profile ? "Profile updated!" : "Profile added!");
//       window.location.reload();
//     } catch {
//       alert("Error saving profile");
//     }
//   };

//   const calculateBMI = () => {
//     if (!height || !weight) return null;
//     const heightInMeters = height / 100;
//     return (weight / (heightInMeters * heightInMeters)).toFixed(2);
//   };

//   const handleGetRecommendation = async () => {
//     const bmiValue = calculateBMI();

//     if (!bmiValue) {
//       alert("Height and weight are required to calculate BMI.");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:5000/api/gemini/recommend", {
//         height,
//         weight,
//         age,
//         healthConditions,
//         medications,
//         therapies,
//         dailyActivity,
//         badHabits
//       });

//       setRecommendation(marked(response.data.recommendation));
//       setBmi(response.bmi);
//     } catch (error) {
//       console.error("Error fetching AI recommendation:", error);
//     }
//   };

//   return (
//     <div className="profile-container">
//       <nav className="navbar">
//         <h2>Health Profile</h2>
//         <div>
//           <button className="nav-button" onClick={() => navigate("/dashboard")}>Dashboard</button>
//           <button className="nav-button" onClick={() => { localStorage.removeItem("userID"); navigate("/login"); }}>Logout</button>
//         </div>
//       </nav>

//       <div className="profile-content">
//         <h3>Welcome, {user.name}</h3>
//         {profile ? (
//           <div>
//             <div className="top">
//               <div className="left">
//                 <p>Height: {profile.height} cm</p>
//                 <p>Weight: {profile.weight} kg</p>
//                 <p>BMI: {calculateBMI() || "Not calculated"}</p>
//                 <p>Age: {profile.age}</p>
//                 <p>Health Conditions: {profile.healthConditions?.join(", ") || "None"}</p>
//                 <p>Medications: {profile.medications?.join(", ") || "None"}</p>
//                 <p>Therapies: {profile.therapies?.join(", ") || "None"}</p>
//                 <p>Daily Activity: {profile.dailyActivity?.exercise || "Not Provided"}</p>
//                 <p>Bad Habits: {profile.badHabits?.join(", ") || "None"}</p>
//               </div>
//               <div className="right">
//                 {profile?.bmiRecords?.length > 0 ? (
//                   <ResponsiveContainer width="100%" height={300}>
//                     <LineChart data={profile.bmiRecords}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="date" />
//                       <YAxis />
//                       <Tooltip />
//                       <Line type="monotone" dataKey="bmi" stroke="#8884d8" />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 ) : (
//                   <p>No BMI records available</p>
//                 )}
//               </div>
//             </div>

//             <button className="action-button" onClick={() => setShowForm(true)}>Update Profile</button>
//             <button className="action-button" onClick={handleGetRecommendation}>Get AI Recommendation</button>

//           </div>
//         ) : (
//           <button className="action-button" onClick={() => setShowForm(true)}>Add Profile</button>
//         )}
//       </div>

//       <div className="form-ai">
//         {showForm && (
//           <form onSubmit={handleSaveProfile} className="profile-form">
//             <h3>{profile ? "Update Profile" : "Add Profile"}</h3>
//             <label>Height (cm):</label>
//             <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} required />
//             <label>Weight (kg):</label>
//             <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
//             <label>Age:</label>
//             <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
//             <label>Health Conditions:</label>
//             <input type="text" value={healthConditions} onChange={(e) => setHealthConditions(e.target.value)} />
//             <label>Medications:</label>
//             <input type="text" value={medications} onChange={(e) => setMedications(e.target.value)} />
//             <label>Therapies:</label>
//             <input type="text" value={therapies} onChange={(e) => setTherapies(e.target.value)} />
//             <label>Daily Activity:</label>
//             <input type="text" value={dailyActivity} onChange={(e) => setDailyActivity(e.target.value)} />
//             <label>Bad Habits:</label>
//             <input type="text" value={badHabits} onChange={(e) => setBadHabits(e.target.value)} />
//             <button type="submit" className="submit-button">{profile ? "Update" : "Add"} Profile</button>
//             <button type="button" onClick={() => setShowForm(false)} className="cancel-button">Cancel</button>
//           </form>
//         )}

//         <div class="recommandation">
//           {bmi && <h3>BMI: {bmi}</h3>}
//           {recommendation && (
//             <div dangerouslySetInnerHTML={{ __html: recommendation.replace(/\n/g, "<br/>") }} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;


import { marked } from "marked";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Profile.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Profile = () => {
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
        const { data: userData } = await axios.get(`http://localhost:5000/api/auth/${userId}`);
        setUser(userData);

        const { data: profileData } = await axios.get(`http://localhost:5000/api/profile/${userId}`);
        setProfile(profileData);
        setHeight(profileData.height || "");
        setWeight(profileData.weight || "");
        setAge(profileData.age || "");
        setBmi(profileData.bmi || "");
        setHealthConditions(profileData.healthConditions || []);
        setMedications(profileData.medications || []);
        setTherapies(profileData.therapies || []);
        setDailyActivity(profileData.dailyActivity || "");
        setBadHabits(profileData.badHabits || []);
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
      if (profile) {
        // If profile exists, update it
        await axios.post(`http://localhost:5000/api/profile/${userId}`, newProfile);
        alert("Profile updated!");
      } else {
        // If no profile exists, create a new one
        await axios.post("http://localhost:5000/api/profile", newProfile);
        alert("Profile added!");
      }
      window.location.reload();
    } catch (error) {
      alert("Error saving profile");
    }
  };

  const calculateBMI = () => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const handleGetRecommendation = async () => {
    const bmiValue = calculateBMI();

    if (!bmiValue) {
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

      setRecommendation(marked(response.data.recommendation));
      setBmi(response.bmi);
    } catch (error) {
      console.error("Error fetching AI recommendation:", error);
    }
  };

  return (
    <div className="profile-container">
      <nav className="navbar1">
        <h2>Health Profile</h2>
        <div>
          <button className="nav-button" onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button className="nav-button" onClick={() => { localStorage.removeItem("userID"); navigate("/login"); }}>Logout</button>
        </div>
      </nav>

      <div className="profile-content">
        <h3>Welcome, {user.name}</h3>
        {profile ? (
          <div className="profile-overview">
            <div className="top">
            <div className="left">
    <p><strong>Height:</strong> {profile.height} cm</p>
    <p><strong>Weight:</strong> {profile.weight} kg</p>
    <p><strong>BMI:</strong> {calculateBMI() || "Not calculated"}</p>
    <p><strong>Age:</strong> {profile.age}</p>
    <p><strong>Health Conditions:</strong> {profile.healthConditions?.join(", ") || "None"}</p>
    <p><strong>Medications:</strong> {profile.medications?.join(", ") || "None"}</p>
    <p><strong>Therapies:</strong> {profile.therapies?.join(", ") || "None"}</p>
    <p><strong>Daily Activity:</strong> {profile.dailyActivity?.exercise || "Not Provided"}</p>
    <p><strong>Bad Habits:</strong> {profile.badHabits?.join(", ") || "None"}</p>
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

            <div className="button-container">
              <button className="action-button" onClick={() => setShowModal(true)}>Update Profile</button>
              <button className="action-button" onClick={handleGetRecommendation}>Get AI Recommendation</button>
            </div>
          </div>
        ) : (
          <button className="action-button" onClick={() => setShowModal(true)}>Add Profile</button>
        )}
        
        {recommendation && (
          <div className="recommandation">
            <h2>AI Recommandation</h2>
            {bmi && <h3>BMI: {bmi}</h3>}
            <div dangerouslySetInnerHTML={{ __html: recommendation.replace(/\n/g, "<br/>") }} />
          </div>
        )}

      </div>

      {/* Modal for updating/adding profile */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
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
              <button type="button" onClick={() => setShowModal(false)} className="cancel-button">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;