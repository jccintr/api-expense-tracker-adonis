import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  
  async register({response,request}: HttpContext) {

    const {name,email,password} = request.body();


    const user = await User.findBy('email', email)

    if (user) {
        return response.status(400).send({error:'Email já cadastrado.'})
    }

    const newUser = new User()
    newUser.name = name
    newUser.email = email;
    newUser.password = password;
    await newUser.save()
    

    response.status(201).send(newUser)
  }
  
  async login({response,request}: HttpContext) {

    const { email, password } = request.only(['email', 'password'])
    const user = await User.findBy('email', email)

    if (!user) {
       return response.status(400).send({error:'Email e ou senha inválidos.'})
    }

    if(! await hash.verify(user.password, password)){
      return response.status(400).send({error:'Email e ou senha inválidos.'})
    }

    const token = await User.accessTokens.create(user)
    
    return response.status(200).send({token: token.value?.release()});

  }
  
}