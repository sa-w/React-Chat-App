import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Chat() {

    const [refreshChat, setRefreshChat] = useState(false)
    const [chats, setChats] = useState([])
    const [requireSignIn, setRequireSignIn] = useState(0)

    let searchParams = new URLSearchParams(document.location.search)
    let searchUser = searchParams.get("user")
    let userValue

    //Chat alert
    const chateSentNotify = () => toast.success('🦄 Success, Chat sent successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    //Update state for sign in
    function updateRequireSignIn(a) {
        setRequireSignIn(a)
    }

    //Update state for refresh chat
    function updateRefreshChat(a) {
        setRefreshChat(a)
    }

    //Update state for chats
    function updateChats(b) {
        setChats(b)
    }

    //Add a new user to chat through creating a new browser tab. 
    function addUserToChat() {

        let params = new URLSearchParams(document.location.search)

        let user = params.get("user")

        let chatAccount = localStorage.getItem("chatAccounts")

        let chatAccountValues //= parseInt(chatAccount, 10)

        if (chatAccount) {
            chatAccountValues = parseInt(chatAccount, 10) //+ 1
            chatAccountValues = chatAccountValues + 1
            localStorage.setItem("chatAccounts", chatAccountValues)
        } else {
            chatAccountValues = 1
            localStorage.setItem("chatAccounts", 1)
        }

        if (user) {
            //  let initialValue = parseInt(user, 10)
            //  let newValue = initialValue + 1
            let currentUrl = document.location.href
            let tempUrl = currentUrl.split('?')[0]
            let finalUrl = tempUrl + '?user=' + chatAccountValues.toString();
            window.open(finalUrl, '_blank');
        } else {
            let currentUrl = document.location.href
            let finalUrl = currentUrl + '?user=' + chatAccountValues.toString();
            window.open(finalUrl, '_blank');
        }

    }

    //Run during every render
    useEffect(() => {

        let activeChat = localStorage.getItem("chat")

        if (activeChat) {
            updateChats(JSON.parse(activeChat))
            updateRefreshChat(0)
            console.log(chats)
        }

        updateRefreshChat(0)

        if (searchUser) {
            userValue = parseInt(searchUser, 10)

            let currentAccount = localStorage.getItem(userValue.toString() + "identity")

            if (currentAccount) {
                updateRequireSignIn(0)
            } else {
                updateRequireSignIn(1)
            }
        } else {
            let currentAccount = localStorage.getItem("0" + "identity")

            if (currentAccount) {
                updateRequireSignIn(0)
            } else {
                updateRequireSignIn(1)
            }
        }

        window.onstorage = () => {
            // When local storage changes, dump the list to
            // the console.
            updateRefreshChat(1)
          };

    }, [refreshChat, requireSignIn])

    //Style for card
    const cardStyle = {

        height: '500px',
        width: '100%',
        marginLeft: '0%',
        marginRight: '0%',
        marginTop: '2%',

    }

    //Style for sender within chat
    const senderStyle = {
        width: '100%',
        marginRight: '0',
        float: 'right'
    }

    //Style for receiver within chat
    const receiverStyle = {
        width: '100%',
        marginLeft: '0',
        float: 'left'
    }

    //Sebd chat message
    function sendChatMessage(value) {

        let message = value

        let params = new URLSearchParams(document.location.search)

        let user = params.get("user")

        let messageObject = localStorage.getItem("chat")

        if (user) {
            let clientId = parseInt(user, 10)
            let userName = localStorage.getItem(clientId.toString() + "identity")//"John"
            let newMessage = { client: clientId, name: userName, message: value }

            if (messageObject) {
                let tempMessageObject = JSON.parse(messageObject)
                //  let size = Object.keys(tempMessageObject).length
                //let index = size + 1
                tempMessageObject.push(newMessage) //[index] = newMessage
                // let newMessageObject = // Object.keys(messageObject).push(JSON.stringify({index:newMessage}))//Object.assign(tempMessageObject, newMessage)
                localStorage.setItem("chat", JSON.stringify(tempMessageObject))
                updateRefreshChat(1)
                chateSentNotify()
            } else {
                var data = [newMessage]
                localStorage.setItem("chat", JSON.stringify(data))
                updateRefreshChat(1)
                chateSentNotify()
            }


        } else {

            let clientId = 0//parseInt(user, 10)
            let userName = localStorage.getItem("0identity")//"Mary"
            let newMessage = { client: clientId, name: userName, message: value }

            if (messageObject) {
                let tempMessageObject = JSON.parse(messageObject)
                //  let size = Object.keys(tempMessageObject).length
                //let index = size + 1
                tempMessageObject.push(newMessage) //[index] = newMessage
                // let newMessageObject = // Object.keys(messageObject).push(JSON.stringify({index:newMessage}))//Object.assign(tempMessageObject, newMessage)
                localStorage.setItem("chat", JSON.stringify(tempMessageObject))
                updateRefreshChat(1)
                chateSentNotify()
            } else {
                var data = [
                    newMessage
                ]
                localStorage.setItem("chat", JSON.stringify(data))
                updateRefreshChat(1)
                chateSentNotify()
            }

        }

    }

    //Create a user account when a new chat is initiated on a new tab
    const createAccount = (a) => {

        let params = new URLSearchParams(document.location.search)

        let searchUser = params.get("user")

        let userIdentity

        if (searchUser) {
            userIdentity = parseInt(searchUser, 10)

            localStorage.setItem(userIdentity.toString() + "identity", a)

            let currentAccount = localStorage.getItem(userIdentity.toString() + "identity")

            if (currentAccount) {
                updateRequireSignIn(0)
            } else {
                updateRequireSignIn(1)
            }
        } else {

            localStorage.setItem("0" + "identity", a)

            let currentAccount = localStorage.getItem("0" + "identity")

            if (currentAccount) {
                updateRequireSignIn(0)
            } else {
                updateRequireSignIn(1)
            }
        }

    }

    //Show chats from all accounts
    const listItems = chats.map((i) => {
        let params = new URLSearchParams(document.location.search)
        let user = params.get("user")
        let userValue

        if (user) {
            userValue = parseInt(user, 10)
        } else {
            userValue = 0
        }

        if (userValue === i.client) {
            return (
                <Container>
                    <Row>
                        <Col></Col>
                        <Col >
                            <div id='sender' className="" style={{ float: 'right', width: '100%' }} >

                                <Stack key={i.message} style={senderStyle} direction="horizontal" gap={1}>
                                    <div style={{ float: 'right', width: '100%' }} >
                                        <Alert variant={'success'}  >
                                            {i.message}
                                        </Alert>
                                    </div>
                                    <span style={{ float: 'right', marginRight: '0' }} ><Badge bg="secondary">{"YOU"}</Badge></span>
                                </Stack>

                            </div>
                        </Col>
                    </Row>
                </Container>

            )
        } else {
            return (
                <Container>
                    <Row>
                        <Col>

                            <div id='receiver' className="" style={{ float: 'left', width: '100%' }} >

                                <Stack key={i.message} style={receiverStyle} direction="horizontal" gap={1}>
                                    <span style={{ float: 'left', marginRight: '0' }} ><Badge bg="secondary">{i.name}</Badge></span>
                                    <div style={{ float: 'left', width: '100%' }}  >
                                        <Alert variant={'success'}  >
                                            {i.message}
                                        </Alert>
                                    </div>
                                </Stack>

                            </div>

                        </Col>
                        <Col >

                        </Col>
                    </Row>
                </Container>
            )
        }

    })

    return (

        <Container id='mainContainer' fluid="md"  >

            <Card className="text-center w-50" ref={(node) =>
                node?.style.setProperty("width", "100%", "important")} style={cardStyle} >
                <Card.Header>

                    <Container>

                        <Row>

                            <Col>
                                <div style={{ float: 'left', marginLeft: '0' }}>
                                    <Badge pill bg="success">
                                        LIVE
                                    </Badge>
                                </div>
                            </Col>
                            <Col>
                                {searchUser === null && (<div style={{ float: 'right', marginRight: '0' }}>
                                    <Button variant="secondary" onClick={() => addUserToChat()} >ADD USER TO THIS CHAT</Button>
                                </div>)}

                            </Col>

                        </Row>

                    </Container>

                </Card.Header>
                <Card.Body style={{ height: '100%', width: '100%', overflow: 'scroll' }}>
                    <div >

                        {requireSignIn === 0 && (<Stack gap={3}  >

                            {listItems}

                        </Stack>)}

                        {requireSignIn === 1 && (<Stack direction="vertical" gap={3}>
                            <Form.Label htmlFor="inputPassword5">To continue, please tell us your name...</Form.Label>
                            <Form.Control className="me-auto" id="accountName" placeholder="Your name..." />
                            <Button variant="secondary" onClick={() => createAccount(document.getElementById('accountName').value)} >SUBMIT</Button>
                        </Stack>)}

                    </div>

                </Card.Body>
                <Card.Footer className="text-muted">
                    {requireSignIn === 0 && (<Stack direction="horizontal" gap={3}>
                        <Form.Control className="me-auto" id="something" placeholder="Say something..." />
                        <Button variant="secondary" onClick={() => sendChatMessage(document.getElementById('something').value)} >SEND</Button>
                    </Stack>)}
                    <ToastContainer />
                </Card.Footer>
            </Card>

        </Container>

    );

}

export default Chat;