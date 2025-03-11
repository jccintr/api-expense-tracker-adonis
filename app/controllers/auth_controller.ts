import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { registerValidator, loginValidator } from '#validators/auth';
import Account from '#models/account';
import Category from '#models/category';

export default class AuthController {
  
  async register({response,request}: HttpContext) {

     const data = request.all()
     await registerValidator.validate(data)

    const {name,email,password} = request.body();


    const user = await User.findBy('email', email)

    if (user) {
        return response.status(409).send({error:'Email já cadastrado.'})
    }

    const newUser = new User()
    newUser.name = name
    newUser.email = email;
    newUser.password = password;
    await newUser.save()
    
    const account = await Account.createMany([
      {
        name: 'Cash',
        user_id: newUser.id,
      },
      {
        name: 'PicPay',
        user_id: newUser.id,
      },
      {
        name: 'Nubank',
        user_id: newUser.id,
      },
    ])

    const categories = await Category.createMany([
      {
        name: 'Alimentação',
        user_id: newUser.id,
      },
      {
        name: 'Mat. Higiêne',
        user_id: newUser.id,
      },
      {
        name: 'Mat. Limpeza',
        user_id: newUser.id,
      },
    ])
    

    response.status(201).send(newUser)
  }
  

  
  async login({response,request}: HttpContext) {

    const data = request.all()
    await loginValidator.validate(data)

    const { email, password } = request.only(['email', 'password'])
    const user = await User.findBy('email', email)

    if (!user) {
       return response.status(401).send({error:'Email e ou senha inválidos.'})
    }

    if(! await hash.verify(user.password, password)){
      return response.status(401).send({error:'Email e ou senha inválidos.'})
    }

    const token = await User.accessTokens.create(user)
    
    return response.status(200).send({token: token.value?.release()});

  }
  
}