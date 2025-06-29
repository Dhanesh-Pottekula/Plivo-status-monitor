export const apiUrls = {
    ping: '/',
    auth: {
        otpGenerate: '/api/auth/otp-generate',
        getUser: '/api/auth/profile/',
        signUp: '/api/auth/signup',
        login: '/api/auth/login',
        generateInviteLink: '/api/invite/create/',
        getTeamMembers: '/api/invite/list/',
        logout: '/api/auth/logout/',
        verifyInviteToken: '/api/invite/verify/',
        grantAccess: '/api/invite/update-access/',
    },
    services: {
        getServicesList: '/api/services/',
        createService: '/api/services/create/',
        updateService: '/api/services/:id/update/',
        deleteService: '/api/services/:id/delete/',
        getSeriviceDetails: '/api/services/:id/',
    }
}