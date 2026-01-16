// Auth Config - Simplified for optional cloud sync
// When cloud sync is enabled, this will configure NextAuth
export const authConfig = {
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        authorized({ auth, request }: any) {
            const isLoggedIn = !!auth?.user;
            const pathname = request.nextUrl?.pathname || '';
            const isOnDashboard = pathname.startsWith('/dashboard');
            const isOnAnalytics = pathname.startsWith('/analytics');

            if (isOnDashboard || isOnAnalytics) {
                return isLoggedIn;
            }
            return true;
        },
    },
    providers: [],
};
