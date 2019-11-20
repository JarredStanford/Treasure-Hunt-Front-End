import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './App.css';

import Timer from './Timer'
import Map from './Map'

function App() {

  let token = '6e5ce6fb846b41cd257980886f6d0f2355e312b8'
  const [currentRoom, setRoom] = useState()
  const [map, setMap] = useState()
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    const rooms = async () => {
      const result = await axios.get('http://localhost:4000/rooms')
      setMap(result.data)
    }
    rooms()
  }, [])

  const createRoom = async (room) => {
    try {
      const result = await axios.post('http://localhost:4000/', room)
      console.log(result)
      const rooms = await axios.get('http://localhost:4000/rooms')
      setMap(rooms.data)
    } catch (err) { }
  }

  const connectRoom = async (room1, room2) => {
    try {
      const body = {
        room1, room2
      }
      const result = await axios.put('http://localhost:4000/connect', (body))
      console.log(result)
    } catch { }
  }

  const init = async () => {
    try {
      const res = await axios.get(
        "https://lambda-treasure-hunt.herokuapp.com/api/adv/init/",
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );
      setRoom(res.data)
      setCooldown(res.data.cooldown)
    } catch (err) {

    }
  };

  const knowRoomMove = async (direction) => {
    try {
      const findExit = map.find(room => room.room_id === currentRoom.room_id)
      const movement = await axios.post("https://lambda-treasure-hunt.herokuapp.com/api/adv/move/",
        { "direction": direction, 'next_room_id': `${findExit[direction]}` },
        { headers: { Authorization: `Token ${token}` } })
      const { data } = movement
      setCooldown(0)
      setCooldown(data.cooldown)
      setRoom(data)

    } catch (err) { setCooldown(err.response.data.cooldown) }
  }

  const move = async (direction) => {
    try {
      const movement = await axios.post("https://lambda-treasure-hunt.herokuapp.com/api/adv/move/",
        { "direction": direction },
        { headers: { Authorization: `Token ${token}` } })
      const { data } = movement
      const roomCheck = map.find(room => room.room_id === data.room_id)
      console.log(roomCheck)
      setCooldown(0)
      setCooldown(data.cooldown)

      if (roomCheck === undefined) {
        createRoom(data)
      }

      if (direction === "n") {
        const room1 = { "room_id": currentRoom.room_id, "n": data.room_id }
        const room2 = { "room_id": data.room_id, "s": currentRoom.room_id }
        connectRoom(room1, room2)
      } else if (direction === "s") {
        const room1 = { "room_id": currentRoom.room_id, "s": data.room_id }
        const room2 = { "room_id": data.room_id, "n": currentRoom.room_id }
        connectRoom(room1, room2)
      } else if (direction === "e") {
        const room1 = { "room_id": currentRoom.room_id, "e": data.room_id }
        const room2 = { "room_id": data.room_id, "w": currentRoom.room_id }
        connectRoom(room1, room2)
      } else {
        const room1 = { "room_id": currentRoom.room_id, "w": data.room_id }
        const room2 = { "room_id": data.room_id, "e": currentRoom.room_id }
        connectRoom(room1, room2)
      }
      setRoom(data)

    } catch (err) { setCooldown(err.response.data.cooldown) }
  }

  const pickupTreasure = async () => {
    try {
      const pickup = await axios.post('https://lambda-treasure-hunt.herokuapp.com/api/adv/take/',
        { "name": "treasure" },
        { headers: { Authorization: `Token ${token}` } })
      setCooldown(pickup.data.cooldown)
      console.log(pickup)
    } catch (err) { setCooldown(err.response.data.cooldown) }
  }

  return (
    <div>
      <Timer cooldown={cooldown} />
      <Map map={map} currentRoom={currentRoom} />
      <div> Room ID: {currentRoom && currentRoom.room_id} </div>
      <div>Description: {currentRoom && currentRoom.description}</div>
      <div>Title: {currentRoom && currentRoom.title}</div>
      <div>Exits: {currentRoom && currentRoom.exits}</div>
      <div>
        <button onClick={() => init()}>Init</button>
        {/*
        All rooms mapped, so we no longer need regular move.
        <button onClick={() => move("n")}>North</button>
        <button onClick={() => move("s")}>South</button>
        <button onClick={() => move("e")}>East</button>
        <button onClick={() => move("w")}>West</button>*/}
      </div>
      <div>
        <button onClick={() => knowRoomMove("n")}>Known North</button>
        <button onClick={() => knowRoomMove("s")}>Known South</button>
        <button onClick={() => knowRoomMove("e")}>Known East</button>
        <button onClick={() => knowRoomMove("w")}>Known West</button>
      </div>

      {currentRoom && currentRoom.messages.map(message => message)}
      <div>{currentRoom && currentRoom.items.map(item => item)}</div>
      <button onClick={() => pickupTreasure()}>Pickup Treasure</button>
    </div>
  )
}

export default App;
