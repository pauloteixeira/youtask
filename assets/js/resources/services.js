var Services = function () {
    this.ERROR_CONSTRAINT_VIOLATION  = "Ocorreu um erro de violação de integridade relacional no banco de dados.";

    this.post = function( route, param, callback, successMessage = '', failCallback = null, errorMessage = '', constraintViolation = this.ERROR_CONSTRAINT_VIOLATION )
    {
        var _service = this;

        $.post( route, param )
            .done(function(data){
                if( null != callback ) {
                    callback(data);
                }
            })
            .fail(function(error, status, type){
                if( null != failCallback ) {
                    failCallback(error);
                    return;
                }

                if( undefined != error ){
                  console.log(error);
                }
            });
    }

    this.get = function( route, param, callback, successMessage = '', failCallback = null, errorMessage = '', constraintViolation = this.ERROR_CONSTRAINT_VIOLATION )
    {
        var _service = this;

        $.get( route, param )
            .done(function(data){
                if( null != callback ) {
                    callback(data);
                }
            })
            .fail(function(error, status, type){
                if( null != failCallback ) {
                    failCallback(error);
                    return;
                }

                if( undefined != error ){
                  console.log(error);
                }
        });
    }

    // serviço para uploads porajax
    this.send = function( route, param, callback, successMessage = '', failCallback = null, method = 'POST', contentType = 'application/x-www-form-urlencoded; charset=UTF-8', dataType="json", processData = true,  errorMessage = '', constraintViolation = this.ERROR_CONSTRAINT_VIOLATION ) {
        var _service = this;

        $.ajax({
            url: route,
            type: method,
            data: param,
            contentType: contentType,
            processData: processData,
            dataType: dataType,
            success: function( data ) {
                if( null != callback ) {
                    callback(data);
                }
            },
            error: function( error ) {
                if( null != failCallback ) {
                    failCallback(error);
                    return;
                }

                if( undefined != error ){
                  throw error;
                }
            }
        });
    };
}
