import { Frame, Page, Button, LegacyCard, Toast, Spinner, Icon } from '@shopify/polaris';
import {
    ChevronLeftMinor, CircleTickMinor, MobileAcceptMajor, CancelMajor,
    NoteMinor, AlertMinor
  } from '@shopify/polaris-icons';
import { TitleBar } from "@shopify/app-bridge-react";
import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuthenticatedFetch } from '../hooks';

export default function Settings(props) {
    const API_URL = props.API_URL;
    const fetch = useAuthenticatedFetch();
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [toastMsg, setToastMsg] = useState();
    const [toastContent, setToastContent] = useState("");
    const [toastErrStatus, setToastErrStatus] = useState(false);
    const [btnSettings, setBtnSettings] = useState({
        visible_add_art: true,
        visible_upload: true,
        visible_add_name: true,
        visible_add_notes: true
    });

    // Respond to the state change
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
        } else {
            setToastContent("Something went wrong!");
            setToastErrStatus(true)
        }
        setLoadingStatus(false);
    }, [])

    // Change button setting
    const changeBtnSettings = (name, value) => {
        setBtnSettings({ ...btnSettings, [name]: value });
    }

    // Save settings
    const saveSettings = async () => {
        setLoadingStatus(true);
        const settingData = {
            "visible_add_art": `${btnSettings.visible_add_art ? "1" : "0"}`,
            "visible_upload": `${btnSettings.visible_upload ? "1" : "0"}`,
            'visible_add_name': `${btnSettings.visible_add_name ? "1" : "0"}`,
            'visible_add_notes': `${btnSettings.visible_add_notes ? "1" : "0"}`
        };
        const response = await fetch(`${API_URL}/save-setting`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settingData)
        });
        const res = await response.json();
        setToastContent(res.message);
        setToastMsg(true);
        setLoadingStatus(false);
    }

    return (
        <Frame>
            <Page fullWidth>
                {toastMsg &&
                    <Toast content={toastContent} onDismiss={() => setToastMsg(false)} />
                }
                {toastErrStatus &&
                    <Toast content={toastContent} error onDismiss={() => setToastErrStatus(false)} />
                }
                {loadingStatus &&
                    <div className="loader_wrapper">
                        <div className="spinner_loader">
                            <Spinner accessibilityLabel="Spinner" size="large" />
                        </div>
                    </div>
                }
                <div className="header">
                    <div className="header_link">
                        <Link to="/">
                            <span><Icon source={ChevronLeftMinor} color="base" /></span>
                            <span className="link_text">Go Back</span>
                        </Link>
                    </div>
                    <div className="header_btns">
                        {/* <a href={void 0} onClick={changePreviewHandle} style={{ marginLeft: "8px" }}>
                            <Button>
                                Instruction
                            </Button>
                        </a> */}
                        <a href={void 0} onClick={saveSettings} style={{ marginLeft: "8px" }}>
                            <Button primary>
                                Update
                            </Button>
                        </a>
                    </div>
                </div>
                {/* <TitleBar title="Settings Page" primaryAction={null} /> */}
                <LegacyCard title="Settings" sectioned>
                    <div className="form_field">
                        <label> visible add art section </label>
                        <div className="status_switch_wrapper">
                            <label className="switch">
                                <input type="checkbox" onChange={(e) => changeBtnSettings("visible_add_art", !btnSettings.visible_add_art)} checked={btnSettings.visible_add_art} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div className="form_field">
                        <label>visible upload photo section </label>
                        <div className="status_switch_wrapper">
                            <label className="switch">
                                <input type="checkbox" onChange={(e) => changeBtnSettings("visible_upload", !btnSettings.visible_upload)} checked={btnSettings.visible_upload} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div className="form_field">
                        <label>visible add name section </label>
                        <div className="status_switch_wrapper">
                            <label className="switch">
                                <input type="checkbox" onChange={(e) => changeBtnSettings("visible_add_name", !btnSettings.visible_add_name)} checked={btnSettings.visible_add_name} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div className="form_field">
                        <label>visible add notes section </label>
                        <div className="status_switch_wrapper">
                            <label className="switch">
                                <input type="checkbox" onChange={(e) => changeBtnSettings("visible_add_notes", !btnSettings.visible_add_notes)} checked={btnSettings.visible_add_notes} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </LegacyCard>
            </Page>
        </Frame>
    );
}