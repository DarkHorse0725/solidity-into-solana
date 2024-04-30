import { BigNumber } from "ethers";

function main(price: number, IDODecimal: number, purchaseDecimal: number) {
    if (price == 0) {
        return { rate: BigNumber.from('0'), de: 0 }
    }
    const MAX_DEX_LENGTH = 18
    const invert = 1 / price
    const invertInArr = invert.toString().split(".");
    let dex: number = invertInArr.length === 1 ? 0 : invertInArr[1].length;
    dex = dex > MAX_DEX_LENGTH ? MAX_DEX_LENGTH : dex
    let intergralPartLength = invert.toString().split('.')[0].length
    const ratex: string = invert.toString().replace('.', '').slice(0, intergralPartLength + dex)

    let rate: BigNumber;
    let de: number;
    if (IDODecimal < purchaseDecimal) {
        rate = BigNumber.from(ratex);
        de = dex + purchaseDecimal - IDODecimal
    } else {
        de = dex
        rate = BigNumber.from(ratex).mul(BigNumber.from("10").pow(IDODecimal - purchaseDecimal))
    }
    return { rate, de }
}

const { rate, de } = main(1.5, 10, 18);
console.log(rate, de)
console.log(rate.toString(), de)
