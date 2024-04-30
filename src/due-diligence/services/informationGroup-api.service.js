import {BaseService} from "../../shared/services/base.service.js";
import http from "../../shared/services/http-common.js";

export class InformationGroupApiService extends BaseService {
    complementUrl = '/informationGroup';

    getByProject(project_id) {
        return http.get(`${this.complementUrl}?project_id=${project_id}`);
    }

    getChildren(project_id, identifier) {
        return http.get(`${this.complementUrl}?project_id=${project_id}&parent=${identifier}`);
    }
}