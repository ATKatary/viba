import { gql } from "@apollo/client";

export const WATCH_USER = gql`
subscription MySubscription($id: String!) {
    watchUser(id: $id) {
        id
        pfp
        name
        email 

        chats {
            id 
            title 
            unreadCount 

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
            }
        }
    }
}
`