module.exports = {
    'index':  function(req, res) {
        if( !req.me ) {
            return res.redirect('/login');
        }
        else if( !req.session.loggedUser.isManager ){
            return res.badRequest();
        }

        Users.find().populate('profile').exec(function (err, users){
				if (err) {
					return res.serverError(err);
				}

			  	return res.view('users/index', {users: users, title: 'Lista de Usuários' });
		});
    },

    'new': function( req, res ) {
        if( !req.me ) {
            return res.redirect('/login');
        }
        else if( !req.session.loggedUser.isManager ){
            return res.badRequest();
        }

        Profiles.find().exec( function( err, profiles ) {
            if( err ) {
                return res.serverError( err );
            }

            return res.view('users/new', { profiles: profiles, title: 'Cadastrar Usuários' });
        });

    },

    'create': function( req, res ) {
        if( !req.me ) {
            return res.redirect('/login');
        }
        else if( !req.session.loggedUser.isManager ){
            return res.badRequest();
        }

        Users.create( {
            profile: req.param('profile-id'),
            name: req.param('name'),
            email: req.param('email'),
            password: req.param('password'),
            is_active: ( req.param('is_active') ) ? true : false
        }, function userCreated( err, user ){
            if( err ) {
                return res.serverError( err );
            }

            return res.redirect('/user');
        });
    },

    'edit': function( req, res ) {
        if( !req.me ) {
            return res.redirect('/login');
        }
        else if( !req.session.loggedUser.isManager ){
            return res.badRequest();
        }

        var objectReturn = {};

        Profiles.find().exec( function( err, result ){
            if( err ) {
                return res.serverError( err );
            }

            if( !result ) {
                return res.notFound();
            }

            objectReturn.profiles = result;
        });

        Users.findOne( req.param('id') ).populate('profile').exec( function( err, user ) {
            if( err ) {
                return res.serverError( err );
            }

            if( !user ) {
                return res.notFound();
            }

            objectReturn.user = user;
            objectReturn.title = 'Editar Usuários';

            return res.view('users/edit', objectReturn);
        });

        return;
    },

    'update': function( req, res ) {
        if( !req.me ) {
            return res.redirect('/login');
        }
        else if( !req.session.loggedUser.isManager ){
            return res.badRequest();
        }

        Users.update( {id: req.param('id')}, {
            name: req.param('name'),
            email: req.param('email'),
            is_active: ( req.param('is_active') ) ? true : false,
            profile: req.param('profile-id'),
            password: req.param('password')
        } ).exec(function ( err ){
            if( err ) { return res.serverError( err ); }

            return res.redirect('/user');
        });
    },

    'delete': function( req, res ) {
        if( !req.me ) {
            return res.redirect('/login');
        }
        else if( !req.session.loggedUser.isManager ){
            return res.badRequest();
        }

        Users.destroy( {id: req.param('id')} ).exec(function( err ){
            if( err ) {
                return res.serverError( err );
            }

            return res.redirect('/user');
        });
    },

    'search': ( req, res ) => {
        if( !req.me ) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let term = req.param('term');

        Users.find().exec( ( err ) => {
            if( err ) return  res.status(500).json({ error: err });

            return res.status(200).json(result);
        })
    },

    'list': ( req, res ) => {
        if( !req.me ) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let listUser = req.param('listUser');

        Users.find().where({'id': {'nin': listUser}}).exec( (err, result) => {
            if( err ) {
                return res.status(500).json({ error: err });
            }

            return res.status(200).json(result);
        });
    }

}
