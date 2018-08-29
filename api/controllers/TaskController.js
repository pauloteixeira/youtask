/**
 * TaskController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    'index': ( req, res ) => {
        const moment    = require('moment');
        const math      = require('mathjs');
        const _LIMIT_   = 2;
        let status      = [];
        let page        = (req.param('p')) ? parseInt(req.param('p'),10) : 1;
        let total       = 0;
        let paginacao   = '';
        let projectId   = req.param('projectId');

        if( !req.me ) {
            return res.redirect('/login');
        }

        Tasks.find({ project: projectId }).limit(_LIMIT_).skip(page-1).populate('project').populate('status').exec( ( err, result ) => {
            if( err ) {
                return res.serverError( err );
            }

            Tasks.count({ project: projectId }).exec( ( err, totalRecords ) => {
                total = totalRecords;

                /* BEGIN: pagination bar */
                if( total > _LIMIT_ ) {
                    if( page > 1 ) {
                        let previos = parseInt( page, 10 ) - 1;
                        paginacao = '<li><a href="/task/p/'+ projectId +'/?p=' + previos + '">«</a></li>';
                    }

                    totalPages = math.ceil(parseInt( total, 10 ) / _LIMIT_);

                    for( var i = 1; i <= totalPages; i++ ) {
                        if( i == page ) {
                         paginacao += '<li class="active"><a href="#">' + i + '</a></li>';
                        } else {
                         paginacao += '<li><a href="/task/p/'+ projectId +'/?p='+ i +'">'+ i +'</a></li>';
                        }
                    }

                    let next = parseInt(page, 10) + 1;
                    if( next < total ) {
                        paginacao += '<li><a href="/task/p/'+ projectId +'/?p=' + next + '">»</a></li>';
                    }
                }
                /* END: pagination bar */

                return res.view('tasks/index', { tasks: result, projectId: projectId, page: page, pagination: paginacao, total: total, moment: moment, title: 'Lista de Tarefas' });
            } );

        } );
    },

    'view': ( req, res ) => {
        if( !req.me ) {
            return res.redirect('/login');
        }

        const moment = require('moment');

        let status;
        let teams;
        let mapStatus = [];

        Status.find().exec( ( err, result ) => {
            if( err ) return res.serverError( err );

            status = result;
            status.forEach( ( item ) => {
                if( item.code == 1 ) {
                    result.forEach( (row) => {
                        if( row.code == 3 )
                            mapStatus[1] = [row.id];
                    } )
                }

                if( item.code == 2 ) {
                    result.forEach( (row) => {
                        if( row.code == 1 )
                            mapStatus[2] = [row.id];
                    } )
                }

                if( item.code == 3 ) {
                    result.forEach( (row) => {
                        if( row.code == 4 )
                            mapStatus[3] = [row.id];
                        if( row.code == 5 )
                            mapStatus[3].push( row.id );
                    } )
                }
            })
        })

        Tasks.findOne({ id: req.param('id') }).populate('project').populate('status').populate('owner').populate('executor').exec( ( err, result ) => {
            if( err ) return res.serverError( err );

            return res.view('tasks/view', { task: result, status: status, mapStatus: mapStatus, moment: moment, title: 'Detalhe da Tarefa'});
        } )


    },

    'new': ( req, res ) => {
        if( !req.me ) {
            return res.redirect('/login');
        }else if(!req.session.loggedUser.isManager && !req.session.loggedUser.isCustomer ) {
            return res.badRequest();
        }

        let projectId = req.param('projectId');

        Status.findOne({code: '0'}).exec( ( err, result ) => {
           if( err ) return res.serverError( err );

           return res.view('tasks/new', { status: result, projectId: projectId, title: 'Cadastrar Tarefa'});
        });
    },

    'create': ( req, res ) => {
        if( !req.me ) {
            return res.redirect('/login');
        }else if(!req.session.loggedUser.isManager && !req.session.loggedUser.isCustomer ) {
            return res.badRequest();
        }

        let projectId = req.param('project');

        Tasks.create({
            owner:              req.param('owner'),
            status:             req.param('status'),
            project:            projectId,
            title:              req.param('title'),
            body:               req.param('body'),
            estimated_start:    req.param('estimated_start')
        }, ( err, user ) => {
            if( err ) {
                return res.serverError( err );
            }

            return res.redirect('/task/p/' + projectId);
        });
    },

    'edit': ( req, res ) => {
        if( !req.me ) {
            return res.redirect('/login');
        }else if(!req.session.loggedUser.isManager && !req.session.loggedUser.isCustomer ) {
            return res.badRequest();
        }

        const moment = require('moment');
        let users;
        let status;

        Projectteams.find( { project: req.param('p') } ).populate('member').exec( (err, result ) => {
            if( err ) return res.serverError(err);

            if( !result ) {
                return res.notFound();
            }

            let team = [];
            result.forEach( (item) => {
                team.push(item.member);
            })

            users = team;
        } );

        Status.find().exec( (err, result) => {
            if( err ) return res.serverError(err);

            if( !result ) {
                sails.log.info('status not found');
                return res.notFound();
            }

            status = result;
        })

        Tasks.findOne({ id: req.param('id')}).populate('project').populate('owner').populate('executor').populate('status').exec( ( err, result ) => {
            if( err )  return res.serverError( err );

            if( !result ) return res.notFound();

            return res.view('tasks/edit', { task: result, moment: moment, users: users, status: status, title: 'Editar Projeto' });
        } )
    },

    'update': ( req, res ) => {
        if( !req.me ) {
            return res.redirect('/login');
        }else if(!req.session.loggedUser.isManager && !req.session.loggedUser.isCustomer ) {
            return res.badRequest();
        }

        let route = '/task/p/' + req.param('project');

        Tasks.update( {id: req.param('id')}, {
            title:                req.param('title'),
            body:                 req.param('body'),
            estimated_start:      req.param('estimated_start'),
            estimated_effort:     req.param('estimated_effort'),
            real_effort:          req.param('real_effort'),
            executor:             req.param('executor'),
            last_informations:    req.param('last_informations'),
            status:               req.param('status')
        } ).exec( ( err ) => {
            if( err ) { return res.serverError( err ); }

            return res.redirect(route);
        });
    },

    'delete': ( req, res ) => {
        if( !req.me ) {
            return res.redirect('/login');
        }else if(!req.session.loggedUser.isManager && !req.session.loggedUser.isCustomer ) {
            return res.badRequest();
        }

        let project = req.param('p');
        let route = '/task/p/' + project;
        Tasks.destroy( {id: req.param('id')} ).exec( ( err ) => {
            if( err ) {
                return res.serverError( err );
            }

            return res.redirect(route);
        });
    },

    'status': ( req, res ) => {
        if( !req.me ) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let id      = req.param('id');
        let status  = req.param('status');

        Tasks.update( { id: id }, { status: status } ).exec( ( err ) => {
            if( err ) {
                return res.status(500).json({ error: err });
            }

            return res.ok();
        });
    },

    'comment': ( req, res ) => {
        if( !req.me ) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let task     = req.param('task');
        let comment  = req.param('comment');
        let owner    = req.session.loggedUser.id;

        Comments.create({
            task: task,
            owner: owner,
            comment: comment
        }, ( err, result ) => {
            if( err ) {
                return res.status(500).json({ error: err });
            }

            return res.ok();
        })
    },

    'effort': ( req, res ) => {
        if( !req.me ) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let task     = req.param('task');
        let effort   = req.param('effort');
        let owner    = req.session.loggedUser.id;

        Efforts.create({
            task: task,
            owner: owner,
            effort: effort
        }, ( err, rs ) => {
            if( err ) {
                return res.status(500).json({ error: err });
            }

            return res.ok();
        })
    },

    'updateEffort': ( req, res ) => {
        if( !req.me ) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let id              = req.param('id');
        let effort          = req.param('effort');
        let estimatedEffort = req.param('estimated_effort');

        Tasks.update( { id: id }, { real_effort: effort, estimated_effort: estimatedEffort }).exec( ( err ) => {
            if( err ) { return res.status(500).json({ error: err }); }

            return res.status(200).json({ status: 'ok' });;
        });
    },

    'task': ( req, res ) => {
        if( !req.me ) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let id = req.param('id');

        Tasks.findOne({ id: id }).exec( (err, result) => {
            if( err ) { return res.status(500).json({ error: err }); }

            return res.status(200).json({ task: task });
        })
    },

    'commentList': ( req, res ) => {
        if( !req.me ) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let id = req.param('id');
        Comments.find({ task: id }).sort('id DESC').populate('owner').exec( (err, result ) => {
            if( err ) return res.status(500).json({ error: err });

            return res.status(200).json({ comments: result });
        })
    },

    'effortList': ( req, res ) => {
        if( !req.me ) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let id = req.param('id');
        Efforts.find({ task: id }).sort('id DESC').populate('owner').exec( (err, result ) => {
            if( err ) return res.status(500).json({ error: err });

            return res.status(200).json({ efforts: result });
        })
    },

    'list': ( req, res ) => {
        if( !req.me ) {
            return res.status(401).json({ error: 'Unauthorized' });
        }else if(!req.session.loggedUser.isManager ) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let id = req.param('id');

        Tasks.find( { select: ['estimated_effort','real_effort', 'project'], where: { project: id } } ).exec( ( err, result ) => {
            if( err ) return res.status(500).json({ error: err });

            return res.status(200).json({ tasks: result });
        } )

    }

};
