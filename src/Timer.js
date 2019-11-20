import React, { useState, useEffect } from 'react'

const Timer = props => {

    const [cooldown, setCooldown] = useState(0)

    useEffect(() => {
        setCooldown(props.cooldown)
    }, [props.cooldown])

    useEffect(() => {
        let interval = null
        interval = setInterval(() => {
            if (cooldown > 0) {
                setCooldown(cooldown => cooldown - 1)
            }
            if (cooldown <= 0) {
                clearInterval(interval)
                setCooldown(0)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [cooldown])

    return (
        <div>Time Remaining: {cooldown}</div>
    )
}

export default Timer