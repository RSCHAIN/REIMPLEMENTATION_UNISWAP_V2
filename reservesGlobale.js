let reserves = [];

exports.setReserves = (newReservesValue) => {
    reserves = newReservesValue
}


exports.getReservesGlobal = () => {
    return reserves
}