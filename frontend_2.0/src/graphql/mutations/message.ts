import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
mutation MyMutation($id: String!, $uid: String!, $text: String!) {
    sendMessage(id: $id, uid: $uid, text: $text) {
        id
    }
}
`

export const REACT_MESSAGE = gql`
mutation MyMutation($id: String!, $uid: String!, $reaction: String!) {
    reactMessage(id: $id, uid: $uid, reaction: $reaction) {
        id
    }
}
`

export const EDIT_MESSAGE = gql`
mutation MyMutation($id: String!, $text: String!) {
    editMessage(id: $id, text: $text) {
        id
    }
}
`

export const DELETE_MESSAGE = gql`
mutation MyMutation($id: String!) {
    deleteMessage(id: $id) {
        id
    }
}
`