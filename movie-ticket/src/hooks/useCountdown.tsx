import { useEffect, useState } from "react";

export default function useCountdown(expiryTime: number|null){
    const [timeLeft, setTimeLeft] = useState(0);
    useEffect(() => {
        if(!expiryTime) return;
        const interval = setInterval(() => {
            setTimeLeft(expiryTime-Date.now())
        },1000);
        return() =>{ 
            clearInterval(interval)
        };
    },[expiryTime]);
    return Math.max(timeLeft,0);
}