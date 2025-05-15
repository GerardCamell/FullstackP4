import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Usuario {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Voluntariado {
    id: ID!
    titulo: String!
    descripcion: String!
    fecha: String!
    tipo: String!
    creadoPor: Usuario!
  }

  type Query {
    usuarios: [Usuario]
    voluntariados: [Voluntariado]
  }

  type Mutation {
    crearVoluntariado(titulo: String!, descripcion: String!, fecha: String!, tipo: String!): Voluntariado
    crearUsuario(name: String!, email: String!, password: String!, role: String): Usuario
  }
`);

export default schema;

