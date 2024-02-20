import React from 'react'
import AddEventType from '../components/AddEventType'
import ViewEventType from '../components/ViewEventType'

export default function EventType() {
    return (
        <>

            <section className='flex justify-center items-center'>
                <section>
                    <AddEventType />
                    <ViewEventType />
                </section>
            </section>
        </>
    )
}
