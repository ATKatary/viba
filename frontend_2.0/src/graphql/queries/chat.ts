import { gql } from "@apollo/client";

export const GET_CHAT = gql`
query MyQuery($id: String!, $uid: String!) {
    chat(id: $id, uid: $uid) {
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
`;