$('.date-input').keydown(function(event){
    let field = $(this);
    let key   = (event.keyCode) ? event.keyCode : event.wich;

    if( key == 9 ){ return; }

    if( ( event.shiftKey ) || ( field.val().length == 10 && key != 8 ) || (((key < 48) || (key > 105)) && key != 8) || (key > 57 && key < 96) ) {
        event.preventDefault();
    }
    else{
        field.val( (field.val().length == 2 && key != 8) ? field.val() + '/' : field.val() );
        field.val( (field.val().length == 5 && key != 8) ? field.val() + '/' : field.val() );
    }

    return;
});


function navTo( route ) {
    location.href = route;
}
