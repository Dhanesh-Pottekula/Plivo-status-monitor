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
        getServicesList: (org_id: string) => `/api/services/${org_id}/`,
        createService: '/api/services/create/',
        updateService: '/api/services/:id/update/',
        deleteService: '/api/services/:id/delete/',
        getSeriviceDetails: '/api/services/:id/',
    },
    incidents: {
        list: (serviceId: number) => `/api/services/${serviceId}/incidents/`,
        create: (serviceId: number) => `/api/services/${serviceId}/incidents/create/`,
        get: (serviceId: number, incidentId: number) => `/api/services/${serviceId}/incidents/${incidentId}/`,
        update: (serviceId: number, incidentId: number) => `/api/services/${serviceId}/incidents/${incidentId}/update/`,
        delete: (serviceId: number, incidentId: number) => `/api/services/${serviceId}/incidents/${incidentId}/delete/`,
    },
    timeline: {
        getTimeLineOfService: (serviceId: number) => `/api/timeline/service/${serviceId}/`,
        getTimeLineOfOrganization: () => `/api/timeline/`,
    },
    organizations: {
        getOrganizationDetails: (organizationId: string) => `/api/organizations/${organizationId}/`,
        getOrganizationsList: () => `/api/organizations/`,
    }
}