import {BaseService} from "../../shared/services/base.service.js";
import http from "../../shared/services/http-common.js";

export class QuestionsApiService extends BaseService {
    complementUrl = '/questions';

    getByProject(project_id) {
        return http.get(`${this.complementUrl}?project_id=${project_id}`);
    }
}