const _form = $('#task-form');
const _list_delete_form = $('#task_list-delete-form');
const TaskServices   = new TaskService;

$(document).ready(() => {
    initEditors();
})


function initEditors() {
    $('#body').froalaEditor({
        placeholderText: 'Detalhe a tarefa',
        height: 200,
        toolbarButtons: ['fullscreen', '|', 'bold', 'italic', 'strikeThrough', 'underline', 'selectAll', '|', 'paragraphFormat', 'paragraphStyle', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', 'undo', 'redo', 'html']
    });

    $('#last_informations').froalaEditor({
        placeholderText: 'Digite as considerações finais da tarefa',
        height: 200,
        toolbarButtons: ['fullscreen', '|', 'bold', 'italic', 'strikeThrough', 'underline', 'selectAll', '|', 'paragraphFormat', 'paragraphStyle', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', 'undo', 'redo', 'html']
    });
}

$('a[name=items-state]').click( changeStatusTask );
$('#aprovar-task,#reprovar-task,#atender-task,#solicitar-task').click(changeStatusTask)
$('#pin-comment,#pin-effort').click( openPinModal );

function changeStatusTask( e ) {
    let _csrf        = $('#_csrf').val();
    let status_value = $( e.currentTarget ).attr('status_value');
    let task_value   = $('#task_id').val();

    TaskServices.changeStatus( { 'id': task_value, 'status': status_value, '_csrf': _csrf }, ( data ) => {
        location.reload();
    } );
}

function openPinModal(event) {
    if( event.currentTarget.id == 'pin-comment') {
        modalComment();
    } else {
        modalEffort();
    }
}

function modalComment() {
    let table = $('#data-table');
    let id = $('#task_id').val();
    let html = [];
    $('#title-modal-pin').html('Comentários da Tarefa');
    table.html('');

    TaskServices.listComment({ id: id }, ( data ) => {
        data.comments.forEach( (item ) => {
            let date = item.comment_at.split('-');
            date = date[2] + '/' + date[1] + '/' + date[0];
            let shtml = '<tr>';
                shtml += '   <td>';
                shtml += '       ' + item.owner.name;
                shtml += '   </td>';
                shtml += '   <td>';
                shtml += '       ' + item.comment;
                shtml += '   </td>';
                shtml += '   <td>';
                shtml += '       ' + date;
                shtml += '   </td>';
                shtml += '</tr>';

            html.push(shtml);
        })


        table.html( html.join(''));
    })
    $('#modal-pins').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function modalEffort() {
    let table = $('#data-table');
    let id = $('#task_id').val();
    let html = [];
    $('#title-modal-pin').html('Apontamentos da Tarefa');
    table.html('');

    TaskServices.listEffort({ id: id }, ( data ) => {
        data.efforts.forEach( (item ) => {
            let date = item.effort_at.split('-');
            date = date[2] + '/' + date[1] + '/' + date[0];
            let shtml = '<tr>';
                shtml += '   <td>';
                shtml += '       ' + item.owner.name;
                shtml += '   </td>';
                shtml += '   <td width="70px">';
                shtml += '       <center>' + item.effort + '</center>';
                shtml += '   </td>';
                shtml += '   <td>';
                shtml += '       ' + date;
                shtml += '   </td>';
                shtml += '</tr>';

            html.push(shtml);
        })


        table.html( html.join(''));
    })
    $('#modal-pins').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function removeTask( formId ) {
  $('#modal-confirm-question').html('Deseja realmente apagar esta tarefa?');

  $('#confirm').modal({
      backdrop: 'static',
      keyboard: false
  }).one('click', '#sim', (e) => {
      $('#' + formId).trigger('submit');
    });
};

$('#bt-comment-task').click(commentTask);
$('#bt-effort-task').click(effortTask);

function commentTask( e ) {
    let task = $('#comment-task_id').val();
    let comment = $('#comment').val();
    let _csrf = $('#_csrf-comment').val();

    // serviço comentário
    TaskServices.sendComment({task: task, comment: comment, _csrf: _csrf}, ( data ) => {
        $('#modal-comment-task').modal('hide');
    })
}

function effortTask( e ) {
    let task = $('#effort-task_id').val();
    let effort = $('#effort').val();
    let _csrf = $('#_csrf-effort').val();

    // serviço comentário
    TaskServices.sendEffort({task: task, effort: effort, _csrf: _csrf}, ( data ) => {
        if( data ) {
            let realEffort          = parseInt($('#real_effort').val()) + parseInt(effort);
            let estimatedEffort     = parseInt($('#estimated_effort').val());
            let percentage          = $('#progress_percentage');
            let real_effort_label   = $('#real_effort_label');
            let progr_bar           = $('#progress_bar');

            TaskServices.updateEffort({ id: task, effort: realEffort, estimated_effort: estimatedEffort }, ( data ) => {
                $('#real_effort').val(realEffort);
                let valorPercentual = Math.round(100+((realEffort - estimatedEffort)/estimatedEffort * 100));
                percentage.html(valorPercentual);
                real_effort_label.html(realEffort + ' Horas');
                progr_bar.prop('style','width: '+valorPercentual+'%').prop('aria-valuenow', valorPercentual);
            });


        }
        $('#modal-effort-task').modal('hide');
    })
}


$('#comment-task').click( (e) => {
    if ($('#comment').data('froala.editor')) {
        $('#comment').froalaEditor('destroy');
    }

    $('#comment').val('');
    $('#comment').froalaEditor({
        placeholderText: 'Adicione um comentário',
        height: 150,
        toolbarButtons: ['fullscreen', '|', 'bold', 'italic', 'strikeThrough', 'underline', 'selectAll', '|', 'paragraphFormat', 'paragraphStyle', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', 'undo', 'redo', 'html']
    });
    $('#modal-comment-task').modal({
        backdrop: 'static',
        keyboard: false
    });
} )

$('#effort-task').click( (e) => {
    $('#effort').val('');
    $('#modal-effort-task').modal({
        backdrop: 'static',
        keyboard: false
    });
} )


_form.submit( ( event ) => {
    let validators      = [];

    let title            = $('#title');
    let estimated_start  = $('#estimated_start');

    /* validators */
    let v_title              = $('#v-title');
    let v_estimated_start    = $('#v-estimated_start');

    v_title.removeClass('validate-display');
    v_estimated_start.removeClass('validate-display');

    if( !title.val().length ) {
        validators.push( v_title );
    }

    if( estimated_start.val() != undefined ) {
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

    if( validators.length ) {
        validators.forEach( ( element ) => {
            element.addClass('validate-display');
        });

        event.preventDefault();

        return false;
    }

    return true;
} )
