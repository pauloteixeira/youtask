/**
 * Profiles.js
 *
 * A user who can log in to this application.
 */

module.exports = {

  attributes: {
      name: {
          type: 'string',
          required: true,
          maxLength: 15,
          example: 'Funcionário'
      },
      code: {
        type: 'integer',
        required: true,
        example: 1 // 1 == Administrador, 2 == Gestor do projeto, 3 == Funcionário e 4 == Cliente
      }
  },

  /* ===================== GENERATE CODE =============================================================================================================================================================================================
  db.profiles.save([{name: 'Administrador', code: 1},{name: 'Gestor', code: 2},{name: 'Funcionário', code: 3},{name: 'Cliente', code: 4}])
  ================================================================================================================================================================================================================================== */
};
