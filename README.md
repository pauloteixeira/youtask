# Youtask

Youtask is a simple task manager build on SailsJS to solve a problem of my team.
We need a simple task manager to manager the tasks of our project.

I decide to implement as simple as possible and share with the community.

## Installing

### Prerequisites
- [Node](https://nodejs.org)
- [NPM](https://www.npmjs.com)
- [MongoDb](https://www.mongodb.com)
- [SailsJs](https://sailsjs.com)

Assuming you already have the Nodejs, MongoDb and NPM installed let's start from SailsJs installation
```bash
$ sudo npm install sails -g
```

Now you need to insert some domain data in mongo database
```bash
$ db.profiles.save([
  {name: 'Administrador', code: 1},
  {name: 'Gestor', code: 2},
  {name: 'Funcionário', code: 3},
  {name: 'Cliente', code: 4}
])
```

```bash
$ db.states.save([
    {name: 'Pendente', code: 1},
    {name: 'Em Andamento', code: 2},
    {name: 'Encerrado', code: 3}
  ])
```

```bash
$ db.status.save([
  {name: 'Recebida', code: '0'},
  {name: 'Em Atendimento', code: '1'},
  {name: 'Aguardando Interação', code: '2'},
  {name: 'Aguardando Aprovação', code: '3'},
  {name: 'Aprovada', code: '4'},
  {name: 'Reprovada', code: '5'}
])
```

In the field profile you will need to insert the ObjectId of Administrador profile from profiles model and in the password you will need to insert a sha256 hashed password in base64
```bash
$ db.users.save([
  {profile: ObjectId('hashid of administrador profile'), name: 'Administrador', email: 'email@administrador', password: 'sha256 hashad password', is_active: true}
])
```

Now you clone the project in your system, navigate until the base project folder and run the command below
```bash
$ npm install
```

Now change the config/datastores.js to your mongodb connection.

That's it, enjoy the Youtask.
