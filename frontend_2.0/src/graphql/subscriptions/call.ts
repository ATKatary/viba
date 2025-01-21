import { gql } from "@apollo/client";

export const WATCH_CALL = gql`
subscription MySubscription($uid: String!) {
    watchCall(uid: $uid) {
        uid
        cid 
        data 
    }
}
`