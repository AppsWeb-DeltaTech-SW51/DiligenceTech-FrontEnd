import {BaseService} from "../../shared/services/base.service.js";
import http from "../../shared/services/http-common.js";

export class AnswersApiService extends BaseService {
    complementUrl = '/answers';

    getByQuestionItem(project_id, info_id) {
        return http.get(`${this.complementUrl}?project_id=${project_id}&informationGroup_id=${info_id}`);
    }
}