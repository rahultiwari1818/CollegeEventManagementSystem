import React from 'react'
import AddCourse from '../components/AddCourse'
import ViewCourses from '../components/ViewCourses'

export default function Courses() {
    return (
        <section className='flex justify-center items-center'>
            <section>
                <AddCourse />
                <ViewCourses />
            </section>
        </section>
    )
}
