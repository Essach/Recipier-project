const { ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} = require("firebase/storage");
const { db, storage } = require('../config/firebase.js');
const { getDocs, collection, getDoc, doc, updateDoc } = require('firebase/firestore');
const { v4 } = require('uuid');

const uploadImageAndGetURL = (image) => {
    const promise = new Promise((resolve, reject) => {
            const filePath = `${image.originalname + v4()}`
            const imageRef = ref(storage, `images/${filePath}`);
            const metadata = {
                contentType: image.mimetype,
            }
            uploadBytes(imageRef, image.buffer, metadata)
                .then((snapshot) => {
                    getDownloadURL(snapshot.ref)
                        .then((url) => {
                            resolve({url: url, filePath: filePath});
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });

    return promise
};

const deleteImage = (imageFilePath) => {
    const promise = new Promise((resolve, reject) => {
            const imageRef = ref(storage, `images/${imageFilePath}`)
            deleteObject(imageRef)
                .then(() => {
                    console.log('file deleted')
                    resolve();
                })
                .catch((error) => {
                    console.log('file not deleted')
                    reject(error);
                })
        })
    

    return promise
}

exports.getGroceries = async (request, response, next) => {
    try {
        const groceriesCollectionRef = collection(db, "groceries");
        const data = await getDocs(groceriesCollectionRef);
        const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }));

        response.status(200).json({
            groceries: filteredData,
        });

        return
    } catch (error) {
        response.status(500).json({
            error,
            message: "Couldn't receive groceries"
        });

        return
    }
};

exports.postGrocery = async (request, response, next) => {
    try {  
        const name = request.body.name;
        const quantityType = request.body.quantityType;
        const quantity = request.body.quantity;
        const image = request.files[0];

        console.log('here 1')
        const groceriesCollectionRef = collection(db, "groceries");
        console.log('here 2')
        const imageLink = await uploadImageAndGetURL(image)
        console.log('here 3')
        const newGroceryRef = await addDoc(groceriesCollectionRef, {    
            name,
            quantityType,
            quantity: parseInt(quantity),
            image: imageLink
        })
        console.log('here 4')
        const newGroceryData = await getDoc(newUserRef);
        console.log('here 5')
        response.status(200).json()

        return;
    } catch (error) {
        console.error(error)
        response.status(500).json({
            error,
            message: 'Internal server error'
        })

        return;
    }
}

exports.patchDeleteGrocery = async (request, response, next) => {
    try {
        const groceryId = request.body.groceryId;
        const oldImagePath = request.body.oldImagePath;

        const groceryRef = doc(db, "groceries", groceryId)
        const groceryData = await getDoc(groceryRef);

        if (!groceryData) {
            response.status(405).json({
                message: "Couldn't find grocery with given id"
            })
        }
        
        await deleteImage(oldImagePath);
        await deleteDoc(groceryRef);
        
        response.status(200).json()

        return;

    } catch (error) {
        response.status(500).json({
            error,
            message: "Internal server error",
        })

        return;
    }
}

exports.patchGroceryQuantity = async (request, response, next) => {
    try {
        const { groceryId, updatedQuantity } = request.body;

        console.log('here 1')
        
        if (updatedQuantity < 0) {
            response.status(404).json()

            return
        }
        console.log('here 2')

        const groceryRef = doc(db, "groceries", groceryId);
        console.log('here 3')
        const groceryData = await getDoc(groceryRef);
        console.log('here 4')
        
        if (!groceryData) {
            response.status(405).json({
                message: "Couldn't find grocery with given id"
            })
        }
        console.log('here 5')

        await updateDoc(groceryRef, {
            quantity: updatedQuantity
        })
        console.log('here 6')

        response.status(200).json()

        return

    } catch (error) {
        response.status(500).json({
            error,
            message: "Internal server error",
        })

        return;
    }
}