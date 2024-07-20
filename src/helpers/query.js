import { firestore } from 'config';
import { collection, getDocs, query, where } from 'firebase/firestore';

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
 