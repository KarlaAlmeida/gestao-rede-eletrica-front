import api from "./BaseService";


class DashboardService {
    obterDashboard() {
        return api.get("/dashboard");
    }
}

export default new DashboardService();