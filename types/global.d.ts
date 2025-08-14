export { }

declare global {
    interface SessionUser {
        id: string | undefined;
        name: string,
        username: string,
        token: string | undefined;
        refreshToken: string | undefined
    }

    interface SessionData {
        user: SessionUser
        accessTokenExpired?: string
        refreshTokenExpired?: string
    }
    interface GetSession {
        user: SessionUser
    }
}