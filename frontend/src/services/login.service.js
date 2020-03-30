import axios from 'axios';
import config from "../services/app.config"

// TODO change localhost:3000 to nginx OAuth2 endpoint.
export default {
    async googleLogin() {
        const res = await axios.get(`http://${config.OAUTH_ADDR}/auth/google`);
        return res.data;
    },
};