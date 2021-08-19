import React, {useState, useEffect, useRef} from "react"
import EmojiPicker from "emoji-picker-react"
import './ChatWindow.css'

import MessageItem from "../MessageItem"
import ApiObject from "../../Api"

import MoreVertIcon from '@material-ui/icons/MoreVert'
import SearchIcon from '@material-ui/icons/Search'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import CloseIcon from '@material-ui/icons/Close'
import SendIcon from '@material-ui/icons/Send'
import MicIcon from '@material-ui/icons/Mic'

const ChatWindow = ({user, data}) => {
    const body = useRef()

    let recognition = null
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition !== undefined) {
        recognition = new SpeechRecognition()

    }

    const [emojiOpen, setEmojiOpen] = useState(false)
    const [text, setText] = useState('')
    const [listening, setListening] = useState(false)
    const [list, setList] = useState([])
    const [users, setUsers] = useState([])
    

    useEffect(() => {
        setList([])
        let unsub = ApiObject.onChatContent(data.chatId, setList, setUsers)
        return unsub
    }, [data.chatId])

    useEffect(() => {
        if (body.current.scrollHeight > body.current.offsetHeight) {
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight
        }
    }, [list])

    const handleOpenEmoji = () => {
        setEmojiOpen(true)
    }

    const handleCloseEmoji = () => {
        setEmojiOpen(false)
    }

    const handleEmojiClick = (event, emojiObject) => {
        setText(text + emojiObject.emoji)
    }

    //preciso arrumar isso ainda
    const handleMicClick = () => {
        if (recognition !== null) {
            
            recognition.onstart = () => {
                setListening(true)
            }
            recognition.onend = () => {
                setListening(false)
            }
            recognition.onresult = (event) => {
                 setText(event.results[0][0].transcript)
            }

            recognition.start()
        }
    }

    const handleSendClick = () => {
        if (text !== '') {
            ApiObject.senMessage(data, user.id, 'text', text, users)
            setText('')
            setEmojiOpen(false)
        }
    }

    const handleInputKeyup = event => {
        if (event.keyCode === 13) {
            handleSendClick()
        }
    }

    return (
        <div className='chatWindow'>
            <div className='chatWindow--header'>
                <div className='chatWindow--header-info'>
                    <img className='chatWindow--avatar' src={data.image} alt='avatar' />
                    <div className='chatWindow--name'>{data.title}</div>
                </div>
                <div className='chatWindow--header-buttons'>
                    <div className='chatWindow--btn'>
                        <SearchIcon style={{color: '#919191'}} />
                    </div>
                    <div className='chatWindow--btn'>
                        <AttachFileIcon style={{color: '#919191'}} />
                    </div>
                    <div className='chatWindow--btn'>
                        <MoreVertIcon style={{color: '#919191'}} />
                    </div>
                </div>
            </div>
            <div ref={body} className='chatWindow--body'>
                {list.map((item, key) => (
                    <MessageItem key={key} data={item} user={user} />
                ))}
            </div>
            <div className='chatWindow--emoji-area' style={{height: emojiOpen ? '200px' : '0px'}}>
                <EmojiPicker onEmojiClick={handleEmojiClick} disableSearchBar disableSkinTonePicker />
            </div>
            <div className='chatWindow--footer'>
                <div className='chatWindow--pre'>
                    <div onClick={handleCloseEmoji} className='chatWindow--btn' style={{width: emojiOpen ? '40px' : '0px'}}>
                        <CloseIcon style={{color: '#919191'}} />
                    </div>
                    <div onClick={handleOpenEmoji} className='chatWindow--btn'>
                        <InsertEmoticonIcon style={{color: emojiOpen ? '#009688' : '#919191'}} />
                    </div>
                </div>
                <div className='chatWindow--input-area'>
                    <input className='chatWindow--input' type='text' placeholder='Digite uma mensagem' value={text} onChange={event => setText(event.target.value)} onKeyUp={handleInputKeyup} />
                </div>
                <div className='chatWindow--post'>
                    {text === '' &&
                        <div onClick={handleMicClick} className='chatWindow--btn'>
                            <MicIcon style={{color: listening ? '#126ece' : '#919191'}} />
                        </div>
                    }
                    {text !== '' &&
                        <div onClick={handleSendClick} className='chatWindow--btn'>
                            <SendIcon style={{color: '#919191'}} />
                        </div>
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default ChatWindow