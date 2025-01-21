import * as types from "../types";
import * as Mui from "@mui/material";
import VibaStyleSheet from "../styles";

interface LoadingProps extends React.PropsWithChildren<any> {
    loading: types.loadingType
}

export function Loading(props: LoadingProps) {
    const {load, message} = props.loading;

    return (
        <Mui.Backdrop 
            open={load || false}
            sx={{zIndex: 10000}}
            className="flex align-center column loading"
        >
            <Mui.Box sx={{width: "50%", margin: 2}}>
                <Mui.LinearProgress 
                    style={{borderRadius: 10, height: 7}}
                    sx={{...VibaStyleSheet.loading.progress}}
                />
            </Mui.Box>
            <Mui.Typography fontSize={14}>{message}</Mui.Typography>
        </Mui.Backdrop>
    )
}