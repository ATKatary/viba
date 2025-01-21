import { gql } from "@apollo/client";

export const READ_CHAT = gql`
mutation MyMutation($id: String!, $uid: String!) {
    readChat(id: $id, uid: $uid) {
        id
    }
}
`

export const BROADCAST = gql`
mutation MyMutation($id: String!, $uid: String!, $message: String!) {
    broadcastChat(id: $id, uid: $uid, message: $message) {
        id
    }
}
`