import { post } from "./axios"
export const sendLineMessage = async (userId: string, replyToken: string, message: any) => {
    const body = {
        replyToken,
        messages: [message]
    }
    console.log(JSON.stringify(body))
    const response = await post(`https://api.line.me/v2/bot/message/reply`, body, { headers: { Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}` } })
    console.log(response)
}
