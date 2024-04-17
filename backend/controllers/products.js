const { db } = require('../config/firebase.js');
const { getDocs, collection, getDoc, doc } = require('firebase/firestore');


exports.getProducts = async (request, response, next) => {
    try {
        const productsCollectionRef = collection(db, "products");
        const data = await getDocs(productsCollectionRef);
        const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }));

        response.status(200).json({
            products: filteredData,
        });

        return
    } catch (error) {
        response.status(500).json({
            error,
            message: "Couldn't receive products"
        });

        return
    }
};

exports.getProduct = async (request, response, next) => {
    try {
        const { id } = request.params;

        const productRef = doc(db, "products", id);
        const product = await getDoc(productRef);
        const productFiltered = { ...product.data(), id: product.id }
        
        if (productFiltered.name === undefined) {
            response.status(404).json({
                message: "Couldn't find product of given id"
            });

            return;
        }

        response.status(200).json({
            product: productFiltered,
        });
    } catch (error) {
        response.status(500).json({
            error,
            message: "Error with getting product"
        });
    }
}

exports.getProductReviews = async (request, response, next) => {
    try {
        const { id } = request.params;
        const productRef = doc(db, "products", id);
        const product = await getDoc(productRef);
        const productFiltered = { ...product.data(), id: product.id }

        if (!productFiltered) {
            response.status(404).json({
                message: "Couldn't find product of given id"
            });

            return;
        }

        response.status(200).json({
            reviews: productFiltered.reviews,
        });
    } catch (error) {
        response.status(500).json({
            error,
            message: "Error with getting product"
        });
    }
};
