import React, { useState } from 'react';

export const Counter = () => {
    const [counter, setCounter] = useState(0);

    return <div>
        <button onClick={() => {setCounter(c => c + 1)}}>
            Count {counter}
        </button>
    </div>
}