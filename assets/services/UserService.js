const UserService = function () {
    let Service = new Services();

    this.SERVICE_SEARCH = '/user/search';
    this.SERVICE_LIST   = '/user/list';

    this.search = ( params, callback ) => {
        Service.get( this.SERVICE_SEARCH, params, callback );
    };

    this.list = ( params, callback ) => {
        Service.get( this.SERVICE_LIST, params, callback );
    };
}
