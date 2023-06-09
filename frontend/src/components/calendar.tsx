import {event} from '@/types';
import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import styled from 'styled-components';
import useEffect from 'react';
import Link from "next/link";

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

const DELETE_EVENT = gql`
    mutation DeleteEvent($deleteEventId: ID!) {
        deleteEvent(id: $deleteEventId) {
            id
            title
            description
            date
            startHour
            endHour
        }
    }
 `;

const CREATE_EVENT = gql`
    mutation CreateEvent($title: String!, $description: String!, $date: Date!, $startHour: Int!, $endHour: Int!) {
        createEvent(title: $title, description: $description, date: $date, startHour: $startHour, endHour: $endHour) {
            id
            title
            description
            date
            startHour
            endHour
        }
    }
`;

function Calendar() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);
    
    const {loading, error, data} = useQuery (GET_EVENTS);

    const [createEvent, {data: dataCreate}] = useMutation(CREATE_EVENT);
    const [deleteEvent, { data: dataRemove}] = useMutation(DELETE_EVENT);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <>
        <title>Calendario</title>
        <StyledForm>
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
            if(data.events.find((eventi: event) => eventi.date.getDay === date.getDay || eventi.startHour === start || eventi.endHour == end)) return alert("Los eventos se solapan");

            createEvent({
                variables: {
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
        >+</button>
        </StyledForm>
        <h1>Listado de eventos</h1>
        <StyledTable>
        <thead>
            <tr>
                <th>Titulo</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Hora de comienzo</th>
                <th>Hora de finalización</th>
                <th>Eliminar</th>
                <th>Cambiar datos</th>
            </tr>
        </thead>
        <tbody>
            {data.events.map((eventis: event) => (
                <tr key={`${eventis.date}`}>
                    <td>
                    <p>{eventis.title}</p>
                    </td>
                    <td>
                        <p>{eventis.description}</p>
                    </td>
                    <td>
                        <p>{eventis.date.toString().split("T")[0]}</p>
                    </td>
                    <td> 
                        <p>{eventis.startHour}</p>
                    </td>
                    <td> 
                        <p>{eventis.endHour}</p>
                    </td>
                    <td>
                        <button onClick={() => {
                            deleteEvent({
                                variables: {
                                    deleteEventId: eventis.id
                                },
                                refetchQueries: [{
                                    query: GET_EVENTS
                                }]
                            });
                        }}
                        >🗑️</button>
                    </td>
                    <td>
                    <Link href="/events/[id]" as={`/events/${eventis.id}`}>
                        <button>Modificar</button>
                    </Link>
                    </td>
                    </tr>
            ))}
        </tbody>
        </StyledTable>
        </>
    )
}

const StyledForm = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 2rem;
margin bottom: 5rem;


input {
    margin: 0 10px;
    padding: 5px;
    border-radius: 5px;
    background-color: #f2f2f2;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

input[type="date"] {
    width: 150px;
}

input[type="time"] {
    width: 100px;
}`;

const StyledTable = styled.table`
    width: 50%;
    text-align: center;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    
    th, td {
        padding: 8px;
        text-align: center;
        border-bottom: 1px solid #ddd;
    }

    button {
        margin: 0 10px;
        padding: 5px;
        border-radius: 5px;
        background-color: #f2f2f2;
        cursor: pointer;
    }

`;

export default Calendar;

