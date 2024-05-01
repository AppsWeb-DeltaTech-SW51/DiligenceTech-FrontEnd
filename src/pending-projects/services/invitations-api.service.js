import {BaseService} from "../../shared/services/base.service.js";
import http from "../../shared/services/http-common.js";

export class InvitationsApiService extends BaseService {
    complementUrl = '/agentProjectInvitation';

    getByProject(project_id) {
        return http.get(`${this.complementUrl}?project_id=${project_id}`);
    }

    getInvitation(project_id, user_id) {
        return http.get(`${this.complementUrl}?project_id=${project_id}&user_id=${user_id}`);
        'http://localhost:3000/agentProjectInvitation?project_id=PJ5757&user_id=u202111654';
    }
}