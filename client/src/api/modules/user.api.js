import privateClient from "../client/private.client.js"
import publicClient from "../client/public.client.js"

// USER ENDPOINTS
const userEndpoints = {
    signin: "user/signin",
    signup: "user/signup",
    getInfo: "user/info",
    passwordUpdate: "user/update-password"
};

// USER API
const userApi = {
    // SIGNIN
    signin: async ({ username, password }) => {
        return await publicClient.post(
            userEndpoints.signin,
            { username, password }
        );
    },
    signup: async ({ username, password, displayName }) => {
        return await publicClient.post(
            userEndpoints.signup,
            { username, password, displayName }
        );
    },
    getInfo: async () => {
        return await privateClient.get(userEndpoints.getInfo);
    },
    passwordUpdate: async ({ password, newPassword, confirmNewPassword }) => {
        return await privateClient.put(
            userEndpoints.passwordUpdate,
            { password, newPassword, confirmNewPassword }
        );
    }
};

export default userApi;