const mongoose = require('mongoose')

/*
  Usa desestruturação para obter as variáveis de
  ambiente necessárias para realizar a conexão ao
  banco de dados
*/
const {
  MONGODB_USER,
  MONGODB_PASS,
  MONGODB_SERVER,
  MONGODB_DATABASE
} = process.env

module.exports = function() {

  // Conecta ao banco de dados
  mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_SERVER}/${MONGODB_DATABASE}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  mongoose.connection.on('connected', () =>
    console.log('=> MONGOOSE! conectado com sucesso ao servidor')
  )

  mongoose.connection.on('disconnected', () =>
    console.log('=> MONGOOSE! desconectado do servidor')
  )

  mongoose.connection.on('error', error => 
    console.error('** MONGOOSE! ERRO ao se conectar ao servidor: ' + error)
  )

  // Quando for detectado o comando de interrupção Ctrl+C
  process.on('SIGINT', () => {
    console.log('=> MONGOOSE! desconectando...')
    mongoose.connection.close()
    process.exit(0)
  })
}