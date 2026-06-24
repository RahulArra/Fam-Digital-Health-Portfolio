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
import NotificationBell from "./NotificationBell";
import ActionRequired from "../components/ActionRequired";

const Profile = () => {
  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
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
  const [grounding, setGrounding] = useState(null);
  const [groundingLabel, setGroundingLabel] = useState("Patient context index");
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
        const { data: userData } = await axios.get(`${API_BASE}/auth/${userId}`);
        setUser(userData);

        const { data: profileData } = await axios.get(`${API_BASE}/profile/${userId}`);
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
        try {
          const { data: groundingData } = await axios.get(`${API_BASE}/gemini/grounding/${userId}`, {
            params: {
              query: "Summarize the patient's current health priorities."
            }
          });
          setGrounding(groundingData.grounding);
          setGroundingLabel("Patient context index");
        } catch (groundingError) {
          console.error("Error fetching grounding preview", groundingError);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [API_BASE, userId]);

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
        await axios.post(`${API_BASE}/profile/${userId}`, newProfile);
        alert("Profile updated!");
      } else {
        await axios.post(`${API_BASE}/profile`, newProfile);
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

  const currentBmi = calculateBMI();

  const formatSourceType = (sourceType) => {
    const labels = {
      profile: "Profile",
      activity: "Lifestyle",
      bmi: "BMI Trend",
      hospital_record: "Hospital Visit",
      care_plan: "Treatment Plan",
      request: "Live Context"
    };

    return labels[sourceType] || "Patient Signal";
  };

  // AI Recommendation function
  const handleGetRecommendation = async () => {
    const bmiValue = currentBmi;

    if (!bmiValue) {
      alert("Height and weight are required to calculate BMI.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/gemini/recommend`, {
        userId,
        height,
        weight,
        age,
        healthConditions,
        medications,
        therapies,
        dailyActivity,
        badHabits,
        query:
          "Generate a personalized health plan with diet, exercise, medication reminders, and follow-up insights."
      });
      setRecommendation(marked(response.data.recommendation));
      setGrounding(response.data.grounding);
      setGroundingLabel("Recommendation grounding");
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
      const response = await axios.post(`${API_BASE}/gemini/chat`, {
        message: inputMessage,
        userId,
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
        timestamp: new Date().toLocaleTimeString(),
        grounding: response.data.grounding
      };

      setMessages(prev => [...prev, aiMessage]);
      setGrounding(response.data.grounding);
      setGroundingLabel("Latest assistant grounding");
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
  <NotificationBell />

  <button className="nav-btn" onClick={() => navigate("/dashboard")}>
    <FiActivity className="btn-icon" />
    Dashboard
  </button>

  <button className="nav-btn" onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    navigate("/login");
  }}>
    <FiArrowUpRight className="btn-icon" />
    Logout
  </button>
</div>


      </nav>
    <ActionRequired />

      {/* Main Content */}
      <main className="profile-main">
        {/* Profile Header */}
        <header className="profile-header">
          <div className="user-info">
            <FiUser className="user-icon" />
            <div>
              <h2>{user.name}'s Health Profile</h2>
              <p className="member-since">Member since 2025</p>
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
                  <span className="metric-value">{currentBmi || '--'}</span>
                  {currentBmi && (
                    <span 
                      className="bmi-status"
                      style={{ backgroundColor: healthStatusColors[getBMIStatus(currentBmi)] }}
                    >
                      {getBMIStatus(currentBmi)}
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

        {/* Notifications Section */}
        {/* <div className="detail-card">
          <h3 className="detail-title">
            <FiBell className="detail-icon" />
            Notifications
          </h3>
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <FiInfo className="info-icon" />
                <p>No notifications available</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                >
                  <div className="notification-header">
                    <strong className="notification-title">{notification.title}</strong>
                    {!notification.isRead && <span className="unread-indicator">●</span>}
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-date">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div> */}
        {/* <ActionRequired /> */}

{/* existing dashboard content below */}

        {grounding?.summary && (
          <div className="grounding-card">
            <div className="grounding-header">
              <div>
                <p className="grounding-eyebrow">RAG Retrieval Layer</p>
                <h3>{groundingLabel}</h3>
              </div>
              <span className="grounding-badge">
                {grounding.summary.chunksRetrieved} snippets retrieved
              </span>
            </div>

            <div className="grounding-stats">
              <div className="grounding-stat">
                <span>Conditions indexed</span>
                <strong>{grounding.summary.conditionsIndexed}</strong>
              </div>
              <div className="grounding-stat">
                <span>Medications indexed</span>
                <strong>{grounding.summary.medicationsIndexed}</strong>
              </div>
              <div className="grounding-stat">
                <span>Hospital records indexed</span>
                <strong>{grounding.summary.recordsIndexed}</strong>
              </div>
              <div className="grounding-stat">
                <span>Latest BMI</span>
                <strong>{grounding.summary.latestBmi || "--"}</strong>
              </div>
            </div>

            <div className="grounding-sources">
              {grounding.sources?.map((source) => (
                <div key={source.id} className="grounding-source">
                  <div className="grounding-source-top">
                    <span className="grounding-source-type">{formatSourceType(source.sourceType)}</span>
                    <span className="grounding-source-score">Score {source.score}</span>
                  </div>
                  <h4>{source.title}</h4>
                  <p>{source.snippet}</p>
                  {source.matchedTerms?.length > 0 && (
                    <div className="grounding-terms">
                      {source.matchedTerms.map((term) => (
                        <span key={`${source.id}-${term}`} className="grounding-term">
                          {term}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}


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
                        {message.sender === 'ai' && message.grounding?.summary && (
                          <div className="message-grounding">
                            Grounded on {message.grounding.summary.chunksRetrieved} patient snippets
                          </div>
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
      
