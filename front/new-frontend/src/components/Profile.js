

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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FiEdit, FiActivity, FiHeart, FiPlus, FiTrash2, FiArrowUpRight, FiUser, FiInfo } from "react-icons/fi";
import './Profile.css';
import ClipLoader from "react-spinners/ClipLoader";
const Profile = () => {
  const [loading, setLoading ] = useState(false)
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

  const healthStatusColors = {
    underweight: '#FFB74D',
    normal: '#81C784',
    overweight: '#FFD54F',
    obese: '#E57373'
  };

  const getBMIStatus = (bmi) => {
    if (!bmi) return 'unknown';
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  };

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
        setHealthConditions(profileData.healthConditions?.join(", ") || "");
        setMedications(profileData.medications?.join(", ") || "");
        setTherapies(profileData.therapies?.join(", ") || "");
        setDailyActivity(profileData.dailyActivity || "");
        setBadHabits(profileData.badHabits?.join(", ") || "");
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
      setLoading(true)
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
      setLoading(false)
    } catch (error) {
      console.error("Error fetching AI recommendation:", error);
      setLoading(false)
    }
  };

  return (
    <div className="profile-container">
      <nav className="navbar">
        <div className="brand">
          <FiHeart className="nav-icon" />
          <h1>HealthTrack</h1>
        </div>
        <div className="nav-controls">
          <button className="nav-btn" onClick={() => navigate("/dashboard")}>
            <FiActivity className="btn-icon" />
            Dashboard
          </button>
          <button className="nav-btn" onClick={() => { localStorage.removeItem("userID"); navigate("/login"); }}>
            <FiArrowUpRight className="btn-icon" />
            Logout
          </button>
        </div>
      </nav>

      <main className="profile-main">
        <header className="profile-header">
          <div className="user-info">
            <FiUser className="user-icon" />
            <div>
              <h2>{user.name}'s Health Profile</h2>
              <p className="member-since">Member since 2023</p>
            </div>
          </div>
          <button className="edit-profile-btn" onClick={() => setShowModal(true)}>
            <FiEdit />
            {profile ? "Edit Profile" : "Create Profile"}
          </button>
        </header>

        <div className="health-grid">
          {/* Health Metrics Card */}
          <div className="health-card">
            <div className="card-header">
              <FiActivity className="card-icon" />
              <h3>Basic Metrics</h3>
            </div>
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-label">Height</span>
                <span className="metric-value">{profile?.height || '--'} cm</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Weight</span>
                <span className="metric-value">{profile?.weight || '--'} kg</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Age</span>
                <span className="metric-value">{profile?.age || '--'}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">BMI</span>
                <div className="bmi-display">
                  <span className="metric-value">{calculateBMI() || '--'}</span>
                  {bmi && (
                    <span 
                      className="bmi-status"
                      style={{ backgroundColor: healthStatusColors[getBMIStatus(bmi)] }}
                    >
                      {getBMIStatus(bmi)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Health Chart Card */}
          <div className="health-card chart-card">
            <div className="card-header">
              <FiActivity className="card-icon" />
              <h3>BMI History</h3>
            </div>
            <div className="chart-container">
              {profile?.bmiRecords?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={profile.bmiRecords}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="bmi" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      dot={{ fill: '#6366f1' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">
                  <FiInfo className="info-icon" />
                  <p>No BMI records available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Health Details Section */}
        <div className="details-section">
          <div className="detail-card">
            <h3 className="detail-title">
              <FiHeart className="detail-icon" />
              Health Conditions
            </h3>
            <div className="tag-container">
              {profile?.healthConditions?.map((condition, index) => (
                <span key={index} className="health-tag">
                  {condition}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-card">
            <h3 className="detail-title">
              <FiActivity className="detail-icon" />
              Daily Activity
            </h3>
            <p className="activity-text">{profile?.dailyActivity || 'No activity information'}</p>
          </div>

          <div className="detail-card">
            <h3 className="detail-title">
              <FiPlus className="detail-icon" />
              Medications & Therapies
            </h3>
            <div className="medication-list">
              {profile?.medications?.map((med, index) => (
                <div key={index} className="med-item">
                  <span>{med}</span>
                  <FiTrash2 className="delete-icon" />
                </div>
              ))}
            </div>
          </div>
        </div>
        {loading ? <div style={{display: "flex", justifyContent:"center"}}><ClipLoader size={70}/></div> : ""}
        {recommendation && (
          <div className="recommendation-card">
            <h3 className="recommendation-title">
              <FiInfo className="recommendation-icon" />
              AI Health Recommendations
            </h3>
            <div 
              className="recommendation-content"
              dangerouslySetInnerHTML={{ __html: recommendation.replace(/\n/g, "<br/>") }} 
            />
          </div>
        )}

        <button className="floating-action-btn" onClick={handleGetRecommendation}>
          AI
        </button>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="profile-modal">
            <div className="modal-header">
              <h3>{profile ? "Update Profile" : "Create Profile"}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Health Conditions (comma separated)</label>
                  <input
                    type="text"
                    value={healthConditions}
                    onChange={(e) => setHealthConditions(e.target.value)}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Medications (comma separated)</label>
                  <input
                    type="text"
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Daily Activity Level</label>
                  <select
                    value={dailyActivity}
                    onChange={(e) => setDailyActivity(e.target.value)}
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light Exercise</option>
                    <option value="moderate">Moderate Exercise</option>
                    <option value="active">Active</option>
                    <option value="very-active">Very Active</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {profile ? "Update Profile" : "Create Profile"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
