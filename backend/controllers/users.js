const bcrypt = require('bcrypt');

const { storage,
    firebaseConfig,
    auth,
    db } = require('../config/firebase.js');
const { ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} = require("firebase/storage");
const { createUserWithEmailAndPassword } = require('firebase/auth');
const { addDoc,
    collection,
    where,
    query,
    getDocs,
    getDoc,
    deleteDoc,
    updateDoc,
    doc
} = require('firebase/firestore');
const { v4 } = require('uuid');
const { initializeApp } = require("firebase/app");
initializeApp(firebaseConfig);


const uploadImagesAndGetURLs = (imageList) => {
    const promises = imageList.map((imageUpload) => {
        return new Promise((resolve, reject) => {
            const filePath = `${imageUpload.originalname + v4()}`
            const imageRef = ref(storage, `images/${filePath}`);
            const metadata = {
                contentType: imageUpload.mimetype,
            }
            uploadBytes(imageRef, imageUpload.buffer, metadata)
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
    });

    return Promise.all(promises);
};

const deleteImages = (imageFilePaths) => {
    const promises = imageFilePaths.map((filePath) => {
        return new Promise((resolve, reject) => {
            const imageRef = ref(storage, `images/${filePath}`)
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
    })

    return promises
}


const sendMessage = async (senderRef, recipientRef, content) => {
    const senderData = await getDoc(senderRef);
    const sender = { ...senderData.data(), id: senderData.id }
    const recipientData = await getDoc(recipientRef);
    const recipient = { ...recipientData.data(), id: recipientData.id }
    const conversationSender = sender.conversations.find(conversation => conversation.recipientId === recipient.id);
    const conversationRecipient = recipient.conversations.find(conversation => conversation.recipientId === sender.id);

    if (conversationSender === undefined && conversationRecipient === undefined) {
        const sentMessage = {
            recipientId: recipient.id,
            messages: [
                {
                    type: 'sent',
                    content: content
                }
            ]
        };
        const receivedMessage = {
            recipientId: sender.id,
            messages: [
                {
                    type: 'received',
                    content: content,
                }
            ]
        };

        await updateDoc(senderRef, {
            conversations: [...sender.conversations, sentMessage]
        })
        await updateDoc(recipientRef, {
            conversations: [...recipient.conversations, receivedMessage]
        })
    } else {
        conversationSender.messages.push({
            type: 'sent',
            content: content,
        });
        conversationRecipient.messages.push({
            type: 'received',
            content: content,
        })

        const newSenderConversations = [...sender.conversations];
        const iS = newSenderConversations.indexOf(conversationSender);
        newSenderConversations.splice(iS, 1);
        newSenderConversations.push(conversationSender);

        const newRecipientConversations = [...recipient.conversations];
        const iR = newRecipientConversations.indexOf(conversationRecipient);
        newRecipientConversations.splice(iR, 1);
        newRecipientConversations.push(conversationRecipient);

        await updateDoc(senderRef, {
            conversations: newSenderConversations
        })
        await updateDoc(recipientRef, {
            conversations: newRecipientConversations
        })
    }
    
    return true;
}



exports.postUserCreate = async (request, response, next) => {
    try {
        const { username, phoneNumber, emailAddress, password } = request.body;

        const hashedPassword = await bcrypt.hash(password, 10)

        let loginType;
        if (emailAddress !== '') {
            loginType = 'emailAddress';
            try {
                await createUserWithEmailAndPassword(auth, emailAddress, hashedPassword)
            } catch (error) {
                response.status(404).json({
                    error,
                })

                return
            }
        } else {
            loginType = 'phoneNumber';
        }
        
        const usersCollectionRef = collection(db, "users");

        let testQuery;
        if (loginType === 'emailAddress') {
            testQuery = query(usersCollectionRef,
                where("emailAddress", "==", emailAddress),
            )
        } else {
            testQuery = query(usersCollectionRef,
                where("phoneNumber", "==", phoneNumber),
            )
        }
        const testDoc = await getDocs(testQuery);
        let testData;
        testDoc.forEach((doc) => {
            testData = {...doc.data(), id: doc.id}
        })
        if (testData !== undefined) {
            response.status(404).json({
                message: 'User already exists',
            })

            return
        }

        const newUserRef = await addDoc(usersCollectionRef, {
            username,
            phoneNumber,
            emailAddress,
            password: hashedPassword,
            accessLevel: 1,
            orders: [],
            favorites: [],
            conversations: [],
            reviews: []
        })

        const chicifyRef = doc(db, "users", "1");
        await sendMessage(chicifyRef, newUserRef, "Welcome to chicify. Feel free to look around.")

        const newUserData = await getDoc(newUserRef);
        const newUser = { ...newUserData.data(), id: newUserData.id };
        
        response.status(200).json({
            user: newUser,
            auth: auth.currentUser
        })

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

exports.postUserLogin = async (request, response, next) => {
    try {
        const { loginType, login , password } = request.body;

        const usersCollectionRef = collection(db, "users");

        const q = query(usersCollectionRef,
            where(loginType, "==", login),
        )
        const docSnap = await getDocs(q);
        let user;
        docSnap.forEach((doc) => {
            user = {...doc.data(), id: doc.id}
        })

        if (!user) {
            response.status(404).json({
                message: "Invalid login or password",
            });

            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            response.status(404).json({
                message: 'Invalid login or password',
            })

            return;
        }

        response.status(200).json({
            user,
        });

        return
    } catch (error) {
        response.status(500).json({
            error,
            message: 'Internal server error',
        });

        return
    }
};

exports.postUserDeleteProduct = async (request, response, next) => {
    try {
        
        const sellerId = request.body.sellerId;
        const productId = request.body.productId;

        let imageFilePaths = [];
        Object.keys(request.body).forEach((key) => {
            if (key.startsWith('imageFilePath')) {
                const value = request.body[key];

                imageFilePaths.push(value)
            }
        });


        const userRef = doc(db, "users", sellerId);
        const userData = await getDoc(userRef);
        const user = { ...userData.data(), id: userData.id }

        if (user.username === undefined) {
            response.status(404).json({
                message: "Couldn't find user with given id",
            })

            return;
        } else if (user.accessLevel <= 1) {
            response.status(404).json({
                message: "User isn't a seller",
            })

            return;
        }

        const productRef = doc(db, "products", productId)
        const productData = await getDoc(productRef);
        
        if (!productData) {
            response.status(405).json({
                message: "Couldn't find product with given id"
            })
        }

        await deleteImages(imageFilePaths);

        await deleteDoc(productRef);
        await updateDoc(userRef,
            { productsForSale: user.productsForSale.filter(product => product !== productId) }
        )

        const userUpdated = {...user, productsForSale: user.productsForSale.filter(product => product !== productId)}

        response.status(200).json({
            user: userUpdated,
        })

        return;

    } catch (error) {
        console.log(error);

        response.status(500).json({
            error,
            message: "Internal server error",
        })

        return;
    }
}

exports.postUserEditProduct = async (request, response, next) => {
    try {
        const name = request.body.name;
        const price = request.body.price;
        const quantity = request.body.quantity;
        const description = request.body.description;
        const sellerId = request.body.sellerId;
        const productId = request.body.productId;

        let delivery = [];
        Object.keys(request.body).forEach((key) => {
            if (key.startsWith('delivery')) {
                const value = request.body[key];

                delivery.push(value)
            }
        });
        delivery = delivery[0]
        const newDelivery = []
        if (delivery.find(item => item === "Standard") !== undefined) newDelivery.push({type: "Standard", price: 3})
        if (delivery.find(item => item === "Express") !== undefined) newDelivery.push({ type: "Express", price: 8 })


        let categories = [];
        Object.keys(request.body).forEach((key) => {
            if (key.startsWith('category')) {
                const value = request.body[key];

                categories.push(value)
            }
        });
        categories = categories[0];

        let imageFilePaths = [];
        Object.keys(request.body).forEach((key) => {
            if (key.startsWith('imageFilePath')) {
                const value = request.body[key];

                imageFilePaths.push(value)
            }
        });

        let imageList = [];
        for (let i = 0; i < request.files.length; i++){
            imageList.push(request.files[i]);
        }

        const userRef = doc(db, "users", sellerId);
        const userData = await getDoc(userRef);
        const user = { ...userData.data(), id: userData.id }
        
        const productRef = doc(db, "products", productId);
        const productData = await getDoc(productRef);
        const product = { ...productData.data(), id: productData.id }
        
        if (user.username === undefined) {
            response.status(404).json({
                message: "Couldn't find user with given id",
            })

            return;
        }
        if (product.name === undefined) {
            response.status(404).json({
                message: "Couldn't find product with given id",
            })

            return;
        }
        if (user.accessLevel < 2) {
            response.status(404).json({
                message: "User with given id isn't a seller",
            })

            return;
        }
        if (!user.productsForSale.find(product => product === productId)) {
            response.status(404).json({
                message: "User isn't a seller of requested product",
            })

            return;
        }

        await deleteImages(imageFilePaths);

        const imagesLinksAndPaths = await uploadImagesAndGetURLs(imageList);

        await updateDoc(productRef, {
            name: name,
            price: parseInt(price),
            delivery: newDelivery,
            quantity: parseInt(quantity),
            images: imagesLinksAndPaths,
            description: description,
            categories: categories,
        })

        response.status(200).json({
            user,
        })

        return;

    } catch (error) {
        console.log(error);

        response.status(500).json({
            error,
            message: "Internal server error",
        })

        return;
    }
}

exports.postUserSellProduct = async (request, response, next) => {
    try {
        const name = request.body.name;
        const price = request.body.price;
        const quantity = request.body.quantity;
        const description = request.body.description;
        const sellerId = request.body.sellerId;

        let delivery = [];
        Object.keys(request.body).forEach((key) => {
            if (key.startsWith('delivery')) {
                const value = request.body[key];

                delivery.push(value)
            }
        });
        delivery = delivery[0]
        const newDelivery = []
        if (delivery.find(item => item === "Standard") !== undefined) newDelivery.push({type: "Standard", price: 3})
        if (delivery.find(item => item === "Express") !== undefined) newDelivery.push({ type: "Express", price: 8 })

        let categories = [];
        Object.keys(request.body).forEach((key) => {
            if (key.startsWith('category')) {
                const value = request.body[key];

                categories.push(value)
            }
        });
        categories = categories[0];
        let imageList = [];
        for (let i = 0; i < request.files.length; i++){
            imageList.push(request.files[i]);
        }

        const userRef = doc(db, "users", sellerId);
        const userData = await getDoc(userRef);
        const user = { ...userData.data(), id: userData.id }

        if (user.username === undefined) {
            response.status(404).json({
                message: "Couldn't find user with given id",
            })

            return;
        }
        else if (user.accessLevel <= 1) {
            response.status(404).json({
                message: "User is not a seller",
            })

            return;
        } 

        const imagesLinksAndPaths = await uploadImagesAndGetURLs(imageList);

        const productsCollectionRef = collection(db, "products");
        const newProductRef = await addDoc(productsCollectionRef, {
            name,
            price: parseInt(price),
            quantity: parseInt(quantity),
            description,
            sellerId,
            delivery: newDelivery,
            categories,
            images: imagesLinksAndPaths,
            reviews: [],
        })
        const newProductData = await getDoc(newProductRef);
        const newProduct = { ...newProductData.data(), id: newProductData.id };
        await updateDoc(userRef, {
            productsForSale: [...user.productsForSale, newProduct.id],
        })

        const updatedUser = { ...user, productsForSale: [...user.productsForSale, newProduct.id] };
        response.status(200).json({
            user: updatedUser,
        })

        return;

    } catch (error) {
        console.log(error);

        response.status(500).json({
            error,
            message: "Internal server error",
        })

        return;
    }
}

exports.postReview = async (request, response, next) => {
    try {
        const { rating, comment, productId, userId } = request.body;
        console.log(rating, comment, productId, userId)

        const userRef = doc(db, "users", userId);
        const userData = await getDoc(userRef);
        const user = { ...userData.data(), id: userData.id }
        
        const productRef = doc(db, "products", productId);
        const productData = await getDoc(productRef);
        const product = { ...productData.data(), id: productData.id }

        if (rating === undefined || userId === undefined) {
            response.status(404).json({
                message: 'Not enough information provided'
            });

            return;
        } else if (!product) {
            response.status(405).json({
                message: "Couldn't find product with given id"
            });

            return;
        } else if (!user) {
            response.status(406).json({
                message: "Couldn't find user with given id"
            });

            return;
        }
        
        const newReview = {rating: rating, comment: comment, userId: userId}

        await updateDoc(productRef, {
            reviews: [...product.reviews, newReview],
        });

        await updateDoc(userRef, {
            reviews: [...user.reviews, productId],
        })

        const updatedUser = { ...user, reviews: [...user.reviews, productId] };

        response.status(200).json({
            user: updatedUser
        });
    } catch (error) {
        response.status(500).json({
            error,
            message: 'Internal server error'
        });
    }
}

exports.patchUserOrder = async (request, response, next) => {
    try {
        const { products, price, userId, paymentId, productBySeller } = request.body;

        const userRef = doc(db, "users", userId);
        const userData = await getDoc(userRef);
        const user = { ...userData.data(), id: userData.id }
        
        const productBySellerFixed = productBySeller.filter(item => item.sellerId !== undefined)

        if (user.username === undefined) {
            response.status(404).json({
                message: "Couldn't find the user with given id"
            });

            return;
        }

        const order = { products: products, price: price, paymentId: paymentId };
        await updateDoc(userRef, {
            orders: [...user.orders, order],
        })
        
        for (let i = 0; i < products.length; i++) {
            const productRef = doc(db, "products", products[i].id);
            const product = await getDoc(productRef);
            const productFiltered = { ...product.data(), id: product.id };
            if (productFiltered.name === undefined) {
                throw new Error("Couldn't update products quantity");
            } else {
                await updateDoc(productRef, {
                    quantity: productFiltered.quantity - products[i].quantity,
                })
            }
        }

        for (const item of productBySellerFixed) {
            const sellerRef = doc(db, "users", item.sellerId);
            await sendMessage(sellerRef, userRef, `Thank you for purchasing ${item.productName}`)
        }

        const userDataUpdated = await getDoc(userRef);
        const userUpdated = { ...userDataUpdated.data(), id: userDataUpdated.id }

        response.status(200).json({
            user: userUpdated
        })
    } catch (error) {
        response.status(500).json({
            error,
            message: 'Problem with ordering'
        })
    }
}

exports.patchSendMessage = async (request, response, next) => {
    try {
        const { senderId, recipientId, content } = request.body;

        const senderRef = doc(db, "users", senderId);
        const senderData = await getDoc(senderRef);
        const sender = { ...senderData.data(), id: senderData.id }
        const recipientRef = doc(db, "users", recipientId);
        const recipientData = await getDoc(recipientRef);
        const recipient = { ...recipientData.data(), id: recipientData.id }

        if (sender.username === undefined || recipient.username === undefined) {
            response.status(404).json({
                message: "Couldn't find one of the users"
            })

            return;
        }

        await sendMessage(senderRef, recipientRef, content);
        if (recipientId === '1') {
            await sendMessage(recipientRef, senderRef, 'This is an automatically generated response');
        }

        const userDataUpdated = await getDoc(senderRef);
        const userUpdated = { ...userDataUpdated.data(), id: userDataUpdated.id }

        response.status(200).json({
            user: userUpdated
        })
        
        return;

    } catch (error) {
        response.status(500).json({
            error,
            message: "Internal code error"
        })
    }
}

const ADDFAVORITE = 'add';
const REMOVEFAVORITE = 'remove';

exports.patchUserFavorite = async (request, response, next) => {
    try {
        const { userId, productId, action } = request.body;

        const userRef = doc(db, "users", userId);
        const userData = await getDoc(userRef);
        const user = { ...userData.data(), id: userData.id }

        if (user.username === undefined) {
            response.status(404).json({
                message: "Couldn't find user with given id",
            });

            return;
        }

        let userUpdated
        if (action === ADDFAVORITE) {
            await updateDoc(userRef, {
                favorites: [...user.favorites, productId]
            })
            userUpdated = {...user, favorites: [...user.favorites, productId]}
        } else if (action === REMOVEFAVORITE) {
            await updateDoc(userRef, {
                favorites: user.favorites.filter(fav => fav !== productId),
            })
            userUpdated = { ...user, favorites: user.favorites.filter(fav => fav !== productId) };
        } else {
            response.status(405).json({
                message: 'Unknown action'
            })
        }

        response.status(200).json({
            user: userUpdated,
        });

        return;

    } catch (error) {
        response.status(500).json({
            error,
            message: 'Problem changing favorites'
        })
    }
}

exports.patchUserSeller = async (request, response, next) => {
    try {
        const { id, name, country, city, street, postal, accountNumber } = request.body;
        
        const userRef = doc(db, "users", id);
        const userData = await getDoc(userRef);
        const user = { ...userData.data(), id: userData.id }
        
        if (user.username === undefined) {
            response.status(404).json({
                message: "Couldn't find the user with given id",
            });

            return;
        } else if (user.accessLevel !== 1) {
            response.status(405).json({
                message: 'Only users with basic access level can become a seller',
            });

            return;
        }

        await updateDoc(userRef,
            {
                accessLevel: 2,
                productsForSale: [],
                sellerInfo: {
                    companyName: name,
                    accountNumber,
                    companyAddress: `${country}, ${city}, ${street}, ${postal}`
                }
            }
        )

        const userUpdated = {...user, accessLevel: 2}
        response.status(200).json({
            user: userUpdated,
        })

    } catch (error) {
        response.status(500).json({
            error,
            message: 'Error with making user a seller'
        })
    }
}

exports.patchUserPassword = async (request, response, next) => {
    try {
        const { loginType, login, newPassword } = request.body;
        
        const usersCollectionRef = collection(db, "users");

        const q = query(usersCollectionRef,
            where(loginType, "==", login),
        )
        const docSnap = await getDocs(q);
        let user;
        docSnap.forEach((doc) => {
            user = {...doc.data(), id: doc.id}
        })

        if (user.username === undefined) {
            response.status(404).json({
                message: "Couldn't find requested user",
            });

            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10) 
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, {
            password: hashedPassword,
        })

        response.status(200).json({
            message: 'password updated'
        });

    } catch (error) {
        response.status(500).json({
            error,
            message: 'Internal server error',
        })
    }
}

exports.getUserName = async (request, response, next) => {
    try {
        const { id } = request.params;

        const userRef = doc(db, "users", id);
        const userData = await getDoc(userRef);
        const user = { ...userData.data(), id: userData.id }

        if (user.username === undefined || (user.username !== undefined && user.username === '')) {
            response.status(404).json({
                message: "Couldn't find user or user doesn't have an username",
            })

            return;
        };

        response.status(200).json({
            username: user.username,
        })
    } catch (error) {
        response.status(500).json({
            error,
            message: 'Internal server error',
        })
    }
}
