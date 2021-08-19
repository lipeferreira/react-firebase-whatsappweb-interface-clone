import React, {useState, useEffect} from "react"
import './MessageItem.css'

const MessageItem = ({data, user}) => {
    const [time, setTime] = useState('')

    useEffect(() => {
        if (data.date > 0) {
            let date = new Date(data.date.seconds * 1000)
            let hours = date.getHours()
            let minutes = date.getMinutes()
            hours = hours < 10 ? '0'+hours : hours
            minutes = minutes < 10 ? '0'+minutes : minutes
            setTime(`${hours}:${minutes}`)
        }
    }, [data])

    return (
        <div className='message-line' style={{justifyContent: user.id === data.author ? 'flex-end' : 'flex-start'}}>
            <div className='message-item' style={{backgroundColor: user.id === data.author ? '#dcf8c6' : '#fff'}}>
                <div className='message-text'>{data.body}</div>
                <div className='message-date'>{time}</div>
            </div>
        </div>
    )
}

export default MessageItem