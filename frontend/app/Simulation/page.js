
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';


export default function App() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);
    console.log(errors);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="number" placeholder="Litrage de votre aquarium" {...register("litrage", {})} />
            <input type="number" placeholder="Longueur de l'aquarium (en cm)" {...register("longueur", { required: true, max: 80 })} />
            <input type="number" placeholder="pH moyen de votre aquarium" {...register("pH", { required: true, max: 14, min: 0, maxLength: 100 })} />
            <input type="number" placeholder="gH moyen de votre aquarium" {...register("gH", { required: true, max: 17, min: 0 })} />
            <select {...register("sol")}>
                <option value="Sable">Sable</option>
                <option value="Sol technique">Sol technique</option>
                <option value="Manado">Manado</option>
                <option value="Gravier">Gravier</option>
                <option value="Galet">Galet</option>
                <option value=""></option>
            </select>
            <select {...register("éclairage", { required: true })}>
                <option value="Fort">Fort</option>
                <option value="Moyen">Moyen</option>
                <option value="Doux">Doux</option>
                <option value="Faible">Faible</option>
            </select>
            <select {...register("courant", { required: true })}>
                <option value="CFort">Fort</option>
                <option value="CModéré">Modéré</option>
                <option value="CFaible">Faible</option>
            </select>
            <select {...register("poissons", { required: true })}>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
            </select>

            <input type="submit" />
        </form>
    );



}
