import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';

import { Address } from '../message/address.interface';
import { addressProvidersName } from '../message/message.provider'
import { getAssertByWallet, getTransaction } from '../../service/covalent'
@Injectable()
export class WebService {
    constructor(
        @Inject(addressProvidersName.ADDRESS_MODEL)
        private addressModel: Model<Address>
    ) { }
    async portfolio(walletId: string) {
        const wallet = await this.addressModel.findOne({ _id: walletId })
        const asserts = await getAssertByWallet(wallet)
        return {
            name: wallet.name.toUpperCase(),
            totalAssets: `$${asserts.reduce(function (tmp, assert) {
                return tmp + assert.totalValue;
            }, 0).toLocaleString()}`,
            addressLink: `${wallet.network === 'erc' ? 'https://etherscan.io' : 'https://bscscan.com'}/address/${wallet.address}`,
            address: wallet.address,
            asserts
        }
    }
    async transaction(walletId: string, page: number = 0) {
        const wallet = await this.addressModel.findOne({ _id: walletId })
        const transactions = await getTransaction(wallet.toJSON(), page, 10)
        return {
            name: wallet.name.toUpperCase(),
            address: wallet.address,
            addressLink: `${wallet.network === 'erc' ? 'https://etherscan.io' : 'https://bscscan.com'}/address/${wallet.address}`,
            ...transactions
        }
    }
}