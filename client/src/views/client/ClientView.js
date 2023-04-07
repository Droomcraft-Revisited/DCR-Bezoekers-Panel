import React from "react";
import {TabPage, TabWindow} from "../../components/tabwindow/TabWindow";
import AudioPage from "./pages/audio/AudioPage";
import VoicePage from "./pages/voice/VoicePage";
import ResetLanguageBanner from "../../components/language/ResetLanguageBanner";
import SettingsPage from "./pages/settings/SettingsPage";
import {LoadingSpinnerBox} from "../../components/loading/LoadingSpinnerBox";
import {GrayoutPage} from "../../components/layout/GrayoutPage";
import {connect} from "react-redux";
import {StaticFooter} from "../../components/footer/StaticFooter";
import {InputModal} from "../../components/modal/InputModal";
import DebugPage from "./pages/debug/DebugPage";
import ActionPhotoPage from "./pages/actionPhoto/ActionPhotoPage";

class ClientView extends React.Component {
    render() {
        let {title, message, footer} = this.props.loadingOverlay;

        return (
            <div className="app">
                <div className="wrapper">
                    <TabWindow>
                        <TabPage name="Audio" content={<AudioPage/>}/>
                        <TabPage hidden={!this.props.voiceState.ready} name="VoiceChat" content={<VoicePage/>}/>
                        <TabPage name="Settings" content={<SettingsPage/>}/>
                        <TabPage name="ActionPhoto" content={<ActionPhotoPage/>}/>
                        <TabPage hidden={!this.props.debugMode} name="Debug" content={<DebugPage />} />
                    </TabWindow>
                </div>

                {this.props.loadingOverlay.visible && <GrayoutPage>
                    <LoadingSpinnerBox
                        title={title}
                        message={message}
                        footer={footer}
                    />
                </GrayoutPage>}
                <ResetLanguageBanner/>

                {this.props.fixedFooter && <StaticFooter>{this.props.fixedFooter}</StaticFooter>}
                {this.props.inputModal.visible && <InputModal />}
            </div>
        );
    }
}

export default connect(mapStateToProps)(ClientView);

function mapStateToProps(state) {
    return {
        debugMode: state.debug,
        inputModal: state.inputModal,
        fixedFooter: state.fixedFooter,
        loadingOverlay: state.loadingOverlay,
        voiceState: state.voiceState
    };
}