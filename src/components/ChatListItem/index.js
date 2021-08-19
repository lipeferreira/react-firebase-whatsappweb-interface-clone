import React, {useState, useEffect} from "react"
import './ChatListItem.css'

const ChatListItem = ({data, active, onClick}) => {
    const [time, setTime] = useState('')

    useEffect(() => {
        if (data.lastMessageDate > 0) {
            let date = new Date(data.lastMessageDate.seconds * 1000)
            let hours = date.getHours()
            let minutes = date.getMinutes()
            hours = hours < 10 ? '0'+hours : hours
            minutes = minutes < 10 ? '0'+minutes : minutes
            setTime(`${hours}:${minutes}`)
        }
    }, [data])

    return (
        <div className={`chatListItem ${active ? 'active' : ''}`} onClick={onClick}>
            <img className='chatListItem--avatar' src={data.image} alt='avatar'></img>
            <div className='chatListItem--rows'>
                <div className='chatListItem--row'>
                    <div className='chatListItem--name'>{data.title}</div>
                    <div className='chatListItem--date'>{time}</div>
                </div>
                <div className='chatListItem--row'>
                    <div className='chatListItem--lastMsg'>
                        <p>{data.lastMessage}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatListItem