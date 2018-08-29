const TaskService = function () {
    let Service = new Services();

    this.SERVICE_CHANGE_STATUS  = '/task/status';
    this.SERVICE_SEND_COMMENT   = '/task/comment';
    this.SERVICE_SEND_EFFORT    = '/task/effort';
    this.SERVICE_UPDATE_EFFORT  = '/task/seteffort';
    this.SERVICE_TASK           = '/task/task';
    this.SERVICE_LIST_COMMENT   = '/task/comment/list';
    this.SERVICE_LIST_EFFORT   = '/task/effort/list';
    this.SERVICE_LIST_TASK      = '/task/list';

    this.changeStatus = ( params, callback ) => {
        Service.post( this.SERVICE_CHANGE_STATUS, params, callback );
    };

    this.sendComment = ( params, callback ) => {
        Service.post( this.SERVICE_SEND_COMMENT, params, callback );
    };

    this.sendEffort = ( params, callback ) => {
        Service.post( this.SERVICE_SEND_EFFORT, params, callback );
    };

    this.updateEffort = ( params, callback ) => {
        Service.get( this.SERVICE_UPDATE_EFFORT, params, callback );
    };

    this.task = ( params, callback ) => {
        Service.get( this.SERVICE_TASK, params, callback );
    };

    this.listComment = ( params, callback ) => {
        Service.get( this.SERVICE_LIST_COMMENT, params, callback );
    };

    this.listEffort = ( params, callback ) => {
        Service.get( this.SERVICE_LIST_EFFORT, params, callback );
    };

    this.list = ( params, callback ) => {
        Service.get( this.SERVICE_LIST_TASK, params, callback );
    };


}
