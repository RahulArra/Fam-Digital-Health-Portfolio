import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
  const userId = localStorage.getItem("userID");

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    axios.get(`http://localhost:5000/api/auth/${userId}`)
      .then((res) => setUser(res.data))
      .catch(() => console.log("User not found"));

    axios.get(`http://localhost:5000/api/profile/${userId}`)
      .then((res) => {
        setProfile(res.data);
        setHeight(res.data.height || "");
        setWeight(res.data.weight || "");
        setAge(res.data.age || "");
        setBmi(res.data.bmi || "");
        setHealthConditions(res.data.healthConditions || []);
        setMedications(res.data.medications || []);
        setTherapies(res.data.therapies || []);
        setDailyActivity(res.data.dailyActivity || "");
        setBadHabits(res.data.badHabits || []);
      })
      .catch(() => setProfile(null));
  }, [userId]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const newProfile = { userId, height, weight, age, healthConditions, medications, therapies, dailyActivity, badHabits };

    await axios.post(`http://localhost:5000/api/profilepost`, newProfile)
      .then(() => {
        alert(profile ? "Profile updated!" : "Profile added!");
        window.location.reload();
      })
      .catch(() => alert("Error saving profile"));
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#333", color: "#fff" }}>
        <h2>Health Profile</h2>
        <div>
          <button onClick={() => navigate("/dashboard")} style={{ marginRight: "10px" }}>Dashboard</button>
          <button onClick={() => { localStorage.removeItem("userID"); navigate("/login"); }}>Logout</button>
        </div>
      </nav>

      {/* Profile Details */}
      <div style={{ padding: "20px" }}>
        <h3>Welcome, {user.name}</h3>
        {profile ? (
          <div>
            <p>Height: {profile.height} cm</p>
            <p>Weight: {profile.weight} kg</p>
            <p>BMI: {profile.bmi}</p>
            <button onClick={() => setShowForm(true)}>Update Profile</button>
          </div>
        ) : (
          <button onClick={() => setShowForm(true)}>Add Profile</button>
        )}
      </div>

      {/* Form to Add/Update Profile */}
      {showForm && (
        <form onSubmit={handleSaveProfile} style={{ padding: "20px", border: "1px solid #ccc", margin: "20px", maxWidth: "400px" }}>
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
          <button type="submit">{profile ? "Update" : "Add"} Profile</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
