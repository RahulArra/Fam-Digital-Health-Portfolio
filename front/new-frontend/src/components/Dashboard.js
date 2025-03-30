import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: auto;
  text-align: center;
`;

const Card = styled.div`
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
  flex: 1;
  margin: 5px;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const RecentVisits = styled.div`
  text-align: left;
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
  margin-top: 20px;
`;

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/user/65e987abcdef123456789012") // Use real ObjectId
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!user) return <h2>Loading...</h2>;

  const bmi = (user.weight / ((user.height / 100) * (user.height / 100))).toFixed(1);

  return (
    <Container>
      <h2>Welcome, {user.name} 👋</h2>

      <StatsContainer>
        <Card>
          <p>Height</p>
          <p>{user.height} cm</p>
        </Card>
        <Card>
          <p>Weight</p>
          <p>{user.weight} kg</p>
        </Card>
        <Card>
          <p>Age</p>
          <p>{user.age} years</p>
        </Card>
        <Card>
          <p>BMI</p>
          <p>{bmi}</p>
        </Card>
      </StatsContainer>

      <h3 style={{ marginTop: "20px" }}>Recent Hospital Visits</h3>
      <RecentVisits>
        {user.visits.length > 0 ? (
          user.visits.map((visit, index) => (
            <p key={index}>
              {visit.date} - {visit.doctor} at {visit.hospital}
            </p>
          ))
        ) : (
          <p>No visits recorded.</p>
        )}
      </RecentVisits>
    </Container>
  );
};

export default Dashboard;
