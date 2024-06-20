import {BaseService} from "../../shared/services/base.service.js";
import http from "../../shared/services/http-common.js";

export class DocumentsApiService extends BaseService {
    complementUrl = '/document';
    getByProject(project_id) {
        return http.get(`${this.complementUrl}?project_id=${project_id}`);
    }

    getByInformationItem(project_id, informationGroup_id) {
        return http.get(`${this.complementUrl}?project_id=${project_id}&informationGroup_id=${informationGroup_id}`);
    }
}