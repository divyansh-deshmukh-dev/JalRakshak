// API functions to communicate with FastAPI backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface CitizenReportInput {
  photoDataUri: string;
  ward: string;
  description?: string;
}

export interface CitizenReportOutput {
  cleanlinessScore: number;
  statusLabel: string;
  analysis: string;
  shutdown_recommended?: boolean;
  shutdown_reason?: string;
  estimated_ph?: number;
  estimated_turbidity?: number;
}

export async function submitCitizenReport(
  data: CitizenReportInput
): Promise<{ success: true; data: CitizenReportOutput } | { success: false; error: string }> {
  try {
    // Convert data URI to File object
    const response = await fetch(data.photoDataUri);
    const blob = await response.blob();
    const file = new File([blob], 'water-sample.jpg', { type: 'image/jpeg' });

    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ward', data.ward);
    if (data.description) {
      formData.append('description', data.description);
    }

    // Send to backend API
    const apiResponse = await fetch(`${API_BASE_URL}/process-citizen-report`, {
      method: 'POST',
      body: formData,
    });

    if (!apiResponse.ok) {
      throw new Error(`API request failed: ${apiResponse.status}`);
    }

    const result = await apiResponse.json();
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      throw new Error(result.error || 'Unknown API error');
    }
  } catch (error) {
    console.error('Error submitting citizen report:', error);
    return { success: false, error: 'Failed to submit report. Please try again.' };
  }
}

// Additional API functions for other features
export async function getReports() {
  try {
    const response = await fetch(`${API_BASE_URL}/reports`);
    if (!response.ok) throw new Error('Failed to fetch reports');
    return await response.json();
  } catch (error) {
    console.error('Error fetching reports:', error);
    return { reports: [] };
  }
}

export async function getIncidents() {
  try {
    const response = await fetch(`${API_BASE_URL}/get-incidents`);
    if (!response.ok) throw new Error('Failed to fetch incidents');
    return await response.json();
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return { incidents: [] };
  }
}

export async function getHeatmapData() {
  try {
    const response = await fetch(`${API_BASE_URL}/heatmap-data`);
    if (!response.ok) throw new Error('Failed to fetch heatmap data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    return { heatmap: [] };
  }
}

export async function getAlerts() {
  try {
    const response = await fetch(`${API_BASE_URL}/get-alerts`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return { alerts: [] };
  }
}
