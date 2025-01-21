import { gql } from "@apollo/client";

export const WATCH_CHAT = gql`
subscription MySubscription($id: String!, $uid: String!) {
    watchChat(id: $id, uid: $uid) {
        id 
        title 
        admins {
            id 
            pfp
            name 
        }

        members {
            id 
            pfp
            name 
        }

        messages {
            id 
            sender {
                id 
                pfp
                name
            }

            text
            timeSent 
            attachments {
                id 
                imageUrl 
                fileUrl
            }
            reactions {
                id
                user {
                    id
                    name
                }
                emoji 
            }
        }
    }
}
`