/**
 * LoginController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  'login': ( req, res ) => {
      let validations = {};
      let userRecord;

      if( req.param('email') ) {

          let inputs = {email,password, rememberMe} = req.allParams();
            Users.findOne({
                email: inputs.email.toLowerCase(),
            }).populate('profile').exec( (err, userRecord ) => {
                if( !userRecord ) {
                    validations = { email: true };

                    return res.view('login', {validations: validations});
                }

                userRecord.isCustomer = false;
                userRecord.isManager  = false;
                userRecord.isUser     = false;

                let crypto = require('crypto');
                inputs.password = crypto.createHash('sha256').update(inputs.password).digest('base64');

                if( inputs.password != userRecord.password ) {
                    validations = { password: true };

                    return res.view('login', {validations: validations});
                }
                req.session.userId = userRecord.id;

                switch( userRecord.profile.name ) {
                    case 'Cliente':
                        userRecord.isCustomer = true;
                    break;

                    case 'Gestor':
                        userRecord.isManager = true;
                    break;

                    case 'Usuário':
                        userRecord.isUser = true;
                    break;
                }
                req.me = userRecord;
                req.session.loggedUser = userRecord;

                if (inputs.rememberMe) {
                      if (req.isSocket) {
                        sails.log.warn(
                          'Received `rememberMe: true` from a virtual request, but it was ignored\n'+
                          'because a browser\'s session cookie cannot be reset over sockets.\n'+
                          'Please use a traditional HTTP request instead.'
                        );
                      } else {
                        req.session.cookie.maxAge = sails.config.custom.rememberMeCookieMaxAge;
                      }
                }

                return res.redirect( '/' );
            });
      }
      else {
          res.view( 'login', {validations: validations} );
      }
  },

  'logout': ( req, res ) => {
      delete req.session.userId;
      req.me = null;

      res.redirect('/login');
  }

};
