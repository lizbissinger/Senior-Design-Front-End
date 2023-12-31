import { LoadDetail } from "../components/types";

async function GetAllLoads() {
    let loads;
    await fetch('http://localhost:3000/loadDetails', {
        method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
        loads = data;
    })
    .catch((error) => console.log(error));
    return loads;
}

export async function CreateNewLoad(load: LoadDetail) {
    let newLoad;
    const requestOptions = {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(load)
    };
    await fetch('http://localhost:3000/loadDetails', requestOptions)
        .then(response => response.json())
        .then(data => newLoad = data);
    return newLoad;
}

export async function DeleteLoad(id: string) {
    let deletedLoad;
    await fetch(`http://localhost:3000/loadDetails/${id}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => deletedLoad = data);
    return deletedLoad;
}

export async function UpdateLoad(load: LoadDetail) {
    const requestOptions = {
        method: "PATCH",
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(load)
    };
    return await fetch(`http://localhost:3000/loadDetails/${load._id}`, requestOptions)
        .then(response => response.json())
}

export default GetAllLoads;