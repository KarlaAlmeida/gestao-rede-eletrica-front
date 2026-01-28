import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:8081/api"
});


class DashboardService {
    obterDashboard() {
        return api.get("/dashboard");
    }
}

export default new DashboardService();