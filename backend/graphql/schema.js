import gql from 'graphql-tag';

export const typeDefs = gql`
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

  type Estado {
    id: ID!
    tipo: String!
    email: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    usuarios: [Usuario!]!
    usuario(id: ID!): Usuario
    voluntariados: [Voluntariado!]!
    voluntariado(id: ID!): Voluntariado
    estados: [Estado!]!
  }

  input UsuarioInput {
    name: String!
    email: String!
    password: String!
    role: String!
  }

  input VoluntariadoInput {
    titulo: String!
    descripcion: String!
    fecha: String
    tipo: String!
  }

  input EstadoInput {
    tipo: String!
    email: String
  }

  type Mutation {
    registrarUsuario(input: UsuarioInput!): Usuario!
    login(email: String!, password: String!): Usuario!
    crearVoluntariado(input: VoluntariadoInput!): Voluntariado!
    actualizarUsuario(id: ID!, input: UsuarioInput!): Usuario!
    eliminarUsuario(id: ID!): Boolean!
    actualizarVoluntariado(id: ID!, input: VoluntariadoInput!): Voluntariado!
    eliminarVoluntariado(id: ID!): Boolean!
    crearEstado(input: EstadoInput!): Estado!
  }

  type Subscription {
    voluntariadoCreado: Voluntariado!
  }
`;
