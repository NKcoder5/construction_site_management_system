import React, { useState } from 'react';
import { Delete, Equal, Trash2 } from 'lucide-react';

const Calculator = () => {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');

    const handleNumber = (num) => {
        setDisplay(display === '0' ? num : display + num);
        setEquation(equation + num);
    };

    const handleOperator = (op) => {
        setDisplay('0');
        setEquation(equation + ' ' + op + ' ');
    };

    const handleEqual = () => {
        try {
            // eslint-disable-next-line no-eval
            const result = eval(equation);
            setDisplay(String(result));
            setEquation(String(result));
        } catch (e) {
            setDisplay('Error');
            setEquation('');
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setEquation('');
    };

    return (
        <div className="p-4 bg-slate-900 text-white rounded-3xl w-full max-w-sm mx-auto shadow-2xl border border-slate-800">
            <div className="mb-4 bg-slate-800 rounded-2xl p-4 text-right">
                <div className="text-slate-400 text-sm h-6">{equation}</div>
                <div className="text-4xl font-mono font-bold">{display}</div>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {['7', '8', '9', '/'].map(btn => (
                    <button key={btn} onClick={() => ['/', '*', '-', '+'].includes(btn) ? handleOperator(btn) : handleNumber(btn)}
                        className={`p-4 rounded-xl font-bold text-xl active:scale-95 transition-transform ${['/', '*', '-', '+'].includes(btn) ? 'bg-orange-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                        {btn}
                    </button>
                ))}
                {['4', '5', '6', '*'].map(btn => (
                    <button key={btn} onClick={() => ['/', '*', '-', '+'].includes(btn) ? handleOperator(btn) : handleNumber(btn)}
                        className={`p-4 rounded-xl font-bold text-xl active:scale-95 transition-transform ${['/', '*', '-', '+'].includes(btn) ? 'bg-orange-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                        {btn}
                    </button>
                ))}
                {['1', '2', '3', '-'].map(btn => (
                    <button key={btn} onClick={() => ['/', '*', '-', '+'].includes(btn) ? handleOperator(btn) : handleNumber(btn)}
                        className={`p-4 rounded-xl font-bold text-xl active:scale-95 transition-transform ${['/', '*', '-', '+'].includes(btn) ? 'bg-orange-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                        {btn}
                    </button>
                ))}
                <button onClick={() => handleNumber('.')} className="p-4 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-xl">.</button>
                <button onClick={() => handleNumber('0')} className="p-4 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-xl">0</button>
                <button onClick={handleClear} className="p-4 rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/30 font-bold text-xl flex items-center justify-center"><Trash2 className="w-5 h-5" /></button>
                <button onClick={() => handleOperator('+')} className="p-4 rounded-xl bg-orange-600 text-white font-bold text-xl">+</button>
            </div>
            <button onClick={handleEqual} className="w-full mt-2 p-4 rounded-xl bg-green-600 hover:bg-green-700 font-bold text-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                <Equal className="w-6 h-6 mr-2" /> Calculate
            </button>
        </div>
    );
};

export default Calculator;
