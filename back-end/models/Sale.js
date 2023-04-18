const mongoose = require('mongoose')

const schema = mongoose.Schema({
  datetime: {
    type: Date,
    required: true,
    default: Date.now()   // Data/hora da gravação
  },
  number: {
    type: Number,
    required: true
  },
  customer: {
    type: mongoose.ObjectId,  // Tipo para chave estrangeira
    ref: 'Customer',          // Model estrangeiro
    required: true
  },
  // Vetor de subdocumentos
  items: [{
    order: {
      type: Number,
      required: true,
      min: 1
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.01
    },
    product: {
      type: mongoose.ObjectId,
      ref: 'Product',
      required: true
    }
  }]
})

/*
  Parâmetros de mongoose.model:
  1º: nome da model, para uso interno (convenção: primeira letra maiúscula e singular)
  2º: relação de campos do esquema (constante schema)
  3º: nome da collection no banco de dados (convenção: mesmo nome do model, mas com
      letra minúscula e no plural)
*/
module.exports = mongoose.model('Sale', schema, 'sales')