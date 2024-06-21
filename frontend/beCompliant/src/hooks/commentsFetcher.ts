import { useEffect, useState } from "react"

export const useCommentsFetcher = (
    team?: string
) => {
    const [comments, setComments] = useState<any>()
    const [error, setError] = useState<Error>();
    const URL = team
    ? `http://localhost:8080/comments/${team}`
    : 'http://localhost:8080/comments';

    useEffect(() => {
        const fetcher = async () => {
            try {
                const response = await fetch(URL);
                const commentsResponse = await response?.json()
                setComments(commentsResponse)
            } catch (error) {
                setError(error as Error)
            }
        }
    }, []);
    return { comments, error } 
}