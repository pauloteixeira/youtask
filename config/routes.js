/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  'GET /':                  'HomeController/index',

  /* ================================= BEGIN: USERS ====================================== */
  'GET /user':              'UserController/index',
  'GET /user/new':          'UserController/new',
  'GET /user/edit/:id':     'UserController/edit',

  /* ========= POST METHODS =========== */
  'POST /user/create':      'UserController/create',
  'POST /user/update':      'UserController/update',
  'POST /user/delete':      'UserController/delete',

  /* ======== AJAX METHODS ========= */
  'GET /user/search':       'UserController/search',
  'GET /user/list':         'UserController/list',
  /* ================================= END: USERS ====================================== */

  /* ================================= BEGIN: PROJECTS ====================================== */
  'GET /project':           'ProjectController/index',
  'GET /project/new':       'ProjectController/new',
  'GET /project/edit/:id':  'ProjectController/edit',
  'GET /project/view/:id':  'ProjectController/view',
  'GET /project/:id':       'ProjectController/view',

  /* ========= POST METHODS =========== */
  'POST /project/create':   'ProjectController/create',
  'POST /project/update':   'ProjectController/update',
  'POST /project/delete':   'ProjectController/delete',

  /* ========= AJAX METHODS =========== */
  'POST /project/state':    'ProjectController/state',
  'GET /project/calc':      'ProjectController/calc',
  'GET /project/members':   'ProjectController/members',
  'GET /project/team':      'ProjectController/team',
  'GET /project/member/remove': 'ProjectController/remove',
  /* ================================= END: PROJECTS ====================================== */

  /* ================================= BEGIN: TASKS ====================================== */
  'GET /task/p/:projectId':         'TaskController/index',
  'GET /task/new/:projectId':       'TaskController/new',
  'GET /task/:id':                  'TaskController/view',
  'GET /task/edit/:p/:id':             'TaskController/edit',

  /* ================ POST METHODS ================= */
  'POST /task/create':              'TaskController/create',
  'POST /task/update':              'TaskController/update',
  'POST /task/delete':              'TaskController/delete',
  'POST /task/status':              'TaskController/status',
  'POST /task/comment':             'TaskController/comment',
  'POST /task/effort':              'TaskController/effort',
  'GET /task/seteffort':            'TaskController/updateEffort',
  'GET /task/task':                 'TaskController/task',
  'GET /task/comment/list':         'TaskController/commentList',
  'GET /task/effort/list':          'TaskController/effortList',
  'GET /task/list':                 'TaskController/list',


  /* ================================= END: TASKS ====================================== */

  /* ================================= BEGIN: LOGIN ======================================= */
  'GET /login':             'LoginController/login',
  'GET /logout':            'LoginController/logout',
  'POST /login':            'LoginController/login',







  'GET /welcome':            { action: 'dashboard/view-welcome' },

  'GET /faq':                { view:   'pages/faq' },
  'GET /legal/terms':        { view:   'pages/legal/terms' },
  'GET /legal/privacy':      { view:   'pages/legal/privacy' },
  'GET /contact':            { view:   'pages/contact' },

  'GET /signup':             { action: 'entrance/view-signup' },
  'GET /email/confirm':      { action: 'entrance/confirm-email' },
  'GET /email/confirmed':    { view:   'pages/entrance/confirmed-email' },

  //'GET /login':              { action: 'entrance/view-login' },
  'GET /password/forgot':    { action: 'entrance/view-forgot-password' },
  'GET /password/new':       { action: 'entrance/view-new-password' },

  'GET /account':            { action: 'account/view-account-overview' },
  'GET /account/password':   { action: 'account/view-edit-password' },
  'GET /account/profile':    { action: 'account/view-edit-profile' },


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the CloudSDK library.
  '/api/v1/account/logout':                           { action: 'account/logout' },
  'PUT   /api/v1/account/update-password':            { action: 'account/update-password' },
  'PUT   /api/v1/account/update-profile':             { action: 'account/update-profile' },
  'PUT   /api/v1/account/update-billing-card':        { action: 'account/update-billing-card' },
  'PUT   /api/v1/entrance/login':                        { action: 'entrance/login' },
  'POST  /api/v1/entrance/signup':                       { action: 'entrance/signup' },
  'POST  /api/v1/entrance/send-password-recovery-email': { action: 'entrance/send-password-recovery-email' },
  'POST  /api/v1/entrance/update-password-and-login':    { action: 'entrance/update-password-and-login' },
  'POST  /api/v1/deliver-contact-form-message':          { action: 'deliver-contact-form-message' },


  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝
  '/terms':                   '/legal/terms',

};
