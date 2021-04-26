export const generateMessage = (platform: number, message: string) => {
    if (platform === 1) return generateFacebookMessage(message)
    else if (platform === 2) return generateLineMessage(message)
    return null
}
const generateFacebookMessage = (message: string) => {
    return {
        message: {
            "text": message
        }
    }
}

const generateLineMessage = (message: string) => {
    return {
        "type": "text",
        "text": message
    }
}

export const generateReplyMessage = (platform: number, message: string) => {
    if (platform === 1) return generateFacebookReplyMessage(message)
    else if (platform === 2) return generateLineReplyMessage(message)
    else return null
}

const generateLineReplyMessage = (message: string) => {
    return {
        "type": "text",
        "text": message,
        "quickReply": {
            "items": [{
                "type": "action",
                "action": {
                    "type": "message",
                    "label": "Confirm",
                    "text": "confirm"
                }
            }, {
                "type": "action",
                "action": {
                    "type": "message",
                    "label": "Cancel",
                    "text": "cancel"
                }
            }]
        }
    }
}


export const generateFacebookReplyMessage = (message: string) => {
    return {
        message: {
            "text": message,
            "quick_replies": [{
                "content_type": "text",
                "title": "Confirm",
                "payload": "confirm"
            }, {
                "content_type": "text",
                "title": "Cancel",
                "payload": "cancel"
            }]
        }
    }
}

export const generateCreateWalletQuickReply = (platform: number, message: string) => {
    if (platform === 1) return generateFacebookQuickReply(message)
    else if (platform === 2) return generateLineQuickReply(message)
    return null
}
const generateLineQuickReply = (message: string) => {
    return {
        "type": "text",
        "text": message,
        "quickReply": {
            "items": [{
                "type": "action",
                "imageUrl": "https://firebasestorage.googleapis.com/v0/b/covalent-4b53e.appspot.com/o/image%2Feth.png?alt=media&token=ef8877f5-4b05-428d-987a-90dd9e27b3fa",
                "action": {
                    "type": "message",
                    "label": "ERC Network",
                    "text": "erc"
                }
            }, {
                "type": "action",
                "imageUrl": "https://firebasestorage.googleapis.com/v0/b/covalent-4b53e.appspot.com/o/image%2Fbsc.png?alt=media&token=ca340a90-5241-4fc9-a7e6-405f89ca86fb",
                "action": {
                    "type": "message",
                    "label": "BSC Network",
                    "text": "bsc"
                }
            }]
        }
    }
}
const generateFacebookQuickReply = (message: string) => {
    return {
        message: {
            "text": message,
            "quick_replies": [{
                "content_type": "text",
                "title": "ERC Network",
                "payload": "erc",
                "image_url": "https://firebasestorage.googleapis.com/v0/b/covalent-4b53e.appspot.com/o/image%2Feth.png?alt=media&token=ef8877f5-4b05-428d-987a-90dd9e27b3fa"
            }, {
                "content_type": "text",
                "title": "BSC Network",
                "payload": "bsc",
                "image_url": "https://firebasestorage.googleapis.com/v0/b/covalent-4b53e.appspot.com/o/image%2Fbsc.png?alt=media&token=ca340a90-5241-4fc9-a7e6-405f89ca86fb"
            }]
        }
    }
}

export const generateFacebookWalletList = (wallets: any) => {
    let elements = []
    for (let i = 0; i < wallets.length; i++) {
        const wallet = wallets[i]
        const logoImg = wallet.network === 'erc' ? 'https://firebasestorage.googleapis.com/v0/b/covalent-4b53e.appspot.com/o/image%2Feth_banner.png?alt=media&token=29cf97e3-99b2-4588-a8e1-a0580af0d717' : 'https://firebasestorage.googleapis.com/v0/b/covalent-4b53e.appspot.com/o/image%2Fbsc_banner.png?alt=media&token=0b1fca9e-318a-4121-99a2-7bc4b1bb409f'
        const url = wallet.network === 'erc' ? `https://etherscan.com/address/${wallet.address}` : `https://bscscan.com/address/${wallet.address}`
        const name = `${wallet.address.substring(0, 6)}....${wallet.address.substring(wallet.address.length - 4, wallet.address.length)} (${wallet.name})`
        const totalValue = `Total Assets $${wallet.totalValue}`
        elements.push({
            "title": name,
            "image_url": logoImg,
            "subtitle": totalValue,
            "default_action": {
                "type": "web_url",
                "url": url,
                "webview_height_ratio": "full",
            },
            "buttons": [
                {
                    "type": "web_url",
                    "url": `${process.env.DOMAIN_NAME}/transactions?id=${wallet.id}`,
                    "title": "Transactions",
                    "webview_height_ratio": "full"

                }, {
                    "type": "web_url",
                    "url": `${process.env.DOMAIN_NAME}/portfolios?id=${wallet.id}`,
                    "title": "Portfolio",
                    "webview_height_ratio": "full"
                }, {
                    "type": "postback",
                    "title": "Delete",
                    "payload": `delete:${wallet.id}`
                }
            ]
        })
    }
    return {
        message: {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    elements
                }
            }
        }
    }
}

export const generateLineWalletList = (wallets: any) => {
    let contents = []
    for (let i = 0; i < wallets.length; i++) {
        const wallet = wallets[i]
        const logoImg = wallet.network === 'erc' ? 'https://firebasestorage.googleapis.com/v0/b/covalent-4b53e.appspot.com/o/image%2Feth_banner_line.png?alt=media&token=c62d4b14-a3c8-4247-a72b-eebaf0c8132f' : 'https://firebasestorage.googleapis.com/v0/b/covalent-4b53e.appspot.com/o/image%2Fbsc_banner_line.png?alt=media&token=8c096a85-7092-47d9-bb42-449c5f1432c4'
        const url = wallet.network === 'erc' ? `https://etherscan.com/address/${wallet.address}` : `https://bscscan.com/address/${wallet.address}`
        const name = `${wallet.address.substring(0, 6)}....${wallet.address.substring(wallet.address.length - 4, wallet.address.length)} (${wallet.name})`
        const totalValue = `Total Assets $${wallet.totalValue}`
        contents.push(
            {
                "type": "bubble",
                "size": "kilo",
                "hero": {
                    "type": "image",
                    "size": "full",
                    "aspectRatio": "20:8",
                    "aspectMode": "fit",
                    "url": logoImg,
                    "position": "relative",
                    "margin": "xs",
                    "align": "center",
                    "gravity": "center",
                    "animated": true,
                    "action": {
                        "type": "uri",
                        "label": "action",
                        "uri": url
                    }
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "sm",
                    "contents": [
                        {
                            "type": "text",
                            "text": name,
                            "wrap": true,
                            "weight": "regular",
                            "size": "md",
                            "style": "normal",
                            "decoration": "none",
                            "position": "relative",
                            "align": "start",
                            "gravity": "center",
                            "maxLines": 1
                        },
                        {
                            "type": "text",
                            "text": totalValue,
                            "size": "md",
                            "weight": "regular",
                            "style": "normal",
                            "align": "start",
                            "gravity": "center",
                            "wrap": true,
                            "maxLines": 1
                        }
                    ]
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "button",
                            "action": {
                                "type": "uri",
                                "label": "Transactions",
                                "uri": `${process.env.DOMAIN_NAME}/transactions?id=${wallet.id}`
                            },
                            "position": "relative",
                            "gravity": "center",
                            "height": "sm"
                        },
                        {
                            "type": "button",
                            "action": {
                                "type": "uri",
                                "label": "Portfolio",
                                "uri": `${process.env.DOMAIN_NAME}/portfolios?id=${wallet.id}`
                            },
                            "height": "sm"
                        },
                        {
                            "type": "button",
                            "action": {
                                "type": "postback",
                                "label": "Delete",
                                "data": `delete:${wallet.id}`
                            },
                            "color": "#F53232",
                            "height": "sm"
                        }
                    ],
                    "position": "relative"
                },
                "styles": {
                    "header": {
                        "separator": true
                    },
                    "footer": {
                        "separator": true
                    }
                }
            }
        )
    }
    return {
        type: 'flex',
        altText: 'Test',
        contents: {
            "type": "carousel",
            "contents": contents
        }
    }
}
