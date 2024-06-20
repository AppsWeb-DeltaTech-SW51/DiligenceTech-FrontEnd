import {BaseService} from "../../shared/services/base.service.js";
import http from "../../shared/services/http-common.js";

export class DueDiligenceProjectsApiService extends BaseService {
    complementUrl = '/dueDiligenceProjects';

    getBySellSideAgent(id) {
        return http.get(`${this.complementUrl}?sell_side_agents_id=${id}`);
    }
    getByBuySideAgent(id) {
        return http.get(`${this.complementUrl}?buy_side_agents_id=${id}`);
    }
}