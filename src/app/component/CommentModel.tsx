// import { Paper, Typography } from '@mui/material'
// import React, { useEffect, useState } from 'react'
// import { Comment } from '../../../types/globalTypes'
// import { API } from '../lib/axios'
// import toast from 'react-hot-toast'
// import CommentSkeleton from './CommentSkeleton'
// import CommentCard from './CommentCard'

// const CommentModel = ({ postId, sx }: { postId: string, sx?: any }) => {

//     const [commentsData, setCommentsData] = useState<Comment[]>([])
//     const [pageNo, setPageNo] = useState<number>(1)
//     const [loading, setLoading] = useState<boolean>(true)

//     const fetchComments = async () => {
//         try {
//             const response = await API.get(`/api/post/get-comments?postId=${postId}&pageNo=${pageNo}`)
//             setCommentsData(response.data.comments)
//             setLoading(false)
//         } catch (error: any) {
//             toast.error(error?.response?.data?.error ?? "Something went wrong while fetching Comments.");
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         fetchComments()
//     }, [])

//     return (
//         <Paper elevation={24}
//         sx={sx}
//         >
//             {
//                 loading ?
//                     Array.from({ length: 5 }).map((_, index) => (
//                         <CommentSkeleton key={index} />
//                     ))
//                     : commentsData.length == 0 ?
//                         <Typography>
//                             No Comments Yet
//                         </Typography>
//                         :
//                         commentsData.map((comment, index) => (
//                             <CommentCard commentData={comment} />
//                         ))
//             }
//         </Paper>
//     )
// }

// export default CommentModel


import React from 'react'

const CommentModel = () => {
  return (
    <div>
      
    </div>
  )
}

export default CommentModel
