import React, { use, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import TranslationPair from '../Lib/Types';
import { useLanguage } from '../Context/LanguageContext';
import { toArabicNumber } from '../Lib/Helpers';
import SuccessAlert from '../Components/SuccessAlert';
import { toEnglishNumber } from '../Lib/Helpers';

const Counter = () => {

    const { language } = useLanguage();
    const [isButtonUpClicked, setIsButtonUpClicked] = useState(false);
    const [isButtonDownClicked, setIsButtonDownClicked] = useState(false); 
    const [count, setCount] = useState(0);
    const [goal, setGoal] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');

    
    const handleUp = () => {
        setIsButtonUpClicked(true);
        console.log('up');
        setCount(count + 1);

        setTimeout(() => {
            setIsButtonUpClicked(false);
        }, 500);
    }

    const handleDown = () => {
        setIsButtonDownClicked(true);
        console.log('down');
        if (count === 0){
            setIsButtonDownClicked(false);
            return;
        };
        setCount(count - 1);

        setTimeout(() => {
            setIsButtonDownClicked(false);
        }, 500);
    }

    const handleReset = () => {
        setCount(0);
        setGoal(0);
        setInputValue('');
    }

    useEffect(() => {
        if (count === goal && goal !== 0) {
            console.log('goal reached');
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                setCount(0);
                setGoal(0);
                setInputValue('');
            }, 3000);
        }
    },[count])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setGoal(parseInt(toEnglishNumber(e.target.value)));
        setCount(0);
    }

    const Zekr: TranslationPair = {
        en: "Start Tasbeeh now using the counter below",
        ar: "ابدأ التسبيح الآن باستخدام العداد "
    }

    const Placeholder: TranslationPair = {
        en: "Enter the number of Tasabeeh (30)",
        ar: "أدخل عدد التسبيح الذي تريد الوصول إليه (30)"}

    const Reset: TranslationPair = {
        en: "Reset Counter",
        ar: "إعادة تعيين العداد"
    }

    const Success: TranslationPair = {
        en: `You have reached your goal of ${goal} times`,
        ar: `لقد قمت بذكر الله ${toArabicNumber(goal)} مرات`
    }

  return (
    <div className="w-full min-h-screen px-2 flex flex-col gap-10 items-center bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <h1 className="text-2xl font-bold text-center">{Zekr[language]}</h1>
        <SuccessAlert message={Success} show={showAlert} onClose={() => setShowAlert(false)} />
        <div className='flex flex-col gap-4 md:flex md:flex-row md:gap-8'>
            <input 
            className='w-80 p-4 bg-[#FFF5E4] dark:bg-slate-900 dark:text-white text-[#134B70] border-2 border-[#134B70] dark:border-white rounded-lg focus:outline-none placeholder:text-slate-700 dark:placeholder-slate-100'
            name='goal'
            id='goal'
            value={inputValue}
            placeholder={Placeholder[language]}
            onChange={(e) => handleChange(e)}
            type="number" />

            <button 
            onClick={handleReset}
            className='px-4 py-2 font-semibold bg-teal-600 text-white rounded-lg'>
                {Reset[language]}
            </button>
            
        </div>

        <div className='bg-white rounded-lg shadow-lg px-4 py-2 w-80'>
            <h2 className='text-4xl font-bold text-center text-black'>{language === "ar"? toArabicNumber(count) : count}</h2>
        </div>

        <div className="relative flex flex-col items-center">
            <button
            onClick={handleUp}
            className={`border-8 rounded-full flex justify-center items-center w-60 h-60 bg-teal-600 shadow-lg ${isButtonUpClicked? `border-[#ffea00] dark:border-[#ffea00] text-[#ffea00]` : `border-[#FFF5E4] text-white dark:border-slate-900`} `} style={{ clipPath: 'circle(50% at 50% 50%)' }}>
            <FontAwesomeIcon icon={faAngleUp} className=" Big"/>
            </button>

            <button 
            onClick={handleDown}
            className={`absolute border-8  -bottom-14 rounded-full flex justify-center items-center w-28 h-28 bg-teal-600 shadow-lg ${isButtonDownClicked? `border-[#ffea00] dark:border-[#ffea00] text-[#ffea00]` : `border-[#FFF5E4] text-white dark:border-slate-900` } `} style={{ clipPath: 'circle(50% at 50% 50%)' }}>
            <FontAwesomeIcon icon={faAngleDown} className=" text-5xl"/>
            </button>
        </div>
    </div>
  );
};

export default Counter;