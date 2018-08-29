const ProjectService = function () {
    let Service = new Services();

    this.SERVICE_CHANGE_STATE = '/project/state';
    this.SERVICE_PROJECT_CALC = '/project/calc';
    this.SERVICE_PROJECT_MEMBERS = '/project/members';
    this.SERVICE_TEAM_ADD = '/project/team';
    this.SERVICE_TEAM_REMOVE = '/project/member/remove';

    this.changeState = ( params, callback ) => {
        Service.post( this.SERVICE_CHANGE_STATE, params, callback );
    };

    this.calc = ( params, callback ) => {
        Service.get( this.SERVICE_PROJECT_CALC, params, callback );
    };

    this.members = ( params, callback ) => {
        Service.get( this.SERVICE_PROJECT_MEMBERS, params, callback );
    };

    this.addTeam = ( params, callback ) => {
        Service.get( this.SERVICE_TEAM_ADD, params, callback );
    };

    this.removeTeam = ( params, callback ) => {
        Service.get( this.SERVICE_TEAM_REMOVE, params, callback );
    };

}
