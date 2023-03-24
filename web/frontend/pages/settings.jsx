import { Frame, Page, Button, LegacyCard, Toast, Spinner } from '@shopify/polaris';
import { TitleBar } from "@shopify/app-bridge-react";
import React, { useState, useCallback, useEffect } from 'react';
import { useAuthenticatedFetch } from '../hooks';

export default function Settings(props) {
    const API_URL = props.API_URL;
    const fetch = useAuthenticatedFetch();
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [toastMsg, setToastMsg] = useState(false);
    console.log('API_URL', props.API_URL);
    const [btnSettings, setBtnSettings] = useState({
        visible_add_art: true,
        visible_upload: true,
        visible_add_name: true,
        visible_add_notes: true
    });

    useEffect(async () => {
        const response = await fetch(`${API_URL}/get-setting`);
        const settingDetails = await response.json();
        if (settingDetails.status === true) {
            const settingsVal = settingDetails.data[0];
            setBtnSettings({
                visible_add_art: settingsVal.visible_add_art,
                visible_upload: settingsVal.visible_upload,
                visible_add_name: settingsVal.visible_add_name,
                visible_add_notes: settingsVal.visible_add_notes
            });
            console.log('use effect');
            console.log('btnSettings.visible_add_art', btnSettings.visible_add_art);
        } else {
            console.log("No data");
        }
        setLoadingStatus(false);
    }, [])

    const changeBtnSettings = (name, value) => {
        setBtnSettings({ ...btnSettings, [name]: value });
        // console.log('btnSettings', name, value);
    }    

    const saveSettings = async () => {
        setLoadingStatus(true);
        const settingData = {
            "visible_add_art": `${btnSettings.visible_add_art ? "1" : "0"}`,
            "visible_upload": `${btnSettings.visible_upload ? "1" : "0"}`,
            'visible_add_name': `${btnSettings.visible_add_name ? "1" : "0"}`,
            'visible_add_notes': `${btnSettings.visible_add_notes ? "1" : "0"}`
        };
        console.log('settingData', settingData);
        const response = await fetch(`${API_URL}/save-setting`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settingData)
        });
        const resData = await response.json();
        setLoadingStatus(false);
        setToastMsg(true);
    }

    return (
        <Frame>
            {toastMsg &&
                <Toast content="Settings saved successfully!" onDismiss={() => setToastMsg(false)} />
            }
            {loadingStatus &&
                <div className="loader_wrapper">
                    <div className="spinner_loader">
                        <Spinner accessibilityLabel="Spinner" size="large" />
                    </div>
                </div>
            }
            <Page
                breadcrumbs={[{ content: 'Settings', url: '/' }]}
                title="Settings"
                primaryAction={{
                    content: "Save",
                    onAction: saveSettings,
                }}
            >
                <TitleBar title="Settings Page" primaryAction={null} />
                <LegacyCard title="Settings" sectioned>
                    <div className="form_field">
                        <label>visible add art section {btnSettings.visible_add_art} hello</label>
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
        </Frame>
    );
}

// export default Settings;