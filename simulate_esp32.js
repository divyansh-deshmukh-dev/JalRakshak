
// Running on Node 18+ which supports fetch natively

const API_URL = 'http://localhost:3000/api/sensor';

function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

async function sendSensorData() {
    const data = {
        ph: getRandomInRange(6.0, 9.0), // Random pH between 6 and 9
        turbidity: getRandomInRange(0, 10), // Random turbidity
        lat: 22.7196 + (Math.random() - 0.5) * 0.05,
        lng: 75.8577 + (Math.random() - 0.5) * 0.05,
        deviceId: 'ESP32-SIM-001'
    };

    console.log('Sending data:', data);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log('Response:', result);
    } catch (error) {
        console.error('Error sending data:', error.message);
        console.log('Make sure the Next.js server is running on localhost:3000');
    }
}

// Run every 5 seconds
setInterval(sendSensorData, 5000);
console.log('Starting ESP32 Simulation...');
sendSensorData();
