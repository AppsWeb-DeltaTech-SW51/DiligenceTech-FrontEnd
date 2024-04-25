class Agent {
    constructor(username = "", password = "", pendingProjects = 0, dueDiligenceProjects = 0, email = "", userId = "") {
        this.userName = username;
        this.password = password;
        this.pendingProjects = pendingProjects;
        this.dueDiligenceProjects = dueDiligenceProjects;
        this.email = email;
        this.userId = userId;
    }
}

class AcquiringEntity {
    constructor(companyName = "", industry = "" ) {
        this.companyName = companyName;
        this.industry = industry;
    }
}






export default Agent;
export default AcquiringEntity;