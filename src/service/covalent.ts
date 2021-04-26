import { HttpStatus } from '@nestjs/common'
import { get } from './axios'
import { BigNumber } from "bignumber.js"
import { add, find } from 'lodash'
enum TRANSACTION_TYPE {
    WITHDRAW = 'Withdraw',
    RECEIVE = 'Receive',
    SWAP = 'Swap',
    TRANSFER = 'Transfer',
    APPROVE = 'Approve',
    FAILED = 'Failed',
    REVOKED = 'Revoked'
}
export const getTotalAssertByWallets = async (wallets: any) => {
    for (let i = 0; i < wallets.length; i++) {
        let wallet = wallets[i]
        let asserts = await getTokenBalanceByAddress(wallet.address, wallet.network === 'erc' ? 1 : 56)
        asserts = assertResTransformation(asserts)
        wallet['totalValue'] = asserts.reduce(function (tmp, assert) {
            return tmp + assert.totalValue;
        }, 0).toLocaleString()
    }

    return wallets
}

export const getAssertByWallet = async (wallet: any) => {
    let asserts = await getTokenBalanceByAddress(wallet.address, wallet.network === 'erc' ? 1 : 56)
    asserts = assertResTransformation(asserts)
    return asserts
}

export const getBalanceByAddress = async (address: string, network: number) => {
    let asserts = await getTokenBalanceByAddress(address, network)
    asserts = assertResTransformation(asserts)
    return asserts
}

export const getTokenBalanceByAddress = async (address: String, network: number) => {
    const response = await get(`https://api.covalenthq.com/v1/${network}/address/${address}/balances_v2?key=${process.env.API_KEY}`)
    if (response)
        return response.data.items
    else return []
}


export const getVolatilityPrice = async (ticker: string) => {
    const response = await get(`https://api.covalenthq.com/v1/pricing/volatility/?tickers=${ticker}&key=${process.env.API_KEY}`)
    if (response && response.data.items.length > 0) {
        const { quote_rate, stddev_1h, stddev_24h, contract_name, logo_url } = response.data.items[0]
        return {
            name: contract_name,
            ticker,
            logoUrl: logo_url,
            currentPrice: quote_rate.toLocaleString(),
            oneHour: stddev_1h,
            oneDay: stddev_24h
        }
    } else return null
}

const assertResTransformation = (items: any) => {
    let asserts = []
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.balance !== '0') {
            let tokenBalance: any = new BigNumber(item.balance)
            tokenBalance = tokenBalance.dividedBy(Math.pow(10, item.contract_decimals))
            if (tokenBalance.toFixed(2) > 0) {
                asserts.push({
                    logo: item.logo_url,
                    name: item.contract_name,
                    ticker: item.contract_ticker_symbol,
                    contractAddress: item.contract_address,
                    balance: tokenBalance.toFixed(2).toLocaleString(),
                    currentPrice: item.quote_rate||0,
                    contractDecimals: item.contract_decimals,
                    totalValue:item.quote||0
                })
            }
        }
    }
    return asserts
}

export const getTransaction = async (wallet: any, page: number, pageLimit: number) => {
    const response = await get(`https://api.covalenthq.com/v1/${wallet.network === 'erc' ? 1 : 56}/address/${wallet.address}/transactions_v2/?page-number=${page}&page-size=${pageLimit}&key=${process.env.API_KEY}`)
    if (response && response.data.items.length > 0) {
        return await transactionResTransformation(response.data, wallet)
    } else return []
}

const transactionResTransformation = async (data: any, wallet: any) => {
    const { items, pagination } = data
    let txTransactions = []
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        let gas = item.gas_quote / item.gas_quote_rate
        if (isNaN(gas)) gas = 0
        const gasQuote = item.gas_quote || 0
        const detail = await transactionProcess(item, wallet)
        txTransactions.push({
            txHash: `${item.tx_hash.substring(0, 6)}....${item.tx_hash.substring(item.tx_hash.length - 4, item.tx_hash.length)}`,
            txHashLink: `${wallet.network === 'erc' ? 'https://etherscan.io' : 'https://bscscan.com'}/tx/${item.tx_hash}`,
            signedAt: item.block_signed_at,
            gasFeeValue: `$${gasQuote} (${gas}${wallet.network === 'erc' ? ' ETH' : ' BSC'})`,
            ...detail
        })
    }
    return { transactions: txTransactions, pagination: { hasMore: pagination.has_more, pageNumber: pagination.page_number, pageSize: pagination.page_size } }
}

const transactionProcess = async (transaction: any, wallet: any): Promise<any> => {
    let result: any = {
        transactionType: TRANSACTION_TYPE.SWAP
    }
    const { log_events } = transaction
    if (log_events.length === 1) {
        const { sender_address, decoded } = log_events[0]
        if (decoded === null) {
            result['transactionType'] = TRANSACTION_TYPE.APPROVE
            return result
        }
        const { params } = decoded
        const address: any = find(params, { value: wallet.address.toLowerCase() })
        const value = find(params, { name: 'value' })
        if (address && address.value === wallet.address.toLowerCase()) {
            if (address.name === 'to') result['transactionType'] = TRANSACTION_TYPE.RECEIVE
            else if (address.name === 'from') result['transactionType'] = TRANSACTION_TYPE.TRANSFER
            else if (address.name === 'owner') {
                if (value && value.value !== '0') result['transactionType'] = TRANSACTION_TYPE.APPROVE
                else if (value && value.value === '0') result['transactionType'] = TRANSACTION_TYPE.REVOKED
            }
        }
    } else if (log_events.length === 0) {
        result['transactionType'] = TRANSACTION_TYPE.FAILED
    }
    return result
}