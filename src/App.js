import React, {useState, useEffect} from "react"
import './App.css'

import ApiObject from "./Api"

import ChatListItem from './components/ChatListItem'
import ChatIntro from "./components/ChatIntro"
import ChatWindow from "./components/ChatWindow"
import NewChat from "./components/NewChat"
import Login from "./components/Login"

import DonutLargeIcon from '@material-ui/icons/DonutLarge'
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SearchIcon from '@material-ui/icons/Search'


const App = () => {
  const [chatList, setChatList] = useState([])
  const [activeChat, setActiveChat] = useState({})
  const [user, setUser] = useState(null)
  const [newChat, setNewChat] = useState(false)

  useEffect(() => {
    if (user !==null) {
      let unsub =  ApiObject.onChatList(user.id, setChatList)
      return unsub
    }
  }, [user])

  const handleChatButton = () => {
    setNewChat(true)
  }

  const handleLoginData = async (user) => {
    let newUser = {
      id: user.uid,
      name: user.displayName,
      avatar: user.photoURL
    }
    await ApiObject.addUser(newUser)
    setUser(newUser)
  }

  if (user === null) {
    return (<Login onReceive={handleLoginData} />)
  }

  return (
    <div className='app-window'>
      <div className='sidebar'>
        <NewChat show={newChat} setShow={setNewChat} user={user} list={chatList} />
        <header>
          <img className='header--avatar' src={user.avatar} alt='avatar'></img>
          <div className='header--buttons'>
            <div className='header--btn'>
              <DonutLargeIcon style={{color: '#919191'}} />
            </div>
            <div onClick={handleChatButton} className='header--btn'>
              <ChatIcon style={{color: '#919191'}} />
            </div>
            <div className='header--btn'>
              <MoreVertIcon style={{color: '#919191'}} />
            </div>
          </div>
        </header>
        <div className='search'>
          <div className='search--input'>
            <SearchIcon fontSize='small' style={{color: '#919191'}} />
            <input type='search' placeholder='Pesquisar ou começar uma nova conversa' />
          </div>
        </div>
        <div className='chatList'>
          {chatList.map((item, key) => (
            <ChatListItem key={key} data={item} active={activeChat.chatId === chatList[key].chatId} onClick={() => setActiveChat(chatList[key])} />
          ))}
        </div>
      </div>
      <div className='content-area'>
        {activeChat.chatId !== undefined &&
          <ChatWindow  user={user} data={activeChat} />
        }
        {activeChat.chatId === undefined &&
          <ChatIntro />
        }
      </div>
    </div>
  )
}

export default App
