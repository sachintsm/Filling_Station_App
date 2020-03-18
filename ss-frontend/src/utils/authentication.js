import { getFromStorage } from './storage';

export const verifyAuth =  () => {
    
    const obj = getFromStorage('auth-token');
    if (!obj) {
        return null
    }
    try {
    //verify token
    fetch('http://localhost:4000/users/verify', {
        method: 'GET',
        headers: {
            'Content-Type': 'application-json',
            'auth-token': obj.token
        }
    })
        .then(res =>  res.json())
        .then(json => {
            console.log(json.state)
        })
    }
    catch (err) {
        return err;
    }
}