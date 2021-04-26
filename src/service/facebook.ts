
import { post } from './axios'
export const sendFacebookMessage = async (id: string, message: any) => {
    const body = {
        recipient: {
            id
        },
        messaging_type: 'RESPONSE'
        , ...message
    }
    const optional = {
        params: {
            access_token: process.env.FACEBOOK_ACCESS_TOKEN
        }
    }
    const response = await post('https://graph.facebook.com/v10.0/me/messages', body, optional)
    console.log(response)
}

export const updatePersistentMenu = async (id: string) => {
    const body = {
        "psid": id,
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [
                    {
                        "type": "postback",
                        "title": "Add wallet",
                        "payload": "addWallet"
                    },
                    {
                        "type": "postback",
                        "title": "Wallets",
                        "payload": "wallets"
                    },
                    {
                        "type": "postback",
                        "title": "Price bot",
                        "payload": "priceBot"
                    }
                ]
            }
        ]
    }
    const optional = {
        params: {
            access_token: process.env.FACEBOOK_ACCESS_TOKEN
        }
    }
    const response = await post(`https://graph.facebook.com/v10.0/me/custom_user_settings`, body, optional)
    console.log(response)
}