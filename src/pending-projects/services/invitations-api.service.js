import {BaseService} from "../../shared/services/base.service.js";
import http from "../../shared/services/http-common.js";

export class InvitationsApiService extends BaseService {
    complementUrl = '/agentProjectInvitation';

    getByProject(project_id) {
        return http.get(`${this.complementUrl}?project_id=${project_id}`);
    }

    getInvitation(project_id, user_id) {
        return http.get(`${this.complementUrl}?project_id=${project_id}&user_id=${user_id}`);
    }

    deleteInvitation(project_id, user_id) {
        return http.delete(`${this.complementUrl}?project_id=${project_id}&user_id=${user_id}`);
    }
}