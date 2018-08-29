/**
 * States.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: {
        type: 'string',
        required: true
    },
    code: {
      type: 'integer',
      required: true,
      example: 1 // 1 == Pendente (Acabou de ser aberto), 2 == Em Andamento (Está sendo trabalhado nesse projeto) e 3 == Encerrado (Projeto finalizado)
    }

  },
  /* ===================== GENERATE CODE =============================================================================================================================================================================================
  db.states.save([{name: 'Pendente', code: 1},{name: 'Em Andamento', code: 2},{name: 'Encerrado', code: 3}])
  ================================================================================================================================================================================================================================== */
};
