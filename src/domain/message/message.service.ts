import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Model } from 'mongoose';

import { Address } from './address.interface';
import { addressProvidersName } from './message.provider'
import { sendFacebookMessage } from '../../service/facebook'
import { sendLineMessage } from '../../service/line'
import { validateAddress } from '../../util/address'
import { get, set, clean } from '../../util/cache'
import { getTotalAssertByWallets } from '../../service/covalent'
import { BOT_STATE } from '../../util/state'
import { getVolatilityPrice } from '../../service/covalent'
import {
    generateCreateWalletQuickReply,
    generateMessage,
    generateLineWalletList, generateFacebookWalletList,
    generateReplyMessage
} from '../../util/message'
@Injectable()
export class MessageService {
    constructor(
        @Inject(addressProvidersName.ADDRESS_MODEL)
        private addressModel: Model<Address>
    ) { }

    facebookMessage(message: any) {
        console.log(`Facebook receive message ${JSON.stringify(message)}`)
        if (message.object === 'page') {
            message.entry.forEach(pageEntry => {
                pageEntry.messaging.forEach(message => {
                    if (message.hasOwnProperty('postback')) {
                        this.processMessage(1, { message: message.postback.payload, userId: message.sender.id })
                    } else if (message.message.hasOwnProperty('quick_reply'))
                        this.processMessage(1, { message: message.message.quick_reply.payload, userId: message.sender.id })
                    else
                        this.processMessage(1, { message: message.message.text, userId: message.sender.id })
                })
            })
        } else return null
    }

    lineMessage(message: any) {
        console.log(`Line receive message ${JSON.stringify(message)}`)
        message.events.forEach(event => {
            const { type, source } = event
            if (type === 'postback') {
                this.processMessage(2, { message: event.postback.data, replyToken: event.replyToken, userId: source.userId })
            } else if (type === 'message') {
                this.processMessage(2, { message: event.message.text, replyToken: event.replyToken, userId: source.userId })
            }
        });

    }

    async processMessage(platform: number, payload: any) {
        const { message, userId, replyToken } = payload
        console.log(`${message} from ${userId}`)
        let messagePayload: any = null
        const cache = get(userId)
        const { lastedState, network, address, id } = cache
        if (message === 'addWallet') {
            messagePayload = generateCreateWalletQuickReply(platform, `You don't have any wallet please add new wallet \nSelect network for add new wallet`)
            set(userId, { lastedState: BOT_STATE.ADD_NEW_WALLET })
        } else if (message === "wallets") {
            let wallets: any = await this.addressModel.find({ userId }).sort({ createdAt: 1 })
            if (wallets.length === 0) {
                messagePayload = generateCreateWalletQuickReply(platform, `You don't have any wallet please add new wallet \nSelect network for add new wallet`)
                set(userId, { lastedState: BOT_STATE.ADD_NEW_WALLET })
            } else {
                messagePayload = await this.getWalletListMessage(platform, wallets)
            }
        } else if (message.includes('delete')) {
            const walletId = message.split(':')
            const wallet = await this.addressModel.findOne({ _id: walletId[1] })
            if (wallet) {
                messagePayload = generateReplyMessage(platform, `Are you sure to delete wallet ${wallet.name} `)
                set(userId, { lastedState: BOT_STATE.DELETE_WALLET, id: walletId[1] })
            } else
                messagePayload = generateMessage(platform, `Wallet not found`)
        } else if (message === 'priceBot') {
            messagePayload = generateMessage(platform, `Please input token ticker for check price...`)
            set(userId, { lastedState: BOT_STATE.PRICE_BOT })
        } else if (lastedState === BOT_STATE.PRICE_BOT) {
            const price = await getVolatilityPrice(message)
            if (price) {
                messagePayload = generateMessage(platform, `${price.name}(${message.toUpperCase()}) current price $${price.currentPrice}`)
            } else {
                messagePayload = generateMessage(platform, `Token not found please input again or select menu for next operation`)
            }
        } else if (lastedState === BOT_STATE.ADD_NEW_WALLET) {
            messagePayload = generateMessage(platform, `Please input your address`)
            set(userId, { lastedState: BOT_STATE.INPUT_ADDRESS, network: message })
        } else if (lastedState === BOT_STATE.INPUT_ADDRESS) {
            const isValid = validateAddress(message.trim())
            let msg = `Please set the wallet name`
            if (!isValid)
                msg = `Your address incorrect please recheck and input again!`
            else
                set(userId, { lastedState: BOT_STATE.INPUT_WALLET_NAME, address: message })
            messagePayload = generateMessage(platform, msg)
        } else if (lastedState === BOT_STATE.INPUT_WALLET_NAME) {
            const wallet = new this.addressModel({ network, address, name: message, userId })
            await wallet.save()
            let wallets: any = await this.addressModel.find({ userId }).sort({ createdAt: -1 })
            messagePayload = await this.getWalletListMessage(platform, wallets)
            clean(userId)
        } else if (lastedState === BOT_STATE.DELETE_WALLET) {
            if (message === 'confirm') {
                await this.addressModel.remove({ _id: id })
            }
            clean(userId)
            let wallets: any = await this.addressModel.find({ userId }).sort({ createdAt: -1 })
            if (wallets.length > 0)
                messagePayload = await this.getWalletListMessage(platform, wallets)
            else {
                messagePayload = generateCreateWalletQuickReply(platform, `You don't have any wallet please add new wallet \nSelect network for add new wallet`)
                set(userId, { lastedState: BOT_STATE.ADD_NEW_WALLET })
            }
        } else return
        if (messagePayload) {
            if (platform === 1)
                sendFacebookMessage(userId, messagePayload)
            else if (platform === 2) sendLineMessage(userId, replyToken, messagePayload)
        }
    }


    getWalletListMessage = async (platform: number, wallets: any) => {
        wallets = await getTotalAssertByWallets(wallets)
        if (platform === 1) {
            return generateFacebookWalletList(wallets)
        } else if (platform === 2)
            return generateLineWalletList(wallets)
        else return []
    }
}
