import { firestore } from 'config';
import { arrayUnion, collection, doc, getCountFromServer, getDocs, query, updateDoc, where } from 'firebase/firestore';

export const getAdminDoc = async (collectionName = "User-Data", token_id) => {
    try {
        let userRef = collection(firestore, collectionName);
        if (token_id) {
            let adminQuery = query(
                userRef,
                where('chat_group_options.isAdmin', '==', true),
                where('chat_group_options.token_id', '==', token_id)
            );
            const querySnapshot = await getDocs(adminQuery);

            if (!querySnapshot.empty) {
                return querySnapshot.docs[0].data();
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
};

export const getTotalUsersInGroup = async (collectionName = "User-Data") => {
    try {
        const userRef = collection(firestore, collectionName);

        const countSnapshot = await getCountFromServer(userRef);
        console.log('Count Snapshot:', countSnapshot.data());

        return countSnapshot.data().count;
    } catch (error) {
        console.error('Error fetching users:', error);
        return 0
    }
};


export const markMessageAsRead = async (tokenId, messageId, userId) => {
    if (tokenId && messageId && userId) {
        try {
            const messageRef = doc(firestore, tokenId, messageId);
            await updateDoc(messageRef, {
                readBy: arrayUnion(userId)
            });
        } catch (error) {
            console.error('Error marking message as read:', error);
            throw error;
        }
    }
};