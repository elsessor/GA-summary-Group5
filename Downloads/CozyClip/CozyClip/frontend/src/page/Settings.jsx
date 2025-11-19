// src/page/Settings.jsx
import React from 'react';
import SideCard from "../component/layout/SideCard.jsx";
import {Routes, Route} from "react-router-dom";
import ReadingExperienceCard from "../component/layout/ReadingExperienceCard.jsx";
import DisplayCard from "../component/layout/DisplayCard.jsx";
import AudioCard from "../component/layout/AudioCard.jsx";
import NotificationCard from "../component/layout/NotificationCard.jsx";
import PrivacyCard from "../component/layout/PrivacyCard.jsx";
import { SettingsProvider, useSettings } from "../context/SettingsContext.jsx";

function SettingsActions() {
    const { resetAll, saveAll } = useSettings();
    return (
        <div className="w-full flex justify-end gap-2 mb-4">
            <button
                onClick={resetAll}
                className="px-3 py-2 text-sm font-medium bg-gray-200 text-black rounded-md hover:bg-gray-300"
            >
                Reset Settings
            </button>
            <button
                onClick={saveAll}
                className="px-4 py-2 bg-[#870022] text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
            >
                Save Changes
            </button>
        </div>
    );
}

function Settings() {
    return (
        <SettingsProvider>
            <div className="w-full flex items-start gap-1">
                <SideCard/>

                <div className="flex-1 p-4">
                    <SettingsActions />
                    <Routes>
                        <Route path="reading-experiences" element={<ReadingExperienceCard/>}/>
                        <Route path="display" element={<DisplayCard/>}/>
                        <Route path="audio" element={<AudioCard/>}/>
                        <Route path="notification" element={<NotificationCard/>}/>
                        <Route path="privacy" element={<PrivacyCard/>}/>
                        <Route path="*" element={<p>Select a setting from the left sidebar.</p>}/>
                    </Routes>
                </div>

            </div>
        </SettingsProvider>
    );
}

export default Settings;
