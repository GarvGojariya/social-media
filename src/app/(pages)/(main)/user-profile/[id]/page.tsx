"use client"
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {

    const params = useParams()
    const id = params.id
    return (
        <div>
            {id}
        </div>
    )
}

export default page
