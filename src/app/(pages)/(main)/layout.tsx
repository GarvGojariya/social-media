import React, { ReactNode } from 'react'
import Sidebar from '../../components/Sidebar'
import { Box } from '@mui/material'
import "@/app/globals.css"

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <Box sx={{
            display: 'flex',
            backgroundColor:"#f7f7f7"
        }}>
            <Sidebar/>
            {children}
        </Box>
    )
}

export default layout
