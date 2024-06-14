import { useState } from "react";
import { UserSettings } from "./App";

export const SizeDropdown = ({ userSettings, setUserSettings }: { userSettings: UserSettings, setUserSettings: Function}) => {
    const [isOpen, setOpen] = useState(false)
  
    console.log("ShowSizeDropdown rendered")
    console.log(userSettings)
  
    const handleDropDown = () => {
      setOpen(!isOpen)
      console.log("click registered")
    }
  
    const handleSelectSmall = (size: string) => {
      setUserSettings( {...userSettings, boardSize: size })
      console.log("Small clicked")
      console.log("New userSettings", userSettings)
    }

    const bulletClassName = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"

    return (
      <>
  
  <button id="dropdown" onClick={() => handleDropDown()} data-dropdown-toggle="dropdownDefaultRadio" className={`text-white bg-green-600 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`} type="button">
    Board size
    <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
  </svg>
  </button>
  
  <div id="dropdown" className={`z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 
    ${
      isOpen ? "block" : "hidden"
    }
    `}>
      <ul className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioButton">
        <li>
          <div className="flex items-center">
              <input checked={userSettings.boardSize === "Small"} onChange={() => handleSelectSmall("Small")} id="default-radio-1" type="radio" value="" name="default-radio" className={bulletClassName} />
              <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Small</label>
          </div>
        </li>
        <li>
          <div className="flex items-center">
              <input checked={userSettings.boardSize === "Medium"} onChange={() => handleSelectSmall("Medium")} id="default-radio-2" type="radio" value="" name="default-radio" className={bulletClassName} />

              <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Medium</label>
          </div>
        </li>
        <li>
          <div className="flex items-center">
              <input checked={userSettings.boardSize === "Large"} onChange={() => handleSelectSmall("Large")} id="default-radio-3" type="radio" value="" name="default-radio" className={bulletClassName} />
              <label htmlFor="default-radio-3" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Large</label>
          </div>
        </li>
      </ul>
  </div>
  
  
  
  </>
    );
  };