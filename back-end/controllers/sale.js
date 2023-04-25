// Importação do model
const Sale = require('../models/Sale')

const controller = {}   // Objeto vazio

controller.create = async (req, res) => {
  try {
    // Manda as informações que vieram em req.body
    // para serem gravadas no banco de dados
    await Sale.create(req.body)

    // HTTP 201: Created
    res.status(201).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.retrieveAll = async (req, res) => {
  try {
    // Retorna todos os documentos da coleção
    const result = await Sale.find()
      .populate('customer')
      .populate('items.product')

    // HTTP 200: OK (implícito)
    res.send(result)
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.retrieveOne = async(req, res) => {
  try {
    const result = await Sale.findById(req.params.id)
      .populate('customer')
      .populate('items.product')

    if(result) {
      // Encontrou o documento ~> HTTP 200: OK (implícito)
      res.send(result)
    }
    else {
      // Não encontrou o documento ~> HTTP 404: Not found
      res.status(404).end()
    }
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.update = async (req, res) => {
  try {

    // Encontra a venda para ser atualizada
    const sale = await Sale.findById(req.params.id)
    
    // items foi passado em req.body
    if(req.body.items) {
      // Percorre cada item de req.body, verificando se já existe
      // ou não em sales.item
      for(let item of req.body.items) {
        // Se o item tem _id, é porque já existe ~> É CASO DE ATUALIZAÇÃO
        if(item._id) {

          // Verifica se foi passada uma propriedade especial, chamada
          // '$_delete', com o valor true e, nesse caso, deleta o subdocumento
          if(item['$_delete'] === true) {
            sale.items.id(item._id).deleteOne()
          }
          else {
            // Procura cada propriedade no item de req.body e atualiza no documento
            for(let prop in item) {
              sale.items.id(item._id)[prop] = item[prop]
            }
          }
        }
        // Item não existe ~> É caso de inserção
        else {
          sale.items.push(item)   // Cria um novo item
        }
      }

      // Indica que o items foi modificado e deve ser regravado
      sale.markModified('items')

    }

    // Verifica as demais propriedades do pai (sale) por alterações
    for(let prop in req.body) {
      if(prop !== 'items') {  // Items já foi processado acima
        console.log({prop})
        sale[prop] = req.body[prop]
        sale.markModified(prop)
      }
    }
    
    const result = await sale.save()

    if(result) {
      // Encontrou e atualizou ~> HTTP 204: No content
      res.status(204).end()
    }
    else {
      // Não encontrou para atualizar ~> HTTP 404: Not found
      res.status(404).end()
    }
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.delete = async (req, res) => {
  try {
    const result = await Sale.findByIdAndDelete(req.params.id)

    if(result) {
      // Encontrou e excluiu ~> HTTP 204: No content
      res.status(204).end()
    }
    else {
      // Não encontrou para excluir ~> HTTP 404: Not found
      res.status(404).end()
    }
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

module.exports = controller