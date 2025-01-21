import * as React from "react";

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

import { THEME } from "../../src/constants";
import { Button, IconButton, Typography } from "@mui/material";
import { useVideo } from "../../src/classes/call/video";
import { styles } from "../../src/styles";
import { ControlsArray } from "../../src/support";
import { Call } from "../../src/classes/call";
import { ThemeContext } from "../../src";

interface VideoProps extends React.HTMLAttributes<HTMLDivElement> {
    call: Call
}

function Video(props: VideoProps) {
    const {call, ...domProps} = props;
    const {style, className, ...rest} = domProps;

    const {localVideo} = useVideo(call);
    const theme = React.useContext(ThemeContext);
    const [muted, setMuted] = React.useState<boolean>(false);
    const [videoEnabled, setVideoEnabled] = React.useState<boolean>(true);

    return (
        <div
            className={`flex column align-center ${className} fixed`} 
            style={{
                ...styles.videoContainer(),
                ...style,
            }}
        >
            {call.connections.length?
                <>
                <div>
                    <video 
                        autoPlay
                        id="local" 
                        playsInline
                        ref={localVideo}
                        className="absolute"
                        style={{...styles.localVideo()}}
                    ></video>
                    {call.connections.map(({uid}) => {
                        return (
                            <video
                                src=" "
                                autoPlay
                                playsInline
                                id={`remote-video-caller-${uid}`}
                                style={{...styles.remoteVideo()}}
                            ></video>
                        )
                    }

                    )}
                </div>
                <ControlsArray 
                    className="width-100 justify-center"
                    style={{margin: "-60px 0 0 0"}}
                    btnStyle={{backgroundColor: `${THEME.DOMINANT}64`, margin: "2px 5px"}}
                    svgStyle={{width: 25, height: 25, color: THEME.BACKGROUND_ACCENT(theme?.isDark)}}
                >
                    {muted? <MicIcon onClick={() => {call.unMute(); setMuted(false)}}/> : <MicOffIcon onClick={() => {call.mute(); setMuted(true)}}/>}
                    {videoEnabled? <VideocamOffIcon onClick={() => {call.hideVideo(); setVideoEnabled(false)}}/> : <VideocamIcon onClick={() => {call.showVideo(); setVideoEnabled(true)}}/>}
                    <CallEndIcon onClick={() => call.leave()} style={{color: THEME.ERROR(theme?.isDark)}}/>
                </ControlsArray>
                </> : <></>
            }
        </div>
    )
}

export default Video;

