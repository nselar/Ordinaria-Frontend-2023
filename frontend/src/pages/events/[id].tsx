import {event} from '@/types';
import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import styled from 'styled-components';
import useEffect from 'react';

const UPDATE_EVENT = gql`
mutation UpdateEvent($updateEventId: ID!, $title: String!, $description: String!, $date: Date!, $startHour: Int!, $endHour: Int!) {
  updateEvent(id: $updateEventId, title: $title, description: $description, date: $date, startHour: $startHour, endHour: $endHour) {
        id
        title
        description
        date
        startHour
        endHour
        }
    }
`;

const GET_EVENTS = gql`
    query GetEvents {
        events {
            id
            title
            description
            date
            startHour
            endHour
        }
    }
`;

const UpdateForm = async (context) => {
    const { eventid } = context.query;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);

    const {loading, error, data} = useQuery (GET_EVENTS);
    
    const [updateEvent, {data: dataUpdate}] = useMutation(UPDATE_EVENT);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;


    return (
        <>
        <title>Modificar Evento</title>
        <label>Fecha: 
        <input type="date" value={date.toISOString().split("T")[0]} onChange={(e) => setDate(new Date(e.target.value))} />
        </label>
        <label>Hora comienzo: 
        <input type="number" value={start} onChange={(e) => {setStart(e.target.valueAsNumber);}} />
        </label>
        <label>Hora finalización: 
        <input type="number" value={end} onChange={(e) => {setEnd(e.target.valueAsNumber);}} />
        </label>
        <label>Titulo:
        <input type="text" value={title} onChange={(e) => {setTitle(e.target.value);}} />
        </label>
        <label>Descripción: 
        <input type="text" value={description} onChange={(e) => {setDescription(e.target.value);}} />
        </label>
        <button onClick={() => {
            if(!title || !description || !start|| !end) {
                return alert ("Faltan datos!");
            }
            if(data.events.find((eventi: event) => eventi.date.getDay === date.getDay && eventi.startHour === start && eventi.endHour == end)) return alert("Los eventos se solapan");

            updateEvent({
                variables: {
                    updateEventId: eventid,
                    title: title,
                    description: description,
                    date: date,
                    startHour: start,
                    endHour: end,

                },
                refetchQueries: [{
                    query: GET_EVENTS,
                }]
            });
        }}
        >Actualizar</button>
        </>
    )
}

export default UpdateForm;