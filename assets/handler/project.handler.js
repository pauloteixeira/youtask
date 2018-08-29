const _form = $('#project-form');
const _view_delete_form = $('#project-view-delete-form');
const ProjectServices   = new ProjectService;
const UserServices      = new UserService;
const TaskServices      = new TaskService;

$(document).ready(() => {
    $('#description').trumbowyg();

    /*$('#premisse').froalaEditor({
        placeholderText: 'Digite a premissa do projeto',
        height: 150,
        toolbarButtons: ['fullscreen', '|', 'bold', 'italic', 'strikeThrough', 'underline', 'selectAll', '|', 'paragraphFormat', 'paragraphStyle', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', 'undo', 'redo', 'html']
    });

    $('#justification').froalaEditor({
        placeholderText: 'Digite a justificativa do projeto',
        height: 150,
        toolbarButtons: ['fullscreen', '|', 'bold', 'italic', 'strikeThrough', 'underline', 'selectAll', '|', 'paragraphFormat', 'paragraphStyle', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', 'undo', 'redo', 'html']
    });

    $('#restrictions').froalaEditor({
        placeholderText: 'Digite as restrições do projeto',
        height: 150,
        toolbarButtons: ['fullscreen', '|', 'bold', 'italic', 'strikeThrough', 'underline', 'selectAll', '|', 'paragraphFormat', 'paragraphStyle', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', 'undo', 'redo', 'html']
    });

    $('#last_informations').froalaEditor({
        placeholderText: 'Digite as considerações finais do projeto',
        height: 150,
        toolbarButtons: ['fullscreen', '|', 'bold', 'italic', 'strikeThrough', 'underline', 'selectAll', '|', 'paragraphFormat', 'paragraphStyle', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', 'undo', 'redo', 'html']
    });*/

})

function projectCalculate( id ) {
    TaskServices.list( id, resultTaskCalculateHandler );
}

function resultTaskCalculateHandler( data ) {
    let calculo         = undefined;
    let tempEstimated   = 0;
    let tempReal        = 0;
    let id              = 0;

    if( data.tasks ) {
        data.tasks.forEach( ( item ) => {
            tempEstimated   = parseInt(tempEstimated)   + parseInt( item.estimated_effort );
            tempReal        = parseInt(tempReal)        + parseInt( item.real_effort );

            if( id === 0 ) {
                id = item.project;
            }
        } )

        let percentage = Math.round(100+((tempReal - tempEstimated)/tempEstimated * 100));
        calculo = {
            id: id,
            percentage: percentage,
            amount_spent: tempReal,
            total_hours: tempEstimated
        };
    }

    setProjectCalculate( calculo );
}

function setProjectCalculate( calculo ) {
    if( calculo != undefined ) {
        ProjectServices.calc( { 'data': calculo }, ( data ) => {
            /* altera valores na tela */
            if( data ) {
                $('#total_hours').html(calculo.total_hours);
                $('#amount_spent').html(calculo.amount_spent);
                $('#progress_percentage').html(calculo.percentage + '%');
                $('#progress_bar').prop('style','width: '+calculo.percentage+'%').prop('aria-valuenow', calculo.percentage);
            }
        } );
    }
}

$('#project-delete').on('click', function(e) {
  e.preventDefault();
  $('#modal-confirm-question').html('Deseja realmente apagar este projeto?');

  $('#confirm').modal({
      backdrop: 'static',
      keyboard: false
    }).one('click', '#sim', function(e) {
      _view_delete_form.trigger('submit');
    });
});

$('#add-member').click( addMemberHandler );

$('a[name=items-state]').click( function( e ) {
    let _csrf           = $('#_csrf').val();
    let stateName       = '<i class="fa fa-bullseye"></i> ' + $(e.currentTarget).html();
    let state_value     = $( e.currentTarget ).attr('state_value');
    let project_value   = $( e.currentTarget ).attr('project_value');

    ProjectServices.changeState( { 'id': project_value, 'state': state_value, '_csrf': _csrf }, ( data ) => {
        $('#dropdownMenuButton').html(stateName);
    } );
})

$('#buscar-membros-time').click( projectMemberSearch );

function removeMember( item ) {
    let id = item;
    ProjectServices.removeTeam( { member: id }, ( data ) => {
        $('#td_' + id).remove();
        projectMemberSearch();
    });

    return;
}

function projectMemberSearch() {
    ProjectServices.members( { id: $('#project_id').val() }, listUsersHandler );
}

function listUsersHandler( data ) {
    let listUser = [$('#owner_id').val()];

    data.forEach( ( item ) => {
        listUser.push(item.member);
    })

    UserServices.list( { listUser: listUser }, populaMembersHandler );
}

function populaMembersHandler( data ) {
    let htmlOptions = ['<option selected>Selecione um membro para o time</option>'];

    data.forEach( (item) => {
        htmlOptions.push('<option id="option_'+item.id+'" value="' + item.id + '">' + item.name + '</option>');
    } );

    $('#users-members').empty();
    $('#users-members').append(htmlOptions.join(''));
    $('#modal-team').modal({
        backdrop: 'static',
        keyboard: false
    });

}

function addMemberHandler( event ) {
    let member  = $('#users-members').val();
    let id      = $('#project_id').val();
    let table   = $('#member-table');
    let html    = '';

    ProjectServices.addTeam( { id: id, member: member }, ( data ) => {
        if( data.toLowerCase() == 'ok' ) {
            html += '<tr id="td_'+ member +'">';
            html += '   <th scope="row">';
            html += '       <button name="bt-remove-member" data-id="'+ member +'" onclick="removeMember('+member+')" type="button" class="btn btn-sm btn-outline-danger btn-create"><i class="fa fa-trash"></i></button>';
            html += '   </th>';
            html += '   <td>' + $('#users-members option:selected').text() + '</td>';
            html += '</td>';

            table.append( html );

            $('#option_' + member).remove();
        }
    } );
}


_form.submit( ( event ) => {
    let validators      = [];

    let name            = $('#name');
    let estimated_start = $('#estimated_start');
    let estimated_end   = $('#estimated_end');
    let real_start      = $('#real_start');
    let real_end        = $('#real_end');


    /* validators */
    let v_name              = $('#v-name');
    let v_estimated_start   = $('#v-estimated_start');
    let v_estimated_end     = $('#v-estimated_end');
    let v_real_start        = $('#v-real_start');
    let v_real_end          = $('#v-real_end');

    v_name.removeClass('validate-display');
    v_estimated_end.removeClass('validate-display');
    v_estimated_start.removeClass('validate-display');
    v_real_end.removeClass('validate-display');
    v_real_start.removeClass('validate-display');

    if( !name.val().length ) {
        validators.push( v_name );
    }

    if( !estimated_start.val() ) {
        validators.push( v_estimated_start );
    }
    else {
        let adate = estimated_start.val().split('/');
        if( adate.length == 3 ){
            let formatedDate = adate[2] + '-' + adate[1] + '-' + adate[0];
            let date = new Date(formatedDate.toString());

            if( (date instanceof Date && !isNaN(date.valueOf())) == false ) {
                validators.push( v_estimated_start );
            }
        }

        if(adate.length != 3){
            validators.push( v_estimated_start );
        }
    }

    if( !estimated_end.val() ) {
        validators.push( v_estimated_end );
    }
    else {
        let adate = estimated_end.val().split('/');
        if( adate.length == 3 ){
            let date = new Date(adate[2] + '-' + adate[1] + '-' + adate[0]);
            if( (date instanceof Date && !isNaN(date.valueOf())) == false ) {
                validators.push( v_estimated_end );
            }
        }else {
            validators.push( v_estimated_end );
        }
    }

    if( real_start.val() ) {
        let adate = real_start.val().split('/');
        if( adate.length == 3 ){
            let date = new Date(adate[2] + '-' + adate[1] + '-' + adate[0]);
            if( (date instanceof Date && !isNaN(date.valueOf())) == false ) {
                validators.push( v_real_start );
            }
        }else {
            validators.push( v_real_start );
        }
    }

    if( real_end.val() ) {
        validators.push( v_real_end );
        let adate = real_end.val().split('/');
        if( adate.length == 3 ){
            let date = new Date(adate[2] + '-' + adate[1] + '-' + adate[0]);
            if( (date instanceof Date && !isNaN(date.valueOf())) == false ) {
                validators.push( v_real_end );
            }
        }else {
            validators.push( v_real_end );
        }
    }

    if( validators.length ) {
        validators.forEach( ( element ) => {
            element.addClass('validate-display');
        });

        event.preventDefault();

        return false;
    }

    return true;
} )
