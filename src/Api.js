import firebase from "firebase/app"
import 'firebase/firebase-auth'
import 'firebase/firebase-firestore'

import  firebaseConfig from './firebaseConfig'

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()

const ApiObject = {
    fbPopup: async () => {
        const provider = new firebase.auth.FacebookAuthProvider()
        let result = await firebaseApp.auth().signInWithPopup(provider)
        return result
    },
    addUser: async (user) => {
        await db.collection('users').doc(user.id).set({
            name: user.name,
            avatar:user.avatar
        }, {merge: true})
    },
    getContactList: async (userId) => {
        let contactList = []

        let results = await db.collection('users').get()
        results.forEach(result => {
            let data = result.data()
            if (result.id !== userId) {
                contactList.push({
                    id: result.id,
                    name: data.name,
                    avatar: data.avatar
                })
            }
        })

        return contactList
    },
    addNewChat: async (user, chatUser) => {
        let newChat = await db.collection('chats').add({
            messages: [],
            users: [user.id, chatUser.id]
        })

        db.collection('users').doc(user.id).update({
            chats: firebase.firestore.FieldValue.arrayUnion({
                chatId: newChat.id,
                title: chatUser.name,
                image: chatUser.avatar,
                with: chatUser.id
            })
        })

        db.collection('users').doc(chatUser.id).update({
            chats: firebase.firestore.FieldValue.arrayUnion({
                chatId: newChat.id,
                title: user.name,
                image: user.avatar,
                with: user.id
            })
        })
    },
    onChatList: (userId, setChatList) => {
        return db.collection('users').doc(userId).onSnapshot(doc => {
            if (doc.exists) {
                let data = doc.data()
                if (data.chats) {
                    let chats = [...data.chats]
                    chats.sort((a,b) => {
                        if (a.lastMessageDate === undefined) {
                            return -1
                        }
                        if (a.lastMessageDate.seconds < b.lastMessageDate.seconds) {
                            return 1
                        } else {
                            return -1
                        }
                    })
                    setChatList(chats)
                }
            }
        })
    },
    onChatContent: (chatId, setList, setUsers) => {
        return db.collection('chats').doc(chatId).onSnapshot(doc => {
            if (doc.exists) {
                let data = doc.data()
                setList(data.messages)
                setUsers(data.users)
            }
        })
    },
    senMessage: async (chatData, userId, type, body, users) => {
        let now = new Date()
        db.collection('chats').doc(chatData.chatId).update({
            messages: firebase.firestore.FieldValue.arrayUnion({
                type,
                author: userId,
                body,
                date: now
            })
        })

        for (let i in users) {
            let user = await db.collection('users').doc(users[i]).get()
            let userData = user.data()
            if (userData.chats) {
                let chats = [...userData.chats]
                for (let e in chats) {
                    if (chats[e].chatId === chatData.chatId) {
                        chats[e].lastMessage = body
                        chats[e].lastMessageDate = now
                    }
                }

                await db.collection('users').doc(users[i]).update({
                    chats
                })
            }
        }
    }
}

export default ApiObject