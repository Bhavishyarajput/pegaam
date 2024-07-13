import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import "./Input.css";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../Firebase";
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { HiOutlinePhotograph } from 'react-icons/hi';
import toast from "react-hot-toast";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);





  const handleSend = async () => {
    


       // https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array idhr se liya hai

      //  The trim method is a JavaScript string method that removes leading and trailing whitespace (spaces, tabs, line breaks, etc.) from a string. It does not modify the original string but instead returns a new string with the whitespace removed.
    
        // if (text.trim().length === 0) {
        //   // If the text is empty or contains only whitespace, do not send.
        //   return alert('No message');
        // // }
//     uploadTask.on(
//       // This code is responsible for uploading the image to the specified storage location.
// // and storage isliye kiya because image storage mai hona chaiye upload
// // vo object ko store krta
//    (error) => {
//      //TODO:Handle Error
//    },
//    () => {
//      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
//        await updateDoc(doc(db, "chats", data.chatId), {
//          messages: arrayUnion({
//            id: uuidv4(),
//            text,
//            senderId: currentUser.uid,
//            date: Timestamp.now(),
//            img: downloadURL,
//          }),
//        });
//      });
//    }
//  );
// } 
//  // yh chaiye hoga na kuki combined id hogi vovala chat khulna chaiye na
// // await updateDoc(washingtonRef, {
// // regions: arrayUnion("greater_virginia")
// // });
// else {
//  //   It updates a Firestore document using the updateDoc function, specifying the document location as doc(db, "chats", data.chatId). This points to the "chats" collection and the specific chat document identified by data.chatId.
// // Within the document update, it adds a new element to the regions array using the arrayUnion function. This new element contains an object with properties id, senderId, and date, which are set to the values generated by the uuid function, the currentuser.uid, and the Timestamp.now() respectively.
// // This code is responsible for updating the Firestore document with the new chat message details when there is no image attached.





    if (img) {
         // {Database systems: UUIDs can be used as primary keys or unique identifiers for database records, ensuring that each record has a globally unique identifier. This is especially useful in distributed or replicated database environments.
      const storageRef = ref(storage, uuidv4());
      const uploadTask = uploadBytesResumable(storageRef, img);
      // bakiyo mai dikt nhi arhi thi isme arhi thi taht's why isliye isme bhi awit lga diya By using await uploadTask and await getDownloadURL(uploadTask.snapshot.ref), you ensure that the code waits for the upload and retrieval of the download URL to complete before moving forward with updating the chat document.
      try {
        await uploadTask;
           // This code is responsible for uploading the image to the specified storage location.
  // and storage isliye kiya because image storage mai hona chaiye upload
  // vo object ko store krta

        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await updateChatDocument(downloadURL);
        toast.success('Image uploaded successfully');
        // alert(`File Uploaded : ${img.name}`)
      } catch (error) {
        // Handle error during upload or getting download URL
        console.error(error);
      }
    } else {
      await updateChatDocument();
    }

    setText("");
    setImg(null);
  };

  const updateChatDocument = async (downloadURL = null) => {
    const messageData = {
      id: uuidv4(),
      text,
      
      senderId: currentUser.uid,
      date: Timestamp.now(),
      img: downloadURL,
    };

    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion(messageData),
    });

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: messageData,
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: messageData,
      [data.chatId + ".date"]: serverTimestamp(),
    });
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
    {data.user?.displayName? (
      <>
    <div className='imputing'>
      <input
        className='texting'
        type='text'
        placeholder='Type something...'
        style={{ outline: 'none', paddingLeft: '20px' }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
      />
      <div className='send'>
        <input
          type='file'
          id='file'
          style={{ display: 'none' }}
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor='file'>
          <HiOutlinePhotograph
            style={{ color: '#e27396', fontSize: '35px', cursor: 'pointer' }}
          />
        </label>
        <button
                className='butting'
                onClick={handleSend}
                disabled={text.trim().length === 0 }
                 // Disable the button when text is empty or contains only whitespace
              >
          Send
        </button>
      </div>
    </div>
    </>
    ) : (
      <div className='jiyan'>
      
      </div>
    )}
    </>
  );
};

export default Input;
