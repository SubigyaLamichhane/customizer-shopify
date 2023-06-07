import {
    Frame,
    Page,
    Layout,
    Button,
} from '@shopify/polaris';
import { useState, useCallback } from 'react';
import FontStyleSetting from '../components/FontStyleSetting';
import FontColorSetting from '../components/FontColorSetting';
import TextOutLineColor from '../components/TextOutLineColor';

export default function TextSetting(props) {
    const API_URL = props.API_URL;
    const [selected, setSelected] = useState("fontStyle");

    // fontStyle
    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );

    return (
        <Frame>
            <Page fullWidth>
                <div className="header">
                    <div className="header_btns">
                        <a href={void 0} onClick={() => handleTabChange("fontStyle")} style={{ marginLeft: "8px" }}>
                            <Button primary={(selected == "fontStyle")}>
                                Font Style
                            </Button>
                        </a>
                        <a href={void 0} onClick={() => handleTabChange("fontColor")} style={{ marginLeft: "8px" }}>
                            <Button primary={(selected == "fontColor")}>
                                Font Color
                            </Button>
                        </a>
                        <a href={void 0} onClick={() => handleTabChange("textOutlineColor")} style={{ marginLeft: "8px" }}>
                            <Button primary={(selected == "textOutlineColor")}>
                                Text Outline Color
                            </Button>
                        </a>
                    </div>
                </div>
                <Layout>
                    <Layout.Section>
                        {
                            (selected == "fontStyle") && <FontStyleSetting API_URL={API_URL} />
                        }
                        {
                            (selected == "fontColor") && <FontColorSetting API_URL={API_URL} />
                        }
                        {
                            (selected == "textOutlineColor") && <TextOutLineColor API_URL={API_URL} />
                        }
                    </Layout.Section>
                </Layout>
            </Page>
        </Frame>
    );
}