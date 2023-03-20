import { Page, Button, LegacyCard } from '@shopify/polaris';
import React, { useState, useEffect } from 'react';
import { useAuthenticatedFetch } from '../hooks';

// const Settings = (props) =>  {

// }
export default function Settings(props) {
    const fetch = useAuthenticatedFetch();
    const API_URL = props.API_URL;
    console.log('API_URL',props.API_URL);
    const [btnSettings, setBtnSettings] = useState({
        visible_add_art: true,
        visible_upload: true,
        visible_add_name: true,
        visible_add_notes: true
    });
    const changeBtnSettings = (name, value) => {
        setBtnSettings({ ...btnSettings, [name]: value });
        // console.log('btnSettings', name, value);
    }

    const saveSettings = async() => {
        console.log('API_URL',props.API_URL);
        // setLoadingStatus(true);
        const settingData = {
            "visible_add_art": `${btnSettings.visible_add_art ? "1" : "0"}`,
            "visible_upload": `${btnSettings.visible_upload ? "1" : "0"}`,
            'visible_add_name': `${btnSettings.visible_add_name ? "1" : "0"}`,
            'visible_add_notes': `${btnSettings.visible_add_notes ? "1" : "0"}`
        };
        console.log('settingData',settingData);
        // alert()
        const response = await fetch(`https://c72c-103-21-55-66.in.ngrok.io/api/save-setting`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settingData)
        });
        const resData = await response.json();
        // setLoadingStatus(false);
        // setToastMsg(true);
    }

    return (
        <Page
            breadcrumbs={[{ content: 'Settings', url: '/' }]}
            title="Settings"
            primaryAction={{
                content: "Save",
                onAction: saveSettings,
            }}
        >
            <LegacyCard title="Settings" sectioned>
                <div className="form_field">
                    <label>visible add art section</label>
                    <div className="status_switch_wrapper">
                        <label onChange={(e) => changeBtnSettings("visible_add_art", !btnSettings.visible_add_art)} className="switch">
                            <input type="checkbox" defaultChecked={btnSettings.visible_add_art} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
                <div className="form_field">
                    <label>visible upload photo section</label>
                    <div className="status_switch_wrapper">
                        <label onChange={(e) => changeBtnSettings("visible_upload", !btnSettings.visible_upload)} className="switch">
                            <input type="checkbox" defaultChecked={btnSettings.visible_upload} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
                <div className="form_field">
                    <label>visible add name section</label>
                    <div className="status_switch_wrapper">
                        <label onChange={(e) => changeBtnSettings("visible_add_name", !btnSettings.visible_add_name)} className="switch">
                            <input type="checkbox" defaultChecked={btnSettings.visible_add_name} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
                <div className="form_field">
                    <label>visible add notes section</label>
                    <div className="status_switch_wrapper">
                        <label onChange={(e) => changeBtnSettings("visible_add_notes", !btnSettings.visible_add_notes)} className="switch">
                            <input type="checkbox" defaultChecked={btnSettings.visible_add_notes} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
                
                {/* <p>Credit card information</p> */}
            </LegacyCard>
        </Page>
    );
}

// export default Settings;