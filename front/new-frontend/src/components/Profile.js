import { marked } from "marked";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  FiEdit, FiActivity, FiHeart, FiPlus, FiTrash2, 
  FiArrowUpRight, FiUser, FiInfo, FiMessageSquare,
  FiChevronDown, FiSend 
} from "react-icons/fi";
import './Profile.css';
import ClipLoader from "react-spinners/ClipLoader";

const Profile = () => {
  // State declarations
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [bmiRecords, setBmiRecords] = useState([]);
  const [healthConditions, setHealthConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [therapies, setTherapies] = useState("");
  const [badHabits, setBadHabits] = useState("");
  const [dailyActivity, setDailyActivity] = useState({
    exercise: "",
    steps: "",
    waterIntake: "",
    sleepHours: ""
  });
  
  // AI Features State
  const [recommendation, setRecommendation] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userID");

  const healthStatusColors = {
    underweight: '#FFB74D',
    normal: '#81C784',
    overweight: '#FFD54F',
    obese: '#E57373'
  };

  // Helper functions
  const getBMIStatus = (bmi) => {
    if (!bmi) return 'unknown';
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        setBmiRecords(profileData.bmiRecords || []);
        setHealthConditions(profileData.healthConditions?.join(", ") || "");
        setMedications(profileData.medications?.join(", ") || "");
        setTherapies(profileData.therapies?.join(", ") || "");
        setBadHabits(profileData.badHabits?.join(", ") || "");
        setDailyActivity(profileData.dailyActivity || {
          exercise: "",
          steps: "",
          waterIntake: "",
          sleepHours: ""
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [userId]);

  // Profile functions
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const newProfile = { 
      userId, 
      height, 
      weight, 
      age, 
      healthConditions: healthConditions.split(",").map(item => item.trim()), 
      medications: medications.split(",").map(item => item.trim()), 
      therapies: therapies.split(",").map(item => item.trim()),
      badHabits: badHabits.split(",").map(item => item.trim()),
      dailyActivity 
    };

    try {
      if (profile) {
        await axios.post(`http://localhost:5000/api/profile/${userId}`, newProfile);
        alert("Profile updated!");
      } else {
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
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    
    if (!bmiRecords.some(record => record.bmi === parseFloat(bmiValue))) {
      setBmiRecords([...bmiRecords, {
        date: new Date(),
        bmi: parseFloat(bmiValue)
      }]);
    }
    
    return bmiValue;
  };

  // AI Recommendation function
  const handleGetRecommendation = async () => {
    const bmiValue = calculateBMI();

    if (!bmiValue) {
      alert("Height and weight are required to calculate BMI.");
      return;
    }

    try {
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching AI recommendation:", error);
      setLoading(false);
    }
  };

  // Chat functions
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await axios.post("http://localhost:5000/api/gemini/chat", {
        message: inputMessage,
        context: {
          height,
          weight,
          age,
          healthConditions,
          medications,
          therapies,
          dailyActivity,
          badHabits,
          bmi: calculateBMI()
        }
      });

      const aiMessage = {
        id: Date.now() + 1,
        text: marked(response.data.reply),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDailyActivityChange = (field, value) => {
    setDailyActivity({
      ...dailyActivity,
      [field]: value
    });
  };

  return (
    <div className="profile-container">
      {/* Navbar */}
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
          <button 
            className="nav-btn" 
            onClick={() => { 
              localStorage.removeItem("userID"); 
              navigate("/login"); 
            }}
          >
            <FiArrowUpRight className="btn-icon" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="profile-main">
        {/* Profile Header */}
        <header className="profile-header">
          <div className="user-info">
            <FiUser className="user-icon" />
            <div>
              <h2>{user.name}'s Health Profile</h2>
              <p className="member-since">Member since 2023</p>
            </div>
          </div>
          <button 
            className="edit-profile-btn" 
            onClick={() => setShowModal(true)}
          >
            <FiEdit />
            {profile ? "Edit Profile" : "Create Profile"}
          </button>
        </header>

        {/* Health Metrics Grid */}
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
                  {calculateBMI() && (
                    <span 
                      className="bmi-status"
                      style={{ backgroundColor: healthStatusColors[getBMIStatus(calculateBMI())] }}
                    >
                      {getBMIStatus(calculateBMI())}
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
              {bmiRecords?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bmiRecords}>
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
            <div className="activity-details">
              <div className="activity-item">
                <span>Exercise:</span>
                <span>{profile?.dailyActivity?.exercise || 'Not specified'}</span>
              </div>
              <div className="activity-item">
                <span>Steps:</span>
                <span>{profile?.dailyActivity?.steps || '--'} per day</span>
              </div>
              <div className="activity-item">
                <span>Water Intake:</span>
                <span>{profile?.dailyActivity?.waterIntake || 'Not specified'}</span>
              </div>
              <div className="activity-item">
                <span>Sleep:</span>
                <span>{profile?.dailyActivity?.sleepHours || '--'} hours</span>
              </div>
            </div>
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

        {/* Loading Indicator */}
        {loading && (
          <div style={{display: "flex", justifyContent:"center"}}>
            <ClipLoader size={70}/>
          </div>
        )}

        {/* AI Recommendation Card */}
        {recommendation && (
          <div className="recommendation-card">
            <div className="recommendation-header">
              <FiInfo className="recommendation-icon" />
              <h3 className="recommendation-title">AI Health Recommendations</h3>
            </div>
            <div 
              className="recommendation-content"
              dangerouslySetInnerHTML={{ __html: recommendation }} 
            />
          </div>
        )}

        {/* AI Chat Interface */}
        <div className={`ai-chat-container ${chatOpen ? 'open' : ''}`}>
          <div className="ai-chat-header" onClick={() => setChatOpen(!chatOpen)}>
            <div className="ai-chat-title">
              <FiMessageSquare className="chat-icon" />
              <h3>Health Assistant</h3>
            </div>
            <div className="ai-chat-actions">
              <button className="chat-toggle-btn">
                {chatOpen ? <FiChevronDown /> : <FiMessageSquare />}
              </button>
            </div>
          </div>
          
          {chatOpen && (
            <div className="ai-chat-content">
              <div className="ai-messages">
                {messages.length === 0 ? (
                  <div className="ai-welcome-message">
                    <p>Hello! I'm your Health Assistant. How can I help you today?</p>
                    <div className="ai-suggestions">
                      <button onClick={() => setInputMessage("What exercise would you recommend for me?")}>
                        Exercise advice
                      </button>
                      <button onClick={() => setInputMessage("How can I improve my sleep?")}>
                        Sleep tips
                      </button>
                      <button onClick={() => setInputMessage("What diet changes would help me?")}>
                        Nutrition tips
                      </button>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className={`message ${message.sender}`}>
                      <div className="message-content">
                        {message.sender === 'ai' ? (
                          <div dangerouslySetInnerHTML={{ __html: message.text }} />
                        ) : (
                          <p>{message.text}</p>
                        )}
                        <span className="message-time">{message.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
                {isTyping && (
                  <div className="message ai">
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="ai-chat-input">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about your health..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim()}
                >
                  <FiSend />
                </button>
              </div>
            </div>
          )}
        </div>
{/* Floating Action Buttons */}
<div className="floating-buttons">
  {/* Recommendations Button */}
  <button 
    className="floating-action-btn recommend-btn"
    onClick={handleGetRecommendation}
  >
    <FiInfo />
    <span className="tooltip">Get Health Advice</span>
  </button>
  
  {/* Chat Button */}
  <button 
    className="floating-action-btn chat-btn"
    onClick={() => setChatOpen(!chatOpen)}
  >
    <FiMessageSquare />
    <span className="tooltip">Chat with AI</span>
  </button>
</div>
      </main>

      {/* Profile Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="profile-modal">
            <div className="modal-header">
              <h3>{profile ? "Update Profile" : "Create Profile"}</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowModal(false)}
              >
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
                  <label>Therapies (comma separated)</label>
                  <input
                    type="text"
                    value={therapies}
                    onChange={(e) => setTherapies(e.target.value)}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Bad Habits (comma separated)</label>
                  <input
                    type="text"
                    value={badHabits}
                    onChange={(e) => setBadHabits(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Exercise Level</label>
                  <select
                    value={dailyActivity.exercise}
                    onChange={(e) => handleDailyActivityChange('exercise', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="intense">Intense</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Daily Steps</label>
                  <input
                    type="number"
                    value={dailyActivity.steps}
                    onChange={(e) => handleDailyActivityChange('steps', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Water Intake</label>
                  <select
                    value={dailyActivity.waterIntake}
                    onChange={(e) => handleDailyActivityChange('waterIntake', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="low">Low (&lt;1L)</option>
                    <option value="moderate">Moderate (1-2L)</option>
                    <option value="high">High (&gt;2L)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Sleep Hours</label>
                  <input
                    type="number"
                    value={dailyActivity.sleepHours}
                    onChange={(e) => handleDailyActivityChange('sleepHours', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {profile ? "Update Profile" : "Create Profile"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="cancel-btn"
                >
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