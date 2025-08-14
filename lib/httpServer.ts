const API_KEY = process.env.BACKEND_API_KEY || ''
export class HttpServer {
    private baseUrl = '/api/end'
    private token: string | null = null
    constructor(token: string | null = null) {
        this.token = token
    }
    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        isFormData = false
    ) {
        const headers = new Headers(options.headers)
        headers.set('x-api-key', API_KEY)
        if (!isFormData) {
            headers.set('Content-Type', 'application/json')
        }
        if (this.token) {
            headers.set('Authorization', 'Bearer ' + this.token)
        }

        const res = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
        })

        if (!res.ok) {
            let message = `Server Error`
            try {
                const errorData = await res.json()
                message = errorData.message || message
            } catch {
            }
            throw new Error(message)
        }
        return {
            data: await res.json() as T,
            status: res.status,
        }
    }

    get<T>(endpoint: string, options?: RequestInit) {
        return this.request<T>(endpoint, { ...options, method: 'GET' })
    }

    post<T>(endpoint: string, body: any, options?: RequestInit) {
        const isFormData = body instanceof FormData
        return this.request<T>(
            endpoint,
            {
                ...options,
                method: 'POST',
                body: isFormData ? body : JSON.stringify(body),
            },
            isFormData
        )
    }

    put<T>(endpoint: string, body: any, options?: RequestInit) {
        const isFormData = body instanceof FormData
        return this.request<T>(
            endpoint,
            {
                ...options,
                method: 'PUT',
                body: isFormData ? body : JSON.stringify(body),
            },
            isFormData
        )
    }

    delete<T>(endpoint: string, options?: RequestInit) {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' })
    }

    public async raw(endpoint: string, options: RequestInit = {}) {
        console.log(process.env.BACKEND_URL + endpoint)
        return await fetch(process.env.BACKEND_URL + endpoint, {
            ...options,
            headers: {
                'x-api-key': API_KEY,
                ...(options.headers || {}),
            },
        });
    }
}

export const httpServer: HttpServer = new HttpServer()
