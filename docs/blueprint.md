# **App Name**: JalSuraksha: Indore Water Quality Monitoring

## Core Features:

- Role-Based Dashboard Routing: Route users to either the Public or Admin dashboard based on a role flag. Includes a UI toggle to switch between roles for demo purposes.
- Public Dashboard: Water Safety Overview: Display a 'Is Your Water Safe Today?' status banner, along with summary cards for average pH, Turbidity, Active Alerts, and AI Cleanliness Score (mock).
- Public Dashboard: Ward Map Visualization: Show an interactive map of Indore, with color-coded wards indicating water safety levels (Green = Safe, Amber = Moderate, Red = Unsafe). Allows toggling between pH, Turbidity, and Combined Risk views.
- Public Dashboard: Citizen Reporting: Enable citizens to report water quality issues by uploading a photo, selecting their ward, and submitting the report. Display a mock AI cleanliness score and status label upon submission.
- Admin Dashboard: Real-time Monitoring: Display real-time metric cards for pH, Turbidity, Temperature, and TDS (mock), with status colors and 24h/7-day trend graphs.
- Admin Dashboard: Heatmap & GIS View: Provide a city heatmap overlay with layers for Water Tanks and Pipelines (future placeholder). Clicking a node displays sensor readings, status, and linked citizen reports.
- AI-Powered Cleanliness Assessment: Provide the other features with a mock AI-tool for determining cleanliness scores of provided reports. Uses past reporting history combined with known sources of pollution to generate a simulated score. (Mock Data).

## Style Guidelines:

- Primary color: #3498db (RGB) - A calming blue, reflecting the water element, but with enough saturation to be professional and trustworthy.
- Background color: #ecf0f1 (RGB) - A very light grey, almost white, providing a clean and neutral backdrop that will contrast effectively with the chosen primary color and suit both dashboards.
- Accent color: #2ecc71 (RGB) - A vibrant green to highlight safe parameters and CTAs, creating a sense of security and environmental consciousness.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look; suitable for both headlines and body text.
- Use simple, clear icons from a library like FontAwesome to represent different metrics and functionalities. Color-code icons to match the severity of the data they represent (e.g., green for safe, red for critical).
- Public Dashboard: Friendly, mobile-first responsive design with clear data visualization and accessible reporting features. Admin Dashboard: Professional, desktop-first layout with detailed analytics and controls. Ensure a consistent design language across both dashboards.
- Subtle transitions and animations to enhance user experience. Use micro-interactions to provide feedback on user actions (e.g., button presses, data loading).