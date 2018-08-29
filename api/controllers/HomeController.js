/**
 * HomeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  'index': ( req, res ) => {
      if( !req.me ) {
          res.redirect( '/login' );
      }
      else {
          const moment  = require('moment');
          const math    = require('mathjs');
          const _LIMIT_ = 20;
          let status    = [];
          let page      = (req.param('p')) ? parseInt(req.param('p'),10) : 1;
          let total     = 0;
          let paginacao = '';

          Status.find().where({'code' : {'<' : 4}}).exec( ( err, result ) => {
              if( err ) return res.serverError( err );

              result.forEach( ( item ) => {
                  status.push( item.id );
              } )

              Tasks.find({ executor: req.session.loggedUser.id, status: { in: status}}).limit(_LIMIT_).skip(page-1).sort('id DESC').populate('project').populate('status').exec( ( err, result ) => {
                  if( err ) return req.serverError( err );

                  Tasks.count({ executor: req.session.loggedUser.id, status: { in: status}}).exec( ( err, totalRecords ) => {
                      total = totalRecords;

                      /* BEGIN: pagination bar */
                      if( total > _LIMIT_ ) {
                          if( page > 1 ) {
                              let previos = parseInt( page, 10 ) - 1;
                              paginacao = '<li><a href="/?p=' + previos + '">«</a></li>';
                          }

                          totalPages = math.ceil(parseInt( total, 10 ) / _LIMIT_);
                          for( var i = 1; i <= totalPages; i++ ) {
                              if( i == page ) {
                               paginacao += '<li class="active"><a href="#">' + i + '</a></li>';
                              } else {
                               paginacao += '<li><a href="/?p='+ i +'">'+ i +'</a></li>';
                              }
                          }

                          let next = parseInt(page, 10) + 1;
                          if( next < total ) {
                              paginacao += '<li><a href="/?p=' + next + '">»</a></li>';
                          }
                      }
                      /* END: pagination bar */

                      return res.view('welcome', { tasks: result, moment: moment, page: page, pagination: paginacao, total: total, title: 'Dashboard do ' + req.session.loggedUser.name });
                  } );

              } )
          } );
      }
  }

};
