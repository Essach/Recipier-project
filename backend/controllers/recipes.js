const { ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} = require("firebase/storage");
const { db, storage } = require('../config/firebase.js');
const { getDocs, collection, getDoc, doc, updateDoc, addDoc, deleteDoc } = require('firebase/firestore');
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

exports.getRecipes = async (request, response, next) => {
    try {
        const recipesCollectionRef = collection(db, "recipes");
        const data = await getDocs(recipesCollectionRef);
        const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }));

        response.status(200).json({
            recipes: filteredData,
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

exports.postRecipe = async (request, response, next) => {
    try {  
        const name = request.body.name;
        const image = request.files[0];
        const ingredients = JSON.parse(request.body.ingredients);

        const recipesCollectionRef = collection(db, "recipes");
        const imageLink = await uploadImageAndGetURL(image)
        const newRecipeRef = await addDoc(recipesCollectionRef, {    
            name,
            ingredients: ingredients,
            image: imageLink
        })
        const newRecipeData = await getDoc(newRecipeRef);
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

exports.patchDeleteRecipe = async (request, response, next) => {
    try {
        const recipeId = request.body.recipeId;
        const oldImagePath = request.body.oldImagePath;

        const recipeRef = doc(db, "recipes", recipeId)
        const recipeData = await getDoc(recipeRef);

        if (!recipeData) {
            response.status(405).json({
                message: "Couldn't find recipe with given id"
            })
        }
        
        await deleteImage(oldImagePath);
        await deleteDoc(recipeRef);
        
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