import http from '../../shared/services/http-common.js';
import {BaseService} from "./base.service.js";

export class AgentsApiService extends BaseService {
    complementUrl = '/agents';

    getByEmailAndPassword(email, password) {
        return http.get(`${this.complementUrl}?email=${email}&password=${password}`);
    }
}