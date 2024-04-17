const { db } = require('../config/firebase.js');
const { addDoc,
    collection,
    getDoc,
    doc
} = require('firebase/firestore');


exports.postPayment = async (request, response, next) => {
    try {
        const { products, price, address, cardInfo } = request.body;

        const paymentsCollectionRef = collection(db, "payments");
        const newPaymentRef = await addDoc(paymentsCollectionRef, {
            products: products,
            price: parseInt(price),
            address: address,
            cardInfo: cardInfo
        })
        const paymentData = await getDoc(newPaymentRef);

        response.status(200).json({
            paymentId: paymentData.id,
            message: 'Payment sent',
        })

        return;
    } catch (error) {
        response.status(500).json({
            error,
            message: 'Code error'
        })
    }
}

exports.getPaymentInfo = async (request, response, next) => {
    try {
        const { id } = request.params;
        
        const paymentRef = doc(db, "payments", id);
        const paymentData = await getDoc(paymentRef);
        const payment = { ...paymentData.data(), id: paymentData.id }

        if (payment.cardInfo === undefined) {
            response.status(404).json({
                message: `Couldn't find payment with given id`,
            });

            return
        }

        response.status(200).json({
            products: payment.products,
            address: payment.address,
            cardInfo: payment.cardInfo,
            price: payment.price,
        })

        return;
    } catch (error) {
        response.status(500).json({
            error,
            message: 'Code error',
        })
    }
}