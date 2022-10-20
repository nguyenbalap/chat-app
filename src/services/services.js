import axios from "axios";
const url = 'http://localhost:3010/api/v1'

export const register = async (form) => {
    console.log(form)
    return await axios.post(`${url}/users/register`, form)
    .then(res => {
        return res.data
    })
    .catch(err => {
        console.log(err)
        console.log("Error")
        return err;
    });
}

export const login = async (form) => {
    return await axios.post(`${url}/users/login`, form)
    .then(res => {
        return res.data
    })
    .catch(err => {
        console.log(err)
        console.log("Error")
        return err;
    });
}

export const get = async () => {
    return await axios.get(`${url}/users`)
    .then(res => {
        return res.data.users
    })
    .catch(err => {
        console.log(err)
        console.log("Error")
        return err;
    });
}

export const updateUser = async (form) => {
    await axios.put(`${url}/users/${form._id}`, form)
    .then(res => {
        return res.data
    })
    .catch(err => {
        console.log(err)
        console.log("Error")
        return err;
    });
}

export const updateIsOnlineUser = async (form) => {
    await axios.put(`${url}/users/socket/${form.socketId}`, form)
    .then(res => {
        return res.data
    })
    .catch(err => {
        console.log(err)
        console.log("Error")
        return err;
    });
}