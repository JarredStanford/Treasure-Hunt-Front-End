import React from 'react'
import Konva from 'konva'
import { Stage, Layer, Rect, Line, Circle } from 'react-konva';

const Map = props => {

    if (!props.map || !props.currentRoom) {
        return <div>Loading</div>
    }

    console.log(props.currentRoom)

    return (
        <Stage width={1000} height={600}>
            <Layer>
                {props.map.map(room => {
                    const roomX = room.x * 10 - 300
                    const roomY = -(room.y * 10 - 300) + 600
                    return (
                        <>
                            <Circle
                                key={room.room_id}
                                x={roomX}
                                y={roomY}
                                height={6}
                                width={6}
                                fill={props.currentRoom.room_id === room.room_id || room.room_id === 377 ? "green" : null}
                                stroke="black"
                                onClick={() => console.log(room)} />
                            {room['s'] ? <Line stroke="black" points={[roomX, roomY + 3, roomX, roomY + 6]} /> : null}
                            {room['n'] ? <Line stroke="black" points={[roomX, roomY - 6, roomX, roomY - 3]} /> : null}
                            {room['w'] ? <Line stroke="black" points={[roomX - 6, roomY, roomX - 3, roomY]} /> : null}
                            {room['e'] ? <Line stroke="black" points={[roomX + 3, roomY, roomX + 6, roomY]} /> : null}
                        </>
                    )
                })}
            </Layer>
        </Stage>
    )
}

export default Map