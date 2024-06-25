"use client"
import { Button } from '@mui/material'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React from 'react'

const page = ({ params }: any) => {
    const  [iv, encryptedData ]= params.slug
    const verify = async()=>{
       const res= await  axios.post("/api/user/verify",{iv,encryptedData})
       console.log(res)
    }
    return (
        <div>
           <Button onClick={verify}>verify</Button>
        </div>
    )
}

export default page
