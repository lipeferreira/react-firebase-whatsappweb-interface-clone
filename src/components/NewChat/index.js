import React, {useState, useEffect} from "react"
import './NewChat.css'

import ApiObject from "../../Api"

import ArrowBackIcon from '@material-ui/icons/ArrowBack'

const NewChat = ({show, setShow, user, list}) => {
    const [listChat, setListChat] = useState([])

    useEffect(() => {
        const getList = async () => {
            if (user !== null) {
                let results = await ApiObject.getContactList(user.id)
                setListChat(results)
            }
        }

        getList()
    }, [user])

    const handleBackButton = () => {
        setShow(false)
    }

    const addNewChat = async (chatUser) => {
        await ApiObject.addNewChat(user, chatUser)

        handleBackButton()
    }

    return (
        <div className='new-chat' style={{left: show ? 0 : -415}}>
            <div className='new-chat--head'>
                <div onClick={handleBackButton} className='new-chat--back-button'><ArrowBackIcon style={{color: '#fff'}} /></div>
                <div className='new-chat--title'>Nova Conversa</div>
            </div>
            <div className='new-chat--list'>
                {listChat.map((item, key) => (
                    <div onClick={() => addNewChat(item)} className='new-chat--item' key={key}>
                        <img className='new-chat--item-avatar' src={item.avatar} alt='avatar'></img>
                        <div className='new-chat--item-name'>{item.name}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NewChat