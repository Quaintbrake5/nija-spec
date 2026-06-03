# Frontend Integration Guide

This document provides guidance and examples for connecting the React frontend to the FastAPI backend of the NijaSpec platform.

## API Overview

The backend provides a RESTful API with endpoints grouped by resource:
- `/api/v1/organizations`
- `/api/v1/projects`
- `/api/v1/specs`
- `/api/v1/runs`

## Client Configuration

We recommend using `axios` for API requests. Below is a recommended configuration for a centralized API client.

### 1. API Client Setup

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for Authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## API Usage Examples

### Projects

#### List Projects for an Organization
`GET /orgs/{org_id}/projects`

```typescript
import apiClient from './apiClient';

export const getProjects = async (orgId: number) => {
  const response = await apiClient.get(`/orgs/${orgId}/projects`);
  return response.data;
};
```

#### Create a New Project
`POST /orgs/{org_id}/projects`

```typescript
export const createProject = async (orgId: number, projectData: { name: string, description: string }) => {
  const response = await apiClient.post(`/orgs/${orgId}/projects`, projectData);
  return response.data;
};
```

### Specifications

#### List Specs for a Project
`GET /projects/{project_id}/specs`

```typescript
export const getProjectSpecs = async (projectId: string | number) => {
  const response = await apiClient.get(`/projects/${projectId}/specs`);
  return response.data;
};
```

#### Create a Specification
`POST /specs`

```typescript
export const createSpec = async (specData: { name: string, content: string, project_id: string }) => {
  const response = await apiClient.post('/specs', specData);
  return response.data;
};
```

### Compliance Runs

#### Start a New Run
`POST /runs`

```typescript
export const startRun = async (runData: { spec_id: string, config: any }) => {
  const response = await apiClient.post('/runs', runData);
  return response.data;
};
```

#### Get Run Results
`GET /runs/{run_id}/results`

```typescript
export const getRunResults = async (runId: string) => {
  const response = await apiClient.get(`/runs/${runId}/results`);
  return response.data;
};
```

## Error Handling

The API uses standard HTTP status codes:

| Status Code | Meaning | Action |
| :--- | :--- | :--- |
| `200 OK` | Success | Process data |
| `201 Created` | Resource Created | Redirect to new resource |
| `204 No Content` | Success (No body) | Update UI state |
| `400 Bad Request` | Validation Error | Show field errors from `detail` |
| `401 Unauthorized` | Token missing/expired | Redirect to login |
| `403 Forbidden` | Insufficient Permissions | Show "Access Denied" |
| `404 Not Found` | Resource missing | Show 404 page/message |
| `500 Internal Error`| Server crash | Show "Something went wrong" |

### Handling Validation Errors

FastAPI returns validation errors in a specific format (`detail` array). Handle them as follows:

```typescript
try {
  await createProject(orgId, data);
} catch (error) {
  if (axios.isAxiosError(error) && error.response?.status === 422) {
    const details = error.response.data.detail;
    // Map these details to your form fields (e.g., using React Hook Form)
    console.error('Validation errors:', details);
  }
}
```

## CORS Configuration

To allow the frontend to communicate with the backend, the FastAPI backend must have CORS configured. Ensure the `CORSMiddleware` is added to the main FastAPI app:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
