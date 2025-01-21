import { gql } from "@apollo/client";

export const GET_USER = gql`
query MyQuery($id: String!) {
    user(id: $id) {
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
`;