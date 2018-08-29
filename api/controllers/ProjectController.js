/**
 * ProjectController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  'index': ( req, res ) => {
      const moment  = require('moment');
      const math    = require('mathjs');
      const _LIMIT_ = 20;
      let status    = [];
      let page      = (req.param('p')) ? parseInt(req.param('p'),10) : 1;
      let total     = 0;
      let paginacao = '';

      if( !req.me ) {
          return res.redirect('/login');
      }

      Projects.find().limit(_LIMIT_).skip(page-1).populate('state').populate('owner').exec( ( err, result ) => {
          if( err ) {
              return res.serverError( err );
          }

          Projects.count().exec( ( err, totalRecords ) => {
              total = totalRecords;

              /* BEGIN: pagination bar */
              if( total > _LIMIT_ ) {
                  if( page > 1 ) {
                      let previos = parseInt( page, 10 ) - 1;
                      paginacao = '<li><a href="/project/?p=' + previos + '">«</a></li>';
                  }

                  totalPages = math.ceil(parseInt( total, 10 ) / _LIMIT_);
                  for( var i = 1; i <= totalPages; i++ ) {
                      if( i == page ) {
                       paginacao += '<li class="active"><a href="#">' + i + '</a></li>';
                      } else {
                       paginacao += '<li><a href="/project/?p='+ i +'">'+ i +'</a></li>';
                      }
                  }

                  let next = parseInt(page, 10) + 1;
                  if( next < total ) {
                      paginacao += '<li><a href="/project/?p=' + next + '">»</a></li>';
                  }
              }
              /* END: pagination bar */


              return res.view('projects/index', { projects: result, moment: moment, page: page, pagination: paginacao, total: total, title: 'Lista de Projetos' });
          } );

      } );
  },

  'view': ( req, res ) => {
      if( !req.me ) {
          return res.redirect('/login');
      }

      const moment = require('moment');

      let states;
      let teams;
      let tasks;

      Status.findOne({code: 4}).exec( ( err, result ) => {
          if( err ) return res.serverError( err );

          Tasks.find().where({ project: req.param('id'), status: {'!=': result.id} }).populate('status').exec( ( err, result ) => {
              if( err ) return res.serverError( err );

              tasks = result;
          } )
      })


      Projectteams.find( { project: req.param('id') } ).populate('member').exec( ( err, result ) => {
          teams = result;
      });

      States.find().exec( ( err, result ) => {
          if( err ) {
              return res.badRequest();
          }

          if( !result ) {
              return res.notFound();
          }

          states = result;
      } );

      Projects.findOne(req.param('id')).populate('owner').populate('state').exec( ( err, result ) => {
          if( err ) {
              return res.serverError( err );
          }

          if( !result ) {
              return res.notFound();
          }

          return res.view('projects/view', { project: result, states: states, teams: teams, tasks: tasks, moment: moment, title: 'Detalhe do Projetos' });
      } )
  },

  'new': ( req, res ) => {
      if( !req.me ) {
          return res.redirect('/login');
      }else if(!req.session.loggedUser.isManager && !req.session.loggedUser.isCustomer ) {
          return res.badRequest();
      }

      States.findOne({name: 'Pendente'}).exec( ( err, result ) => {
         if( err ) return res.serverError( err );

         return res.view('projects/new', { state: result, title: 'Cadastrar Projeto'});
      });
  },

  'create': ( req, res ) => {
      if( !req.me ) {
          return res.redirect('/login');
      }else if(!req.session.loggedUser.isManager && !req.session.loggedUser.isCustomer ) {
          return res.badRequest();
      }

      Projects.create({
          owner:                req.param('owner'),
          state:                req.param('state'),
          name:                 req.param('name'),
          description:          req.param('description'),
          estimated_start:      req.param('estimated_start'),
          estimated_end:        req.param('estimated_end'),
          real_start:           req.param('real_start'),
          real_end:             req.param('real_end'),
          justification:        req.param('justification'),
          premisse:             req.param('premisse')
      }, ( err, user ) => {
          if( err ) {
              return res.serverError( err );
          }

          return res.redirect('/project');
      });
  },

  'edit': ( req, res ) => {
      if( !req.me ) {
          return res.redirect('/login');
      }else if(!req.session.loggedUser.isManager && !req.session.loggedUser.isCustomer ) {
          return res.badRequest();
      }

      const moment = require('moment');

      var result = Projects;
      Projects.findOne({ id: req.param('id')}).populate('state').populate('owner').exec( ( err, result ) => {
          if( err ) {
              return res.serverError( err );
          }

          if( !result ) {
              return res.notFound();
          }

          return res.view('projects/edit', { project: result, moment: moment, title: 'Editar Projeto' });
      } )
  },

  'update': ( req, res ) => {
      if( !req.me ) {
          return res.redirect('/login');
      }else if(!req.session.loggedUser.isManager && !req.session.loggedUser.isCustomer ) {
          return res.badRequest();
      }

      Projects.update( {id: req.param('id')}, {
          owner:                req.param('owner'),
          state:                req.param('state'),
          name:                 req.param('name'),
          description:          req.param('description'),
          estimated_start:      req.param('estimated_start'),
          estimated_end:        req.param('estimated_end'),
          real_start:           req.param('real_start'),
          real_end:             req.param('real_end'),
          justification:        req.param('justification'),
          premisse:             req.param('premisse'),
          last_informations:    req.param('last_informations'),
      } ).exec( ( err ) => {
          if( err ) { return res.serverError( err ); }

          return res.redirect('/project');
      });
  },

  'delete': ( req, res ) => {
      if( !req.me ) {
          return res.redirect('/login');
      }else if(!req.session.loggedUser.isManager && !req.session.loggedUser.isCustomer ) {
          return res.badRequest();
      }

      Projects.destroy( {id: req.param('id')} ).exec( ( err ) => {
          if( err ) {
              return res.serverError( err );
          }

          return res.redirect('/project');
      });
  },

  'state': ( req, res ) => {
      if( !req.me ) {
          return res.status(401).json({ error: 'Unauthorized' });
      }else if(!req.session.loggedUser.isManager && !req.session.loggedUser.isCustomer ) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      let id = req.param('id');
      let state = req.param('state');

      Projects.update( { id: id }, { state: state } ).exec( ( err ) => {
          if( err ) {
              return res.status(500).json({ error: err });
          }

          return res.ok();
      });
  },

  'calc': ( req, res ) => {
      if( !req.me ) {
          return res.status(401).json({ error: 'Unauthorized' });
      }else if(!req.session.loggedUser.isManager && !req.session.loggedUser.isCustomer ) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      let calculo = req.param('data');
      let id      = calculo.id;

      Projects.update( { id: id }, {
          progress_percentage: calculo.percentage,
          amount_spent: calculo.amount_spent,
          total_hours: calculo.total_hours
      }).exec( ( err ) => {
          if( err ) return res.status(500).json({ error: err });

          return res.status(200).json(true);
      } )
  },

  'members': ( req, res ) => {
      if( !req.me ) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      let projectId = req.param('id');

      Projectteams.find( {project: projectId} ).exec( ( err, result ) => {
          if( err ) return res.status(500).json({ error: err });

          return res.status(200).json(result);
      })
  },

  'team': ( req, res ) => {
      if( !req.me ) {
          return res.status(401).json({ error: 'Unauthorized' });
      }else if(!req.session.loggedUser.isManager && !req.session.loggedUser.isCustomer ) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      let project   = req.param('id');
      let member    = req.param('member');

      Projectteams.create({
          member: member,
          project: project
      }, ( err, user ) => {
          if( err ) {
              return res.status(500).json({ error: err });
          }

          return res.ok();
      });
  },

  'remove': ( req, res ) => {
      if( !req.me ) {
          return res.status(401).json({ error: 'Unauthorized' });
      }else if(!req.session.loggedUser.isManager && !req.session.loggedUser.isCustomer ) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      Projectteams.destroy( {member: req.param('member')} ).exec( ( err ) => {
          if( err ) {
              return res.status(500).json({ error: err });
          }

          return res.ok();
      });
  },
};
