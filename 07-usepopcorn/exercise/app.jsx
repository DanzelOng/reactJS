import { useEffect, useState } from "react";
import "../app2.css";

const host = "api.frankfurter.app";

export default function App() {
    const [amount, setAmount] = useState("");
    const [value1, setValue1] = useState("USD");
    const [value2, setValue2] = useState("USD");
    const [converted, setConverted] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!amount) {
            setConverted(null);
            return;
        }
        if (value1 === value2) {
            setConverted(amount);
            return;
        }
        async function convert() {
            setIsLoading(true);
            const result = await fetch(
                `https://${host}/latest?amount=${amount}&from=${value1}&to=${value2}`
            );
            const data = await result.json();
            setConverted(data.rates[value2]);
            setIsLoading(false);
        }
        convert();
    }, [amount, value1, value2]);

    return (
        <div className="App">
            <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <select value={value1} onChange={(e) => setValue1(e.target.value)}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CAD">CAD</option>
                <option value="INR">INR</option>
            </select>
            <select value={value2} onChange={(e) => setValue2(e.target.value)}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CAD">CAD</option>
                <option value="INR">INR</option>
            </select>
            <div>
                {/* no amount*/}
                {!amount && "Start Converting!"}
                {/* loading data */}
                {isLoading && <Loader />}
                {/* data has being fetched  */}
                {!isLoading &&
                    converted &&
                    `${amount} ${value1} is ${converted} ${value2}`}
            </div>
        </div>
    );
}

function Loader() {
    return <p>Conversion in Process...</p>;
}
