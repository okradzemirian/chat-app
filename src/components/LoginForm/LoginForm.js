import React, { useState, useContext } from 'react'
import FirebaseContext from '../Firebase/Context'
import Input from '../Input/Input'

const LoginForm = () => {
    const firebase = useContext(FirebaseContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = e => {
        try {
            e.preventDefault()
            firebase.login(email, password).then(() => {
                console.log('logged in')
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <Input
                id="email"
                onChange={e => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder="email"
                autoComplete="off"
            />
            <Input
                onChange={e => setPassword(e.target.value)}
                id="password"
                value={password}
                type="password"
                placeholder="password"
                autoComplete="off"
            />

            <button type="submit">Log In</button>
        </form>
    )
}

export default LoginForm
