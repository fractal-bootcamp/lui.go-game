import { useState } from "react";
import { UserSettings } from "../shared/constants";

export const SettingDropdown = ({ userSettings, setUserSettings, settingKey, settingOptions }: { userSettings: UserSettings, setUserSettings: Function, settingKey: string, settingOptions: string[]}) => {
    const [isOpen, setOpen] = useState(false)
  
    const handleDropDown = () => {
      setOpen(!isOpen)
    }
  
    const handleSelect = (selection: string) => {
      setUserSettings( {...userSettings, [settingKey]: selection })
    }

    const humanTextPrep = settingKey.replace(/([A-Z])/g, " $1");
    const humanText = humanTextPrep.charAt(0).toUpperCase() + humanTextPrep.slice(1).toLowerCase();

    const buttonClass = "text-white bg-green-600 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
    const dropdownClass = `z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 
          ${
            isOpen ? "block" : "hidden"
          }
          `
    const optionClass = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
    const optionTextClass = "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"

    return (
      <>
        <button id="dropdown" onClick={() => handleDropDown()} data-dropdown-toggle="dropdownDefaultRadio" className={buttonClass} type="button">
          {humanText}
          <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
        </svg>
        </button>
        
        <div id="dropdown" className={dropdownClass}>
          <ul className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioButton">
            {settingOptions.map((optionName, optionIndex)=>{
              return(
                <li key={optionIndex}>
                  <div className="flex items-center">
                      <input checked={eval("userSettings."+settingKey) === optionName} onChange={() => handleSelect(optionName)} id="default-radio-1" type="radio" value="" name="default-radio" className={optionClass} />
                      <label htmlFor="default-radio-1" className={optionTextClass}>{optionName}</label>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
    
    
    
      </>
    );
  };