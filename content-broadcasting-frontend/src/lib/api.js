import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const api = axios.create({
	baseURL: BASE_URL,
	timeout: 15000,
	headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem('cbs_token')

		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
	}

	return config
})

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			if (typeof window !== 'undefined') {
				localStorage.removeItem('cbs_token')
				localStorage.removeItem('cbs_user')
				window.location.href = '/login'
			}
		}

		return Promise.reject(error)
	}
)

export default api

export const authApi = {
	login: (email, password) => api.post('/api/auth/login', { email, password }),
	register: (name, email, password, role) =>
		api.post('/api/auth/register', { name, email, password, role }),
}

export const contentApi = {
	uploadContent: (formData) =>
		api.post('/api/content/upload', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		}),
	getMyContent: () => api.get('/api/content/my'),
}

export const approvalApi = {
	getAllContent: () => api.get('/api/content/all'),
	getPendingContent: () => api.get('/api/content/pending'),
	approveContent: (id) => api.patch(`/api/approval/${id}/approve`),
	rejectContent: (id, rejectionReason) =>
		api.patch(`/api/approval/${id}/reject`, { rejectionReason }),
}

export const publicApi = {
	getLiveContent: (teacherId, subject) => {
		const params = subject ? { subject } : {}

		return api.get(`/content/live/${teacherId}`, { params })
	},
}
