import {configProduction} from "./config.production";
import {configDevelopment} from "./config.development";

const getConfig = () => {
    switch (process.env.REACT_APP_VERCEL_ENV) {
        case 'production':
            return configProduction;
        case 'development':
            return configDevelopment;
        default:
            return configDevelopment;
    }
};

const config = getConfig();
export default config;